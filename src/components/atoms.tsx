import { useEffect, useRef, useState, type ReactNode } from 'react'

/** Fade-in + rise on scroll into view */
export function Reveal({
  children,
  delay = 0,
  style,
}: {
  children: ReactNode
  delay?: number
  style?: React.CSSProperties
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisible(true)
          obs.disconnect()
        }
      },
      { threshold: 0.12 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      style={{
        ...style,
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(36px)',
        transition: `opacity 1s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 1s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  )
}

/** Golden dust particles floating upward — full-section background layer */
export function Particles({ density = 46 }: { density?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let w = 0
    let h = 0
    const parent = canvas.parentElement!
    const resize = () => {
      w = parent.clientWidth
      h = parent.clientHeight
      canvas.width = w
      canvas.height = h
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(parent)

    interface P { x: number; y: number; r: number; s: number; o: number; ph: number }
    const parts: P[] = Array.from({ length: density }, () => ({
      x: Math.random() * 2000,
      y: Math.random() * 1200,
      r: 0.6 + Math.random() * 1.8,
      s: 0.08 + Math.random() * 0.35,
      o: 0.15 + Math.random() * 0.5,
      ph: Math.random() * Math.PI * 2,
    }))

    let raf = 0
    let t = 0
    const draw = () => {
      t += 0.016
      ctx.clearRect(0, 0, w, h)
      for (const p of parts) {
        p.y -= p.s
        p.x += Math.sin(t + p.ph) * 0.15
        if (p.y < -4) { p.y = h + 4; p.x = Math.random() * w }
        const tw = 0.55 + 0.45 * Math.sin(t * 2 + p.ph)
        ctx.beginPath()
        ctx.arc(p.x % (w + 8), p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(212,175,55,${(p.o * tw).toFixed(3)})`
        ctx.shadowColor = 'rgba(212,175,55,0.8)'
        ctx.shadowBlur = 6
        ctx.fill()
        ctx.shadowBlur = 0
      }
      raf = requestAnimationFrame(draw)
    }
    raf = requestAnimationFrame(draw)

    return () => { cancelAnimationFrame(raf); ro.disconnect() }
  }, [density])

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
    />
  )
}

/** Living Milky Way background — fixed canvas: drifting galactic band, twinkling
    starfield, glowing nebulae and orbiting celestial bodies */
export function GalaxyBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let w = 0
    let h = 0
    const resize = () => {
      w = window.innerWidth
      h = window.innerHeight
      canvas.width = w
      canvas.height = h
    }
    resize()
    window.addEventListener('resize', resize)

    // ── Starfield ────────────────────────────────────────
    interface Star { x: number; y: number; r: number; c: string; ph: number; sp: number; depth: number }
    const palette = ['242,231,208', '212,175,55', '167,139,202', '143,163,224', '255,255,255']
    const stars: Star[] = Array.from({ length: 170 }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: 0.4 + Math.random() * 1.4,
      c: palette[Math.floor(Math.random() * palette.length)],
      ph: Math.random() * Math.PI * 2,
      sp: 0.5 + Math.random() * 1.8,
      depth: 0.3 + Math.random() * 0.7,
    }))

    // ── Milky Way dust clouds (particles along the band) ──
    interface Dust { off: number; spread: number; r: number; c: string; o: number; drift: number }
    const dustColors = ['123,94,167', '59,74,140', '212,175,55', '167,139,202']
    const dust: Dust[] = Array.from({ length: 90 }, () => ({
      off: Math.random(),                       // position along the band 0..1
      spread: (Math.random() - 0.5) * 2,        // perpendicular spread -1..1
      r: 1 + Math.random() * 2.6,
      c: dustColors[Math.floor(Math.random() * dustColors.length)],
      o: 0.05 + Math.random() * 0.16,
      drift: (Math.random() - 0.5) * 0.06,
    }))

    // ── Nebulae (large radial glows, breathing) ───────────
    const nebulae = [
      { x: 0.18, y: 0.28, r: 0.32, c: '123,94,167', base: 0.075, ph: 0 },
      { x: 0.82, y: 0.62, r: 0.36, c: '59,74,140', base: 0.07, ph: 2.1 },
      { x: 0.55, y: 0.12, r: 0.24, c: '155,110,180', base: 0.05, ph: 4.2 },
    ]

    // ── Celestial bodies ──────────────────────────────────
    const planets = [
      { cx: 0.86, cy: 0.16, orbit: 0, r: 0.017, c1: '#c9a961', c2: '#7b5ea7', glow: 'rgba(212,175,55,0.5)', ring: true, sp: 0 },
      { cx: 0.10, cy: 0.74, orbit: 0, r: 0.012, c1: '#3b4a8c', c2: '#7b5ea7', glow: 'rgba(143,163,224,0.5)', ring: false, sp: 0 },
    ]
    const moon = { orbitR: 0.05, r: 0.005, sp: 0.22, ph: Math.random() * Math.PI * 2 }

    // shooting star state
    interface Meteor { x: number; y: number; vx: number; vy: number; life: number; max: number }
    let meteor: Meteor | null = null
    let nextMeteor = 300 + Math.random() * 400
    let frame = 0

    let raf = 0
    let t = 0
    const draw = () => {
      t += 0.016
      frame += 1
      ctx.clearRect(0, 0, w, h)

      // deep space base
      const base = ctx.createLinearGradient(0, 0, w, h)
      base.addColorStop(0, '#0c0705')
      base.addColorStop(0.45, '#0d0810')
      base.addColorStop(1, '#0a0714')
      ctx.fillStyle = base
      ctx.fillRect(0, 0, w, h)

      // breathing nebulae
      for (const n of nebulae) {
        const breathe = n.base * (0.65 + 0.55 * Math.sin(t * 0.7 + n.ph))
        const nx = n.x * w + Math.sin(t * 0.11 + n.ph) * 46
        const ny = n.y * h + Math.cos(t * 0.09 + n.ph) * 36
        const g = ctx.createRadialGradient(nx, ny, 0, nx, ny, n.r * Math.max(w, h))
        g.addColorStop(0, `rgba(${n.c},${breathe.toFixed(3)})`)
        g.addColorStop(1, 'rgba(0,0,0,0)')
        ctx.fillStyle = g
        ctx.fillRect(0, 0, w, h)
      }

      // ── Milky Way band: soft diagonal ribbon + dust ─────
      const bandAngle = -0.5 // radians, diagonal
      const bx = Math.cos(bandAngle), by = Math.sin(bandAngle)
      const px = -by, py = bx // perpendicular
      const cx = w * 0.5, cy = h * 0.42
      const bandLen = Math.max(w, h) * 1.6
      const bandWidth = Math.min(w, h) * 0.34

      const ribbon = ctx.createLinearGradient(
        cx - px * bandWidth, cy - py * bandWidth,
        cx + px * bandWidth, cy + py * bandWidth
      )
      ribbon.addColorStop(0, 'rgba(123,94,167,0)')
      ribbon.addColorStop(0.5, 'rgba(150,120,190,0.14)')
      ribbon.addColorStop(1, 'rgba(59,74,140,0)')
      ctx.fillStyle = ribbon
      ctx.fillRect(0, 0, w, h)

      for (const d of dust) {
        d.off += d.drift * 0.0028
        if (d.off > 1.05) d.off = -0.05
        if (d.off < -0.05) d.off = 1.05
        const along = (d.off - 0.5) * bandLen
        const wob = Math.sin(t * 0.55 + d.off * 12) * bandWidth * 0.13
        const dx = cx + bx * along + px * (d.spread * bandWidth * 0.5 + wob)
        const dy = cy + by * along + py * (d.spread * bandWidth * 0.5 + wob)
        ctx.beginPath()
        ctx.arc(dx, dy, d.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${d.c},${d.o.toFixed(3)})`
        ctx.fill()
      }

      // starfield with parallax drift + twinkle
      for (const s of stars) {
        const sx = ((s.x + t * 0.0035 * s.depth) % 1) * w
        const sy = s.y * h + Math.sin(t * 0.16 + s.ph) * 3.2 * s.depth
        const tw = 0.5 + 0.5 * Math.sin(t * s.sp * 2 + s.ph)
        const alpha = (0.15 + 0.7 * tw * tw) * s.depth
        ctx.beginPath()
        ctx.arc(sx, sy, s.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${s.c},${alpha.toFixed(3)})`
        ctx.shadowColor = `rgba(${s.c},0.8)`
        ctx.shadowBlur = 4
        ctx.fill()
        ctx.shadowBlur = 0
      }

      // ── Celestial bodies ────────────────────────────────
      const p1 = planets[0]
      const p1x = p1.cx * w + Math.sin(t * 0.05) * 12
      const p1y = p1.cy * h + Math.cos(t * 0.04) * 9
      const pr1 = p1.r * Math.min(w, h)
      // glow
      const glow1 = ctx.createRadialGradient(p1x, p1y, 0, p1x, p1y, pr1 * 3.4)
      glow1.addColorStop(0, p1.glow.replace('0.5', '0.30'))
      glow1.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.fillStyle = glow1
      ctx.fillRect(p1x - pr1 * 4, p1y - pr1 * 4, pr1 * 8, pr1 * 8)
      // body
      const body1 = ctx.createLinearGradient(p1x - pr1, p1y - pr1, p1x + pr1, p1y + pr1)
      body1.addColorStop(0, p1.c1)
      body1.addColorStop(1, p1.c2)
      ctx.beginPath()
      ctx.arc(p1x, p1y, pr1, 0, Math.PI * 2)
      ctx.fillStyle = body1
      ctx.fill()
      // ring
      if (p1.ring) {
        ctx.save()
        ctx.translate(p1x, p1y)
        ctx.rotate(-0.5 + Math.sin(t * 0.05) * 0.03)
        ctx.strokeStyle = 'rgba(201,169,97,0.45)'
        ctx.lineWidth = 1.2
        ctx.beginPath()
        ctx.ellipse(0, 0, pr1 * 1.9, pr1 * 0.55, 0, 0, Math.PI * 2)
        ctx.stroke()
        ctx.restore()
      }
      // moon orbiting planet 1
      const mx = p1x + Math.cos(t * moon.sp + moon.ph) * moon.orbitR * Math.min(w, h)
      const my = p1y + Math.sin(t * moon.sp + moon.ph) * moon.orbitR * Math.min(w, h) * 0.5
      ctx.beginPath()
      ctx.arc(mx, my, moon.r * Math.min(w, h), 0, Math.PI * 2)
      ctx.fillStyle = 'rgba(242,231,208,0.85)'
      ctx.fill()

      // second planet
      const p2 = planets[1]
      const p2x = p2.cx * w + Math.sin(t * 0.04 + 2) * 10
      const p2y = p2.cy * h + Math.cos(t * 0.05 + 1) * 8
      const pr2 = p2.r * Math.min(w, h)
      const glow2 = ctx.createRadialGradient(p2x, p2y, 0, p2x, p2y, pr2 * 3)
      glow2.addColorStop(0, 'rgba(143,163,224,0.22)')
      glow2.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.fillStyle = glow2
      ctx.fillRect(p2x - pr2 * 4, p2y - pr2 * 4, pr2 * 8, pr2 * 8)
      const body2 = ctx.createLinearGradient(p2x - pr2, p2y - pr2, p2x + pr2, p2y + pr2)
      body2.addColorStop(0, p2.c1)
      body2.addColorStop(1, p2.c2)
      ctx.beginPath()
      ctx.arc(p2x, p2y, pr2, 0, Math.PI * 2)
      ctx.fillStyle = body2
      ctx.fill()

      // occasional shooting star
      if (!meteor && frame > nextMeteor) {
        meteor = {
          x: w * (0.2 + Math.random() * 0.6),
          y: h * Math.random() * 0.3,
          vx: -(4.5 + Math.random() * 3),
          vy: 2 + Math.random() * 1.6,
          life: 0,
          max: 44 + Math.random() * 22,
        }
        nextMeteor = frame + 480 + Math.random() * 600
      }
      if (meteor) {
        meteor.life += 1
        meteor.x += meteor.vx
        meteor.y += meteor.vy
        const fade = 1 - meteor.life / meteor.max
        if (fade <= 0) meteor = null
        else {
          const tail = 16
          const grad = ctx.createLinearGradient(
            meteor.x, meteor.y,
            meteor.x - meteor.vx * tail, meteor.y - meteor.vy * tail
          )
          grad.addColorStop(0, `rgba(242,231,208,${(0.8 * fade).toFixed(3)})`)
          grad.addColorStop(1, 'rgba(123,94,167,0)')
          ctx.strokeStyle = grad
          ctx.lineWidth = 1.3
          ctx.beginPath()
          ctx.moveTo(meteor.x, meteor.y)
          ctx.lineTo(meteor.x - meteor.vx * tail, meteor.y - meteor.vy * tail)
          ctx.stroke()
        }
      }

      raf = requestAnimationFrame(draw)
    }
    raf = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed', inset: '-4%', width: '108%', height: '108%', zIndex: -1, pointerEvents: 'none',
        filter: 'blur(4px) saturate(1.2) brightness(1.05)',
      }}
    />
  )
}

/** Twinkling star / sparkle layer — cosmic shimmer for section backgrounds */
export function Sparkles({ density = 70 }: { density?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let w = 0
    let h = 0
    const parent = canvas.parentElement!
    const resize = () => {
      w = parent.clientWidth
      h = parent.clientHeight
      canvas.width = w
      canvas.height = h
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(parent)

    const palette = ['212,175,55', '167,139,202', '143,163,224', '242,231,208']
    interface Star { x: number; y: number; r: number; c: string; ph: number; sp: number; cross: boolean }
    interface Meteor { x: number; y: number; vx: number; vy: number; life: number; max: number }

    const stars: Star[] = Array.from({ length: density }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: 0.4 + Math.random() * 1.3,
      c: palette[Math.floor(Math.random() * palette.length)],
      ph: Math.random() * Math.PI * 2,
      sp: 0.6 + Math.random() * 1.6,
      cross: Math.random() < 0.14,
    }))

    let meteor: Meteor | null = null
    let nextMeteor = 240 + Math.random() * 360
    let frame = 0

    let raf = 0
    let t = 0
    const draw = () => {
      t += 0.016
      frame += 1
      ctx.clearRect(0, 0, w, h)

      for (const s of stars) {
        const tw = 0.5 + 0.5 * Math.sin(t * s.sp * 2 + s.ph)
        const alpha = 0.12 + 0.75 * tw * tw
        const x = s.x * w
        const y = s.y * h
        ctx.beginPath()
        ctx.arc(x, y, s.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${s.c},${alpha.toFixed(3)})`
        ctx.shadowColor = `rgba(${s.c},0.9)`
        ctx.shadowBlur = 5
        ctx.fill()
        ctx.shadowBlur = 0
        if (s.cross && tw > 0.86) {
          const g = (tw - 0.86) * 22 * s.r
          ctx.strokeStyle = `rgba(${s.c},${(alpha * 0.7).toFixed(3)})`
          ctx.lineWidth = 0.7
          ctx.beginPath()
          ctx.moveTo(x - g, y); ctx.lineTo(x + g, y)
          ctx.moveTo(x, y - g); ctx.lineTo(x, y + g)
          ctx.stroke()
        }
      }

      // occasional shooting star
      if (!meteor && frame > nextMeteor) {
        meteor = {
          x: w * (0.15 + Math.random() * 0.7),
          y: h * Math.random() * 0.35,
          vx: -(4 + Math.random() * 3),
          vy: 2 + Math.random() * 1.4,
          life: 0,
          max: 46 + Math.random() * 22,
        }
        nextMeteor = frame + 420 + Math.random() * 500
      }
      if (meteor) {
        meteor.life += 1
        meteor.x += meteor.vx
        meteor.y += meteor.vy
        const fade = 1 - meteor.life / meteor.max
        if (fade <= 0) {
          meteor = null
        } else {
          const tail = 14
          const grad = ctx.createLinearGradient(
            meteor.x, meteor.y,
            meteor.x - meteor.vx * tail, meteor.y - meteor.vy * tail
          )
          grad.addColorStop(0, `rgba(242,231,208,${(0.85 * fade).toFixed(3)})`)
          grad.addColorStop(1, 'rgba(212,175,55,0)')
          ctx.strokeStyle = grad
          ctx.lineWidth = 1.4
          ctx.beginPath()
          ctx.moveTo(meteor.x, meteor.y)
          ctx.lineTo(meteor.x - meteor.vx * tail, meteor.y - meteor.vy * tail)
          ctx.stroke()
        }
      }

      raf = requestAnimationFrame(draw)
    }
    raf = requestAnimationFrame(draw)

    return () => { cancelAnimationFrame(raf); ro.disconnect() }
  }, [density])

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
    />
  )
}

/** Arabesque divider — eight-pointed star band (zakharef) */
export function Ornament({ width = 320, color = '#c9a961' }: { width?: number; color?: string }) {
  return (
    <svg
      width={width}
      height="28"
      viewBox="0 0 320 28"
      style={{ display: 'block', margin: '0 auto' }}
      aria-hidden="true"
    >
      <line x1="0" y1="14" x2="118" y2="14" stroke={color} strokeWidth="0.8" opacity="0.6" />
      <line x1="202" y1="14" x2="320" y2="14" stroke={color} strokeWidth="0.8" opacity="0.6" />
      <g transform="translate(160,14)" stroke={color} fill="none" strokeWidth="0.9">
        <rect x="-7" y="-7" width="14" height="14" />
        <rect x="-7" y="-7" width="14" height="14" transform="rotate(45)" />
        <circle r="2.4" fill={color} stroke="none" />
      </g>
      <circle cx="128" cy="14" r="2" fill={color} opacity="0.8" />
      <circle cx="192" cy="14" r="2" fill={color} opacity="0.8" />
    </svg>
  )
}

/** Arabic calligraphic quote strip */
export function ArabicQuote({ text, size = 'clamp(22px,3vw,34px)' }: { text: string; size?: string }) {
  return (
    <p
      dir="rtl"
      lang="ar"
      style={{
        fontFamily: "'Amiri', serif",
        fontSize: size,
        color: '#d4af37',
        lineHeight: 1.9,
        margin: 0,
        textShadow: '0 0 24px rgba(212,175,55,0.35)',
      }}
    >
      {text}
    </p>
  )
}

/** Small gold eyebrow label */
export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p
      style={{
        fontFamily: "'Cinzel', serif",
        fontSize: '12px',
        letterSpacing: '0.34em',
        textTransform: 'uppercase',
        color: '#c9a961',
        marginBottom: '18px',
      }}
    >
      {children}
    </p>
  )
}

export const theme = {
  bg: '#0c0705',
  bgSoft: '#161009',
  gold: '#d4af37',
  goldSoft: '#c9a961',
  cream: '#f2e7d0',
  beige: '#c9b48a',
  purple: '#7b5ea7',
  cosmicBlue: '#3b4a8c',
}

/* ---------- coffee botanical decorations ---------- */

function CoffeeBean({ size = 18, color = 'rgba(139,94,60,0.85)', rotate = 0 }: { size?: number; color?: string; rotate?: number }) {
  return (
    <svg width={size} height={size * 1.4} viewBox="0 0 20 28" style={{ transform: `rotate(${rotate}deg)` }} aria-hidden="true">
      <ellipse cx="10" cy="14" rx="8" ry="12.6" fill={color} />
      <path d="M10 2 C 5.5 8, 14.5 20, 10 26" stroke="rgba(12,7,5,0.55)" strokeWidth="1.6" fill="none" strokeLinecap="round" />
    </svg>
  )
}

function CoffeeCup({ size = 26, color = 'rgba(212,175,55,0.85)' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      {/* cup */}
      <path d="M6 10 h17 v7 a8.5 8.5 0 0 1 -17 0 Z" fill="none" stroke={color} strokeWidth="1.7" strokeLinejoin="round" />
      {/* handle */}
      <path d="M23 12 c 4 0, 4.6 6, 0 6.4" fill="none" stroke={color} strokeWidth="1.7" strokeLinecap="round" />
      {/* saucer */}
      <path d="M4 27 c 8 2.2, 16 2.2, 24 0" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      {/* steam */}
      <path d="M11 6.5 c -1 -1.6, 1 -2.2, 0 -3.8 M15.5 6.5 c -1 -1.6, 1 -2.2, 0 -3.8 M20 6.5 c -1 -1.6, 1 -2.2, 0 -3.8" fill="none" stroke={color} strokeWidth="1.2" strokeLinecap="round" opacity={0.7} />
    </svg>
  )
}

/* five symbolic cups: strength, love, peace, home, luck */
const CUP_SYMBOLS: { icon: ReactNode; color: string; label: string }[] = [
  {
    // strength — clenched fist
    color: '#d4af37',
    label: 'força / قوة / fuerza / strength',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M6.5 10.5V8a1.5 1.5 0 0 1 3 0v2h1V7a1.5 1.5 0 0 1 3 0v3h1V8.5a1.5 1.5 0 0 1 3 0V14a6 6 0 0 1-6 6h-.8a6 6 0 0 1-4.9-2.53L3.4 13.9a1.4 1.4 0 0 1 2.2-1.7l.9 1.2Z" />
      </svg>
    ),
  },
  {
    // love — heart
    color: '#e0607e',
    label: 'amor / حب / amor / love',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 21s-8.5-5.4-10.6-10C-.1 7.6 2 4 5.5 4 7.7 4 9.6 5.4 12 8c2.4-2.6 4.3-4 6.5-4C22 4 24.1 7.6 22.6 11 20.5 15.6 12 21 12 21Z" />
      </svg>
    ),
  },
  {
    // peace — dove
    color: '#9db7e0',
    label: 'paz / سلام / paz / peace',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M21.4 3.6c-.5.4-1.3.7-2.1.8-1.2-1.3-3-1.6-4.6-.7-2 1-3 3.3-2.7 5.5-3.5-.4-6.5-2.4-8.4-5.3-.7 2.1-.2 4.4 1.3 6-1-.1-1.9-.5-2.7-1 .2 2.8 2.2 4.7 4.6 5-.7.4-1.6.5-2.5.3.7 2.3 2.8 3.7 5 3.8-2 1.6-4.5 2.3-7.3 2.3 2.6 1.6 5.7 2.2 8.7 1.6 4.4-.8 7.7-4.6 8.3-9.2.1-.8.1-1.6 0-2.4.9-.7 1.7-1.7 2.4-2.9-.8.5-1.8.9-2.8 1 .8-.8 1.5-1.9 1.8-3.1-.6.4-1.4.8-2.3 1Z" />
      </svg>
    ),
  },
  {
    // home — house
    color: '#a7b8a0',
    label: 'lar / بيت / hogar / home',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 3 2.5 11h2.6v9h5.4v-6h3v6h5.4v-9h2.6L12 3Z" />
      </svg>
    ),
  },
  {
    // luck — four-leaf clover
    color: '#7fbf7f',
    label: 'sorte / حظ / suerte / luck',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 2c1.8 0 3 1.4 3 3 0 1.5-1 2.6-2 3.4.5-.3 1.2-.4 1.9-.4 1.7 0 3.1 1.2 3.1 3s-1.4 3-3.1 3c-.7 0-1.4-.1-1.9-.4 1 .8 2 1.9 2 3.4 0 1.6-1.2 3-3 3s-3-1.4-3-3c0-1.5 1-2.6 2-3.4-.5.3-1.2.4-1.9.4-1.7 0-3.1-1.2-3.1-3s1.4-3 3.1-3c.7 0 1.4.1 1.9.4-1-.8-2-1.9-2-3.4 0-1.6 1.2-3 3-3Zm1 20c2 .8 4 2.5 4.5 3l-.8 1c-.7-.8-2.5-2.2-4.2-2.9Z" />
      </svg>
    ),
  },
]

/* decorative coffee scatter — beans, branches and five symbolic cups floating elegantly between sections */
export function CoffeeScatter() {
  return (
    <div aria-hidden="true" className="coffee-scatter" style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}>
      {/* five symbolic cups */}
      {[
        { top: '22%', left: '5%', s: 30 },
        { top: '38%', right: '4%', s: 34 },
        { top: '58%', left: '8%', s: 28 },
        { top: '72%', right: '7%', s: 32 },
        { top: '86%', left: '14%', s: 27 },
      ].map((pos, i) => {
        const sym = CUP_SYMBOLS[i % CUP_SYMBOLS.length]
        return (
          <div
            key={`cup-${i}`}
            className="coffeeFloat"
            title={sym.label}
            style={{
              position: 'absolute',
              ...pos,
              animation: `coffeeFloat ${9 + i * 1.7}s ease-in-out ${i * 1.2}s infinite`,
              opacity: 0.8,
            }}
          >
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <CoffeeCup size={pos.s} color="rgba(212,175,55,0.8)" />
              <span style={{ position: 'absolute', top: '30%', left: '50%', transform: 'translate(-50%, -30%)', color: sym.color }}>
                {sym.icon}
              </span>
            </div>
          </div>
        )
      })}
      {/* drifting coffee beans */}
      {[
        { top: '16%', left: '32%', r: 24, s: 15 },
        { top: '30%', left: '88%', r: -40, s: 13 },
        { top: '44%', left: '18%', r: 60, s: 17 },
        { top: '52%', left: '60%', r: -15, s: 12 },
        { top: '63%', left: '85%', r: 105, s: 15 },
        { top: '70%', left: '40%', r: -70, s: 13 },
        { top: '82%', left: '55%', r: 30, s: 16 },
        { top: '90%', left: '88%', r: -20, s: 12 },
      ].map((b, i) => (
        <div
          key={`bean-${i}`}
          style={{
            position: 'absolute',
            top: b.top,
            left: b.left,
            animation: `coffeeFloat ${10 + (i % 4) * 1.9}s ease-in-out ${i * 0.8}s infinite`,
            opacity: 0.55,
          }}
        >
          <CoffeeBean size={b.s} rotate={b.r} />
        </div>
      ))}
      <style>{`
        @keyframes coffeeFloat {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-14px) rotate(3deg); }
        }
        @keyframes coffeeSway {
          0%, 100% { transform: rotate(-2.5deg); }
          50% { transform: rotate(2.5deg); }
        }
        @media (max-width: 768px) {
          .coffee-scatter { display: none; }
        }
      `}</style>
    </div>
  )
}

export const WHATSAPP_URL = 'https://wa.me/5512988051401'

export const VYTETECH_URL = 'https://vytetech.com'
