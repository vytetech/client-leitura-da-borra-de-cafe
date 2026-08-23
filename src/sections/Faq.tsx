import { useState } from 'react'
import { useLang, type TKey } from '../i18n'
import { Eyebrow, Reveal, Sparkles, theme } from '../components/atoms'

const qa = [1, 2, 3, 4, 5, 6] as const

export default function Faq() {
  const { t } = useLang()
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section
      id="faq"
      style={{
        background: 'transparent',
        padding: 'clamp(90px, 11vw, 150px) clamp(20px, 4vw, 60px)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Sparkles density={55} />
      <div style={{ maxWidth: '860px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <Reveal><Eyebrow>{t('faq.eyebrow')}</Eyebrow></Reveal>
        <Reveal delay={80}>
          <h2
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: 'clamp(30px, 4.4vw, 54px)',
              fontWeight: 500,
              color: theme.cream,
              margin: '0 0 14px',
            }}
          >
            {t('faq.title')}
          </h2>
        </Reveal>
        <Reveal delay={140}>
          <p
            style={{
              fontFamily: "'Playfair Display', serif",
              fontStyle: 'italic',
              fontSize: 'clamp(15px, 1.5vw, 18px)',
              color: theme.beige,
              margin: '0 0 48px',
              maxWidth: '600px',
            }}
          >
            {t('faq.sub')}
          </p>
        </Reveal>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {qa.map((n, i) => {
            const isOpen = open === i
            return (
              <Reveal key={n} delay={i * 60}>
                <div
                  style={{
                    border: `1px solid ${isOpen ? 'rgba(212,175,55,0.55)' : 'rgba(201,169,97,0.22)'}`,
                    backgroundColor: isOpen ? 'rgba(22,16,9,0.85)' : 'rgba(12,7,5,0.6)',
                    transition: 'border-color 0.3s ease, background-color 0.3s ease',
                  }}
                >
                  <button
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '18px',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '22px 26px',
                      textAlign: 'left',
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "'Cinzel', serif",
                        fontSize: 'clamp(14px, 1.5vw, 17px)',
                        letterSpacing: '0.06em',
                        color: isOpen ? theme.gold : theme.cream,
                        transition: 'color 0.3s ease',
                      }}
                    >
                      {t(`faq.q${n}` as TKey)}
                    </span>
                    <span
                      style={{
                        flexShrink: 0,
                        width: '30px',
                        height: '30px',
                        border: `1px solid ${theme.goldSoft}`,
                        borderRadius: '50%',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: theme.gold,
                        fontSize: '17px',
                        lineHeight: 1,
                        transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
                        transition: 'transform 0.35s cubic-bezier(0.16,1,0.3,1)',
                      }}
                    >
                      +
                    </span>
                  </button>
                  <div
                    style={{
                      maxHeight: isOpen ? '320px' : '0',
                      overflow: 'hidden',
                      transition: 'max-height 0.5s cubic-bezier(0.16,1,0.3,1)',
                    }}
                  >
                    <p
                      style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: 'clamp(14px, 1.4vw, 16.5px)',
                        lineHeight: 1.85,
                        color: theme.beige,
                        margin: 0,
                        padding: '0 26px 26px',
                      }}
                    >
                      {t(`faq.a${n}` as TKey)}
                    </p>
                  </div>
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
