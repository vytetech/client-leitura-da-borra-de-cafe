import type { Hono } from "hono";
import type { HttpBindings } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import fs from "fs";
import path from "path";

type App = Hono<{ Bindings: HttpBindings }>;

export function serveStaticFiles(app: App) {
  const distPath = path.resolve(import.meta.dirname, "../dist/public");
  const validHtmlPaths = new Set(["/pt/", "/en/", "/es/", "/ar/", "/login", "/admin"]);
  const privateHtmlPaths = new Set(["/login", "/admin"]);

  app.get("/", (c) => c.redirect("/pt/", 301));
  for (const locale of ["pt", "en", "es", "ar"]) {
    app.get(`/${locale}`, (c) => c.redirect(`/${locale}/`, 301));
  }

  app.use("*", serveStatic({ root: "./dist/public" }));

  app.notFound((c) => {
    const accept = c.req.header("accept") ?? "";
    if (!accept.includes("text/html")) {
      return c.json({ error: "Not Found" }, 404);
    }
    const reqPath = new URL(c.req.url).pathname;
    const locale = reqPath.split("/").filter(Boolean)[0];
    const localizedIndex = ["pt", "en", "es", "ar"].includes(locale)
      ? path.resolve(distPath, locale, "index.html")
      : path.resolve(distPath, "index.html");
    const indexPath = fs.existsSync(localizedIndex) ? localizedIndex : path.resolve(distPath, "index.html");
    let content = fs.readFileSync(indexPath, "utf-8");
    if (privateHtmlPaths.has(reqPath) || !validHtmlPaths.has(reqPath)) {
      content = content
        .replace(/<title>.*?<\/title>/, "<title>Area privada | Ahmad K. Taha</title>")
        .replace(/<meta name="robots" content="[^"]*" \/>/, '<meta name="robots" content="noindex, nofollow, noarchive" />')
        .replace(/<link rel="canonical" href="[^"]*" \/>\n/, "");
    }
    return c.html(content, validHtmlPaths.has(reqPath) ? 200 : 404);
  });
}
