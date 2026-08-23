import { useState } from 'react'
import { useLang } from '../i18n'
import type { TKey } from '../i18n'
import { Ornament, theme, VYTETECH_URL, WHATSAPP_URL } from '../components/atoms'

const RULE_KEYS: TKey[] = ['rules.r1', 'rules.r2', 'rules.r3', 'rules.r4', 'rules.r5', 'rules.r6', 'rules.r7']

export default function Footer() {
  const { t, overrides } = useLang()
  const [rulesOpen, setRulesOpen] = useState(false)

  return (
    <footer
      style={{
        background: 'linear-gradient(180deg, rgba(22,16,9,0.6) 0%, rgba(7,4,2,0.85) 100%)',
        borderTop: '1px solid rgba(201,169,97,0.25)',
        padding: 'clamp(60px, 8vw, 100px) clamp(20px, 4vw, 60px) 40px',
        textAlign: 'center',
      }}
    >
      <img
        src={overrides['img.logo'] || '/images/ahmad/logo.png'}
        alt="Logo Ahmad K. Taha"
        style={{ width: 'clamp(90px, 10vw, 130px)', height: 'auto', marginBottom: '20px', opacity: 0.95 }}
      />
      <p
        style={{
          fontFamily: "'Cinzel', serif",
          fontSize: 'clamp(20px, 2.6vw, 30px)',
          letterSpacing: '0.14em',
          color: theme.cream,
          margin: '0 0 10px',
        }}
      >
        Ahmad K. Taha
      </p>
      <p
        style={{
          fontFamily: "'Playfair Display', serif",
          fontStyle: 'italic',
          fontSize: '16px',
          color: theme.beige,
          margin: '0 0 22px',
        }}
      >
        {t('footer.tagline')}
      </p>
      <div style={{ margin: '26px 0' }}>
        <Ornament width={240} />
      </div>
      <p
        style={{
          fontFamily: "'Cinzel', serif",
          fontSize: '12px',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: 'rgba(242,231,208,0.7)',
          margin: '0 0 8px',
        }}
      >
        {t('footer.location')}
      </p>
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noreferrer"
        style={{
          fontFamily: "'Cinzel', serif",
          fontSize: '13px',
          letterSpacing: '0.14em',
          color: theme.gold,
          textDecoration: 'none',
        }}
      >
        WhatsApp · +55 12 98805-1401
      </a>
      <div style={{ marginTop: '18px', display: 'flex', justifyContent: 'center', gap: '22px' }}>
        <a
          href="https://instagram.com/leituradecafe"
          target="_blank"
          rel="noreferrer"
          aria-label="Instagram"
          style={{
            color: theme.goldSoft,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            textDecoration: 'none',
            transition: 'color 0.25s ease',
          }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
            <rect x="2.5" y="2.5" width="19" height="19" rx="5" />
            <circle cx="12" cy="12" r="4.4" />
            <circle cx="17.6" cy="6.4" r="1.1" fill="currentColor" stroke="none" />
          </svg>
          <span
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: '12px',
              letterSpacing: '0.14em',
              color: theme.gold,
            }}
          >
            @leituradecafe
          </span>
        </a>
      </div>
      {/* Important information — House rules link */}
      <button
        onClick={() => setRulesOpen(true)}
        style={{
          marginTop: '30px',
          background: 'none',
          border: '1px solid rgba(212,175,55,0.4)',
          borderRadius: '999px',
          padding: '10px 26px',
          cursor: 'pointer',
          fontFamily: "'Cinzel', serif",
          fontSize: '11px',
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: theme.gold,
          transition: 'background-color 0.25s ease, border-color 0.25s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(212,175,55,0.12)'
          e.currentTarget.style.borderColor = theme.gold
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent'
          e.currentTarget.style.borderColor = 'rgba(212,175,55,0.4)'
        }}
      >
        {t('rules.link')}
      </button>
      <p
        style={{
          fontFamily: "'Cinzel', serif",
          fontSize: '10px',
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: 'rgba(201,180,138,0.45)',
          marginTop: '34px',
        }}
      >
        © {new Date().getFullYear()} Ahmad K. Taha · {t('footer.rights')} · {t('footer.developedBy')}{' '}
        <a
          href={VYTETECH_URL}
          target="_blank"
          rel="noreferrer"
          style={{
            color: theme.gold,
            fontWeight: 700,
            textDecoration: 'none',
            letterSpacing: '0.14em',
          }}
        >
          VyteTech
        </a>
      </p>

      {/* House rules modal */}
      {rulesOpen && (
        <div
          onClick={() => setRulesOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            backgroundColor: 'rgba(4,2,1,0.82)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            dir={undefined}
            style={{
              maxWidth: '640px',
              width: '100%',
              maxHeight: '82vh',
              overflowY: 'auto',
              background: 'linear-gradient(180deg, rgba(26,18,10,0.98) 0%, rgba(14,9,5,0.98) 100%)',
              border: `1px solid rgba(212,175,55,0.5)`,
              padding: 'clamp(28px, 4vw, 46px)',
              textAlign: 'start',
              position: 'relative',
              boxShadow: '0 30px 80px rgba(0,0,0,0.7)',
            }}
          >
            <button
              onClick={() => setRulesOpen(false)}
              aria-label="Close"
              style={{
                position: 'absolute',
                top: '14px',
                insetInlineEnd: '14px',
                background: 'none',
                border: 'none',
                color: theme.goldSoft,
                fontSize: '22px',
                cursor: 'pointer',
                lineHeight: 1,
                padding: '6px 10px',
              }}
            >
              ×
            </button>
            <p
              style={{
                fontFamily: "'Cinzel', serif",
                fontSize: '11px',
                letterSpacing: '0.28em',
                textTransform: 'uppercase',
                color: theme.gold,
                margin: '0 0 6px',
              }}
            >
              {t('rules.subtitle')}
            </p>
            <h3
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 'clamp(24px, 3vw, 32px)',
                color: theme.cream,
                margin: '0 0 22px',
              }}
            >
              {t('rules.title')}
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {RULE_KEYS.map((k, i) => (
                <div key={k} style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                  <span
                    style={{
                      fontFamily: "'Cinzel', serif",
                      fontSize: '13px',
                      color: theme.gold,
                      border: '1px solid rgba(212,175,55,0.45)',
                      borderRadius: '50%',
                      minWidth: '30px',
                      height: '30px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      marginTop: '2px',
                    }}
                  >
                    {i + 1}
                  </span>
                  <p
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: '15.5px',
                      lineHeight: 1.75,
                      color: theme.beige,
                      margin: 0,
                    }}
                  >
                    {t(k)}
                  </p>
                </div>
              ))}
            </div>
            <div style={{ textAlign: 'center', marginTop: '30px' }}>
              <button
                onClick={() => setRulesOpen(false)}
                style={{
                  background: `linear-gradient(135deg, ${theme.gold} 0%, #b8923f 100%)`,
                  border: 'none',
                  padding: '12px 38px',
                  fontFamily: "'Cinzel', serif",
                  fontSize: '12px',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: '#120b06',
                  cursor: 'pointer',
                  fontWeight: 700,
                }}
              >
                {t('rules.close')}
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  )
}
