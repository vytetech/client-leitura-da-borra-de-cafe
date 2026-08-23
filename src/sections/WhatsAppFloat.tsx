import { useState } from 'react'
import { WHATSAPP_URL } from '../components/atoms'

const INSTAGRAM_URL = 'https://www.instagram.com/leituradecafe'

export default function WhatsAppFloat() {
  const [hover, setHover] = useState(false)
  const [igHover, setIgHover] = useState(false)

  return (
    <>
    {/* Instagram floating button */}
    <a
      href={INSTAGRAM_URL}
      target="_blank"
      rel="noreferrer"
      aria-label="Instagram @leituradecafe"
      onMouseEnter={() => setIgHover(true)}
      onMouseLeave={() => setIgHover(false)}
      style={{
        position: 'fixed',
        bottom: '104px',
        right: '26px',
        zIndex: 900,
        width: '56px',
        height: '56px',
        borderRadius: '50%',
        background: 'radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285aeb 90%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 8px 26px rgba(214,36,159,0.45)',
        transition: 'transform 0.25s ease, box-shadow 0.25s ease',
        transform: igHover ? 'scale(1.1)' : 'scale(1)',
      }}
    >
      <span
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          border: '2px solid rgba(214,36,159,0.65)',
          animation: 'waPulse 2.6s ease-out infinite',
          animationDelay: '0.8s',
          pointerEvents: 'none',
        }}
      />
      <svg width="27" height="27" viewBox="0 0 24 24" fill="#ffffff" aria-hidden="true">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
      </svg>
    </a>
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noreferrer"
      aria-label="WhatsApp"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: 'fixed',
        bottom: '26px',
        right: '26px',
        zIndex: 900,
        width: '62px',
        height: '62px',
        borderRadius: '50%',
        backgroundColor: hover ? '#2bd46b' : '#25d366',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 8px 30px rgba(37,211,102,0.45)',
        transition: 'transform 0.25s ease, background-color 0.25s ease',
        transform: hover ? 'scale(1.1)' : 'scale(1)',
      }}
    >
      {/* pulsing ring */}
      <span
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          border: '2px solid rgba(37,211,102,0.7)',
          animation: 'waPulse 2.2s ease-out infinite',
          pointerEvents: 'none',
        }}
      />
      <svg width="30" height="30" viewBox="0 0 24 24" fill="#0c0705" aria-hidden="true">
        <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.9-4.45 9.9-9.91A9.86 9.86 0 0 0 12.04 2zm0 18.03h-.01a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.11.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.23 8.24-8.23a8.2 8.2 0 0 1 8.23 8.24c0 4.54-3.7 8.23-8.24 8.23zm4.52-6.16c-.25-.13-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.24-.64.8-.78.97-.14.16-.29.18-.54.06-.25-.13-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.01-.38.11-.51.11-.11.25-.29.37-.43.12-.15.16-.25.25-.41.08-.17.04-.31-.02-.43-.06-.13-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.22.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.6.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.14-1.18-.06-.1-.22-.16-.47-.28z" />
      </svg>
      <style>{`
        @keyframes waPulse {
          0% { transform: scale(1); opacity: 0.8; }
          70% { transform: scale(1.55); opacity: 0; }
          100% { transform: scale(1.55); opacity: 0; }
        }
      `}</style>
    </a>
    </>
  )
}
