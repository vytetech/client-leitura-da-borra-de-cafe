import { z } from "zod";
import { createRouter, adminQuery } from "./middleware";
import { TRPCError } from "@trpc/server";
import { promises as fs } from "fs";
import path from "path";

/**
 * Image upload system (admin only).
 * - Accepts all common formats: JPG, JPEG, PNG, GIF, WebP, SVG
 * - Files up to 20 MB (base64 payload up to ~28 MB), any resolution
 * - Stored under dist/public/uploads and served instantly
 * - Admin can list and delete previously uploaded files
 */

const ALLOWED_MIME: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/jpg": ".jpg",
  "image/png": ".png",
  "image/gif": ".gif",
  "image/webp": ".webp",
  "image/svg+xml": ".svg",
  "video/mp4": ".mp4",
  "video/webm": ".webm",
  "video/quicktime": ".mov",
};

const MAX_FILE_BYTES = 20 * 1024 * 1024; // 20 MB per file
const MAX_B64_LEN = Math.ceil(MAX_FILE_BYTES * 1.4) + 1024;

function uploadsDir() {
  return path.resolve(process.cwd(), "dist/public/uploads");
}

function sanitizeName(name: string) {
  const base = name.replace(/\.[^.]+$/, "").toLowerCase();
  return (
    base
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 40) || "imagem"
  );
}

export const uploadRouter = createRouter({
  upload: adminQuery
    .input(
      z.object({
        name: z.string().min(1).max(200),
        mime: z.string().min(3).max(60),
        base64: z.string().min(10).max(MAX_B64_LEN),
      })
    )
    .mutation(async ({ input }) => {
      const ext = ALLOWED_MIME[input.mime.toLowerCase()];
      if (!ext) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Formato não suportado. Use JPG, PNG, GIF, WebP, SVG, MP4, WebM ou MOV.",
        });
      }
      let buf: Buffer;
      try {
        buf = Buffer.from(input.base64, "base64");
      } catch {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Arquivo inválido." });
      }
      if (buf.length === 0 || buf.length > MAX_FILE_BYTES) {
        throw new TRPCError({
          code: "PAYLOAD_TOO_LARGE",
          message: "Arquivo muito grande (máx. 20 MB).",
        });
      }

      const dir = uploadsDir();
      await fs.mkdir(dir, { recursive: true });

      const safe = sanitizeName(input.name);
      const stamp = Date.now().toString(36);
      const filename = `${stamp}-${safe}${ext}`;
      await fs.writeFile(path.join(dir, filename), buf);

      return { url: `/uploads/${filename}`, size: buf.length };
    }),

  list: adminQuery.query(async () => {
    const dir = uploadsDir();
    let files: string[] = [];
    try {
      files = await fs.readdir(dir);
    } catch {
      return [];
    }
    const out: { url: string; size: number; mtime: number }[] = [];
    for (const f of files) {
      if (!/\.(jpe?g|png|gif|webp|svg|mp4|webm|mov)$/i.test(f)) continue;
      try {
        const st = await fs.stat(path.join(dir, f));
        out.push({ url: `/uploads/${f}`, size: st.size, mtime: st.mtimeMs });
      } catch {
        /* ignore */
      }
    }
    out.sort((a, b) => b.mtime - a.mtime);
    return out;
  }),

  deleteFile: adminQuery
    .input(z.object({ url: z.string().min(1).max(300) }))
    .mutation(async ({ input }) => {
      const filename = path.basename(input.url);
      if (!/^[\w.-]+\.(jpe?g|png|gif|webp|svg|mp4|webm|mov)$/i.test(filename)) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Arquivo inválido." });
      }
      try {
        await fs.unlink(path.join(uploadsDir(), filename));
      } catch {
        /* already gone */
      }
      return { success: true };
    }),
});
