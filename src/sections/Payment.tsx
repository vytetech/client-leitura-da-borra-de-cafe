import { useState } from 'react'
import { useLang, type TKey } from '../i18n'
import { Eyebrow, Reveal, theme, WHATSAPP_URL } from '../components/atoms'

const methods: { t: TKey; d: TKey; icon: React.ReactNode }[] = [
  {
    t: 'pay.pix.t',
    d: 'pay.pix.d',
    icon: (
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 2.5 21.5 12 12 21.5 2.5 12Z" />
        <path d="M8.5 8.5c1.4 1.4 1.4 5.6 0 7M15.5 8.5c-1.4 1.4-1.4 5.6 0 7M8.2 12h7.6" />
      </svg>
    ),
  },
  {
    t: 'pay.paypal.t',
    d: 'pay.paypal.d',
    icon: (
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M6.5 20.5 9 3.5h6.2c2.6 0 4.3 1.8 3.9 4.4-.5 3.1-2.9 4.9-6 4.9h-2.3l-.9 7.7Z" />
        <path d="M10.8 12.8h2.3c3.1 0 5.5-1.8 6-4.9" />
      </svg>
    ),
  },
  {
    t: 'pay.card.t',
    d: 'pay.card.d',
    icon: (
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="2.5" y="5" width="19" height="14" rx="2.5" />
        <path d="M2.5 9.5h19M6 15.5h5" />
      </svg>
    ),
  },
]

export default function Payment() {
  const { t } = useLang()

  const pay = (label: string) => {
    const msg = `${t('pay.msg')} *${label}*. ☕`
    window.open(`${WHATSAPP_URL}?text=${encodeURIComponent(msg)}`, '_blank')
  }

  return (
    <section
      id="pagamento"
      style={{
        position: 'relative',
        background: 'transparent',
        padding: 'clamp(90px, 11vw, 150px) clamp(20px, 4vw, 60px)',
      }}
    >
      <div style={{ maxWidth: '1180px', margin: '0 auto' }}>
        <Reveal><Eyebrow>{t('pay.eyebrow')}</Eyebrow></Reveal>
        <Reveal delay={80}>
          <h2
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: 'clamp(30px, 4.2vw, 54px)',
              fontWeight: 500,
              color: theme.cream,
              margin: '0 0 18px',
              lineHeight: 1.2,
            }}
          >
            {t('pay.title')}
          </h2>
        </Reveal>
        <Reveal delay={140}>
          <p
            style={{
              fontFamily: "'Playfair Display', serif",
              fontStyle: 'italic',
              fontSize: 'clamp(15px, 1.5vw, 18px)',
              color: theme.beige,
              margin: '0 0 58px',
              maxWidth: '640px',
            }}
          >
            {t('pay.sub')}
          </p>
        </Reveal>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
            gap: 'clamp(20px, 2.5vw, 32px)',
          }}
        >
          {methods.map((m, i) => (
            <Reveal key={m.t} delay={i * 110}>
              <PaymentCard
                title={t(m.t)}
                desc={t(m.d)}
                icon={m.icon}
                cta={`${t('pay.cta')} ${t(m.t)}`}
                onPay={() => pay(t(m.t))}
              />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function PaymentCard({
  title,
  desc,
  icon,
  cta,
  onPay,
}: {
  title: string
  desc: string
  icon: React.ReactNode
  cta: string
  onPay: () => void
}) {
  const [hover, setHover] = useState(false)

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        height: '100%',
        boxSizing: 'border-box',
        backgroundColor: theme.bgSoft,
        border: `1px solid ${hover ? theme.gold : 'rgba(201,169,97,0.3)'}`,
        padding: 'clamp(30px, 3vw, 42px)',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.35s ease',
        transform: hover ? 'translateY(-6px)' : 'none',
        boxShadow: hover ? '0 22px 55px rgba(0,0,0,0.5), 0 0 34px rgba(212,175,55,0.1)' : 'none',
      }}
    >
      <div
        style={{
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          border: `1px solid ${theme.goldSoft}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: theme.gold,
          marginBottom: '24px',
        }}
      >
        {icon}
      </div>
      <h3
        style={{
          fontFamily: "'Cinzel', serif",
          fontSize: 'clamp(19px, 1.9vw, 23px)',
          fontWeight: 500,
          color: theme.cream,
          margin: '0 0 14px',
        }}
      >
        {title}
      </h3>
      <p
        style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: '15px',
          lineHeight: 1.75,
          color: 'rgba(242,231,208,0.72)',
          margin: '0 0 28px',
          flex: 1,
        }}
      >
        {desc}
      </p>
      <button
        onClick={onPay}
        style={{
          fontFamily: "'Cinzel', serif",
          fontSize: '12px',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: hover ? '#0c0705' : theme.gold,
          backgroundColor: hover ? theme.gold : 'transparent',
          border: `1px solid ${theme.gold}`,
          padding: '15px 22px',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          width: '100%',
        }}
      >
        {cta}
      </button>
    </div>
  )
}
