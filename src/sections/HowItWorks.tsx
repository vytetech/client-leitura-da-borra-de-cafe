import { useLang, type TKey } from '../i18n'
import { Eyebrow, Reveal, theme } from '../components/atoms'

const steps: { t: TKey; d: TKey }[] = [
  { t: 'how.s1t', d: 'how.s1d' },
  { t: 'how.s2t', d: 'how.s2d' },
  { t: 'how.s3t', d: 'how.s3d' },
  { t: 'how.s4t', d: 'how.s4d' },
]

export default function HowItWorks() {
  const { t } = useLang()

  return (
    <section
      id="como-funciona"
      style={{
        position: 'relative',
        background: 'transparent',
        padding: 'clamp(90px, 11vw, 150px) clamp(20px, 4vw, 60px)',
      }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <Reveal><Eyebrow>{t('how.eyebrow')}</Eyebrow></Reveal>
        <Reveal delay={80}>
          <h2
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: 'clamp(32px, 4.6vw, 60px)',
              fontWeight: 500,
              color: theme.cream,
              margin: '0 0 70px',
            }}
          >
            {t('how.title')}
          </h2>
        </Reveal>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))',
            gap: '2px',
            backgroundColor: 'rgba(201,169,97,0.22)',
            border: '1px solid rgba(201,169,97,0.22)',
          }}
        >
          {steps.map((s, i) => (
            <Reveal key={s.t} delay={i * 110} style={{ backgroundColor: 'rgba(12,7,5,0.72)' }}>
              <div style={{ padding: 'clamp(30px, 3vw, 44px)', height: '100%', boxSizing: 'border-box' }}>
                <svg width="34" height="34" viewBox="0 0 34 34" style={{ marginBottom: '22px' }} aria-hidden="true">
                  <g transform="translate(17,17)" stroke={theme.goldSoft} fill="none" strokeWidth="0.9">
                    <rect x="-9" y="-9" width="18" height="18" />
                    <rect x="-9" y="-9" width="18" height="18" transform="rotate(45)" />
                    <circle r="3" fill={theme.gold} stroke="none" />
                  </g>
                </svg>
                <p
                  style={{
                    fontFamily: "'Cinzel', serif",
                    fontSize: '12px',
                    letterSpacing: '0.26em',
                    color: theme.goldSoft,
                    marginBottom: '12px',
                  }}
                >
                  {String(i + 1).padStart(2, '0')}
                </p>
                <h3
                  style={{
                    fontFamily: "'Cinzel', serif",
                    fontSize: 'clamp(19px, 1.9vw, 24px)',
                    fontWeight: 500,
                    color: theme.cream,
                    margin: '0 0 14px',
                  }}
                >
                  {t(s.t)}
                </h3>
                <p
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: '15px',
                    lineHeight: 1.75,
                    color: 'rgba(242,231,208,0.72)',
                    margin: 0,
                  }}
                >
                  {t(s.d)}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
