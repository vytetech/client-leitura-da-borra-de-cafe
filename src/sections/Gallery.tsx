import { useCallback, useEffect, useState } from 'react'
import { useLang } from '../i18n'
import { Eyebrow, Reveal, theme } from '../components/atoms'

const defaultPhotos = Array.from({ length: 9 }, (_, i) => `/images/ahmad/g${i + 1}.jpg`)

export default function Gallery() {
  const { t, lang, overrides } = useLang()
  const photos = defaultPhotos.map((d, i) => overrides[`gallery.photo.${i + 1}`] || d)
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
      id="galeria"
      style={{
        background: 'transparent',
        padding: 'clamp(90px, 11vw, 150px) clamp(20px, 4vw, 60px)',
      }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <Reveal><Eyebrow>{t('gallery.eyebrow')}</Eyebrow></Reveal>
        <Reveal delay={80}>
          <h2
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: 'clamp(32px, 4.6vw, 60px)',
              fontWeight: 500,
              color: theme.cream,
              margin: '0 0 16px',
            }}
          >
            {t('gallery.title')}
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
              maxWidth: '620px',
            }}
          >
            {t('gallery.sub')}
          </p>
        </Reveal>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
            gap: '14px',
          }}
        >
          {photos.map((src, i) => (
            <Reveal key={src} delay={(i % 3) * 90}>
              <button
                onClick={() => setOpen(i)}
                className="gallery-item"
                style={{
                  position: 'relative',
                  display: 'block',
                  width: '100%',
                  padding: 0,
                  border: '1px solid rgba(201,169,97,0.25)',
                  backgroundColor: theme.bgSoft,
                  cursor: 'zoom-in',
                  overflow: 'hidden',
                  aspectRatio: '1',
                }}
              >
                <img
                  src={src}
                  alt={`${galleryAlt[lang]} ${i + 1}`}
                  loading="lazy"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                    transition: 'transform 0.7s cubic-bezier(0.16,1,0.3,1), filter 0.5s ease',
                  }}
                />
                <span
                  className="gallery-veil"
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
            alt={`${galleryAlt[lang]} ${open + 1}`}
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
        .gallery-item:hover img { transform: scale(1.06); filter: brightness(1.08); }
        .gallery-item:hover .gallery-veil { opacity: 1; }
      `}</style>
    </section>
  )
}

const galleryAlt = {
  pt: 'Xicara real com simbolos da borra de cafe',
  en: 'Real cup with coffee grounds symbols',
  es: 'Taza real con simbolos de los posos del cafe',
  ar: 'فنجان حقيقي مع رموز تفل القهوة',
}
