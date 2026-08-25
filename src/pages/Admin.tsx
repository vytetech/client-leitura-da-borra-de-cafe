import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import { trpc } from '@/providers/trpc'
import { useAuth } from '@/hooks/useAuth'
import { dict, ALL_KEYS, type Lang, type TKey } from '@/i18n'
import { theme } from '@/components/atoms'

function readSession(): { u: string; p: string } | null {
  try {
    const raw = sessionStorage.getItem('adminCreds')
    if (!raw) return null
    const o = JSON.parse(raw)
    if (o && o.u && o.p) return o
  } catch { /* ignore */ }
  return null
}

const LANGS: Lang[] = ['pt', 'ar', 'es', 'en']

const IMAGE_FIELDS: { key: string; label: string; current: string }[] = [
  { key: 'img.logo', label: 'Logo (menu e rodapé)', current: '/images/ahmad/logo.png' },
  { key: 'img.heroLogo', label: 'Logo grande do Hero', current: '/images/ahmad/logo.png' },
  { key: 'img.about', label: 'Foto da seção Sobre', current: '/images/ahmad/about.png' },
  ...Array.from({ length: 9 }, (_, i) => ({
    key: `gallery.photo.${i + 1}`,
    label: `Galeria da Borra — foto ${i + 1}`,
    current: `/images/ahmad/g${i + 1}.jpg`,
  })),
  ...Array.from({ length: 6 }, (_, i) => ({
    key: `events.photo.${i + 1}`,
    label: `Eventos — foto ${i + 1}`,
    current: `/images/ahmad/ev${i + 1}.jpg`,
  })),
]

const PRICE_FIELDS: { key: TKey; label: string }[] = [
  { key: 'services.s1p' as TKey, label: 'Leitura individual (presencial)' },
  { key: 'services.s2p' as TKey, label: 'Consulta online' },
  { key: 'services.s3p' as TKey, label: 'Eventos' },
]

const SECTIONS: { label: string; match: (k: string) => boolean }[] = [
  { label: '💳 Pagamento', match: (k) => k.startsWith('pay.') },
  { label: '🧭 Menu e Hero', match: (k) => k.startsWith('nav.') || k.startsWith('hero.') },
  { label: '👤 Sobre', match: (k) => k.startsWith('about.') },
  { label: '☕ Como Funciona', match: (k) => k.startsWith('how.') },
  { label: '🖼️ Galeria', match: (k) => k.startsWith('gallery.') && !k.startsWith('gallery.photo') },
  { label: '🎉 Eventos', match: (k) => k.startsWith('events.') },
  { label: '🔮 Serviços (textos)', match: (k) => (k.startsWith('services.') && !(k.startsWith('services.s') && k.endsWith('p'))) },
  { label: '📡 Leitura à Distância', match: (k) => k.startsWith('remote.') },
  { label: '📅 Agendamento', match: (k) => k.startsWith('booking.') },
  { label: '💬 Depoimentos', match: (k) => k.startsWith('testi.') },
  { label: '❓ FAQ', match: (k) => k.startsWith('faq.') },
  { label: '🦶 Rodapé', match: (k) => k.startsWith('footer.') },
  { label: '📜 Regras da casa', match: (k) => k.startsWith('rules.') },
]

/* ---- style (appearance) settings ---- */
const COLOR_FIELDS = [
  { key: 'style.color.gold', label: 'Dourado principal', def: '#d4af37' },
  { key: 'style.color.goldSoft', label: 'Dourado suave', def: '#c9a961' },
  { key: 'style.color.cream', label: 'Texto claro (creme)', def: '#f2e7d0' },
  { key: 'style.color.beige', label: 'Texto secundário (bege)', def: '#c9b48a' },
  { key: 'style.color.bg', label: 'Fundo escuro', def: '#0c0705' },
]

const FONT_FAMILIES = [
  { id: '', label: 'Padrão do site' },
  { id: "'Playfair Display', serif", label: 'Playfair Display (clássica)' },
  { id: "'Cinzel', serif", label: 'Cinzel (elegante)' },
  { id: "'Cormorant Garamond', serif", label: 'Cormorant (refinada)' },
  { id: "'EB Garamond', serif", label: 'EB Garamond (literária)' },
  { id: "'Tajawal', sans-serif", label: 'Tajawal (árabe moderna)' },
  { id: "'Amiri', serif", label: 'Amiri (árabe clássica)' },
  { id: 'Georgia, serif', label: 'Georgia' },
]

const FONT_SIZE_FIELDS = [
  { key: 'style.font.base', label: 'Tamanho base do texto', def: '16px', opts: ['14px', '15px', '16px', '17px', '18px'] },
  { key: 'style.font.h1', label: 'Escala dos títulos', def: '1', opts: ['0.9', '1', '1.1', '1.25'] },
]

const SITE_SECTIONS = [
  { id: 'hero', label: 'Hero (abertura)' },
  { id: 'sobre', label: 'Sobre Ahmad' },
  { id: 'como-funciona', label: 'Como funciona' },
  { id: 'galeria', label: 'Galeria da borra' },
  { id: 'servicos', label: 'Serviços' },
  { id: 'eventos', label: 'Eventos' },
  { id: 'pagamento', label: 'Pagamento' },
  { id: 'leitura-distancia', label: 'Leitura à distância' },
  { id: 'agendar', label: 'Agendamento' },
  { id: 'depoimentos', label: 'Depoimentos' },
  { id: 'faq', label: 'FAQ' },
]

const PREVIEW_STYLE_ID = 'admin-style-preview'
type AdminTab = 'textos' | 'precos' | 'cupons' | 'imagens' | 'estilo' | 'secoes' | 'usuarios'
type CouponForm = {
  code: string
  discountPercent: string
  startDate: string
  endDate: string
  isActive: boolean
}

const emptyCouponForm: CouponForm = {
  code: '',
  discountPercent: '',
  startDate: '',
  endDate: '',
  isActive: true,
}

const couponStatusLabel = {
  scheduled: 'Agendado',
  active: 'Ativo',
  expired: 'Expirado',
  inactive: 'Inativo',
} as const

export default function Admin() {
  const { user, isAuthenticated, isLoading, logout } = useAuth()
  const navigate = useNavigate()
  const [creds, setCreds] = useState<{ u: string; p: string } | null>(readSession)
  const adminLogin = trpc.auth.adminLogin.useMutation()
  const utils = trpc.useUtils()

  const doLogin = async (u: string, p: string) => {
    await adminLogin.mutateAsync({ username: u, password: p })
    sessionStorage.setItem('adminCreds', JSON.stringify({ u, p }))
    setCreds({ u, p })
    await utils.invalidate()
  }

  const handleLogout = async () => {
    sessionStorage.removeItem('adminCreds')
    await logout()
  }

  const isAdmin = !!user && user.role === 'admin'

  const contentQuery = trpc.content.list.useQuery(undefined, { enabled: isAdmin })
  const uploadsQuery = trpc.upload.list.useQuery(undefined, { enabled: isAdmin })
  const upsert = trpc.content.upsert.useMutation()
  const remove = trpc.content.remove.useMutation()
  const uploadMut = trpc.upload.upload.useMutation()
  const deleteFile = trpc.upload.deleteFile.useMutation()
  const adminUsersQuery = trpc.adminUsers.list.useQuery(undefined, { enabled: isAdmin })
  const createAdmin = trpc.adminUsers.create.useMutation()
  const removeAdmin = trpc.adminUsers.remove.useMutation()
  const updateAdmin = trpc.adminUsers.update.useMutation()
  const couponsQuery = trpc.coupons.list.useQuery(undefined, { enabled: isAdmin })
  const createCoupon = trpc.coupons.create.useMutation()
  const updateCoupon = trpc.coupons.update.useMutation()
  const removeCoupon = trpc.coupons.remove.useMutation()

  const [tab, setTab] = useState<AdminTab>('textos')
  const [lang, setLang] = useState<Lang>('pt')
  const [search, setSearch] = useState('')
  const [drafts, setDrafts] = useState<Record<string, string>>({})
  const [saved, setSaved] = useState<string | null>(null)
  const [uploading, setUploading] = useState<string | null>(null)
  const [notice, setNotice] = useState<{ text: string; ok: boolean } | null>(null)
  const [newAdminUser, setNewAdminUser] = useState('')
  const [newAdminPass, setNewAdminPass] = useState('')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editUser, setEditUser] = useState('')
  const [editPass, setEditPass] = useState('')
  const [couponForm, setCouponForm] = useState<CouponForm>(emptyCouponForm)
  const [editingCouponId, setEditingCouponId] = useState<number | null>(null)

  const overrides = useMemo(() => contentQuery.data ?? {}, [contentQuery.data])
  const fileInputs = useRef<Record<string, HTMLInputElement | null>>({})

  useEffect(() => {
    if (!isLoading && !isAuthenticated) navigate('/login')
  }, [isLoading, isAuthenticated, navigate])

  // cleanup preview style on unmount
  useEffect(() => () => { document.getElementById(PREVIEW_STYLE_ID)?.remove() }, [])

  if (isLoading) {
    return <Shell><p style={{ color: theme.beige }}>Carregando…</p></Shell>
  }
  if (!isAuthenticated) {
    if (creds) {
      return <AutoLogin creds={creds} onLogin={doLogin} onFail={() => { sessionStorage.removeItem('adminCreds'); setCreds(null) }} />
    }
    return <InlineLogin onLogin={doLogin} busy={adminLogin.isPending} />
  }
  if (!isAdmin) {
    return (
      <Shell>
        <h1 style={h1}>Acesso restrito</h1>
        <p style={{ color: theme.beige, fontFamily: "'Playfair Display', serif" }}>
          Esta área é exclusiva do administrador. Sua conta não possui permissão.
        </p>
        <a href="/" style={linkStyle}>← Voltar ao site</a>
      </Shell>
    )
  }

  const base = (k: TKey, l: Lang) => dict[k][l]
  const currentVal = (k: TKey, l: Lang) => drafts[`${k}.${l}`] ?? overrides[`${k}.${l}`] ?? ''
  const isDirty = (k: TKey, l: Lang) => drafts[`${k}.${l}`] !== undefined

  const flash = (text: string, ok = true) => {
    setNotice({ text, ok })
    setTimeout(() => setNotice(null), 3200)
  }

  const save = async (compoundKey: string, value: string) => {
    try {
      if (value === '') {
        await remove.mutateAsync({ key: compoundKey })
      } else {
        await upsert.mutateAsync({ key: compoundKey, value })
      }
      setDrafts((d) => {
        const n = { ...d }
        delete n[compoundKey]
        return n
      })
      await contentQuery.refetch()
      setSaved(compoundKey)
      setTimeout(() => setSaved(null), 2000)
      flash(value === '' ? 'Restaurado ao padrão ✓' : 'Salvo com sucesso ✓')
    } catch {
      flash('Erro ao salvar — tente novamente.', false)
    }
  }

  /* ---- image upload ---- */
  const handleUpload = async (targetKey: string, file: File) => {
    setUploading(targetKey)
    try {
      const base64 = await new Promise<string>((resolve, reject) => {
        const r = new FileReader()
        r.onload = () => resolve(String(r.result).split(',')[1] ?? '')
        r.onerror = reject
        r.readAsDataURL(file)
      })
      const res = await uploadMut.mutateAsync({ name: file.name, mime: file.type, base64 })
      setDrafts((d) => ({ ...d, [targetKey]: res.url }))
      await uploadsQuery.refetch()
      flash('Imagem enviada — clique em Salvar para aplicar ✓')
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Falha no envio'
      flash(msg.includes('Formato') || msg.includes('grande') ? msg : 'Falha no envio — verifique o arquivo.', false)
    } finally {
      setUploading(null)
    }
  }

  /* ---- live style preview ---- */
  const applyStylePreview = (next: Record<string, string>) => {
    const get = (k: string, def: string) => next[k] ?? def
    const gold = get('style.color.gold', '#d4af37')
    const goldSoft = get('style.color.goldSoft', '#c9a961')
    const cream = get('style.color.cream', '#f2e7d0')
    const beige = get('style.color.beige', '#c9b48a')
    const bg = get('style.color.bg', '#0c0705')
    const ff = get('style.font.family', '')
    const base = get('style.font.base', '16px')
    const h1scale = get('style.font.h1', '1')
    let el = document.getElementById(PREVIEW_STYLE_ID) as HTMLStyleElement | null
    if (!el) {
      el = document.createElement('style')
      el.id = PREVIEW_STYLE_ID
      document.head.appendChild(el)
    }
    el.textContent = `
      .preview-sw { display:inline-block; width:100%; }
      body { background-color: ${bg} !important; }
      ${ff ? `body, p, span, div, textarea, input, button { font-family: ${ff} !important; }` : ''}
      body { font-size: ${base}; }
      h1, h2 { transform-origin: left top; }
      .style-preview-bar span.c-gold { background:${gold}; } .style-preview-bar span.c-goldSoft { background:${goldSoft}; }
      .style-preview-bar span.c-cream { background:${cream}; } .style-preview-bar span.c-beige { background:${beige}; } .style-preview-bar span.c-bg { background:${bg}; }
      .font-scale-note::after { content: ' (×${h1scale})'; }
    `
  }

  const styleGet = (key: string, def: string) => drafts[key] ?? overrides[key] ?? def

  const onStyleChange = (key: string, value: string, def: string) => {
    const next = { ...COLOR_FIELDS.reduce((a, f) => ({ ...a, [f.key]: styleGet(f.key, f.def) }), {}),
      'style.font.family': styleGet('style.font.family', ''),
      'style.font.base': styleGet('style.font.base', '16px'),
      'style.font.h1': styleGet('style.font.h1', '1'),
      [key]: value }
    setDrafts((d) => ({ ...d, [key]: value }))
    applyStylePreview(next)
    void def
  }

  const saveStyle = async () => {
    const keys = [
      ...COLOR_FIELDS.map((f) => f.key),
      'style.font.family', 'style.font.base', 'style.font.h1',
    ]
    try {
      for (const k of keys) {
        const v = drafts[k]
        if (v === undefined) continue
        if (v === '' ) await remove.mutateAsync({ key: k })
        else await upsert.mutateAsync({ key: k, value: v })
      }
      setDrafts((d) => {
        const n = { ...d }
        keys.forEach((k) => delete n[k])
        return n
      })
      await contentQuery.refetch()
      flash('Estilo salvo — visível no site inteiro ✓')
    } catch {
      flash('Erro ao salvar o estilo.', false)
    }
  }

  const resetStyle = async () => {
    const keys = [...COLOR_FIELDS.map((f) => f.key), 'style.font.family', 'style.font.base', 'style.font.h1']
    for (const k of keys) {
      if (overrides[k]) await remove.mutateAsync({ key: k })
    }
    setDrafts((d) => { const n = { ...d }; keys.forEach((k) => delete n[k]); return n })
    await contentQuery.refetch()
    document.getElementById(PREVIEW_STYLE_ID)?.remove()
    flash('Estilo restaurado ao padrão ✓')
  }

  /* ---- section visibility ---- */
  const sectionKey = (id: string) => `section.${id}.visible`
  const isSectionVisible = (id: string) => (drafts[sectionKey(id)] ?? overrides[sectionKey(id)] ?? '1') !== '0'
  const toggleSection = async (id: string) => {
    const k = sectionKey(id)
    const next = isSectionVisible(id) ? '0' : '1'
    try {
      await upsert.mutateAsync({ key: k, value: next })
      await contentQuery.refetch()
      flash(next === '1' ? 'Seção exibida ✓' : 'Seção ocultada ✓')
    } catch {
      flash('Erro ao atualizar a seção.', false)
    }
  }

  /* ---- admin users ---- */
  const submitNewAdmin = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await createAdmin.mutateAsync({ username: newAdminUser.trim(), password: newAdminPass })
      await utils.adminUsers.list.invalidate()
      setNewAdminUser('')
      setNewAdminPass('')
      flash('Administrador criado ✓')
    } catch (err) {
      flash(err instanceof Error ? err.message : 'Erro ao criar administrador.', false)
    }
  }

  const startEditAdmin = (id: number, username: string) => {
    setEditingId(id)
    setEditUser(username)
    setEditPass('')
  }

  const cancelEditAdmin = () => {
    setEditingId(null)
    setEditUser('')
    setEditPass('')
  }

  const saveEditAdmin = async (id: number, currentUsername: string) => {
    const nextUser = editUser.trim()
    // Only send what actually changed; an unchanged name would be a pointless write.
    const payload: { id: number; username?: string; password?: string } = { id }
    if (nextUser && nextUser !== currentUsername) payload.username = nextUser
    if (editPass) payload.password = editPass

    if (payload.username === undefined && payload.password === undefined) {
      cancelEditAdmin()
      return
    }
    try {
      await updateAdmin.mutateAsync(payload)
      await utils.adminUsers.list.invalidate()
      cancelEditAdmin()
      flash('Administrador atualizado ✓')
    } catch (err) {
      flash(err instanceof Error ? err.message : 'Erro ao atualizar administrador.', false)
    }
  }

  const deleteAdmin = async (id: number, username: string) => {
    if (!window.confirm(`Remover o administrador "${username}"? Ele perde o acesso imediatamente.`)) return
    try {
      await removeAdmin.mutateAsync({ id })
      await utils.adminUsers.list.invalidate()
      flash('Administrador removido ✓')
    } catch (err) {
      flash(err instanceof Error ? err.message : 'Erro ao remover administrador.', false)
    }
  }

  const submitCoupon = async (e: React.FormEvent) => {
    e.preventDefault()
    const discountPercent = Number(couponForm.discountPercent)

    if (!couponForm.code.trim()) {
      flash('Código obrigatório.', false)
      return
    }
    if (!couponForm.discountPercent || Number.isNaN(discountPercent)) {
      flash('Percentual de desconto obrigatório.', false)
      return
    }
    if (!couponForm.startDate) {
      flash('Data inicial obrigatória.', false)
      return
    }
    if (!couponForm.endDate) {
      flash('Data final obrigatória.', false)
      return
    }
    if (couponForm.endDate < couponForm.startDate) {
      flash('A data de término deve ser igual ou posterior à data de início.', false)
      return
    }

    const payload = {
      code: couponForm.code,
      discountPercent,
      startDate: couponForm.startDate,
      endDate: couponForm.endDate,
      isActive: couponForm.isActive,
    }

    try {
      if (editingCouponId) {
        await updateCoupon.mutateAsync({ id: editingCouponId, ...payload })
        flash('Cupom atualizado ✓')
      } else {
        await createCoupon.mutateAsync(payload)
        flash('Cupom criado ✓')
      }
      setCouponForm(emptyCouponForm)
      setEditingCouponId(null)
      await utils.coupons.list.invalidate()
    } catch (err) {
      flash(err instanceof Error ? err.message : 'Erro ao salvar cupom.', false)
    }
  }

  const startEditCoupon = (coupon: NonNullable<typeof couponsQuery.data>[number]) => {
    setEditingCouponId(coupon.id)
    setCouponForm({
      code: coupon.code,
      discountPercent: String(coupon.discountPercent),
      startDate: coupon.startDate,
      endDate: coupon.endDate,
      isActive: coupon.isActive,
    })
  }

  const cancelCouponEdit = () => {
    setEditingCouponId(null)
    setCouponForm(emptyCouponForm)
  }

  const deleteCoupon = async (id: number, code: string) => {
    if (!window.confirm(`Remover o cupom "${code}"?`)) return
    try {
      await removeCoupon.mutateAsync({ id })
      await utils.coupons.list.invalidate()
      if (editingCouponId === id) cancelCouponEdit()
      flash('Cupom removido ✓')
    } catch (err) {
      flash(err instanceof Error ? err.message : 'Erro ao remover cupom.', false)
    }
  }

  const styleDirty = [...COLOR_FIELDS.map((f) => f.key), 'style.font.family', 'style.font.base', 'style.font.h1']
    .some((k) => drafts[k] !== undefined)

  const filteredSections = SECTIONS
    .map((sec) => ({
      ...sec,
      keys: ALL_KEYS.filter((k) => sec.match(k) && (
        search === '' ||
        k.toLowerCase().includes(search.toLowerCase()) ||
        base(k, lang).toLowerCase().includes(search.toLowerCase())
      )),
    }))
    .filter((sec) => sec.keys.length > 0)

  return (
    <Shell>
      {/* toast */}
      {notice && (
        <div style={{
          position: 'fixed', top: 18, left: '50%', transform: 'translateX(-50%)', zIndex: 999,
          backgroundColor: notice.ok ? 'rgba(30,58,38,0.97)' : 'rgba(70,26,26,0.97)',
          border: `1px solid ${notice.ok ? 'rgba(126,211,150,0.6)' : 'rgba(224,138,138,0.6)'}`,
          color: notice.ok ? '#b9e8c6' : '#f0c1c1',
          padding: '12px 26px', fontFamily: "'Cinzel', serif", fontSize: 13, letterSpacing: '0.08em',
          boxShadow: '0 14px 40px rgba(0,0,0,0.55)',
        }}>
          {notice.text}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <p style={{ fontFamily: "'Cinzel', serif", fontSize: 11, letterSpacing: '0.34em', color: theme.goldSoft, textTransform: 'uppercase', margin: '0 0 8px' }}>
            Painel do Administrador
          </p>
          <h1 style={h1}>Editar o site</h1>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <a href="/" style={linkStyle}>← Ver site</a>
          <button onClick={() => handleLogout()} style={ghostBtn}>Sair</button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, margin: '34px 0 26px', flexWrap: 'wrap' }}>
        {([['textos', '✏️ Textos'], ['precos', '💰 Preços das leituras'], ['cupons', '🏷️ Cupons'], ['imagens', '🖼️ Fotos e vídeos'], ['estilo', '🎨 Estilo'], ['secoes', '🧩 Seções'], ['usuarios', '👤 Usuários']] as const).map(([id, label]) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            style={{
              ...tabBtn,
              backgroundColor: tab === id ? theme.gold : 'transparent',
              color: tab === id ? theme.bg : theme.gold,
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 'textos' && (
        <>
          <div style={{ display: 'flex', gap: 12, marginBottom: 26, flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ display: 'flex', border: `1px solid ${theme.goldSoft}` }}>
              {LANGS.map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  style={{
                    background: lang === l ? theme.gold : 'transparent',
                    color: lang === l ? theme.bg : theme.cream,
                    border: 'none', cursor: 'pointer', padding: '8px 16px',
                    fontFamily: "'Cinzel', serif", fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase',
                  }}
                >
                  {l}
                </button>
              ))}
            </div>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar texto…"
              style={inputStyle}
            />
          </div>

          {filteredSections.map((sec) => (
            <div key={sec.label} style={{ marginBottom: 40 }}>
              <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: 19, color: theme.gold, margin: '0 0 16px', letterSpacing: '0.06em' }}>
                {sec.label}
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {sec.keys.map((k) => {
                  const ck = `${k}.${lang}`
                  const dirty = isDirty(k, lang)
                  const hasOverride = !!overrides[ck]
                  return (
                    <div key={k} style={{ border: `1px solid ${dirty ? theme.gold : 'rgba(201,169,97,0.22)'}`, padding: 18, backgroundColor: 'rgba(22,16,9,0.6)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, gap: 10, flexWrap: 'wrap' }}>
                        <code style={{ color: theme.beige, fontSize: 11, opacity: 0.7 }}>{k}</code>
                        {hasOverride && <span style={{ color: theme.gold, fontSize: 11, fontFamily: "'Cinzel', serif", letterSpacing: '0.14em' }}>● PERSONALIZADO</span>}
                      </div>
                      <textarea
                        value={currentVal(k, lang)}
                        placeholder={base(k, lang)}
                        rows={Math.min(6, Math.max(1, Math.ceil(base(k, lang).length / 70)))}
                        onChange={(e) => setDrafts((d) => ({ ...d, [ck]: e.target.value }))}
                        dir={lang === 'ar' ? 'rtl' : 'ltr'}
                        style={{ ...inputStyle, width: '100%', resize: 'vertical', lineHeight: 1.6 }}
                      />
                      {dirty && (
                        <div style={{ display: 'flex', gap: 10, marginTop: 10, flexWrap: 'wrap' }}>
                          <button onClick={() => save(ck, drafts[ck])} style={saveBtn} disabled={upsert.isPending || remove.isPending}>
                            {saved === ck ? '✓ Salvo!' : 'Salvar'}
                          </button>
                          <button onClick={() => setDrafts((d) => { const n = { ...d }; delete n[ck]; return n })} style={ghostBtn}>
                            Descartar
                          </button>
                          {hasOverride && (
                            <button onClick={() => save(ck, '')} style={{ ...ghostBtn, color: '#e08a8a', borderColor: 'rgba(224,138,138,0.4)' }}>
                              Restaurar padrão
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </>
      )}

      {tab === 'precos' && (
        <>
          <p style={{ color: theme.beige, fontFamily: "'Playfair Display', serif", fontStyle: 'italic', fontSize: 14, margin: '0 0 26px' }}>
            Edite os preços exibidos nos cartões de serviço — em cada idioma. Deixe vazio e salve para voltar ao padrão.
          </p>
          <div style={{ display: 'flex', border: `1px solid ${theme.goldSoft}`, marginBottom: 22, width: 'fit-content' }}>
            {LANGS.map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                style={{
                  background: lang === l ? theme.gold : 'transparent',
                  color: lang === l ? theme.bg : theme.cream,
                  border: 'none', cursor: 'pointer', padding: '8px 16px',
                  fontFamily: "'Cinzel', serif", fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase',
                }}
              >
                {l}
              </button>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))', gap: 16 }}>
            {PRICE_FIELDS.map((f) => {
              const ck = `${f.key}.${lang}`
              const dirty = drafts[ck] !== undefined
              const hasOverride = !!overrides[ck]
              return (
                <div key={f.key} style={{ border: `1px solid ${dirty ? theme.gold : 'rgba(201,169,97,0.22)'}`, padding: 18, backgroundColor: 'rgba(22,16,9,0.6)' }}>
                  <p style={{ fontFamily: "'Cinzel', serif", fontSize: 13, color: theme.cream, margin: '0 0 4px', letterSpacing: '0.06em' }}>{f.label}</p>
                  <p style={{ color: theme.beige, fontSize: 11, margin: '0 0 12px', opacity: 0.7 }}>
                    Padrão: {base(f.key, lang)}
                    {hasOverride && <span style={{ color: theme.gold }}> · ● personalizado</span>}
                  </p>
                  <input
                    value={drafts[ck] ?? overrides[ck] ?? ''}
                    placeholder={base(f.key, lang)}
                    onChange={(e) => setDrafts((d) => ({ ...d, [ck]: e.target.value }))}
                    style={{ ...inputStyle, width: '100%', fontSize: 16 }}
                    dir={lang === 'ar' ? 'rtl' : 'ltr'}
                  />
                  {dirty && (
                    <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                      <button onClick={() => save(ck, drafts[ck])} style={saveBtn}>
                        {saved === ck ? '✓ Salvo!' : 'Salvar'}
                      </button>
                      <button onClick={() => setDrafts((d) => { const n = { ...d }; delete n[ck]; return n })} style={ghostBtn}>
                        Descartar
                      </button>
                    </div>
                  )}
                  {hasOverride && !dirty && (
                    <button onClick={() => save(ck, '')} style={{ ...ghostBtn, marginTop: 12, color: '#e08a8a', borderColor: 'rgba(224,138,138,0.4)', fontSize: 11 }}>
                      Restaurar padrão
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        </>
      )}

      {tab === 'cupons' && (
        <>
          <form onSubmit={submitCoupon} style={{ border: `1px solid rgba(201,169,97,0.22)`, backgroundColor: 'rgba(22,16,9,0.6)', padding: '22px 24px', marginBottom: 30 }}>
            <p style={{ fontFamily: "'Cinzel', serif", fontSize: 13, letterSpacing: '0.14em', textTransform: 'uppercase', color: theme.gold, margin: '0 0 18px' }}>
              {editingCouponId ? 'Editar cupom' : 'Novo cupom'}
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 180px), 1fr))', gap: 14, alignItems: 'end' }}>
              <label>
                <span style={adminLabelStyle}>Código</span>
                <input
                  value={couponForm.code}
                  onChange={(e) => setCouponForm((f) => ({ ...f, code: e.target.value.toUpperCase() }))}
                  placeholder="BORRA10"
                  style={{ ...inputStyle, width: '100%' }}
                />
              </label>
              <label>
                <span style={adminLabelStyle}>Desconto %</span>
                <input
                  type="number"
                  min={1}
                  max={100}
                  value={couponForm.discountPercent}
                  onChange={(e) => setCouponForm((f) => ({ ...f, discountPercent: e.target.value }))}
                  placeholder="10"
                  style={{ ...inputStyle, width: '100%' }}
                />
              </label>
              <label>
                <span style={adminLabelStyle}>Começa em</span>
                <input
                  type="date"
                  value={couponForm.startDate}
                  onChange={(e) => setCouponForm((f) => ({ ...f, startDate: e.target.value }))}
                  style={{ ...inputStyle, width: '100%', colorScheme: 'dark' }}
                />
              </label>
              <label>
                <span style={adminLabelStyle}>Termina em</span>
                <input
                  type="date"
                  value={couponForm.endDate}
                  onChange={(e) => setCouponForm((f) => ({ ...f, endDate: e.target.value }))}
                  style={{ ...inputStyle, width: '100%', colorScheme: 'dark' }}
                />
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 10, minHeight: 42 }}>
                <input
                  type="checkbox"
                  checked={couponForm.isActive}
                  onChange={(e) => setCouponForm((f) => ({ ...f, isActive: e.target.checked }))}
                />
                <span style={{ ...adminLabelStyle, margin: 0 }}>Ativo</span>
              </label>
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 18, flexWrap: 'wrap' }}>
              <button type="submit" disabled={createCoupon.isPending || updateCoupon.isPending} style={{ ...saveBtn, opacity: createCoupon.isPending || updateCoupon.isPending ? 0.6 : 1 }}>
                {editingCouponId ? 'Salvar cupom' : 'Criar cupom'}
              </button>
              {editingCouponId && (
                <button type="button" onClick={cancelCouponEdit} style={ghostBtn}>
                  Cancelar edição
                </button>
              )}
            </div>
          </form>

          {couponsQuery.isLoading && (
            <p style={{ color: theme.beige, fontFamily: "'Playfair Display', serif" }}>Carregando…</p>
          )}
          {couponsQuery.data && couponsQuery.data.length === 0 && (
            <p style={{ color: 'rgba(201,180,138,0.6)', fontFamily: "'Playfair Display', serif", fontStyle: 'italic' }}>
              Nenhum cupom cadastrado.
            </p>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {couponsQuery.data?.map((coupon) => (
              <div key={coupon.id} style={{ border: `1px solid rgba(201,169,97,0.22)`, backgroundColor: 'rgba(22,16,9,0.6)', padding: '14px 20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                  <div>
                    <span style={{ fontFamily: "'Cinzel', serif", fontSize: 15, color: theme.cream, letterSpacing: '0.08em' }}>
                      {coupon.code}
                    </span>
                    <span style={{ display: 'block', fontFamily: "'Playfair Display', serif", fontSize: 13, color: theme.beige, marginTop: 4 }}>
                      {coupon.discountPercent}% · {new Date(`${coupon.startDate}T00:00:00`).toLocaleDateString('pt-BR')} → {new Date(`${coupon.endDate}T00:00:00`).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
                    <span style={{
                      fontFamily: "'Cinzel', serif",
                      fontSize: 11,
                      letterSpacing: '0.14em',
                      color: coupon.status === 'active' ? '#9fe3b4' : coupon.status === 'expired' || coupon.status === 'inactive' ? '#e08a8a' : theme.gold,
                      border: '1px solid rgba(201,169,97,0.35)',
                      padding: '8px 12px',
                    }}>
                      {couponStatusLabel[coupon.status]}
                    </span>
                    <button onClick={() => startEditCoupon(coupon)} style={{ ...ghostBtn, minWidth: 110 }}>
                      Editar
                    </button>
                    <button
                      onClick={() => deleteCoupon(coupon.id, coupon.code)}
                      disabled={removeCoupon.isPending}
                      style={{ ...ghostBtn, color: '#e08a8a', borderColor: 'rgba(224,138,138,0.45)', minWidth: 110 }}
                    >
                      Remover
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {tab === 'imagens' && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 260px), 1fr))', gap: 18 }}>
            {IMAGE_FIELDS.map((f) => {
              const url = drafts[f.key] ?? overrides[f.key] ?? ''
              const shown = url || f.current
              const dirty = drafts[f.key] !== undefined
              const busy = uploading === f.key
              return (
                <div key={f.key} style={{ border: `1px solid ${dirty ? theme.gold : 'rgba(201,169,97,0.22)'}`, backgroundColor: 'rgba(22,16,9,0.6)', padding: 14 }}>
                  <div style={{ aspectRatio: '1', overflow: 'hidden', marginBottom: 12, backgroundColor: theme.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                    <img src={shown} alt={f.label} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    {busy && (
                      <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(12,7,5,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: theme.gold, fontFamily: "'Cinzel', serif", fontSize: 12, letterSpacing: '0.2em' }}>
                        ENVIANDO…
                      </div>
                    )}
                  </div>
                  <p style={{ fontFamily: "'Cinzel', serif", fontSize: 12, color: theme.cream, margin: '0 0 10px', letterSpacing: '0.05em' }}>{f.label}</p>

                  {/* upload button */}
                  <input
                    ref={(el) => { fileInputs.current[f.key] = el }}
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/gif,image/webp,image/svg+xml,video/mp4,video/webm,video/quicktime"
                    style={{ display: 'none' }}
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) void handleUpload(f.key, file)
                      e.target.value = ''
                    }}
                  />
                  <button
                    onClick={() => fileInputs.current[f.key]?.click()}
                    disabled={busy}
                    style={{ ...saveBtn, width: '100%', marginBottom: 10, opacity: busy ? 0.6 : 1 }}
                  >
                    {busy ? 'Enviando…' : '⬆ Enviar nova imagem'}
                  </button>

                  <input
                    value={url}
                    placeholder={f.current}
                    onChange={(e) => setDrafts((d) => ({ ...d, [f.key]: e.target.value }))}
                    style={{ ...inputStyle, width: '100%', fontSize: 12 }}
                  />
                  {dirty && (
                    <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
                      <button onClick={() => save(f.key, drafts[f.key])} style={saveBtn}>
                        {saved === f.key ? '✓ Salvo!' : 'Salvar'}
                      </button>
                      <button onClick={() => setDrafts((d) => { const n = { ...d }; delete n[f.key]; return n })} style={ghostBtn}>
                        Descartar
                      </button>
                    </div>
                  )}
                  {overrides[f.key] && !dirty && (
                    <button onClick={() => save(f.key, '')} style={{ ...ghostBtn, marginTop: 10, color: '#e08a8a', borderColor: 'rgba(224,138,138,0.4)', fontSize: 11 }}>
                      Restaurar padrão
                    </button>
                  )}
                </div>
              )
            })}
          </div>

          {/* uploads library */}
          <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: 19, color: theme.gold, margin: '44px 0 16px', letterSpacing: '0.06em' }}>
            📚 Biblioteca de envios
          </h2>
          {(uploadsQuery.data ?? []).length === 0 ? (
            <p style={{ color: theme.beige, fontFamily: "'Playfair Display', serif", fontStyle: 'italic', fontSize: 14 }}>
              Nenhuma mídia enviada ainda. Formatos aceitos: JPG, JPEG, PNG, GIF, WebP, SVG e vídeos MP4, WebM, MOV — até 20 MB por arquivo, qualquer resolução.
            </p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 160px), 1fr))', gap: 14 }}>
              {(uploadsQuery.data ?? []).map((u) => (
                <div key={u.url} style={{ border: '1px solid rgba(201,169,97,0.22)', backgroundColor: 'rgba(22,16,9,0.6)', padding: 10 }}>
                  <div style={{ aspectRatio: '1', overflow: 'hidden', marginBottom: 8, backgroundColor: theme.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {/\.(mp4|webm|mov)$/i.test(u.url) ? (
                      <video src={u.url} muted playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <img src={u.url} alt={u.url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    )}
                  </div>
                  <p style={{ color: theme.beige, fontSize: 10, wordBreak: 'break-all', margin: '0 0 8px', opacity: 0.8 }}>{u.url}</p>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button
                      onClick={() => { navigator.clipboard?.writeText(u.url); flash('URL copiada ✓') }}
                      style={{ ...ghostBtn, fontSize: 10, padding: '6px 10px', flex: 1 }}
                    >
                      Copiar URL
                    </button>
                    <button
                      onClick={async () => { await deleteFile.mutateAsync({ url: u.url }); await uploadsQuery.refetch(); flash('Arquivo excluído ✓') }}
                      style={{ ...ghostBtn, fontSize: 10, padding: '6px 10px', color: '#e08a8a', borderColor: 'rgba(224,138,138,0.4)' }}
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {tab === 'estilo' && (
        <>
          <p style={{ color: theme.beige, fontFamily: "'Playfair Display', serif", fontStyle: 'italic', fontSize: 14, margin: '0 0 26px' }}>
            Ajuste cores e tipografia do site inteiro — a pré-visualização é aplicada nesta página na hora; clique em <strong style={{ color: theme.gold }}>Salvar estilo</strong> para publicar.
          </p>

          <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: 19, color: theme.gold, margin: '0 0 16px' }}>🎨 Cores</h2>
          <div className="style-preview-bar" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 220px), 1fr))', gap: 14, marginBottom: 34 }}>
            {COLOR_FIELDS.map((f) => (
              <div key={f.key} style={{ border: '1px solid rgba(201,169,97,0.22)', backgroundColor: 'rgba(22,16,9,0.6)', padding: 14 }}>
                <p style={{ fontFamily: "'Cinzel', serif", fontSize: 12, color: theme.cream, margin: '0 0 10px' }}>{f.label}</p>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <input
                    type="color"
                    value={styleGet(f.key, f.def)}
                    onChange={(e) => onStyleChange(f.key, e.target.value, f.def)}
                    style={{ width: 46, height: 36, border: '1px solid rgba(201,169,97,0.4)', background: 'none', cursor: 'pointer', padding: 0 }}
                  />
                  <code style={{ color: theme.beige, fontSize: 13 }}>{styleGet(f.key, f.def)}</code>
                </div>
              </div>
            ))}
          </div>

          <h2 className="font-scale-note" style={{ fontFamily: "'Cinzel', serif", fontSize: 19, color: theme.gold, margin: '0 0 16px' }}>🔤 Tipografia</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))', gap: 14, marginBottom: 34 }}>
            <div style={{ border: '1px solid rgba(201,169,97,0.22)', backgroundColor: 'rgba(22,16,9,0.6)', padding: 14 }}>
              <p style={{ fontFamily: "'Cinzel', serif", fontSize: 12, color: theme.cream, margin: '0 0 10px' }}>Família da fonte (site inteiro)</p>
              <select
                value={styleGet('style.font.family', '')}
                onChange={(e) => onStyleChange('style.font.family', e.target.value, '')}
                style={{ ...inputStyle, width: '100%' }}
              >
                {FONT_FAMILIES.map((f) => (
                  <option key={f.id} value={f.id} style={{ backgroundColor: '#160f08' }}>{f.label}</option>
                ))}
              </select>
            </div>
            {FONT_SIZE_FIELDS.map((f) => (
              <div key={f.key} style={{ border: '1px solid rgba(201,169,97,0.22)', backgroundColor: 'rgba(22,16,9,0.6)', padding: 14 }}>
                <p style={{ fontFamily: "'Cinzel', serif", fontSize: 12, color: theme.cream, margin: '0 0 10px' }}>{f.label}</p>
                <select
                  value={styleGet(f.key, f.def)}
                  onChange={(e) => onStyleChange(f.key, e.target.value, f.def)}
                  style={{ ...inputStyle, width: '100%' }}
                >
                  {f.opts.map((o) => (
                    <option key={o} value={o} style={{ backgroundColor: '#160f08' }}>{o}</option>
                  ))}
                </select>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <button onClick={saveStyle} disabled={!styleDirty || upsert.isPending} style={{ ...saveBtn, opacity: styleDirty ? 1 : 0.5, padding: '14px 34px' }}>
              Salvar estilo
            </button>
            <button onClick={() => { setDrafts((d) => { const n = { ...d }; COLOR_FIELDS.forEach((f) => delete n[f.key]); delete n['style.font.family']; delete n['style.font.base']; delete n['style.font.h1']; return n }); document.getElementById(PREVIEW_STYLE_ID)?.remove() }} style={ghostBtn}>
              Descartar alterações
            </button>
            <button onClick={resetStyle} style={{ ...ghostBtn, color: '#e08a8a', borderColor: 'rgba(224,138,138,0.4)' }}>
              Restaurar tudo ao padrão
            </button>
          </div>
        </>
      )}

      {tab === 'secoes' && (
        <>
          <p style={{ color: theme.beige, fontFamily: "'Playfair Display', serif", fontStyle: 'italic', fontSize: 14, margin: '0 0 26px' }}>
            Controle quais seções aparecem no site. Ocultar não apaga o conteúdo — basta reativar quando quiser.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {SITE_SECTIONS.map((s) => {
              const visible = isSectionVisible(s.id)
              return (
                <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: `1px solid ${visible ? 'rgba(201,169,97,0.22)' : 'rgba(224,138,138,0.3)'}`, backgroundColor: 'rgba(22,16,9,0.6)', padding: '14px 20px' }}>
                  <span style={{ fontFamily: "'Cinzel', serif", fontSize: 14, color: visible ? theme.cream : 'rgba(201,180,138,0.5)', letterSpacing: '0.08em' }}>
                    {s.label}
                  </span>
                  <button
                    onClick={() => toggleSection(s.id)}
                    style={{
                      ...ghostBtn,
                      color: visible ? '#9fe3b4' : '#e08a8a',
                      borderColor: visible ? 'rgba(126,211,150,0.45)' : 'rgba(224,138,138,0.45)',
                      minWidth: 120,
                    }}
                  >
                    {visible ? '● Visível' : '○ Oculta'}
                  </button>
                </div>
              )
            })}
          </div>
        </>
      )}

      {tab === 'usuarios' && (
        <>
          <p style={{ color: theme.beige, fontFamily: "'Playfair Display', serif", fontStyle: 'italic', fontSize: 14, margin: '0 0 26px' }}>
            Crie contas de administrador com acesso total a este painel. O administrador principal
            do sistema não aparece nesta lista e não pode ser removido daqui.
          </p>

          <form onSubmit={submitNewAdmin} style={{ border: `1px solid rgba(201,169,97,0.22)`, backgroundColor: 'rgba(22,16,9,0.6)', padding: '22px 24px', marginBottom: 30 }}>
            <p style={{ fontFamily: "'Cinzel', serif", fontSize: 13, letterSpacing: '0.14em', textTransform: 'uppercase', color: theme.gold, margin: '0 0 18px' }}>
              Novo administrador
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'flex-start' }}>
              <input
                value={newAdminUser}
                onChange={(e) => setNewAdminUser(e.target.value)}
                placeholder="Usuário"
                autoComplete="off"
                style={{ ...inputStyle, flex: '1 1 200px', width: 'auto' }}
              />
              <input
                type="password"
                value={newAdminPass}
                onChange={(e) => setNewAdminPass(e.target.value)}
                placeholder="Senha (mín. 8 caracteres)"
                autoComplete="new-password"
                style={{ ...inputStyle, flex: '1 1 200px', width: 'auto' }}
              />
              <button type="submit" disabled={createAdmin.isPending} style={{ ...saveBtn, opacity: createAdmin.isPending ? 0.6 : 1 }}>
                {createAdmin.isPending ? 'Criando…' : 'Criar administrador'}
              </button>
            </div>
            <p style={{ color: 'rgba(201,180,138,0.6)', fontFamily: "'Playfair Display', serif", fontSize: 12.5, margin: '14px 0 0' }}>
              O usuário precisa ter entre 3 e 64 caracteres. A senha é guardada com hash e nunca fica visível.
            </p>
          </form>

          {adminUsersQuery.isLoading && (
            <p style={{ color: theme.beige, fontFamily: "'Playfair Display', serif" }}>Carregando…</p>
          )}
          {adminUsersQuery.data && adminUsersQuery.data.length === 0 && (
            <p style={{ color: 'rgba(201,180,138,0.6)', fontFamily: "'Playfair Display', serif", fontStyle: 'italic' }}>
              Nenhum administrador adicional cadastrado.
            </p>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {adminUsersQuery.data?.map((a) => (
              <div key={a.id} style={{ border: `1px solid rgba(201,169,97,0.22)`, backgroundColor: 'rgba(22,16,9,0.6)', padding: '14px 20px' }}>
                {editingId === a.id ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <p style={{ fontFamily: "'Cinzel', serif", fontSize: 12, letterSpacing: '0.14em', textTransform: 'uppercase', color: theme.gold, margin: 0 }}>
                      Editando {a.username}
                    </p>
                    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
                      <input
                        value={editUser}
                        onChange={(e) => setEditUser(e.target.value)}
                        placeholder="Usuário"
                        autoComplete="off"
                        style={{ ...inputStyle, flex: '1 1 200px', width: 'auto' }}
                      />
                      <input
                        type="password"
                        value={editPass}
                        onChange={(e) => setEditPass(e.target.value)}
                        placeholder="Deixe em branco para manter a atual"
                        autoComplete="new-password"
                        style={{ ...inputStyle, flex: '1 1 240px', width: 'auto' }}
                      />
                      <button
                        onClick={() => saveEditAdmin(a.id, a.username)}
                        disabled={updateAdmin.isPending}
                        style={{ ...saveBtn, opacity: updateAdmin.isPending ? 0.6 : 1 }}
                      >
                        {updateAdmin.isPending ? 'Salvando…' : 'Salvar'}
                      </button>
                      <button onClick={cancelEditAdmin} disabled={updateAdmin.isPending} style={ghostBtn}>
                        Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                    <div>
                      <span style={{ fontFamily: "'Cinzel', serif", fontSize: 14, color: theme.cream, letterSpacing: '0.08em' }}>
                        {a.username}
                      </span>
                      <span style={{ display: 'block', fontFamily: "'Playfair Display', serif", fontSize: 12, color: 'rgba(201,180,138,0.55)', marginTop: 4 }}>
                        criado em {new Date(a.createdAt).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                      <button
                        onClick={() => startEditAdmin(a.id, a.username)}
                        style={{ ...ghostBtn, minWidth: 120 }}
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => deleteAdmin(a.id, a.username)}
                        disabled={removeAdmin.isPending}
                        style={{ ...ghostBtn, color: '#e08a8a', borderColor: 'rgba(224,138,138,0.45)', minWidth: 120 }}
                      >
                        Remover
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </Shell>
  )
}

function InlineLogin({ onLogin, busy }: { onLogin: (u: string, p: string) => Promise<void>; busy: boolean }) {
  const [u, setU] = useState('')
  const [p, setP] = useState('')
  const [err, setErr] = useState(false)
  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErr(false)
    try {
      await onLogin(u, p)
    } catch {
      setErr(true)
    }
  }
  return (
    <Shell>
      <div style={{ maxWidth: 380, margin: '8vh auto 0', border: '1px solid rgba(201,169,97,0.4)', backgroundColor: 'rgba(22,16,9,0.9)', padding: '36px 32px' }}>
        <h1 style={{ ...h1, fontSize: 22, textAlign: 'center', marginBottom: 24 }}>Área do Administrador</h1>
        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <input value={u} onChange={(e) => setU(e.target.value)} placeholder="Usuário" autoComplete="username" style={inputStyle} />
          <input type="password" value={p} onChange={(e) => setP(e.target.value)} placeholder="Senha" autoComplete="current-password" style={inputStyle} />
          {err && <p style={{ color: '#e08a8a', fontSize: 13, margin: 0, fontFamily: "'Playfair Display', serif" }}>Usuário ou senha incorretos.</p>}
          <button type="submit" disabled={busy} style={{ ...saveBtn, padding: '13px 20px', fontSize: 12, opacity: busy ? 0.6 : 1 }}>
            {busy ? 'Entrando…' : 'Entrar'}
          </button>
        </form>
      </div>
    </Shell>
  )
}

function AutoLogin({ creds, onLogin, onFail }: { creds: { u: string; p: string }; onLogin: (u: string, p: string) => Promise<void>; onFail: () => void }) {
  const [tried, setTried] = useState(false)
  useEffect(() => {
    if (tried) return
    setTried(true)
    onLogin(creds.u, creds.p).catch(() => onFail())
  }, [tried, creds, onLogin, onFail])
  return <Shell><p style={{ color: theme.beige }}>Entrando…</p></Shell>
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: theme.bg, padding: 'clamp(28px, 5vw, 70px) clamp(18px, 4vw, 60px)' }}>
      <div style={{ maxWidth: 980, margin: '0 auto' }}>{children}</div>
    </div>
  )
}

const h1: React.CSSProperties = {
  fontFamily: "'Cinzel', serif",
  fontSize: 'clamp(26px, 3.5vw, 40px)',
  fontWeight: 500,
  color: theme.cream,
  margin: 0,
}
const linkStyle: React.CSSProperties = {
  color: theme.gold,
  fontFamily: "'Cinzel', serif",
  fontSize: 12,
  letterSpacing: '0.18em',
  textTransform: 'uppercase',
  textDecoration: 'none',
}
const inputStyle: React.CSSProperties = {
  backgroundColor: 'rgba(12,7,5,0.7)',
  border: '1px solid rgba(201,169,97,0.3)',
  color: theme.cream,
  fontFamily: "'Playfair Display', serif",
  fontSize: 15,
  padding: '10px 14px',
  outline: 'none',
  boxSizing: 'border-box',
}
const adminLabelStyle: React.CSSProperties = {
  display: 'block',
  color: theme.goldSoft,
  fontFamily: "'Cinzel', serif",
  fontSize: 11,
  letterSpacing: '0.16em',
  textTransform: 'uppercase',
  marginBottom: 6,
}
const tabBtn: React.CSSProperties = {
  border: `1px solid ${theme.gold}`,
  cursor: 'pointer',
  fontFamily: "'Cinzel', serif",
  fontSize: 12,
  letterSpacing: '0.18em',
  textTransform: 'uppercase',
  padding: '12px 22px',
  transition: 'all 0.25s ease',
}
const saveBtn: React.CSSProperties = {
  backgroundColor: theme.gold,
  color: theme.bg,
  border: 'none',
  cursor: 'pointer',
  fontFamily: "'Cinzel', serif",
  fontSize: 11,
  letterSpacing: '0.2em',
  textTransform: 'uppercase',
  padding: '10px 20px',
}
const ghostBtn: React.CSSProperties = {
  backgroundColor: 'transparent',
  color: theme.beige,
  border: '1px solid rgba(201,169,97,0.35)',
  cursor: 'pointer',
  fontFamily: "'Cinzel', serif",
  fontSize: 11,
  letterSpacing: '0.2em',
  textTransform: 'uppercase',
  padding: '10px 20px',
}
