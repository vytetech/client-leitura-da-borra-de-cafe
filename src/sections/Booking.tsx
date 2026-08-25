import { useState } from 'react'
import { useLang, type TKey } from '../i18n'
import { Eyebrow, Particles, Sparkles, Reveal, theme, WHATSAPP_URL } from '../components/atoms'
import { trpc } from '@/providers/trpc'

const serviceKeys: TKey[] = ['services.s1t', 'services.s2t', 'services.s3t']
const timeKeys: TKey[] = ['booking.morning', 'booking.afternoon', 'booking.evening']

export default function Booking() {
  const { t, lang } = useLang()
  const [form, setForm] = useState({
    name: '',
    whatsapp: '',
    email: '',
    service: 0,
    date: '',
    time: 0,
    coupon: '',
    notes: '',
  })
  const [error, setError] = useState(false)
  const [couponMessage, setCouponMessage] = useState<{ text: string; ok: boolean } | null>(null)
  const [hover, setHover] = useState(false)
  const validateCoupon = trpc.coupons.validate.useMutation()

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }))

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim() || !form.whatsapp.trim()) {
      setError(true)
      return
    }
    setError(false)
    setCouponMessage(null)

    let appliedCoupon = ''
    if (form.coupon.trim()) {
      try {
        const result = await validateCoupon.mutateAsync({ code: form.coupon.trim() })
        setCouponMessage({ text: result.message, ok: result.valid })
        if (!result.valid) return
        appliedCoupon = `${result.code} (${result.discountPercent}%)`
      } catch {
        setCouponMessage({ text: 'Não foi possível validar o cupom agora.', ok: false })
        return
      }
    }

    const L = {
      pt: { h: 'Novo pedido de leitura', n: 'Nome', w: 'WhatsApp', em: 'E-mail', s: 'Serviço', d: 'Data', tm: 'Horário', o: 'Observações' },
      es: { h: 'Nueva solicitud de lectura', n: 'Nombre', w: 'WhatsApp', em: 'Correo', s: 'Servicio', d: 'Fecha', tm: 'Hora', o: 'Observaciones' },
      en: { h: 'New reading request', n: 'Name', w: 'WhatsApp', em: 'Email', s: 'Service', d: 'Date', tm: 'Time', o: 'Notes' },
      ar: { h: 'طلب قراءة جديد', n: 'الاسم', w: 'واتساب', em: 'البريد', s: 'الخدمة', d: 'التاريخ', tm: 'الوقت', o: 'ملاحظات' },
    }[lang]

    const lines = [
      `☕ *${L.h} — Ahmad K. Taha*`,
      ``,
      `*${L.n}:* ${form.name}`,
      `*${L.w}:* ${form.whatsapp}`,
      form.email ? `*${L.em}:* ${form.email}` : '',
      `*${L.s}:* ${t(serviceKeys[form.service])}`,
      form.date ? `*${L.d}:* ${form.date}` : '',
      `*${L.tm}:* ${t(timeKeys[form.time])}`,
      appliedCoupon ? `*Cupom:* ${appliedCoupon}` : '',
      form.notes ? `*${L.o}:* ${form.notes}` : '',
    ].filter((l) => l !== '')

    window.open(`${WHATSAPP_URL}?text=${encodeURIComponent(lines.join('\n'))}`, '_blank')
  }

  return (
    <section
      id="agendar"
      style={{
        position: 'relative',
        background: 'transparent',
        padding: 'clamp(90px, 11vw, 150px) clamp(20px, 4vw, 60px)',
        overflow: 'hidden',
      }}
    >
      <Sparkles density={40} />
      <Particles density={30} />
      <div style={{ maxWidth: '760px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
        <Reveal><Eyebrow>{t('booking.eyebrow')}</Eyebrow></Reveal>
        <Reveal delay={80}>
          <h2
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: 'clamp(32px, 4.6vw, 56px)',
              fontWeight: 500,
              color: theme.cream,
              margin: '0 0 18px',
            }}
          >
            {t('booking.title')}
          </h2>
        </Reveal>
        <Reveal delay={140}>
          <p
            style={{
              fontFamily: "'Playfair Display', serif",
              fontStyle: 'italic',
              fontSize: 'clamp(15px, 1.5vw, 18px)',
              lineHeight: 1.7,
              color: theme.beige,
              margin: '0 0 50px',
            }}
          >
            {t('booking.sub')}
          </p>
        </Reveal>

        <Reveal delay={200}>
          <form
            onSubmit={submit}
            style={{
              border: '1px solid rgba(201,169,97,0.3)',
              backgroundColor: 'rgba(22,16,9,0.75)',
              backdropFilter: 'blur(4px)',
              padding: 'clamp(28px, 4vw, 52px)',
              display: 'flex',
              flexDirection: 'column',
              gap: '26px',
            }}
          >
            {error && (
              <p
                style={{
                  border: '1px solid rgba(220,120,100,0.5)',
                  color: '#e8a08e',
                  fontFamily: "'Playfair Display', serif",
                  fontSize: '14px',
                  padding: '12px 16px',
                  margin: 0,
                }}
              >
                {t('booking.error')}
              </p>
            )}

            <Field label={t('booking.name')} value={form.name} onChange={set('name')} placeholder={t('booking.namePh')} />
            <div className="booking-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '26px' }}>
              <Field label={t('booking.whatsapp')} value={form.whatsapp} onChange={set('whatsapp')} placeholder="+55 12 98805-1401" type="tel" />
              <Field label={t('booking.email')} value={form.email} onChange={set('email')} placeholder="voce@email.com" type="email" />
            </div>

            <SelectField
              label={t('booking.service')}
              value={form.service}
              onChange={(v) => setForm((f) => ({ ...f, service: v }))}
              options={serviceKeys.map((k) => t(k))}
            />

            <label style={{ display: 'block' }}>
              <span style={labelStyle}>Cupom</span>
              <input
                value={form.coupon}
                onChange={(e) => {
                  setForm((f) => ({ ...f, coupon: e.target.value.toUpperCase() }))
                  setCouponMessage(null)
                }}
                placeholder="BORRA10"
                style={inputStyle}
                onFocus={(e) => (e.currentTarget.style.borderBottomColor = theme.gold)}
                onBlur={(e) => (e.currentTarget.style.borderBottomColor = 'rgba(201,169,97,0.4)')}
              />
              {couponMessage && (
                <span style={{
                  display: 'block',
                  color: couponMessage.ok ? '#9fe3b4' : '#e8a08e',
                  fontFamily: "'Playfair Display', serif",
                  fontSize: 13,
                  marginTop: 8,
                }}>
                  {couponMessage.text}
                </span>
              )}
            </label>

            <div className="booking-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '26px' }}>
              <Field label={t('booking.date')} value={form.date} onChange={set('date')} type="date" />
              <SelectField
                label={t('booking.time')}
                value={form.time}
                onChange={(v) => setForm((f) => ({ ...f, time: v }))}
                options={timeKeys.map((k) => t(k))}
              />
            </div>

            <label style={{ display: 'block' }}>
              <span style={labelStyle}>{t('booking.notes')}</span>
              <textarea
                rows={3}
                value={form.notes}
                onChange={set('notes')}
                placeholder={t('booking.notesPh')}
                style={{ ...inputStyle, resize: 'vertical' }}
                onFocus={(e) => (e.currentTarget.style.borderBottomColor = theme.gold)}
                onBlur={(e) => (e.currentTarget.style.borderBottomColor = 'rgba(201,169,97,0.4)')}
              />
            </label>

            <button
              type="submit"
              disabled={validateCoupon.isPending}
              onMouseEnter={() => setHover(true)}
              onMouseLeave={() => setHover(false)}
              style={{
                marginTop: '8px',
                fontFamily: "'Cinzel', serif",
                fontSize: '13px',
                letterSpacing: '0.24em',
                textTransform: 'uppercase',
                color: hover ? '#0c0705' : theme.gold,
                backgroundColor: hover ? theme.gold : 'transparent',
                border: `1px solid ${theme.gold}`,
                padding: '18px 24px',
                cursor: validateCoupon.isPending ? 'wait' : 'pointer',
                opacity: validateCoupon.isPending ? 0.65 : 1,
                transition: 'all 0.3s ease',
                boxShadow: hover ? '0 0 36px rgba(212,175,55,0.3)' : 'none',
              }}
            >
              {validateCoupon.isPending ? 'Validando…' : t('booking.submit')} ✆
            </button>
          </form>
        </Reveal>
      </div>

      <style>{`
        @media (max-width: 560px) { .booking-row { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  )
}

const labelStyle: React.CSSProperties = {
  fontFamily: "'Cinzel', serif",
  fontSize: '11px',
  letterSpacing: '0.22em',
  textTransform: 'uppercase',
  color: theme.goldSoft,
  marginBottom: '6px',
  display: 'block',
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  boxSizing: 'border-box',
  padding: '12px 0',
  fontSize: '16px',
  fontFamily: "'Playfair Display', serif",
  backgroundColor: 'transparent',
  color: theme.cream,
  border: 'none',
  borderBottom: '1px solid rgba(201,169,97,0.4)',
  outline: 'none',
  colorScheme: 'dark',
  transition: 'border-color 0.25s ease',
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
}: {
  label: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  type?: string
}) {
  return (
    <label style={{ display: 'block' }}>
      <span style={labelStyle}>{label}</span>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={inputStyle}
        onFocus={(e) => (e.currentTarget.style.borderBottomColor = theme.gold)}
        onBlur={(e) => (e.currentTarget.style.borderBottomColor = 'rgba(201,169,97,0.4)')}
      />
    </label>
  )
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string
  value: number
  onChange: (v: number) => void
  options: string[]
}) {
  return (
    <label style={{ display: 'block' }}>
      <span style={labelStyle}>{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ ...inputStyle, appearance: 'none', cursor: 'pointer' }}
        onFocus={(e) => (e.currentTarget.style.borderBottomColor = theme.gold)}
        onBlur={(e) => (e.currentTarget.style.borderBottomColor = 'rgba(201,169,97,0.4)')}
      >
        {options.map((o, i) => (
          <option key={o} value={i} style={{ backgroundColor: theme.bgSoft, color: theme.cream }}>
            {o}
          </option>
        ))}
      </select>
    </label>
  )
}
