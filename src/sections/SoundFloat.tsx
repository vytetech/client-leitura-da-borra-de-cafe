import { useEffect, useRef, useState } from 'react'

/**
 * Ambient music player.
 * Primary track: /audio/cafffe.mp3 (loops softly).
 * Browsers block autoplay with sound, so playback starts either
 * automatically (if allowed) or on the visitor's first interaction.
 * The floating icon lets the visitor mute / unmute at any time.
 */
export default function SoundFloat() {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [playing, setPlaying] = useState(false)
  const [hover, setHover] = useState(false)

  useEffect(() => {
    const audio = new Audio('/audio/cafffe.mp3')
    audio.loop = true
    audio.volume = 0.45
    audioRef.current = audio

    const tryPlay = () => {
      audio
        .play()
        .then(() => setPlaying(true))
        .catch(() => setPlaying(false))
    }

    // attempt autoplay (succeeds when the browser allows it)
    tryPlay()

    // otherwise start on the first visitor interaction
    const start = () => {
      if (audio.paused) {
        audio.play().then(() => setPlaying(true)).catch(() => {})
      }
      window.removeEventListener('pointerdown', start)
      window.removeEventListener('keydown', start)
      window.removeEventListener('touchstart', start)
    }
    window.addEventListener('pointerdown', start)
    window.addEventListener('keydown', start)
    window.addEventListener('touchstart', start)

    return () => {
      window.removeEventListener('pointerdown', start)
      window.removeEventListener('keydown', start)
      window.removeEventListener('touchstart', start)
      audio.pause()
      audioRef.current = null
    }
  }, [])

  const toggle = () => {
    const audio = audioRef.current
    if (!audio) return
    if (audio.paused) {
      audio.volume = 0.45
      audio.muted = false
      audio.play().then(() => setPlaying(true)).catch(() => {})
    } else {
      audio.pause()
      setPlaying(false)
    }
  }

  return (
    <button
      onClick={toggle}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      aria-label={playing ? 'Desligar a música / كتم الصوت / Mute music' : 'Ligar a música / تشغيل الصوت / Play music'}
      title={playing ? 'Desligar a música' : 'Ligar a música'}
      style={{
        position: 'fixed',
        bottom: '26px',
        left: '26px',
        zIndex: 900,
        width: '56px',
        height: '56px',
        borderRadius: '50%',
        cursor: 'pointer',
        background: playing
          ? 'linear-gradient(135deg, rgba(212,175,55,0.95) 0%, rgba(184,146,63,0.95) 100%)'
          : 'rgba(22,16,9,0.85)',
        border: '1px solid rgba(212,175,55,0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: playing ? '0 8px 26px rgba(212,175,55,0.4)' : '0 8px 22px rgba(0,0,0,0.5)',
        transition: 'transform 0.25s ease, box-shadow 0.25s ease, background 0.25s ease',
        transform: hover ? 'scale(1.1)' : 'scale(1)',
        backdropFilter: 'blur(6px)',
      }}
    >
      {/* pulsing ring while playing */}
      {playing && (
        <span
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            border: '2px solid rgba(212,175,55,0.6)',
            animation: 'soundPulse 2.4s ease-out infinite',
            pointerEvents: 'none',
          }}
        />
      )}

      {playing ? (
        /* equalizer bars */
        <span style={{ display: 'flex', alignItems: 'flex-end', gap: '3px', height: '22px' }} aria-hidden="true">
          {[0, 1, 2, 3].map((i) => (
            <span
              key={i}
              style={{
                width: '3.5px',
                borderRadius: '2px',
                backgroundColor: '#120b06',
                animation: `eqBar ${0.7 + i * 0.13}s ease-in-out ${i * 0.1}s infinite alternate`,
                height: '100%',
                transformOrigin: 'bottom',
              }}
            />
          ))}
        </span>
      ) : (
        /* muted note */
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M9 18V5l12-2v13" />
          <circle cx="6" cy="18" r="3" />
          <circle cx="18" cy="16" r="3" />
          <line x1="2" y1="22" x2="22" y2="2" stroke="#d4af37" />
        </svg>
      )}

      <style>{`
        @keyframes eqBar {
          from { transform: scaleY(0.25); }
          to { transform: scaleY(1); }
        }
        @keyframes soundPulse {
          0% { transform: scale(1); opacity: 0.8; }
          70% { transform: scale(1.5); opacity: 0; }
          100% { transform: scale(1.5); opacity: 0; }
        }
      `}</style>
    </button>
  )
}
