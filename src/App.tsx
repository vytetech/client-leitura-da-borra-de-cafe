import { Routes, Route } from 'react-router'
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

function Site() {
  const { overrides } = useLang()
  const visible = (id: string) => overrides[`section.${id}.visible`] !== '0'
  return (
    <div
      style={{
        minHeight: '100vh',
        scrollBehavior: 'smooth',
        position: 'relative',
      }}
    >
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

function App() {
  return (
    <LanguageProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="*" element={<Site />} />
      </Routes>
    </LanguageProvider>
  )
}

export default App
