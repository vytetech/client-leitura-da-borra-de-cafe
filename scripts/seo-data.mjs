export const SITE_URL = (process.env.VITE_SITE_URL || process.env.SITE_URL || 'https://leitura-borra-cafe.onrender.com').replace(/\/$/, '')
export const DEFAULT_IMAGE = '/images/ahmad/logo.png'
export const SITE_NAME = 'Ahmad K. Taha'
export const BRAND_NAME = 'A Leitura da Borra de Cafe'

export const locales = {
  pt: { hreflang: 'pt-BR', og: 'pt_BR', path: '/pt/', label: 'Português', dir: 'ltr' },
  en: { hreflang: 'en', og: 'en_US', path: '/en/', label: 'English', dir: 'ltr' },
  es: { hreflang: 'es', og: 'es_ES', path: '/es/', label: 'Español', dir: 'ltr' },
  ar: { hreflang: 'ar', og: 'ar_AR', path: '/ar/', label: 'العربية', dir: 'rtl' },
}

export const supportedLangs = Object.keys(locales)

export const seoByLang = {
  pt: {
    title: 'Leitura da Borra de Cafe e Cafeomancia | Ahmad K. Taha',
    description: 'Consulta de leitura da borra de cafe com Ahmad K. Taha em Ilhabela e online. Cafeomancia, tasseografia arabe, simbolos na xicara e orientacao espiritual.',
    h1: 'Leitura da Borra de Cafe com Ahmad K. Taha',
    lead: 'Cafeomancia e tasseografia arabe para consultas presenciais em Ilhabela, leituras online e eventos.',
    keywords: ['leitura da borra de cafe', 'cafeomancia', 'tasseografia', 'tasseomancia', 'consulta espiritual', 'jogo de buzios', 'taro', 'astrologia', 'quiromancia'],
    imageAlt: 'Xicara usada em leitura da borra de cafe com Ahmad K. Taha',
    sections: [
      { title: 'Como funciona a leitura da borra de cafe', text: 'A leitura interpreta simbolos formados pela borra na xicara, observando borda, paredes e fundo para orientar perguntas pessoais com cuidado e respeito.' },
      { title: 'Consultas presenciais e online', text: 'O atendimento pode acontecer em Ilhabela ou por videochamada. Nas leituras a distancia, Ahmad prepara o ritual com os dados enviados pelo cliente.' },
      { title: 'Servicos espirituais relacionados', text: 'O site apresenta leitura individual, consulta online e leituras para eventos, com linguagem conectada a cafeomancia, tasseomancia, taro, astrologia, buzios e quiromancia quando pertinente.' },
    ],
  },
  en: {
    title: 'Coffee Grounds Reading and Tasseography | Ahmad K. Taha',
    description: 'Coffee grounds reading with Ahmad K. Taha in Ilhabela and online. Arabic tasseography, cup symbols, spiritual reading and live consultations.',
    h1: 'Coffee Grounds Reading with Ahmad K. Taha',
    lead: 'Arabic coffee cup reading and tasseography for in-person sessions, online readings and events.',
    keywords: ['coffee grounds reading', 'coffee cup reading', 'tasseography', 'tasseomancy', 'spiritual reading', 'tarot reading', 'astrology reading', 'palm reading'],
    imageAlt: 'Coffee cup prepared for a coffee grounds reading with Ahmad K. Taha',
    sections: [
      { title: 'How coffee grounds reading works', text: 'The reading interprets symbols left inside the cup, from the rim to the bottom, to guide personal questions through a symbolic and spiritual tradition.' },
      { title: 'In-person and online readings', text: 'Sessions are available in Ilhabela or by video call. For distance readings, Ahmad prepares the ritual using the details shared by the client.' },
      { title: 'Related spiritual readings', text: 'The site presents individual readings, online consultations and event readings, with natural semantic links to tasseomancy, tarot reading, astrology, palm reading and other divinatory practices.' },
    ],
  },
  es: {
    title: 'Lectura de Posos de Cafe y Cafeomancia | Ahmad K. Taha',
    description: 'Lectura de los posos del cafe con Ahmad K. Taha en Ilhabela y online. Cafeomancia, taseografia arabe, simbolos en la taza y orientacion espiritual.',
    h1: 'Lectura de los Posos del Cafe con Ahmad K. Taha',
    lead: 'Cafeomancia y taseografia arabe para consultas presenciales, lecturas online y eventos.',
    keywords: ['lectura de posos de cafe', 'lectura del cafe', 'cafeomancia', 'taseografia', 'taseomancia', 'lectura espiritual', 'tarot', 'astrologia', 'quiromancia'],
    imageAlt: 'Taza preparada para una lectura de los posos del cafe con Ahmad K. Taha',
    sections: [
      { title: 'Como funciona la lectura de los posos del cafe', text: 'La lectura interpreta los simbolos que quedan en la taza, desde el borde hasta el fondo, para orientar preguntas personales con sensibilidad.' },
      { title: 'Consultas presenciales y online', text: 'Las sesiones pueden realizarse en Ilhabela o por videollamada. En las lecturas a distancia, Ahmad prepara el ritual con los datos enviados por la persona.' },
      { title: 'Servicios espirituales relacionados', text: 'El sitio presenta lecturas individuales, consultas online y eventos, con relaciones naturales con taseomancia, tarot, astrologia, lectura de manos y practicas adivinatorias.' },
    ],
  },
  ar: {
    title: 'قراءة الفنجان وتفل القهوة | أحمد ك. طه',
    description: 'قراءة تفل القهوة مع أحمد ك. طه في إيلابيلا وعن بعد. تفسير رموز الفنجان، التاسيوغرافيا العربية، والاستشارة الروحية المباشرة.',
    h1: 'قراءة الفنجان مع أحمد ك. طه',
    lead: 'قراءة تفل القهوة والتاسيوغرافيا العربية للاستشارات الحضورية، القراءات عن بعد والمناسبات.',
    keywords: ['قراءة الفنجان', 'قراءة تفل القهوة', 'التاسيوغرافيا', 'استشارة روحية', 'قراءة التاروت', 'علم الفلك', 'قراءة الكف'],
    imageAlt: 'فنجان قهوة مخصص لقراءة تفل القهوة مع أحمد ك. طه',
    sections: [
      { title: 'كيف تتم قراءة الفنجان', text: 'تعتمد القراءة على تفسير الرموز التي تظهر داخل الفنجان، من الحافة إلى القاع، ضمن تقليد رمزي وروحي قائم على الانتباه والاحترام.' },
      { title: 'جلسات حضورية وعن بعد', text: 'يمكن إجراء القراءة في إيلابيلا أو عبر مكالمة فيديو. في القراءة عن بعد يجهز أحمد الطقس باستخدام البيانات التي يرسلها العميل.' },
      { title: 'خدمات روحية مرتبطة', text: 'يعرض الموقع قراءات فردية واستشارات عبر الإنترنت وقراءات للمناسبات، مع ارتباط طبيعي بالتاروت والتنجيم وقراءة الكف والممارسات الروحية.' },
    ],
  },
}

export function canonical(lang) {
  return `${SITE_URL}${locales[lang].path}`
}

export function jsonLd(lang) {
  const seo = seoByLang[lang]
  const url = canonical(lang)
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      '@id': `${SITE_URL}/#organization`,
      name: SITE_NAME,
      alternateName: [BRAND_NAME, 'A leitura da borra de cafe', 'قراءة الفنجان'],
      url: SITE_URL,
      logo: `${SITE_URL}${DEFAULT_IMAGE}`,
      sameAs: ['https://www.instagram.com/leituradecafe'],
      contactPoint: { '@type': 'ContactPoint', contactType: 'customer service', availableLanguage: ['Portuguese', 'English', 'Spanish', 'Arabic'] },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      name: BRAND_NAME,
      url: SITE_URL,
      inLanguage: supportedLangs.map((code) => locales[code].hreflang),
      publisher: { '@id': `${SITE_URL}/#organization` },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      '@id': `${url}#webpage`,
      url,
      name: seo.title,
      description: seo.description,
      isPartOf: { '@id': `${SITE_URL}/#website` },
      about: seo.keywords,
      inLanguage: locales[lang].hreflang,
      primaryImageOfPage: `${SITE_URL}${DEFAULT_IMAGE}`,
      breadcrumb: { '@id': `${url}#breadcrumb` },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      '@id': `${url}#service`,
      name: seo.h1,
      description: seo.description,
      serviceType: seo.keywords.slice(0, 5),
      provider: { '@id': `${SITE_URL}/#organization` },
      areaServed: ['BR', 'Online'],
      availableChannel: { '@type': 'ServiceChannel', serviceUrl: url },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      '@id': `${url}#breadcrumb`,
      itemListElement: [{ '@type': 'ListItem', position: 1, name: lang === 'en' ? 'Home' : lang === 'es' ? 'Inicio' : lang === 'ar' ? 'الرئيسية' : 'Inicio', item: url }],
    },
  ]
}
