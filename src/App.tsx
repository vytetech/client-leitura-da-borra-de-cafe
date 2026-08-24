import { Routes, Route } from 'react-router'
import type { ReactNode } from 'react'
import { LanguageProvider, useLang } from './i18n'
import Navbar from './sections/Navbar'
import { GalaxyBackground, CoffeeScatter } from './components/atoms'
import Login from './pages/Login'
import Admin from './pages/Admin'
import Hero from './sections/Hero'
import About from './sections/About'
import HowItWorks from './sections/HowItWorks'
import Gallery from './sections/Gallery'
import Events from './sections/Events'
import Services from './sections/Services'
import Payment from './sections/Payment'
import RemoteReading from './sections/RemoteReading'
import Booking from './sections/Booking'
import Testimonials from './sections/Testimonials'
import Faq from './sections/Faq'
import Footer from './sections/Footer'
import WhatsAppFloat from './sections/WhatsAppFloat'
import SoundFloat from './sections/SoundFloat'
import { Seo } from './components/Seo'
import { theme } from './components/atoms'

function Site() {
  const { lang, overrides } = useLang()
  const visible = (id: string) => overrides[`section.${id}.visible`] !== '0'
  return (
    <div
      style={{
        minHeight: '100vh',
        scrollBehavior: 'smooth',
        position: 'relative',
      }}
    >
      <Seo lang={lang} />
      <GalaxyBackground />
      <CoffeeScatter />
      <Navbar />
      <main>
        {visible('hero') && <Hero />}
        {visible('sobre') && <About />}
        {visible('como-funciona') && <HowItWorks />}
        {visible('galeria') && <Gallery />}
        {visible('servicos') && <Services />}
        {visible('eventos') && <Events />}
        {visible('pagamento') && <Payment />}
        {visible('leitura-distancia') && <RemoteReading />}
        {visible('agendar') && <Booking />}
        {visible('depoimentos') && <Testimonials />}
        {visible('faq') && <Faq />}
      </main>
      <Footer />
      <WhatsAppFloat />
      <SoundFloat />
    </div>
  )
}

function PrivatePage({ children }: { children: ReactNode }) {
  return (
    <>
      <Seo lang="pt" noindex />
      {children}
    </>
  )
}

function NotFound() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        padding: '32px',
        textAlign: 'center',
        background: 'linear-gradient(180deg, #160f08 0%, #0c0705 100%)',
        color: theme.cream,
      }}
    >
      <Seo lang="pt" noindex />
      <main>
        <h1 style={{ fontFamily: "'Cinzel', serif", fontSize: 'clamp(34px, 6vw, 64px)', margin: '0 0 16px' }}>Pagina nao encontrada</h1>
        <p style={{ fontFamily: "'Playfair Display', serif", color: theme.beige, margin: '0 0 28px' }}>A pagina solicitada nao existe ou foi movida.</p>
        <a href="/pt/" style={{ color: theme.gold, fontFamily: "'Cinzel', serif", letterSpacing: '0.14em', textTransform: 'uppercase' }}>Voltar ao inicio</a>
      </main>
    </div>
  )
}

function App() {
  return (
    <LanguageProvider>
      <Routes>
        <Route path="/" element={<Site />} />
        <Route path="/pt" element={<Site />} />
        <Route path="/en" element={<Site />} />
        <Route path="/es" element={<Site />} />
        <Route path="/ar" element={<Site />} />
        <Route path="/login" element={<PrivatePage><Login /></PrivatePage>} />
        <Route path="/admin" element={<PrivatePage><Admin /></PrivatePage>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </LanguageProvider>
  )
}

export default App
