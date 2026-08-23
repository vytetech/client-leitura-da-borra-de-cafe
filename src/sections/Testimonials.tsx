import { useLang, type TKey } from '../i18n'
import { Eyebrow, Reveal, theme } from '../components/atoms'

const items: { text: TKey; name: TKey }[] = [
  { text: 'testi.t1', name: 'testi.n1' },
  { text: 'testi.t2', name: 'testi.n2' },
  { text: 'testi.t3', name: 'testi.n3' },
]

export default function Testimonials() {
  const { t } = useLang()

  return (
    <section
      id="depoimentos"
      style={{
        background: 'transparent',
        padding: 'clamp(90px, 11vw, 150px) clamp(20px, 4vw, 60px)',
      }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <Reveal><Eyebrow>{t('testi.eyebrow')}</Eyebrow></Reveal>
        <Reveal delay={80}>
          <h2
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: 'clamp(32px, 4.6vw, 56px)',
              fontWeight: 500,
              color: theme.cream,
              margin: '0 0 64px',
            }}
          >
            {t('testi.title')}
          </h2>
        </Reveal>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))',
            gap: 'clamp(20px, 2.5vw, 34px)',
          }}
        >
          {items.map((it, i) => (
            <Reveal key={it.text} delay={i * 120}>
              <figure
                style={{
                  margin: 0,
                  height: '100%',
                  boxSizing: 'border-box',
                  border: '1px solid rgba(201,169,97,0.25)',
                  backgroundColor: 'rgba(12,7,5,0.72)',
                  padding: 'clamp(30px, 3vw, 42px)',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <span
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: '54px',
                    lineHeight: 0.6,
                    color: theme.gold,
                    marginBottom: '24px',
                  }}
                  aria-hidden="true"
                >
                  “
                </span>
                <blockquote
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontStyle: 'italic',
                    fontSize: 'clamp(15px, 1.4vw, 17px)',
                    lineHeight: 1.8,
                    color: 'rgba(242,231,208,0.88)',
                    margin: '0 0 28px',
                    flex: 1,
                  }}
                >
                  {t(it.text)}
                </blockquote>
                <figcaption
                  style={{
                    fontFamily: "'Cinzel', serif",
                    fontSize: '11px',
                    letterSpacing: '0.22em',
                    textTransform: 'uppercase',
                    color: theme.goldSoft,
                  }}
                >
                  {t(it.name)}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
