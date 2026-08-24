import { useEffect } from 'react'
import { useLocation } from 'react-router'
import { getAlternateLinks, getCanonicalUrl, getJsonLd, getSiteUrl, locales, seoByLang, type Lang } from '@/seo'

function setMeta(selector: string, attrs: Record<string, string>) {
  let el = document.head.querySelector(selector) as HTMLMetaElement | HTMLLinkElement | null
  if (!el) {
    el = document.createElement(selector.startsWith('link') ? 'link' : 'meta')
    const match = selector.match(/\[(name|property|rel)="([^"]+)"\]/)
    if (match) el.setAttribute(match[1], match[2])
    document.head.appendChild(el)
  }
  Object.entries(attrs).forEach(([key, value]) => el?.setAttribute(key, value))
}

function removeManagedLinks() {
  document.head.querySelectorAll('[data-seo-managed="true"]').forEach((el) => el.remove())
}

function addLink(rel: string, attrs: Record<string, string>) {
  const el = document.createElement('link')
  el.rel = rel
  el.dataset.seoManaged = 'true'
  Object.entries(attrs).forEach(([key, value]) => el.setAttribute(key, value))
  document.head.appendChild(el)
}

function setJsonLd(id: string, data: unknown) {
  let el = document.getElementById(id) as HTMLScriptElement | null
  if (!el) {
    el = document.createElement('script')
    el.id = id
    el.type = 'application/ld+json'
    document.head.appendChild(el)
  }
  el.textContent = JSON.stringify(data)
}

export function Seo({ lang, noindex = false }: { lang: Lang; noindex?: boolean }) {
  const location = useLocation()

  useEffect(() => {
    const baseUrl = getSiteUrl()
    const seo = seoByLang[lang]
    const canonical = noindex ? `${baseUrl}${location.pathname}` : getCanonicalUrl(lang, baseUrl)
    const image = `${baseUrl}/images/ahmad/logo.png`

    document.title = noindex ? 'Area administrativa | Ahmad K. Taha' : seo.title
    document.documentElement.lang = locales[lang].hreflang
    document.documentElement.dir = locales[lang].dir

    setMeta('meta[name="description"]', { content: noindex ? 'Area administrativa privada.' : seo.description })
    setMeta('meta[name="robots"]', { content: noindex ? 'noindex, nofollow, noarchive' : 'index, follow, max-image-preview:large' })
    setMeta('meta[property="og:title"]', { property: 'og:title', content: noindex ? 'Area administrativa' : seo.title })
    setMeta('meta[property="og:description"]', { property: 'og:description', content: noindex ? 'Area administrativa privada.' : seo.description })
    setMeta('meta[property="og:type"]', { property: 'og:type', content: noindex ? 'website' : 'website' })
    setMeta('meta[property="og:url"]', { property: 'og:url', content: canonical })
    setMeta('meta[property="og:image"]', { property: 'og:image', content: image })
    setMeta('meta[property="og:locale"]', { property: 'og:locale', content: locales[lang].og })
    setMeta('meta[name="twitter:card"]', { name: 'twitter:card', content: 'summary_large_image' })
    setMeta('meta[name="twitter:title"]', { name: 'twitter:title', content: noindex ? 'Area administrativa' : seo.title })
    setMeta('meta[name="twitter:description"]', { name: 'twitter:description', content: noindex ? 'Area administrativa privada.' : seo.description })
    setMeta('meta[name="twitter:image"]', { name: 'twitter:image', content: image })

    removeManagedLinks()
    if (!noindex) {
      addLink('canonical', { href: canonical })
      getAlternateLinks(lang, baseUrl).forEach((alt) => addLink('alternate', { hreflang: alt.lang, href: alt.href }))
      addLink('alternate', { hreflang: 'x-default', href: getCanonicalUrl('pt', baseUrl) })
      Object.values(locales).filter((locale) => locale.og !== locales[lang].og).forEach((locale) => {
        const meta = document.createElement('meta')
        meta.setAttribute('property', 'og:locale:alternate')
        meta.setAttribute('content', locale.og)
        meta.dataset.seoManaged = 'true'
        document.head.appendChild(meta)
      })
      setJsonLd('site-json-ld', getJsonLd(lang, baseUrl))
    }
  }, [lang, location.pathname, noindex])

  return null
}
