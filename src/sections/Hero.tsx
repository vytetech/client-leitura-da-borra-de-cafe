import { useLang } from '../i18n'
import { Particles, Sparkles, Ornament, theme, WHATSAPP_URL } from '../components/atoms'
import { useState } from 'react'

export default function Hero() {
  const { t, overrides } = useLang()
  const [h1, setH1] = useState(false)
  const [h2, setH2] = useState(false)

  return (
    <section
      style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        background: 'transparent',
      }}
    >
      <Sparkles density={90} />
      <Particles density={60} />

      <div
        className="hero-inner"
        style={{
          position: 'relative',
          zIndex: 2,
          textAlign: 'center',
          padding: '140px 24px 100px',
          maxWidth: '900px',
        }}
      >
        <img
          src={overrides['img.heroLogo'] || '/images/ahmad/logo.png'}
          alt="Xícara cósmica de borra de café"
          style={{
            width: 'clamp(180px, 26vw, 300px)',
            height: 'auto',
            marginBottom: '8px',
            filter: 'drop-shadow(0 0 44px rgba(123,94,167,0.45)) drop-shadow(0 0 18px rgba(212,175,55,0.3))',
            animation: 'heroFloat 7s ease-in-out infinite',
          }}
        />

        <h1
          style={{
            fontFamily: "'Cinzel', serif",
            fontSize: 'clamp(40px, 7vw, 84px)',
            fontWeight: 600,
            letterSpacing: '0.06em',
            color: theme.cream,
            margin: '12px 0 6px',
            lineHeight: 1.08,
            textShadow: '0 4px 40px rgba(0,0,0,0.6)',
          }}
        >
          Ahmad K. Taha
        </h1>

        <p
          style={{
            fontFamily: "'Cinzel', serif",
            fontSize: 'clamp(12px, 1.5vw, 16px)',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: theme.goldSoft,
            margin: '10px 0 4px',
          }}
        >
          {t('hero.subtitle')}
        </p>

        <p
          style={{
            fontFamily: "'Playfair Display', serif",
            fontStyle: 'italic',
            fontSize: 'clamp(14px, 1.6vw, 18px)',
            color: theme.beige,
            margin: '8px 0 26px',
          }}
        >
          {t('hero.since')} · {t('hero.location')}
        </p>

        <p
          style={{
            fontFamily: "'Playfair Display', serif",
            fontStyle: 'italic',
            fontSize: 'clamp(16px, 1.9vw, 21px)',
            color: theme.goldSoft,
            margin: '10px 0 38px',
            letterSpacing: '0.02em',
          }}
        >
          {t('footer.tagline')}
        </p>

        <Ornament />

        <div
          className="hero-btns"
          style={{
            display: 'flex',
            gap: '18px',
            justifyContent: 'center',
            alignItems: 'center',
            flexWrap: 'wrap',
            marginTop: '40px',
          }}
        >
          <button
            onClick={() => document.getElementById('agendar')?.scrollIntoView({ behavior: 'smooth' })}
            onMouseEnter={() => setH1(true)}
            onMouseLeave={() => setH1(false)}
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: '13px',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: h1 ? '#0c0705' : theme.gold,
              backgroundColor: h1 ? theme.gold : 'transparent',
              border: `1px solid ${theme.gold}`,
              padding: '17px 40px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: h1 ? '0 0 32px rgba(212,175,55,0.35)' : 'none',
            }}
          >
            {t('hero.ctaBook')}
          </button>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noreferrer"
            onMouseEnter={() => setH2(true)}
            onMouseLeave={() => setH2(false)}
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: '13px',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              color: h2 ? theme.cream : 'rgba(242,231,208,0.85)',
              border: '1px solid rgba(242,231,208,0.4)',
              backgroundColor: h2 ? 'rgba(242,231,208,0.08)' : 'transparent',
              padding: '17px 40px',
              transition: 'all 0.3s ease',
            }}
          >
            {t('hero.ctaWhats')}
          </a>
        </div>
      </div>

      <style>{`
        @keyframes heroFloat { 0%,100%{ transform: translateY(0) } 50%{ transform: translateY(-14px) } }
        @media (max-width: 768px) {
          .hero-inner { padding: 120px 20px 120px !important; }
          .hero-btns a, .hero-btns button { width: 100%; max-width: 340px; box-sizing: border-box; text-align: center; }
        }
      `}</style>
    </section>
  )
}
