import { useLang } from '../i18n'
import { Eyebrow, Ornament, Reveal, theme } from '../components/atoms'
import { seoByLang } from '../seo'

export default function About() {
  const { t, lang, overrides } = useLang()

  return (
    <section
      id="sobre"
      style={{
        position: 'relative',
        background: 'transparent',
        padding: 'clamp(90px, 11vw, 150px) clamp(20px, 4vw, 60px)',
        overflow: 'hidden',
      }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <Reveal><Eyebrow>{t('about.eyebrow')}</Eyebrow></Reveal>
        <Reveal delay={80}>
          <h2
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: 'clamp(32px, 4.6vw, 60px)',
              fontWeight: 500,
              letterSpacing: '0.02em',
              color: theme.cream,
              margin: '0 0 60px',
              lineHeight: 1.15,
            }}
          >
            {t('about.title')}
          </h2>
        </Reveal>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 380px), 1fr))',
            gap: 'clamp(44px, 6vw, 90px)',
            alignItems: 'center',
          }}
        >
          <Reveal delay={120}>
            <div style={{ position: 'relative' }}>
              <div
                style={{
                  position: 'absolute',
                  inset: '-18px 18px 18px -18px',
                  border: `1px solid ${theme.goldSoft}`,
                  opacity: 0.5,
                  pointerEvents: 'none',
                }}
              />
              <img
                src={overrides['img.about'] || '/images/ahmad/about.png'}
                alt={seoByLang[lang].imageAlt}
                width={900}
                height={900}
                style={{
                  width: '100%',
                  display: 'block',
                  boxShadow: '0 30px 80px rgba(0,0,0,0.55)',
                }}
              />
            </div>
          </Reveal>

          <div>
            <Reveal delay={160}>
              <p
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: 'clamp(16px, 1.5vw, 19px)',
                  lineHeight: 1.85,
                  color: 'rgba(242,231,208,0.88)',
                  marginBottom: '24px',
                }}
              >
                {t('about.p1')}
              </p>
            </Reveal>
            <Reveal delay={220}>
              <p
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: 'clamp(16px, 1.5vw, 19px)',
                  lineHeight: 1.85,
                  color: 'rgba(242,231,208,0.88)',
                  marginBottom: '34px',
                }}
              >
                {t('about.p2')}
              </p>
            </Reveal>

            <Reveal delay={280}>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '2px',
                  backgroundColor: 'rgba(201,169,97,0.25)',
                  border: '1px solid rgba(201,169,97,0.25)',
                  marginBottom: '34px',
                }}
              >
                {[
                  { n: '20+', l: t('about.stat1') },
                  { n: '4', l: t('about.stat2') },
                  { n: '5.000+', l: t('about.stat3') },
                ].map((s) => (
                  <div
                    key={s.n}
                    style={{
                      backgroundColor: theme.bg,
                      padding: '22px 14px',
                      textAlign: 'center',
                    }}
                  >
                    <p
                      style={{
                        fontFamily: "'Cinzel', serif",
                        fontSize: 'clamp(22px, 2.6vw, 34px)',
                        color: theme.gold,
                        margin: '0 0 6px',
                      }}
                    >
                      {s.n}
                    </p>
                    <p
                      style={{
                        fontFamily: "'Cinzel', serif",
                        fontSize: '10px',
                        letterSpacing: '0.14em',
                        textTransform: 'uppercase',
                        color: theme.beige,
                        margin: 0,
                        lineHeight: 1.5,
                      }}
                    >
                      {s.l}
                    </p>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal delay={340}>
              <p
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontStyle: 'italic',
                  fontSize: 'clamp(15px, 1.5vw, 18px)',
                  lineHeight: 1.7,
                  color: theme.goldSoft,
                  borderLeft: `2px solid ${theme.gold}`,
                  paddingLeft: '20px',
                  margin: '0 0 20px',
                }}
              >
                {t('about.connection')}
              </p>
              <p
                style={{
                  fontFamily: "'Cinzel', serif",
                  fontSize: '12px',
                  letterSpacing: '0.2em',
                  color: 'rgba(201,180,138,0.8)',
                }}
              >
                {t('about.langs')}
              </p>
            </Reveal>
          </div>
        </div>

        <div style={{ marginTop: '80px' }}>
          <Ornament />
        </div>
      </div>
    </section>
  )
}
