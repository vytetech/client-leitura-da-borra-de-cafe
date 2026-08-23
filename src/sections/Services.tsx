import { useState } from 'react'
import { useLang, type TKey } from '../i18n'
import { Eyebrow, Reveal, theme } from '../components/atoms'

const PRESS_WHATSAPP_URL = 'https://wa.me/5511986981444'

const services: { t: TKey; d: TKey; p: TKey; press?: boolean }[] = [
  { t: 'services.s1t', d: 'services.s1d', p: 'services.s1p' },
  { t: 'services.s2t', d: 'services.s2d', p: 'services.s2p' },
  { t: 'services.s3t', d: 'services.s3d', p: 'services.s3p', press: true },
]

export default function Services() {
  const { t } = useLang()

  return (
    <section
      id="servicos"
      style={{
        position: 'relative',
        background: 'transparent',
        padding: 'clamp(90px, 11vw, 150px) clamp(20px, 4vw, 60px)',
      }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <Reveal><Eyebrow>{t('services.eyebrow')}</Eyebrow></Reveal>
        <Reveal delay={80}>
          <h2
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: 'clamp(32px, 4.6vw, 60px)',
              fontWeight: 500,
              color: theme.cream,
              margin: '0 0 64px',
            }}
          >
            {t('services.title')}
          </h2>
        </Reveal>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))',
            gap: 'clamp(20px, 2.5vw, 34px)',
          }}
        >
          {services.map((s, i) => (
            <Reveal key={s.t} delay={i * 120}>
              <ServiceCard
                title={t(s.t)}
                desc={t(s.d)}
                price={t(s.p)}
                cta={s.press ? t('services.ctaPress') : t('services.cta')}
                press={s.press}
              />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function ServiceCard({
  title,
  desc,
  price,
  cta,
  press,
}: {
  title: string
  desc: string
  price: string
  cta: string
  press?: boolean
}) {
  const [hover, setHover] = useState(false)

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: 'relative',
        height: '100%',
        boxSizing: 'border-box',
        backgroundColor: theme.bg,
        border: `1px solid ${hover ? theme.gold : 'rgba(201,169,97,0.3)'}`,
        padding: 'clamp(34px, 3.5vw, 48px)',
        display: 'flex',
        flexDirection: 'column',
        transition: 'border-color 0.35s ease, transform 0.35s ease, box-shadow 0.35s ease',
        transform: hover ? 'translateY(-8px)' : 'none',
        boxShadow: hover ? '0 24px 60px rgba(0,0,0,0.5), 0 0 40px rgba(123,94,167,0.12)' : 'none',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '2px',
          background: `linear-gradient(90deg, transparent, ${theme.gold}, transparent)`,
          opacity: hover ? 1 : 0.35,
          transition: 'opacity 0.35s ease',
        }}
      />
      <h3
        style={{
          fontFamily: "'Cinzel', serif",
          fontSize: 'clamp(21px, 2vw, 26px)',
          fontWeight: 500,
          color: theme.cream,
          margin: '0 0 18px',
        }}
      >
        {title}
      </h3>
      <p
        style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: '15.5px',
          lineHeight: 1.8,
          color: 'rgba(242,231,208,0.75)',
          margin: '0 0 30px',
          flex: 1,
        }}
      >
        {desc}
      </p>
      <p
        style={{
          fontFamily: "'Cinzel', serif",
          fontSize: 'clamp(19px, 1.9vw, 24px)',
          color: theme.gold,
          letterSpacing: '0.04em',
          margin: '0 0 26px',
        }}
      >
        {price}
      </p>
      {press ? (
        <a
          href={PRESS_WHATSAPP_URL}
          target="_blank"
          rel="noreferrer"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            fontFamily: "'Cinzel', serif",
            fontSize: '12px',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: hover ? '#0c0705' : '#25D366',
            backgroundColor: hover ? '#25D366' : 'transparent',
            border: '1px solid #25D366',
            padding: '14px 24px',
            cursor: 'pointer',
            textDecoration: 'none',
            transition: 'all 0.3s ease',
            alignSelf: 'flex-start',
          }}
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22c5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2zm0 18.03a8.1 8.1 0 0 1-4.13-1.13l-.3-.18-3.12.82.83-3.04-.2-.31a8.06 8.06 0 1 1 6.92 3.84zm4.43-6.05c-.24-.12-1.43-.71-1.65-.79-.22-.08-.38-.12-.54.12-.16.24-.62.79-.76.95-.14.16-.28.18-.52.06-.24-.12-1.03-.38-1.96-1.21-.72-.64-1.21-1.44-1.35-1.68-.14-.24-.02-.37.11-.49.11-.11.24-.28.37-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.78-.19-.47-.39-.4-.54-.41h-.46c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2s.86 2.32.98 2.48c.12.16 1.7 2.59 4.11 3.63.57.25 1.02.39 1.37.51.58.18 1.1.16 1.51.1.46-.07 1.43-.58 1.63-1.15.2-.56.2-1.04.14-1.15-.06-.1-.22-.16-.46-.28z"/>
          </svg>
          {cta}
        </a>
      ) : (
        <button
          onClick={() => document.getElementById('agendar')?.scrollIntoView({ behavior: 'smooth' })}
          style={{
            fontFamily: "'Cinzel', serif",
            fontSize: '12px',
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: hover ? '#0c0705' : theme.gold,
            backgroundColor: hover ? theme.gold : 'transparent',
            border: `1px solid ${theme.gold}`,
            padding: '14px 24px',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            alignSelf: 'flex-start',
          }}
        >
          {cta} →
        </button>
      )}
    </div>
  )
}
