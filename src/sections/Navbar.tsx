import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { useLang, type Lang } from '../i18n'
import { theme } from '../components/atoms'

const links: { id: string; key: 'nav.about' | 'nav.how' | 'nav.gallery' | 'nav.services' | 'nav.events' | 'nav.testimonials' }[] = [
  { id: 'sobre', key: 'nav.about' },
  { id: 'como-funciona', key: 'nav.how' },
  { id: 'galeria', key: 'nav.gallery' },
  { id: 'servicos', key: 'nav.services' },
  { id: 'eventos', key: 'nav.events' },
  { id: 'depoimentos', key: 'nav.testimonials' },
]

const LANG_OPTIONS: { id: Lang; flag: string; label: string }[] = [
  { id: 'pt', flag: '🇧🇷', label: 'Português' },
  { id: 'ar', flag: '🇵🇸', label: 'العربية' },
  { id: 'es', flag: '🇪🇸', label: 'Español' },
  { id: 'en', flag: '🇨🇦', label: 'English' },
]

function GlobeIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="9.2" />
      <ellipse cx="12" cy="12" rx="4.2" ry="9.2" />
      <line x1="2.8" y1="12" x2="21.2" y2="12" />
      <path d="M4.2 6.2 C 7.5 8.4, 16.5 8.4, 19.8 6.2" />
      <path d="M4.2 17.8 C 7.5 15.6, 16.5 15.6, 19.8 17.8" />
    </svg>
  )
}

export default function Navbar() {
  const { lang, setLang, t, overrides } = useLang()
  const [scrolled, setScrolled] = useState(false)
  const [hover, setHover] = useState<string | null>(null)
  const [langOpen, setLangOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    const closeMenus = () => { setLangOpen(false) }
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('click', closeMenus)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('click', closeMenus)
    }
  }, [])

  // lock body scroll while the mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const go = (id: string) => {
    setMenuOpen(false)
    requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }))
  }

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        zIndex: 100,
        backgroundColor: scrolled || menuOpen ? 'rgba(12,7,5,0.94)' : 'transparent',
        backdropFilter: scrolled || menuOpen ? 'blur(12px)' : 'none',
        WebkitBackdropFilter: scrolled || menuOpen ? 'blur(12px)' : 'none',
        borderBottom: scrolled || menuOpen ? '1px solid rgba(201,169,97,0.25)' : '1px solid transparent',
        transition: 'all 0.45s ease',
      }}
    >
      <div
        style={{
          maxWidth: '1440px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '14px clamp(18px, 3.5vw, 48px)',
          gap: '16px',
        }}
      >
        <button
          onClick={() => { setMenuOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: 0,
            minWidth: 0,
          }}
        >
          <img src={overrides['img.logo'] || '/images/ahmad/logo.png'} alt="Logo A leitura da borra de café — قراءة الفنجان" style={{ width: '38px', height: '38px', flexShrink: 0 }} />
          <span
            className="brand-text"
            style={{
              fontFamily: "'Cinzel', serif",
              letterSpacing: '0.18em',
              color: theme.cream,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            A LEITURA DA BORRA DE CAFÉ
          </span>
        </button>

        {/* ---------- desktop nav ---------- */}
        <nav className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: '2px', flexWrap: 'nowrap', justifyContent: 'flex-end' }}>
          {links.map((l) => (
            <button
              key={l.id}
              onClick={() => go(l.id)}
              onMouseEnter={() => setHover(l.id)}
              onMouseLeave={() => setHover(null)}
              className="nav-link"
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontFamily: "'Cinzel', serif",
                fontSize: '11px',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: hover === l.id ? theme.gold : 'rgba(242,231,208,0.82)',
                padding: '10px 12px',
                transition: 'color 0.25s ease',
                whiteSpace: 'nowrap',
              }}
            >
              {t(l.key)}
            </button>
          ))}
          <button
            onClick={() => go('agendar')}
            onMouseEnter={() => setHover('book')}
            onMouseLeave={() => setHover(null)}
            style={{
              cursor: 'pointer',
              fontFamily: "'Cinzel', serif",
              fontSize: '11px',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: hover === 'book' ? '#0c0705' : theme.gold,
              backgroundColor: hover === 'book' ? theme.gold : 'transparent',
              border: `1px solid ${theme.gold}`,
              padding: '10px 20px',
              marginLeft: '8px',
              transition: 'all 0.25s ease',
              whiteSpace: 'nowrap',
            }}
          >
            {t('nav.book')}
          </button>

          {/* Language picker — desktop */}
          <div style={{ position: 'relative', marginLeft: '14px' }}>
            <button
              onClick={(e) => { e.stopPropagation(); setLangOpen((o) => !o) }}
              aria-label="Language / Idioma / اللغة"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: langOpen ? 'rgba(212,175,55,0.14)' : 'transparent',
                border: '1px solid rgba(201,169,97,0.4)',
                color: theme.gold,
                cursor: 'pointer',
                padding: '8px 12px',
                transition: 'background 0.25s ease',
              }}
            >
              <GlobeIcon />
              <span style={{ fontSize: '13px', lineHeight: 1 }}>{LANG_OPTIONS.find((o) => o.id === lang)?.flag}</span>
            </button>
            {langOpen && (
              <div
                onClick={(e) => e.stopPropagation()}
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 8px)',
                  insetInlineEnd: 0,
                  minWidth: '180px',
                  backgroundColor: 'rgba(12,7,5,0.97)',
                  border: `1px solid ${theme.goldSoft}`,
                  boxShadow: '0 18px 50px rgba(0,0,0,0.6)',
                  zIndex: 200,
                }}
              >
                {LANG_OPTIONS.map((o) => (
                  <button
                    key={o.id}
                    onClick={() => { setLang(o.id); setLangOpen(false) }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      width: '100%',
                      background: lang === o.id ? 'rgba(212,175,55,0.16)' : 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '12px 16px',
                      textAlign: 'start',
                      transition: 'background 0.2s ease',
                    }}
                  >
                    <span style={{ fontSize: '17px', lineHeight: 1 }}>{o.flag}</span>
                    <span
                      style={{
                        fontFamily: "'Cinzel', serif",
                        fontSize: '12px',
                        letterSpacing: '0.08em',
                        color: lang === o.id ? theme.gold : theme.cream,
                      }}
                    >
                      {o.label}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </nav>

        {/* ---------- mobile controls ---------- */}
        <div className="mobile-controls" style={{ display: 'none', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={(e) => { e.stopPropagation(); setMenuOpen((o) => !o); setLangOpen(false) }}
            aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
            style={{
              background: 'transparent',
              border: '1px solid rgba(201,169,97,0.4)',
              cursor: 'pointer',
              width: '42px',
              height: '42px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '5px',
              padding: 0,
            }}
          >
            <span
              style={{
                display: 'block',
                width: '18px',
                height: '1.6px',
                backgroundColor: theme.gold,
                transition: 'transform 0.3s ease, opacity 0.3s ease',
                transform: menuOpen ? 'translateY(6.6px) rotate(45deg)' : 'none',
              }}
            />
            <span
              style={{
                display: 'block',
                width: '18px',
                height: '1.6px',
                backgroundColor: theme.gold,
                transition: 'opacity 0.25s ease',
                opacity: menuOpen ? 0 : 1,
              }}
            />
            <span
              style={{
                display: 'block',
                width: '18px',
                height: '1.6px',
                backgroundColor: theme.gold,
                transition: 'transform 0.3s ease',
                transform: menuOpen ? 'translateY(-6.6px) rotate(-45deg)' : 'none',
              }}
            />
          </button>
        </div>
      </div>

      {/* ---------- mobile drawer (portal, escapes header stacking context) ---------- */}
      {createPortal(
      <div
        className="mobile-drawer"
        onClick={(e) => e.stopPropagation()}
        style={{
          display: 'none',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 99,
          background: 'linear-gradient(180deg, rgba(10,6,4,0.98) 0%, rgba(7,4,2,0.99) 100%)',
          backdropFilter: 'blur(14px)',
          WebkitBackdropFilter: 'blur(14px)',
          opacity: menuOpen ? 1 : 0,
          pointerEvents: menuOpen ? 'auto' : 'none',
          transition: 'opacity 0.35s ease',
          paddingTop: '90px',
          overflowY: 'auto',
        }}
      >
        <nav style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', padding: '10px 24px 40px' }}>
          {links.map((l, i) => (
            <button
              key={l.id}
              onClick={() => go(l.id)}
              style={{
                background: 'none',
                border: 'none',
                borderBottom: '1px solid rgba(201,169,97,0.16)',
                cursor: 'pointer',
                fontFamily: "'Cinzel', serif",
                fontSize: '17px',
                letterSpacing: '0.26em',
                textTransform: 'uppercase',
                color: theme.cream,
                padding: '18px 10px',
                width: '100%',
                maxWidth: '380px',
                opacity: menuOpen ? 1 : 0,
                transform: menuOpen ? 'translateY(0)' : 'translateY(14px)',
                transition: `opacity 0.4s ease ${0.06 * i + 0.1}s, transform 0.4s ease ${0.06 * i + 0.1}s, color 0.25s ease`,
              }}
            >
              {t(l.key)}
            </button>
          ))}
          <button
            onClick={() => go('agendar')}
            style={{
              cursor: 'pointer',
              fontFamily: "'Cinzel', serif",
              fontSize: '15px',
              letterSpacing: '0.26em',
              textTransform: 'uppercase',
              color: '#120b06',
              background: `linear-gradient(135deg, ${theme.gold} 0%, #b8923f 100%)`,
              border: 'none',
              padding: '16px 44px',
              marginTop: '26px',
              fontWeight: 700,
              opacity: menuOpen ? 1 : 0,
              transform: menuOpen ? 'translateY(0)' : 'translateY(14px)',
              transition: `opacity 0.4s ease 0.5s, transform 0.4s ease 0.5s`,
            }}
          >
            {t('nav.book')}
          </button>

          {/* language flags row */}
          <div
            style={{
              display: 'flex',
              gap: '14px',
              marginTop: '34px',
              opacity: menuOpen ? 1 : 0,
              transform: menuOpen ? 'translateY(0)' : 'translateY(14px)',
              transition: `opacity 0.4s ease 0.58s, transform 0.4s ease 0.58s`,
            }}
          >
            {LANG_OPTIONS.map((o) => (
              <button
                key={o.id}
                onClick={() => setLang(o.id)}
                aria-label={o.label}
                style={{
                  background: lang === o.id ? 'rgba(212,175,55,0.16)' : 'transparent',
                  border: `1px solid ${lang === o.id ? theme.gold : 'rgba(201,169,97,0.35)'}`,
                  borderRadius: '50%',
                  width: '52px',
                  height: '52px',
                  fontSize: '22px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.25s ease',
                  lineHeight: 1,
                }}
              >
                {o.flag}
              </button>
            ))}
          </div>
        </nav>
      </div>,
      document.body
      )}

      <style>{`
        .brand-text { font-size: clamp(11px, 1.2vw, 14px); }
        @media (max-width: 1023px) {
          .desktop-nav { display: none !important; }
          .mobile-controls { display: flex !important; }
          .mobile-drawer { display: block !important; }
          .brand-text { font-size: 11.5px; letter-spacing: 0.14em; }
        }
        @media (min-width: 1024px) {
          .mobile-drawer { display: none !important; }
        }
        @media (max-width: 420px) {
          .brand-text { font-size: 10px; letter-spacing: 0.11em; }
        }
      `}</style>
    </header>
  )
}
