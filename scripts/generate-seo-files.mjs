import fs from 'node:fs'
import path from 'node:path'
import { SITE_URL, canonical, jsonLd, locales, seoByLang, supportedLangs } from './seo-data.mjs'

const dist = path.resolve('dist/public')
const indexPath = path.join(dist, 'index.html')
const template = fs.readFileSync(indexPath, 'utf8')

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
    />`
}

function renderRoot(lang) {
  const seo = seoByLang[lang]
  const sections = seo.sections
    .map((section) => `<section><h2>${escapeHtml(section.title)}</h2><p>${escapeHtml(section.text)}</p></section>`)
    .join('')
  const dir = locales[lang].dir
  return `<div id="root"><main lang="${locales[lang].hreflang}" dir="${dir}"><h1>${escapeHtml(seo.h1)}</h1><p>${escapeHtml(seo.lead)}</p>${sections}</main></div>`
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
