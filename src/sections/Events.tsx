import { useCallback, useEffect, useState } from 'react'
import { useLang } from '../i18n'
import { Eyebrow, Reveal, Sparkles, theme } from '../components/atoms'

const defaultPhotos = Array.from({ length: 6 }, (_, i) => `/images/ahmad/ev${i + 1}.jpg`)

export default function Events() {
  const { t, lang, overrides } = useLang()
  const photos = defaultPhotos.map((d, i) => overrides[`events.photo.${i + 1}`] || d)
  const [open, setOpen] = useState<number | null>(null)

  const close = useCallback(() => setOpen(null), [])
  const prev = useCallback(
    () => setOpen((o) => (o === null ? o : (o + photos.length - 1) % photos.length)),
    []
  )
  const next = useCallback(
    () => setOpen((o) => (o === null ? o : (o + 1) % photos.length)),
    []
  )

  useEffect(() => {
    if (open === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, close, prev, next])

  return (
    <section
      id="eventos"
      style={{
        background: 'transparent',
        padding: 'clamp(90px, 11vw, 150px) clamp(20px, 4vw, 60px)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Sparkles density={60} />
      <div style={{ maxWidth: '1280px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <Reveal><Eyebrow>{t('events.eyebrow')}</Eyebrow></Reveal>
        <Reveal delay={80}>
          <h2
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: 'clamp(30px, 4.4vw, 56px)',
              fontWeight: 500,
              color: theme.cream,
              margin: '0 0 16px',
              maxWidth: '820px',
              lineHeight: 1.15,
            }}
          >
            {t('events.title')}
          </h2>
        </Reveal>
        <Reveal delay={140}>
          <p
            style={{
              fontFamily: "'Playfair Display', serif",
              fontStyle: 'italic',
              fontSize: 'clamp(15px, 1.5vw, 18px)',
              color: theme.beige,
              margin: '0 0 56px',
              maxWidth: '640px',
            }}
          >
            {t('events.sub')}
          </p>
        </Reveal>

        {/* Masonry grid (preserva a proporção de cada foto) */}
        <div style={{ columns: '3 300px', columnGap: '14px' }}>
          {photos.map((src, i) => (
            <Reveal key={src} delay={(i % 3) * 90}>
              <button
                onClick={() => setOpen(i)}
                className="event-item"
                style={{
                  position: 'relative',
                  display: 'block',
                  width: '100%',
                  padding: 0,
                  marginBottom: '14px',
                  border: '1px solid rgba(201,169,97,0.25)',
                  backgroundColor: theme.bgSoft,
                  cursor: 'zoom-in',
                  overflow: 'hidden',
                  breakInside: 'avoid',
                }}
              >
                <img
                  src={src}
                  alt={`${eventAlt[lang]} ${i + 1}`}
                  loading="lazy"
                  style={{
                    width: '100%',
                    display: 'block',
                    transition: 'transform 0.7s cubic-bezier(0.16,1,0.3,1), filter 0.5s ease',
                  }}
                />
                <span
                  className="event-veil"
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background:
                      'linear-gradient(180deg, transparent 55%, rgba(12,7,5,0.75) 100%)',
                    opacity: 0,
                    transition: 'opacity 0.4s ease',
                    display: 'flex',
                    alignItems: 'flex-end',
                    justifyContent: 'center',
                    paddingBottom: '18px',
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'Cinzel', serif",
                      fontSize: '11px',
                      letterSpacing: '0.3em',
                      color: theme.gold,
                      textTransform: 'uppercase',
                    }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </span>
              </button>
            </Reveal>
          ))}
        </div>

        <Reveal delay={200}>
          <div style={{ textAlign: 'center', marginTop: '48px' }}>
            <a
              href="https://wa.me/5511986981444"
              target="_blank"
              rel="noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '12px',
                fontFamily: "'Cinzel', serif",
                fontSize: '13px',
                letterSpacing: '0.28em',
                textTransform: 'uppercase',
                color: theme.bg,
                background: `linear-gradient(120deg, ${theme.gold}, ${theme.goldSoft})`,
                padding: '18px 42px',
                textDecoration: 'none',
                boxShadow: '0 12px 40px rgba(212,175,55,0.28)',
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22c5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2zm0 18.03a8.1 8.1 0 0 1-4.13-1.13l-.3-.18-3.12.82.83-3.04-.2-.31a8.06 8.06 0 1 1 6.92 3.84zm4.43-6.05c-.24-.12-1.43-.71-1.65-.79-.22-.08-.38-.12-.54.12-.16.24-.62.79-.76.95-.14.16-.28.18-.52.06-.24-.12-1.03-.38-1.96-1.21-.72-.64-1.21-1.44-1.35-1.68-.14-.24-.02-.37.11-.49.11-.11.24-.28.37-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.78-.19-.47-.39-.4-.54-.41h-.46c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2s.86 2.32.98 2.48c.12.16 1.7 2.59 4.11 3.63.57.25 1.02.39 1.37.51.58.18 1.1.16 1.51.1.46-.07 1.43-.58 1.63-1.15.2-.56.2-1.04.14-1.15-.06-.1-.22-.16-.46-.28z"/>
              </svg>
              {t('events.cta')}
            </a>
          </div>
        </Reveal>
      </div>

      {/* Lightbox */}
      {open !== null && (
        <div
          onClick={close}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            backgroundColor: 'rgba(5,3,2,0.94)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
            backdropFilter: 'blur(6px)',
            WebkitBackdropFilter: 'blur(6px)',
          }}
        >
          <img
            src={photos[open]}
            alt={`${eventAlt[lang]} ${open + 1}`}
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: 'min(92vw, 900px)',
              maxHeight: '82vh',
              objectFit: 'contain',
              border: `1px solid ${theme.goldSoft}`,
              boxShadow: '0 0 90px rgba(123,94,167,0.3), 0 30px 80px rgba(0,0,0,0.7)',
            }}
          />
          {[
            { label: '‹', act: prev, left: '18px' },
            { label: '›', act: next, right: '18px' },
          ].map((b) => (
            <button
              key={b.label}
              onClick={(e) => { e.stopPropagation(); b.act() }}
              style={{
                position: 'fixed',
                top: '50%',
                transform: 'translateY(-50%)',
                left: b.left,
                right: b.right,
                width: '52px',
                height: '52px',
                borderRadius: '50%',
                border: `1px solid ${theme.goldSoft}`,
                backgroundColor: 'rgba(12,7,5,0.7)',
                color: theme.gold,
                fontSize: '26px',
                cursor: 'pointer',
                lineHeight: 1,
              }}
              aria-label={b.label}
            >
              {b.label}
            </button>
          ))}
          <button
            onClick={close}
            style={{
              position: 'fixed',
              top: '22px',
              right: '22px',
              border: `1px solid ${theme.goldSoft}`,
              backgroundColor: 'rgba(12,7,5,0.7)',
              color: theme.cream,
              fontFamily: "'Cinzel', serif",
              fontSize: '11px',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              padding: '12px 20px',
              cursor: 'pointer',
            }}
          >
            {t('gallery.close')} ✕
          </button>
        </div>
      )}

      <style>{`
        .event-item:hover img { transform: scale(1.05); filter: brightness(1.08); }
        .event-item:hover .event-veil { opacity: 1; }
      `}</style>
    </section>
  )
}

const eventAlt = {
  pt: 'Leitura da borra de cafe realizada em evento',
  en: 'Coffee grounds reading performed at an event',
  es: 'Lectura de posos de cafe realizada en un evento',
  ar: 'قراءة تفل القهوة في مناسبة',
}
