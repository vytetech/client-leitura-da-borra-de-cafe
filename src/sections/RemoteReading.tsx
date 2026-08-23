import { useLang } from '../i18n'
import { Eyebrow, Ornament, Reveal, theme } from '../components/atoms'

export default function RemoteReading() {
  const { t } = useLang()

  return (
    <section
      style={{
        position: 'relative',
        background: 'transparent',
        padding: 'clamp(80px, 9vw, 130px) clamp(20px, 4vw, 60px)',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          maxWidth: '980px',
          margin: '0 auto',
          border: `1px solid rgba(201,169,97,0.35)`,
          padding: 'clamp(36px, 5vw, 70px)',
          position: 'relative',
          background: 'radial-gradient(ellipse 90% 90% at 50% 0%, rgba(59,74,140,0.14) 0%, transparent 65%), rgba(22,16,9,0.72)',
        }}
      >
        {/* corner ornaments */}
        {[
          { top: -1, left: -1, rotate: 0 },
          { top: -1, right: -1, rotate: 90 },
          { bottom: -1, right: -1, rotate: 180 },
          { bottom: -1, left: -1, rotate: 270 },
        ].map((c, i) => (
          <svg
            key={i}
            width="34"
            height="34"
            viewBox="0 0 34 34"
            style={{
              position: 'absolute',
              top: c.top,
              left: c.left,
              right: c.right,
              bottom: c.bottom,
              transform: `rotate(${c.rotate}deg)`,
            }}
            aria-hidden="true"
          >
            <path d="M1 33 V8 Q1 1 8 1 H33" fill="none" stroke={theme.gold} strokeWidth="1.4" />
            <circle cx="8" cy="8" r="2.2" fill={theme.gold} />
          </svg>
        ))}

        <Reveal><Eyebrow>{t('remote.eyebrow')}</Eyebrow></Reveal>
        <Reveal delay={80}>
          <h2
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: 'clamp(26px, 3.4vw, 42px)',
              fontWeight: 500,
              color: theme.cream,
              margin: '0 0 26px',
              lineHeight: 1.25,
            }}
          >
            {t('remote.title')}
          </h2>
        </Reveal>
        <Reveal delay={140}>
          <p
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(15px, 1.5vw, 18px)',
              lineHeight: 1.85,
              color: 'rgba(242,231,208,0.85)',
              marginBottom: '34px',
            }}
          >
            {t('remote.intro')}
          </p>
        </Reveal>

        <Reveal delay={200}>
          <p
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: '12px',
              letterSpacing: '0.24em',
              textTransform: 'uppercase',
              color: theme.goldSoft,
              marginBottom: '18px',
            }}
          >
            {t('remote.need')}
          </p>
          <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 34px', display: 'grid', gap: '12px' }}>
            {[t('remote.i1'), t('remote.i2'), t('remote.i3')].map((item) => (
              <li
                key={item}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                  fontFamily: "'Playfair Display', serif",
                  fontSize: '16px',
                  lineHeight: 1.6,
                  color: theme.cream,
                }}
              >
                <span style={{ color: theme.gold, fontSize: '13px', paddingTop: '4px' }}>✦</span>
                {item}
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={260}>
          <p
            style={{
              fontFamily: "'Playfair Display', serif",
              fontStyle: 'italic',
              fontSize: 'clamp(15px, 1.4vw, 17px)',
              lineHeight: 1.85,
              color: theme.beige,
              borderTop: '1px solid rgba(201,169,97,0.25)',
              paddingTop: '28px',
              margin: 0,
            }}
          >
            {t('remote.ritual')}
          </p>
        </Reveal>

        <Reveal delay={320}>
          <div
            style={{
              marginTop: '30px',
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              border: `1px solid ${theme.gold}`,
              backgroundColor: 'rgba(212,175,55,0.08)',
              padding: '18px 22px',
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={theme.gold} strokeWidth="1.6" style={{ flexShrink: 0 }}>
              <circle cx="12" cy="12" r="9.5" />
              <line x1="12" y1="7.5" x2="12" y2="13" strokeLinecap="round" />
              <circle cx="12" cy="16.5" r="0.6" fill={theme.gold} />
            </svg>
            <p
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 'clamp(14px, 1.4vw, 16px)',
                lineHeight: 1.7,
                color: theme.gold,
                margin: 0,
                fontWeight: 600,
              }}
            >
              {t('remote.note')}
            </p>
          </div>
        </Reveal>

        <div style={{ marginTop: '44px' }}>
          <Ornament width={240} />
        </div>
      </div>
    </section>
  )
}
