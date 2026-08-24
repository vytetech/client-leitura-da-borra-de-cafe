import fs from 'node:fs'
import path from 'node:path'
import { SITE_URL, canonical, jsonLd, locales, seoByLang, supportedLangs } from './seo-data.mjs'

const dist = path.resolve('dist/public')
const indexPath = path.join(dist, 'index.html')
const template = fs.readFileSync(indexPath, 'utf8')
const viteHeadAssets = extractViteHeadAssets(template)

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}

function renderHead(lang) {
  const seo = seoByLang[lang]
  const locale = locales[lang]
  const url = canonical(lang)
  const image = `${SITE_URL}/images/ahmad/logo.png`
  const alternateLinks = supportedLangs
    .map((code) => `    <link rel="alternate" hreflang="${locales[code].hreflang}" href="${canonical(code)}" />`)
    .join('\n')
  const ogAlternates = supportedLangs
    .filter((code) => code !== lang)
    .map((code) => `    <meta property="og:locale:alternate" content="${locales[code].og}" />`)
    .join('\n')

  return `    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="icon" href="/favicon.ico" sizes="any" />
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
    <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
    <title>${escapeHtml(seo.title)}</title>
    <meta name="description" content="${escapeHtml(seo.description)}" />
    <meta name="robots" content="index, follow, max-image-preview:large" />
    <link rel="canonical" href="${url}" />
${alternateLinks}
    <link rel="alternate" hreflang="x-default" href="${canonical('pt')}" />
    <meta property="og:title" content="${escapeHtml(seo.title)}" />
    <meta property="og:description" content="${escapeHtml(seo.description)}" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${url}" />
    <meta property="og:image" content="${image}" />
    <meta property="og:locale" content="${locale.og}" />
${ogAlternates}
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(seo.title)}" />
    <meta name="twitter:description" content="${escapeHtml(seo.description)}" />
    <meta name="twitter:image" content="${image}" />
    <script id="site-json-ld" type="application/ld+json">${JSON.stringify(jsonLd(lang))}</script>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Amiri:ital,wght@0,400;0,700;1,400&display=swap"
      rel="stylesheet"
    />
${viteHeadAssets}`
}

function extractViteHeadAssets(html) {
  const headMatch = html.match(/<head>([\s\S]*?)<\/head>/)
  if (!headMatch) {
    throw new Error('Could not find <head> in Vite build output.')
  }

  const tags = headMatch[1].match(/<(?:link|script)\b[\s\S]*?>(?:<\/script>)?/g) ?? []
  const assetTags = tags.filter((tag) => tag.includes('/assets/') || tag.includes('type="module"'))

  const hasModuleScript = assetTags.some((tag) => /<script\b/i.test(tag) && tag.includes('type="module"'))
  if (!hasModuleScript) {
    throw new Error('Could not find Vite module script in build output.')
  }

  return assetTags.join('\n')
}

function renderRoot(lang) {
  const locale = locales[lang]
  return `<div id="root" lang="${locale.hreflang}" dir="${locale.dir}"><div aria-hidden="true" style="min-height:100vh;display:grid;place-items:center;background:radial-gradient(circle at 50% 20%, rgba(177,129,54,.2), transparent 34%),linear-gradient(180deg,#160f08 0%,#0c0705 100%);color:#f7ead7;font-family:'Cinzel',serif;"><div style="display:grid;gap:18px;place-items:center;padding:32px;text-align:center;"><div style="width:44px;height:44px;border:1px solid rgba(212,175,55,.55);border-radius:999px;box-shadow:0 0 32px rgba(212,175,55,.24);"></div><div style="font-size:clamp(18px,4vw,28px);letter-spacing:.08em;text-transform:uppercase;">Ahmad K. Taha</div><div style="width:120px;height:2px;background:linear-gradient(90deg,transparent,#d4af37,transparent);"></div></div></div></div>`
}

function renderHtml(lang) {
  const locale = locales[lang]
  return template
    .replace(/<html[^>]*>/, `<html lang="${locale.hreflang}" dir="${locale.dir}">`)
    .replace(/<head>[\s\S]*?<\/head>/, `<head>\n${renderHead(lang)}\n  </head>`)
    .replace(/<div id="root"><\/div>/, renderRoot(lang))
}

for (const lang of supportedLangs) {
  const html = renderHtml(lang)
  const dir = path.join(dist, lang)
  fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(path.join(dir, 'index.html'), html)
  if (lang === 'pt') fs.writeFileSync(indexPath, html)
}

const sitemapUrls = supportedLangs.map((lang) => {
  const alternates = supportedLangs
    .map((code) => `    <xhtml:link rel="alternate" hreflang="${locales[code].hreflang}" href="${canonical(code)}" />`)
    .join('\n')
  return `  <url>
    <loc>${canonical(lang)}</loc>
${alternates}
    <xhtml:link rel="alternate" hreflang="x-default" href="${canonical('pt')}" />
    <changefreq>weekly</changefreq>
    <priority>${lang === 'pt' ? '1.0' : '0.9'}</priority>
  </url>`
}).join('\n')

fs.writeFileSync(path.join(dist, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${sitemapUrls}
</urlset>
`)

fs.writeFileSync(path.join(dist, 'robots.txt'), `User-agent: *
Allow: /
Disallow: /admin
Disallow: /login
Disallow: /api/

Sitemap: ${SITE_URL}/sitemap.xml
`)
