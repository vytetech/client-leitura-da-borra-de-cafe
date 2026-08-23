import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

export type Lang = 'pt' | 'es' | 'en' | 'ar'

const dict = {
  // ── Navbar ──────────────────────────────────────────────
  'nav.about': { pt: 'Sobre', es: 'Sobre mí', en: 'About', ar: 'عن أحمد' },
  'nav.how': { pt: 'Como Funciona', es: 'Cómo Funciona', en: 'How It Works', ar: 'كيف تتم القراءة' },
  'nav.gallery': { pt: 'Galeria', es: 'Galería', en: 'Gallery', ar: 'المعرض' },
  'nav.services': { pt: 'Serviços', es: 'Servicios', en: 'Services', ar: 'الخدمات' },
  'nav.testimonials': { pt: 'Depoimentos', es: 'Testimonios', en: 'Testimonials', ar: 'آراء الزبائن' },
  'nav.book': { pt: 'Agendar', es: 'Reservar', en: 'Book Now', ar: 'احجز الآن' },
  'hero.subtitle': {
    pt: 'Leitor de Borra de Café · Cafeomancia & Tasseografia Árabe',
    es: 'Lector de los Posos del Café · Cafeomancia y Taseografía Árabe',
    en: 'Coffee Ground Reader · Arabic Cup Reading & Tasseography',
    ar: 'قارئ الفنجان · قراءة البن والتصوير بالفنجان العربي',
  },
  'hero.location': {
    pt: 'Ilhabela · Brasil',
    es: 'Ilhabela · Brasil',
    en: 'Ilhabela · Brazil',
    ar: 'إيلابيلا · البرازيل',
  },
  'hero.since': {
    pt: 'Mais de 20 anos lendo o que a borra revela',
    es: 'Más de 20 años leyendo lo que revelan los posos',
    en: 'Over 20 years reading what the grounds reveal',
    ar: 'أكثر من ٢٠ عاماً أقرأ ما تكشفه التفل',
  },
  'hero.ctaBook': { pt: 'Agendar Leitura', es: 'Reservar Lectura', en: 'Book a Reading', ar: 'احجز قراءتك' },
  'hero.ctaWhats': { pt: 'Falar no WhatsApp', es: 'Hablar por WhatsApp', en: 'Chat on WhatsApp', ar: 'تواصل عبر واتساب' },
  'about.eyebrow': { pt: 'O Leitor', es: 'El Lector', en: 'The Reader', ar: 'القارئ' },
  'about.title': {
    pt: 'Um dom que nasceu comigo',
    es: 'Un don que nació conmigo',
    en: 'A gift I was born with',
    ar: 'موهبة وُلدت معي',
  },
  'about.p1': {
    pt: 'Sou Ahmad K. Taha, nasci com o dom da leitura da borra de café e aprendi a arte antiga da tasseografia árabe com a minha avó, que lia as xícaras dos clientes. Tinha 13 anos quando fiz a minha primeira leitura — e desde então nunca mais parei.',
    es: 'Soy Ahmad K. Taha. Nací con el don de la lectura de los posos del café y aprendí el arte antiguo de la taseografía árabe con mi abuela, que leía las tazas de nuestra familia y de los vecinos. Tenía 13 años cuando hice mi primera lectura — y desde entonces nunca he parado.',
    en: 'I am Ahmad K. Taha. I was born with the gift of coffee ground reading and learned the ancient art of Arabic tasseography from my grandmother, who read cups for our family and neighbors. I was 13 when I gave my first reading — and I have never stopped since.',
    ar: 'أنا أحمد ك. طه. وُلدت ومعي موهبة قراءة الفنجان، وتعلّمت فنّ التاسيوغرافيا العربي العريق على يد جدتي التي كانت تقرأ الفناجين لعائلتنا وللجيران. كنت في الثالثة عشرة من عمري حين أجريت قراءتي الأولى — ومنذ ذلك الحين لم أتوقف أبداً.',
  },
  'about.p2': {
    pt: 'Desde 2014 vivo na Ilhabela, no litoral norte de São Paulo, Brasil, onde faço a leitura da borra de café para o mundo inteiro — tenho clientes no mundo inteiro. Para mim, cada xícara é uma conversa: a borra guarda símbolos, e o meu trabalho é dar voz a eles com respeito, sensibilidade e verdade.',
    es: 'Desde 2014 vivo en Ilhabela, en el litoral norte de São Paulo, Brasil, donde recibo personas de todo el mundo. Para mí, cada taza es una conversación: los posos guardan símbolos, y mi trabajo es darles voz con respeto, sensibilidad y verdad.',
    en: 'Since 2014 I have lived in Ilhabela, on the northern coast of São Paulo, Brazil, where I welcome people from all over the world. To me, every cup is a conversation: the grounds hold symbols, and my work is to give them a voice — with respect, sensitivity and truth.',
    ar: 'منذ عام ٢٠١٤ أعيش في إيلابيلا، على الساحل الشمالي لولاية ساو باولو في البرازيل، حيث أستقبل الناس من كل أنحاء العالم. بالنسبة لي، كل فنجان هو حوار: التفل يحفظ الرموز، وعملي أن أمنحها صوتاً باحترام وحساسية وصدق.',
  },
  'about.stat1': { pt: 'anos de experiência', es: 'años de experiencia', en: 'years of experience', ar: 'عاماً من الخبرة' },
  'about.stat2': { pt: 'idiomas falados', es: 'idiomas', en: 'languages spoken', ar: 'لغات أتحدثها' },
  'about.stat3': { pt: 'leituras realizadas', es: 'lecturas realizadas', en: 'readings given', ar: 'قراءة أجريتها' },
  'about.langs': {
    pt: 'Português · العربية · Español · English',
    es: 'Português · العربية · Español · English',
    en: 'Português · العربية · Español · English',
    ar: 'Português · العربية · Español · English',
  },
  'about.connection': {
    pt: '“A leitura acontece na conexão energética entre a xícara e o cliente.”',
    es: '“La lectura ocurre en la conexión energética entre la taza y el cliente.”',
    en: '“The reading happens in the energetic connection between the cup and the client.”',
    ar: '«تتم القراءة في الاتصال الطاقي بين الفنجان والعميل.»',
  },
  'how.eyebrow': { pt: 'O Ritual', es: 'El Ritual', en: 'The Ritual', ar: 'الطقوس' },
  'how.title': { pt: 'Como Funciona', es: 'Cómo Funciona', en: 'How It Works', ar: 'كيف تتم القراءة' },
  'how.s1t': { pt: 'Agendamento', es: 'Reserva', en: 'Booking', ar: 'الحجز' },
  'how.s1d': {
    pt: 'Você escolhe o tipo de leitura e agenda pelo formulário ou WhatsApp. Confirmamos data, horário e formato — presencial ou online.',
    es: 'Eliges el tipo de lectura y reservas por el formulario o WhatsApp. Confirmamos fecha, hora y formato — presencial u online.',
    en: 'You choose the type of reading and book through the form or WhatsApp. We confirm date, time and format — in person or online.',
    ar: 'تختار نوع القراءة وتحجز عبر النموذج أو واتساب. نؤكد التاريخ والوقت والشكل — حضورياً أو عن بُعد.',
  },
  'how.s2t': { pt: 'Leitura Presencial', es: 'Lectura Presencial', en: 'In-Person Reading', ar: 'القراءة الحضورية' },
  'how.s2d': {
    pt: 'Na leitura presencial, o café é preparado no ritual tradicional. Você o bebe com calma, com a sua intenção presente, e vira a xícara sobre o pires.',
    es: 'En la lectura presencial, el café se prepara en el ritual tradicional. Lo bebes con calma, con tu intención presente, y giras la taza sobre el plato.',
    en: 'In the in-person reading, the coffee is prepared in the traditional ritual. You drink it slowly, holding your intention, then turn the cup onto its saucer.',
    ar: 'في القراءة الحضورية، يُحضَّر القهوة وفق الطقس التقليدي. تشربها بهدوء ونيّتك حاضرة، ثم تقلب الفنجان على الصحن.',
  },
  'how.s3t': { pt: 'Leitura à Distância', es: 'Lectura a Distancia', en: 'Distance Reading', ar: 'القراءة عن بُعد' },
  'how.s3d': {
    pt: 'Você envia os seus dados pessoais por mensagem no WhatsApp. Ahmad prepara o café especial da leitura e coloca no líquido uma folha com as suas informações escritas — é assim que ele se conecta à sua energia, onde você estiver no planeta.',
    es: 'Envías tus datos personales por mensaje de WhatsApp. Ahmad prepara el café especial de la lectura y coloca en el líquido una hoja con tu información escrita — así se conecta con tu energía, estés donde estés en el planeta.',
    en: 'You send your personal details by WhatsApp message. Ahmad prepares the special reading coffee and places a sheet with your written information into the liquid — that is how he connects with your energy, wherever you are on the planet.',
    ar: 'عن بعد: ترسل معلوماتك الشخصية عبر رسالة واتساب. يقوم أحمد طه بإعداد القهوة الخاصة بالقراءة ويضع في الفنجان ورقة مكتوب عليها معلوماتك — وذلك للاتصال بطاقتك أينما كنت على الكوكب.',
  },
  'how.s4t': { pt: 'Chamada e Interpretação', es: 'Llamada e Interpretación', en: 'Call & Interpretation', ar: 'الاتصال والتفسير' },
  'how.s4d': {
    pt: 'Na leitura à distância, Ahmad liga para você por videochamada e a leitura acontece ao vivo. Presencial ou online, ele lê cada símbolo da borda ao fundo da xícara — presente, futuro próximo e o que ainda se forma — e responde às suas perguntas.',
    es: 'En la lectura a distancia, Ahmad te llama por videollamada y la lectura ocurre en vivo. Presencial u online, lee cada símbolo desde el borde hasta el fondo de la taza — presente, futuro cercano y lo que aún se forma — y responde a tus preguntas.',
    en: 'For distance readings, Ahmad calls you on video and the reading happens live. In person or online, he reads every symbol from the rim to the bottom of the cup — present, near future, and what is still forming — and answers your questions.',
    ar: 'بعدها يقوم أحمد بالاتصال بك محادثة فيديو وتتم القراءة مباشرة. يقرأ كل رمز من حافة الفنجان إلى قاعه — الحاضر والمستقبل القريب وما لم يتشكّل بعد — ويجيب عن أسئلتك.',
  },
  'remote.eyebrow': { pt: 'Consulta Online', es: 'Consulta Online', en: 'Online Reading', ar: 'الاستشارة أونلاين' },
  'remote.title': {
    pt: 'Leitura à Distância — Como é Feita',
    es: 'Lectura a Distancia — Cómo se Hace',
    en: 'Distance Reading — How It Works',
    ar: 'القراءة عن بُعد — كيف تتم',
  },
  'remote.intro': {
    pt: 'Para consultas online, você não precisa virar a sua própria xícara. O ritual é realizado por mim, aqui em Ilhabela, com os seus dados de nascimento.',
    es: 'Para consultas online no necesitas girar tu propia taza. El ritual lo realizo yo, aquí en Ilhabela, con tus datos de nacimiento.',
    en: 'For online readings you do not need to turn your own cup. I perform the ritual myself, here in Ilhabela, using your birth details.',
    ar: 'في الاستشارات أونلاين لا تحتاج إلى قلب فنجانك بنفسك. أنا أجري الطقس بنفسي هنا في كوكايا، باستخدام بيانات ميلادك.',
  },
  'remote.need': {
    pt: 'O que você deve fornecer:',
    es: 'Lo que debes proporcionar:',
    en: 'What you need to provide:',
    ar: 'ما يجب أن تقدّمه:',
  },
  'remote.i1': {
    pt: 'Nome completo e data de nascimento',
    es: 'Nombre completo y fecha de nacimiento',
    en: 'Full name and date of birth',
    ar: 'الاسم الكامل وتاريخ الميلاد',
  },
  'remote.i2': {
    pt: 'Nome completo e data de nascimento dos pais',
    es: 'Nombre completo y fecha de nacimiento de los padres',
    en: 'Full names and birth dates of your parents',
    ar: 'الاسم الكامل وتاريخ ميلاد الوالدين',
  },
  'remote.i3': {
    pt: 'Bairro, cidade, estado e país de residência',
    es: 'Barrio, ciudad, estado y país de residencia',
    en: 'Neighborhood, city, state and country of residence',
    ar: 'الحي والمدينة والولاية والبلد',
  },
  'remote.ritual': {
    pt: 'O ritual: preparo o café especial da leitura, coloco no líquido uma folha com os seus dados escritos para me conectar à sua energia, onde você estiver no planeta. Depois eu mesmo ligo para você por videochamada e a leitura acontece ao vivo.',
    es: 'El ritual: preparo el café especial de la lectura, coloco en el líquido una hoja con tus datos escritos para conectar con tu energía, estés donde estés en el planeta. Después yo mismo te llamo por videollamada y la lectura ocurre en vivo.',
    en: 'The ritual: I prepare the special reading coffee, place a sheet with your written details into the liquid to connect with your energy, wherever you are on the planet. Then I call you myself on video and the reading happens live.',
    ar: 'الطقس: أُعدّ القهوة الخاصة بالقراءة وأضع في الفنجان ورقة مكتوب عليها معلوماتك للاتصال بطاقتك أينما كنت على الكوكب. بعدها أتصل بك بنفسي محادثة فيديو وتتم القراءة مباشرة.',
  },
  'remote.note': {
    pt: 'Importante: para confirmar o agendamento da leitura da borra de café, o pagamento deve ser feito antecipadamente.',
    es: 'Importante: para confirmar la reserva de la lectura de los posos del café, el pago debe realizarse por adelantado.',
    en: 'Important: to confirm your coffee ground reading booking, payment must be made in advance.',
    ar: 'ملاحظة: لتأكيد حجز قراءة تفل القهوة يجب الدفع مسبقاً.',
  },
  'gallery.eyebrow': { pt: 'Registros Reais', es: 'Registros Reales', en: 'Real Records', ar: 'توثيق حقيقي' },
  'gallery.title': { pt: 'Galeria da Borra', es: 'Galería de los Posos', en: 'Grounds Gallery', ar: 'معرض الفناجين' },
  'gallery.sub': {
    pt: 'Xícaras reais de leituras realizadas — clique para ampliar e observar os símbolos.',
    es: 'Tazas reales de lecturas realizadas — haz clic para ampliar y observar los símbolos.',
    en: 'Real cups from actual readings — click to enlarge and observe the symbols.',
    ar: 'فناجين حقيقية من قراءات فعلية — انقر للتكبير وتأمّل الرموز.',
  },
  'gallery.close': { pt: 'Fechar', es: 'Cerrar', en: 'Close', ar: 'إغلاق' },
  'nav.events': { pt: 'Eventos', es: 'Eventos', en: 'Events', ar: 'المناسبات' },
  'events.eyebrow': { pt: 'Leituras em Eventos', es: 'Lecturas en Eventos', en: 'Readings at Events', ar: 'قراءات في المناسبات' },
  'events.title': {
    pt: 'A borra de café em ocasiões especiais',
    es: 'Los posos de café en ocasiones especiales',
    en: 'Coffee ground readings on special occasions',
    ar: 'قراءة الفنجان في المناسبات الخاصة',
  },
  'events.sub': {
    pt: 'De festas temáticas a lançamentos de marcas como a Boncafé — Ahmad leva a magia da cafeomancia ao vivo para o seu evento.',
    es: 'De fiestas temáticas a lanzamientos de marcas como Boncafé — Ahmad lleva la magia de la cafeomancia en vivo a tu evento.',
    en: 'From themed parties to brand launches like Boncafé — Ahmad brings the magic of live tasseography to your event.',
    ar: 'من الحفلات التنكرية إلى إطلاق علامات تجارية مثل Boncafé — أحمد يجلب سحر قراءة الفنجان الحية إلى مناسبتك.',
  },
  'events.cta': {
    pt: 'Levar a leitura para o meu evento',
    es: 'Llevar la lectura a mi evento',
    en: 'Bring the reading to my event',
    ar: 'أحضر القراءة إلى مناسبتي',
  },
  'services.eyebrow': { pt: 'Serviços', es: 'Servicios', en: 'Services', ar: 'الخدمات' },
  'services.title': {
    pt: 'Escolha a sua leitura',
    es: 'Elige tu lectura',
    en: 'Choose your reading',
    ar: 'اختر قراءتك',
  },
  'services.s1t': { pt: 'Leitura Individual', es: 'Lectura Individual', en: 'Individual Reading', ar: 'قراءة فردية' },
  'services.s1d': {
    pt: 'Presencial em Ilhabela ou online. Sessão completa de 30 a 45 minutos, com tempo para as suas perguntas.',
    es: 'Presencial en Ilhabela u online. Sesión completa de 30 a 45 minutos, con tiempo para tus preguntas.',
    en: 'In person in Ilhabela or online. A full 30 to 45 minute session, with time for your questions.',
    ar: 'حضورياً في كوكايا أو عن بُعد. جلسة كاملة من ٣٠ إلى ٤٥ دقيقة، مع وقت لأسئلتك.',
  },
  'services.s1p': { pt: 'A partir de R$ 300', es: 'Desde R$ 300', en: 'From R$ 300', ar: 'ابتداءً من ٣٠٠ ريال برازيلي' },
  'services.s2t': { pt: 'Consulta Online', es: 'Consulta Online', en: 'Online Consultation', ar: 'استشارة أونلاين' },
  'services.s2d': {
    pt: 'Por videochamada no WhatsApp, Zoom ou Google Meet. Ritual de leitura à distância realizado por Ahmad com os seus dados.',
    es: 'Por videollamada en WhatsApp, Zoom o Google Meet. Ritual de lectura a distancia realizado por Ahmad con tus datos.',
    en: 'By video call on WhatsApp, Zoom or Google Meet. The distance-reading ritual is performed by Ahmad using your details.',
    ar: 'عبر مكالمة فيديو على واتساب أو زوم أو جوجل ميت. طقس القراءة عن بُعد يجريه أحمد باستخدام بياناتك.',
  },
  'services.s2p': { pt: 'R$ 300', es: 'R$ 300', en: 'R$ 300', ar: '٣٠٠ ريال برازيلي' },
  'services.s3t': { pt: 'Eventos', es: 'Eventos', en: 'Events', ar: 'المناسبات' },
  'services.s3d': {
    pt: 'Leituras em aniversários, casamentos e eventos corporativos. Uma experiência inesquecível para os seus convidados.',
    es: 'Lecturas en cumpleaños, bodas y eventos corporativos. Una experiencia inolvidable para tus invitados.',
    en: 'Readings at birthdays, weddings and corporate events. An unforgettable experience for your guests.',
    ar: 'قراءات في أعياد الميلاد والأعراس والفعاليات المؤسسية. تجربة لا تُنسى لضيوفك.',
  },
  'services.s3p': { pt: 'Sob consulta', es: 'A consultar', en: 'On request', ar: 'حسب الاتفاق' },
  'services.ctaPress': { pt: 'Falar com a Assessoria', es: 'Hablar con la Prensa', en: 'Contact the Press Office', ar: 'تواصل مع المكتب الصحفي' },
  'services.cta': { pt: 'Agendar', es: 'Reservar', en: 'Book', ar: 'احجز' },
  'booking.eyebrow': { pt: 'Agendamento', es: 'Reserva', en: 'Booking', ar: 'الحجز' },
  'booking.title': {
    pt: 'Reserve a sua leitura',
    es: 'Reserva tu lectura',
    en: 'Book your reading',
    ar: 'احجز قراءتك',
  },
  'booking.sub': {
    pt: 'Preencha o formulário e o seu pedido chega direto no meu WhatsApp, já com tudo pronto para combinarmos.',
    es: 'Completa el formulario y tu solicitud llega directo a mi WhatsApp, lista para coordinar.',
    en: 'Fill in the form and your request goes straight to my WhatsApp, ready for us to arrange everything.',
    ar: 'املأ النموذج ويصل طلبك مباشرة إلى واتساب الخاص بي، جاهزاً لنرتّب كل شيء معاً.',
  },
  'booking.name': { pt: 'Nome completo', es: 'Nombre completo', en: 'Full name', ar: 'الاسم الكامل' },
  'booking.namePh': { pt: 'Seu nome completo', es: 'Tu nombre completo', en: 'Your full name', ar: 'اسمك الكامل' },
  'booking.whatsapp': { pt: 'WhatsApp', es: 'WhatsApp', en: 'WhatsApp', ar: 'واتساب' },
  'booking.email': { pt: 'E-mail', es: 'Correo electrónico', en: 'Email', ar: 'البريد الإلكتروني' },
  'booking.service': { pt: 'Tipo de serviço', es: 'Tipo de servicio', en: 'Service type', ar: 'نوع الخدمة' },
  'booking.date': { pt: 'Data preferida', es: 'Fecha preferida', en: 'Preferred date', ar: 'التاريخ المفضل' },
  'booking.time': { pt: 'Horário preferido', es: 'Hora preferida', en: 'Preferred time', ar: 'الوقت المفضل' },
  'booking.notes': { pt: 'Observações', es: 'Observaciones', en: 'Notes', ar: 'ملاحظات' },
  'booking.notesPh': {
    pt: 'Uma pergunta, uma ocasião, algo que queira contar antes…',
    es: 'Una pregunta, una ocasión, algo que quieras contar antes…',
    en: 'A question, an occasion, anything you would like to share first…',
    ar: 'سؤال، مناسبة، أي شيء تود مشاركته مسبقاً…',
  },
  'booking.morning': { pt: 'Manhã (9h – 12h)', es: 'Mañana (9h – 12h)', en: 'Morning (9am – 12pm)', ar: 'صباحاً (٩ – ١٢)' },
  'booking.afternoon': { pt: 'Tarde (14h – 17h)', es: 'Tarde (14h – 17h)', en: 'Afternoon (2pm – 5pm)', ar: 'بعد الظهر (١٤ – ١٧)' },
  'booking.evening': { pt: 'Noite (19h – 21h)', es: 'Noche (19h – 21h)', en: 'Evening (7pm – 9pm)', ar: 'مساءً (١٩ – ٢١)' },
  'booking.submit': { pt: 'Enviar pelo WhatsApp', es: 'Enviar por WhatsApp', en: 'Send via WhatsApp', ar: 'أرسل عبر واتساب' },
  'booking.error': {
    pt: 'Preencha pelo menos nome, WhatsApp e serviço.',
    es: 'Completa al menos nombre, WhatsApp y servicio.',
    en: 'Please fill in at least name, WhatsApp and service.',
    ar: 'يرجى ملء الاسم ورقم الواتساب ونوع الخدمة على الأقل.',
  },
  'testi.eyebrow': { pt: 'Depoimentos', es: 'Testimonios', en: 'Testimonials', ar: 'آراء الزبائن' },
  'testi.title': {
    pt: 'Quem já virou a xícara',
    es: 'Quienes ya giraron la taza',
    en: 'Those who have turned the cup',
    ar: 'من قلبوا الفنجان',
  },
  'testi.t1': {
    pt: '“Ahmad descreveu coisas da minha vida que eu nunca tinha contado a ninguém. Saí da leitura em silêncio — e em paz. Volto todos os anos.”',
    es: '“Ahmad describió cosas de mi vida que nunca le había contado a nadie. Salí de la lectura en silencio — y en paz. Vuelvo todos los años.”',
    en: '“Ahmad described things from my life I had never told anyone. I left the reading in silence — and at peace. I come back every year.”',
    ar: '«وصف أحمد أشياء من حياتي لم أخبر بها أحداً قط. خرجت من القراءة صامتاً — وبسلام. أعود كل عام.»',
  },
  'testi.n1': { pt: 'Maria · São Paulo, Brasil', es: 'María · São Paulo, Brasil', en: 'Maria · São Paulo, Brazil', ar: 'ماريا · ساو باولو، البرازيل' },
  'testi.t2': {
    pt: '“Fiz a consulta online achando que não seria a mesma coisa. Foi mais forte do que qualquer leitura presencial que já fiz. Preciso e humano.”',
    es: '“Hice la consulta online pensando que no sería lo mismo. Fue más fuerte que cualquier lectura presencial que había hecho. Preciso y humano.”',
    en: '“I booked the online consultation thinking it would not be the same. It was more powerful than any in-person reading I have ever had. Precise and human.”',
    ar: '«حجزت الاستشارة أونلاين ظناً مني أنها لن تكون بنفس القوة. كانت أقوى من أي قراءة حضورية مررت بها. دقيقة وإنسانية.»',
  },
  'testi.n2': { pt: 'João · Rio de Janeiro, Brasil', es: 'João · Río de Janeiro, Brasil', en: 'João · Rio de Janeiro, Brazil', ar: 'جواو · ريو دي جانيرو، البرازيل' },
  'testi.t3': {
    pt: '“He read my cup in English and Arabic, switching between them as the symbols appeared. It felt ancient and completely personal at once.”',
    es: '“Leyó mi taza en inglés y árabe, alternando entre ellos a medida que aparecían los símbolos. Se sintió antiguo y completamente personal a la vez.”',
    en: '“He read my cup in English and Arabic, switching between them as the symbols appeared. It felt ancient and completely personal at once.”',
    ar: '«قرأ فنجاني بالإنجليزية والعربية، متنقلاً بينهما كلما ظهرت الرموز. شعرت بشيء عريق وشخصي تماماً في آن واحد.»',
  },
  'testi.n3': { pt: 'Sarah · Nova York, EUA', es: 'Sarah · Nueva York, EE. UU.', en: 'Sarah · New York, USA', ar: 'سارة · نيويورك، الولايات المتحدة' },
  'pay.eyebrow': { pt: 'Pagamento', es: 'Pago', en: 'Payment', ar: 'الدفع' },
  'pay.title': {
    pt: 'Escolha como pagar a sua leitura',
    es: 'Elige cómo pagar tu lectura',
    en: 'Choose how to pay for your reading',
    ar: 'اختر طريقة الدفع لقراءتك',
  },
  'pay.sub': {
    pt: 'Três formas simples e seguras. Toque na sua preferida e combinamos tudo pelo WhatsApp.',
    es: 'Tres formas simples y seguras. Toca tu preferida y coordinamos todo por WhatsApp.',
    en: 'Three simple and secure options. Tap your favorite and we arrange everything over WhatsApp.',
    ar: 'ثلاث طرق بسيطة وآمنة. اختر ما يناسبك ونرتّب كل شيء عبر واتساب.',
  },
  'pay.pix.t': { pt: 'PIX', es: 'PIX', en: 'PIX', ar: 'PIX' },
  'pay.pix.d': {
    pt: 'Pagamento instantâneo e sem taxas — ideal para quem está no Brasil. Você recebe a chave PIX no WhatsApp.',
    es: 'Pago instantáneo y sin comisiones — ideal para quienes están en Brasil. Recibes la clave PIX por WhatsApp.',
    en: 'Instant, fee-free payment — ideal if you are in Brazil. You receive the PIX key on WhatsApp.',
    ar: 'دفع فوري وبدون رسوم — مثالي لمن هو في البرازيل. تستلم مفتاح PIX عبر واتساب.',
  },
  'pay.paypal.t': { pt: 'PayPal', es: 'PayPal', en: 'PayPal', ar: 'PayPal' },
  'pay.paypal.d': {
    pt: 'Perfeito para clientes internacionais: pague em sua moeda, com a proteção do PayPal.',
    es: 'Perfecto para clientes internacionales: paga en tu moneda, con la protección de PayPal.',
    en: 'Perfect for international clients: pay in your own currency, with PayPal buyer protection.',
    ar: 'مثالي للزبائن الدوليين: ادفع بعملتك مع حماية PayPal.',
  },
  'pay.card.t': { pt: 'Cartão de Crédito ou Débito', es: 'Tarjeta de Crédito o Débito', en: 'Credit or Debit Card', ar: 'بطاقة ائتمان أو خصم' },
  'pay.card.d': {
    pt: 'Enviamos um link de pagamento seguro no WhatsApp — você paga com qualquer cartão, em poucos cliques.',
    es: 'Te enviamos un enlace de pago seguro por WhatsApp — pagas con cualquier tarjeta, en pocos clics.',
    en: 'We send you a secure payment link on WhatsApp — pay with any card in just a few clicks.',
    ar: 'نرسل لك رابط دفع آمن عبر واتساب — ادفع بأي بطاقة خلال نقرات قليلة.',
  },
  'pay.cta': { pt: 'Pagar com', es: 'Pagar con', en: 'Pay with', ar: 'ادفع عبر' },
  'pay.msg': {
    pt: 'Olá Ahmad! Quero pagar a minha leitura da borra de café via',
    es: '¡Hola Ahmad! Quiero pagar mi lectura de los posos del café por',
    en: 'Hello Ahmad! I would like to pay for my coffee ground reading via',
    ar: 'مرحباً أحمد! أود دفع قراءة الفنجان عبر',
  },
  'mq.1': { pt: 'A xícara não mente.', es: 'La taza no miente.', en: 'The cup does not lie.', ar: 'الفنجان لا يكذب.' },
  'mq.2': { pt: 'Você não escolheu a xícara — a xícara escolheu você.', es: 'No elegiste la taza — la taza te eligió a ti.', en: 'You did not choose the cup — the cup chose you.', ar: 'أنت لم تختر الفنجان — الفنجان اختارك.' },
  'mq.3': { pt: 'O fundo da xícara é só o começo.', es: 'El fondo de la taza es solo el comienzo.', en: 'The bottom of the cup is only the beginning.', ar: 'قاع الفنجان ليس إلا البداية.' },
  'mq.4': { pt: 'Cada borra é um mapa. Eu sei lê-lo.', es: 'Cada poso es un mapa. Yo sé leerlo.', en: 'Every ground is a map. I know how to read it.', ar: 'كل تفلة خريطة، وأنا أعرف قراءتها.' },
  'mq.5': { pt: 'A resposta que você procura já foi desenhada.', es: 'La respuesta que buscas ya fue dibujada.', en: 'The answer you seek has already been drawn.', ar: 'الإجابة التي تبحث عنها رُسمت من قبل.' },
  'mq.6': { pt: 'Quem vira a xícara, nunca mais a vê da mesma forma.', es: 'Quien voltea la taza, nunca la vuelve a ver igual.', en: 'Once you turn the cup, you never see it the same way again.', ar: 'من يقلب الفنجان لا يراه كما كان أبداً.' },
  'faq.eyebrow': { pt: 'Dúvidas Frequentes', es: 'Dudas Frecuentes', en: 'Common Questions', ar: 'الأسئلة الشائعة' },
  'faq.title': {
    pt: 'Antes de virar a xícara',
    es: 'Antes de voltear la taza',
    en: 'Before you turn the cup',
    ar: 'قبل أن تقلب الفنجان',
  },
  'faq.sub': {
    pt: 'Tudo o que você precisa saber — sem mistério. O mistério fica para a leitura.',
    es: 'Todo lo que necesitas saber — sin misterio. El misterio queda para la lectura.',
    en: 'Everything you need to know — no mystery here. The mystery stays in the reading.',
    ar: 'كل ما تحتاج معرفته — بلا غموض. الغموض نتركه للقراءة.',
  },
  'faq.q1': {
    pt: 'A consulta online funciona mesmo?',
    es: '¿La consulta online realmente funciona?',
    en: 'Does the online reading really work?',
    ar: 'هل الاستشارة أونلاين فعّالة حقاً؟',
  },
  'faq.a1': {
    pt: 'Sim. Você envia os seus dados pelo WhatsApp, Ahmad prepara o café especial aqui em Ilhabela e coloca a folha com as suas informações no líquido para se conectar à sua energia. Depois ele liga por videochamada e a leitura acontece ao vivo — com a mesma profundidade de uma sessão presencial.',
    es: 'Sí. Envías tus datos por WhatsApp, Ahmad prepara el café especial en Ilhabela y coloca la hoja con tu información en el líquido para conectar con tu energía. Después te llama por videollamada y la lectura ocurre en vivo — con la misma profundidad que una sesión presencial.',
    en: 'Yes. You send your details via WhatsApp, Ahmad prepares the special coffee in Ilhabela and places the sheet with your information into the liquid to connect with your energy. Then he calls you on video and the reading happens live — with the same depth as an in-person session.',
    ar: 'نعم. ترسل معلوماتك عبر واتساب، ويحضّر أحمد القهوة الخاصة هنا في كوكايا ويضع ورقة بياناتك في الفنجان للاتصال بطاقتك. بعدها يتصل بك محادثة فيديو وتتم القراءة مباشرة — بنفس عمق الجلسة الحضورية.',
  },
  'faq.q2': {
    pt: 'Quanto tempo dura uma leitura?',
    es: '¿Cuánto dura una lectura?',
    en: 'How long does a reading take?',
    ar: 'كم تستغرق القراءة؟',
  },
  'faq.a2': {
    pt: 'Entre 30 e 45 minutos, sem pressa. Há tempo para a interpretação completa — da borda ao fundo da xícara — e para todas as suas perguntas.',
    es: 'Entre 30 y 45 minutos, sin prisa. Hay tiempo para la interpretación completa — del borde al fondo de la taza — y para todas tus preguntas.',
    en: 'Between 30 and 45 minutes, unhurried. There is time for the full interpretation — from the rim to the bottom of the cup — and for all of your questions.',
    ar: 'بين ٣٠ و٤٥ دقيقة، دون استعجال. هناك وقت للتفسير الكامل — من حافة الفنجان إلى قاعه — ولكل أسئلتك.',
  },
  'faq.q3': {
    pt: 'O que eu preciso preparar?',
    es: '¿Qué necesito preparar?',
    en: 'What do I need to prepare?',
    ar: 'ماذا أحتاج أن أحضّر؟',
  },
  'faq.a3': {
    pt: 'Presencial: apenas a sua presença e as suas perguntas. Online: nome completo e data de nascimento, dos seus pais também, e o seu bairro, cidade, estado e país. Nada mais — o resto é com a xícara.',
    es: 'Presencial: solo tu presencia y tus preguntas. Online: nombre completo y fecha de nacimiento, también de tus padres, y tu barrio, ciudad, estado y país. Nada más — el resto es cosa de la taza.',
    en: 'In person: just your presence and your questions. Online: your full name and birth date, your parents\' as well, and your neighborhood, city, state and country. Nothing else — the cup takes care of the rest.',
    ar: 'حضورياً: فقط حضورك وأسئلتك. أونلاين: اسمك الكامل وتاريخ ميلادك، وبيانات والديك أيضاً، وحيّك ومدينتك وولايتك وبلدك. لا شيء أكثر — الباقي على الفنجان.',
  },
  'faq.q4': {
    pt: 'Em quais idiomas acontece a leitura?',
    es: '¿En qué idiomas se hace la lectura?',
    en: 'In which languages is the reading done?',
    ar: 'بأي لغات تتم القراءة؟',
  },
  'faq.a4': {
    pt: 'Português, árabe, espanhol ou inglês — você escolhe. Ahmad alterna entre os idiomas naturalmente quando os símbolos pedem.',
    es: 'Portugués, árabe, español o inglés — tú eliges. Ahmad alterna entre los idiomas naturalmente cuando los símbolos lo piden.',
    en: 'Portuguese, Arabic, Spanish or English — your choice. Ahmad switches between languages naturally when the symbols call for it.',
    ar: 'البرتغالية أو العربية أو الإسبانية أو الإنجليزية — أنت تختار. أحمد ينتقل بين اللغات بشكل طبيعي حين تقتضي الرموز ذلك.',
  },
  'faq.q5': {
    pt: 'Quanto custa e como pago?',
    es: '¿Cuánto cuesta y cómo pago?',
    en: 'How much does it cost and how do I pay?',
    ar: 'كم التكلفة وكيف أدفع؟',
  },
  'faq.a5': {
    pt: 'Leituras individuais e consultas online a partir de R$ 300; eventos sob consulta com a assessoria. Você paga por PIX, PayPal ou cartão de crédito/débito via link seguro — tudo combinado pelo WhatsApp, sem burocracia.',
    es: 'Lecturas individuales y consultas online desde R$ 300; eventos bajo consulta con la asesoría. Pagas por PIX, PayPal o tarjeta de crédito/débito mediante un enlace seguro — todo se coordina por WhatsApp, sin burocracia.',
    en: 'Individual readings and online consultations from R$ 300; events on request via the press office. Pay by PIX, PayPal or credit/debit card via a secure link — everything arranged over WhatsApp, no bureaucracy.',
    ar: 'القراءات الفردية والاستشارات أونلاين ابتداءً من ٣٠٠ ريال برازيلي؛ المناسبات حسب الاتفاق مع المكتب الصحفي. تدفع عبر PIX أو PayPal أو بطاقة ائتمان/خصم برابط آمن — كل شيء يُرتَّب عبر واتساب دون تعقيد.',
  },
  'faq.q6': {
    pt: 'Como agendo a minha leitura?',
    es: '¿Cómo agendo mi lectura?',
    en: 'How do I book my reading?',
    ar: 'كيف أحجز قراءتي؟',
  },
  'faq.a6': {
    pt: 'Pelo formulário aqui do site ou direto no WhatsApp +55 12 98805-1401. Você escolhe data e horário preferidos, e a confirmação chega rapidinho — geralmente no mesmo dia.',
    es: 'Por el formulario aquí del sitio o directo en el WhatsApp +55 12 98805-1401. Eliges fecha y horario preferidos, y la confirmación llega rapidito — generalmente el mismo día.',
    en: 'Through the form here on the site or directly on WhatsApp +55 12 98805-1401. You pick your preferred date and time, and confirmation arrives quickly — usually the same day.',
    ar: 'عبر النموذج هنا في الموقع أو مباشرة على واتساب ‎+55 12 98805-1401. تختار التاريخ والوقت المفضلين، ويصلك التأكيد سريعاً — غالباً في نفس اليوم.',
  },
  'footer.tagline': {
    pt: 'O que o futuro guarda, a borra de café revela.',
    es: 'Lo que el futuro guarda, los posos del café lo revelan.',
    en: 'What the future holds, the coffee grounds reveal.',
    ar: 'ما يخبئه المستقبل، يكشفه تفل القهوة.',
  },
  'footer.location': {
    pt: 'Ilhabela · SP · Brasil',
    es: 'Ilhabela · SP · Brasil',
    en: 'Ilhabela · SP · Brazil',
    ar: 'كوكايا · إيلابيلا · ساو باولو · البرازيل',
  },
  'footer.rights': {
    pt: 'Todos os direitos reservados.',
    es: 'Todos los derechos reservados.',
    en: 'All rights reserved.',
    ar: 'جميع الحقوق محفوظة.',
  },
  'footer.developedBy': {
    pt: 'Desenvolvido por',
    es: 'Desarrollado por',
    en: 'Developed by',
    ar: 'تطوير',
  },
  'rules.link': {
    pt: 'Informações importantes — Regras da casa',
    es: 'Información importante — Reglas de la casa',
    en: 'Important information — House rules',
    ar: 'معلومات مهمة — قواعد الدار',
  },
  'rules.title': {
    pt: 'Informações importantes',
    es: 'Información importante',
    en: 'Important information',
    ar: 'معلومات مهمة',
  },
  'rules.subtitle': {
    pt: 'Regras da casa',
    es: 'Reglas de la casa',
    en: 'House rules',
    ar: 'قواعد الدار',
  },
  'rules.r1': {
    pt: 'A leitura da borra de café é um ritual de interpretação simbólica e espiritual. Ela não substitui orientação médica, psicológica, jurídica ou financeira profissional.',
    es: 'La lectura de los posos del café es un ritual de interpretación simbólica y espiritual. No sustituye orientación médica, psicológica, jurídica o financiera profesional.',
    en: 'Coffee-ground reading is a ritual of symbolic and spiritual interpretation. It does not replace professional medical, psychological, legal or financial advice.',
    ar: 'قراءة تفل القهوة طقسٌ للتفسير الرمزي والروحي. وهي لا تغني عن الاستشارة الطبية أو النفسية أو القانونية أو المالية المتخصصة.',
  },
  'rules.r2': {
    pt: 'O agendamento só é confirmado mediante pagamento antecipado. Sem a confirmação do pagamento, o horário pode ser liberado para outra pessoa.',
    es: 'La cita solo se confirma mediante pago anticipado. Sin la confirmación del pago, el horario puede liberarse para otra persona.',
    en: 'The booking is only confirmed upon advance payment. Without payment confirmation, the time slot may be released to someone else.',
    ar: 'لا يُؤكَّد الحجز إلا بالدفع المسبق. ومن دون تأكيد الدفع قد يُفسَح الموعد لشخص آخر.',
  },
  'rules.r3': {
    pt: 'Remarcações devem ser solicitadas com pelo menos 24 horas de antecedência pelo WhatsApp. Em caso de não comparecimento sem aviso, o valor não é reembolsado.',
    es: 'Las reprogramaciones deben solicitarse con al menos 24 horas de antelación por WhatsApp. En caso de no asistir sin aviso, el valor no se reembolsa.',
    en: 'Rescheduling must be requested at least 24 hours in advance via WhatsApp. In case of a no-show without notice, the amount is non-refundable.',
    ar: 'يجب طلب إعادة الجدولة قبل ٢٤ ساعة على الأقل عبر واتساب. وفي حال عدم الحضور من دون إشعار، لا يُسترد المبلغ.',
  },
  'rules.r4': {
    pt: 'Tudo o que é dito na leitura é confidencial. Da mesma forma, pedimos que você não grave nem divulgue a sessão sem autorização.',
    es: 'Todo lo que se dice en la lectura es confidencial. Asimismo, te pedimos que no grabes ni divulgues la sesión sin autorización.',
    en: 'Everything said during the reading is confidential. Likewise, we ask that you do not record or share the session without permission.',
    ar: 'كل ما يُقال في القراءة سرّي تماماً. وبالمثل نرجو منك عدم تسجيل الجلسة أو نشرها من دون إذن.',
  },
  'rules.r5': {
    pt: 'Nas leituras à distância, os dados pessoais enviados (nome completo, datas de nascimento e local) são usados exclusivamente para a preparação do ritual e não são compartilhados com terceiros.',
    es: 'En las lecturas a distancia, los datos personales enviados (nombre completo, fechas de nacimiento y lugar) se utilizan exclusivamente para la preparación del ritual y no se comparten con terceros.',
    en: 'For remote readings, the personal data you send (full name, birth dates and location) is used exclusively to prepare the ritual and is never shared with third parties.',
    ar: 'في القراءات عن بُعد، تُستخدَم البيانات الشخصية المُرسَلة (الاسم الكامل وتواريخ الميلاد والمكان) حصرياً لتحضير الطقس ولا تُشارَك مع أي طرف ثالث.',
  },
  'rules.r6': {
    pt: 'Atendimento a partir dos 18 anos. Menores somente acompanhados e com consentimento dos responsáveis.',
    es: 'Atención a partir de los 18 años. Menores solo acompañados y con consentimiento de sus responsables.',
    en: 'Readings are available from 18 years of age. Minors only when accompanied and with their guardians\u2019 consent.',
    ar: 'القراءة متاحة من عمر ١٨ عاماً فما فوق. القاصرون فقط بمرافقة ذويهم وبموافقتهم.',
  },
  'rules.r7': {
    pt: 'Chegue com a mente aberta e, se possível, alguns minutos antes do horário — o café é preparado na hora, especialmente para você.',
    es: 'Llega con la mente abierta y, si puedes, unos minutos antes de la hora — el café se prepara al momento, especialmente para ti.',
    en: 'Come with an open mind and, if possible, a few minutes early — the coffee is brewed on the spot, especially for you.',
    ar: 'تعال بذهن مفتوح، وإن أمكن قبل الموعد ببضع دقائق — فالقهوة تُحضَّر في الحال، خصيصاً لك.',
  },
  'rules.close': {
    pt: 'Entendi',
    es: 'Entendido',
    en: 'Got it',
    ar: 'فهمت',
  },
} as const

export { dict }
export type TKey = keyof typeof dict
export const ALL_KEYS = Object.keys(dict) as TKey[]

interface LangCtx {
  lang: Lang
  setLang: (l: Lang) => void
  t: (k: TKey) => string
  overrides: Record<string, string>
}

const Ctx = createContext<LangCtx | null>(null)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>('pt')

  const setLang = (l: Lang) => setLangState(l)

  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'
    document.documentElement.lang = lang === 'ar' ? 'ar' : lang === 'pt' ? 'pt-BR' : lang
  }, [lang])
  const [overrides, setOverrides] = useState<Record<string, string>>({})

  useEffect(() => {
    let cancelled = false
    fetch('/api/trpc/content.list')
      .then((r) => r.json())
      .then((data) => {
        const map = data?.result?.data?.json
        if (!cancelled && map && typeof map === 'object') setOverrides(map)
      })
      .catch(() => {})
    return () => { cancelled = true }
  }, [])

  // global style overrides from the admin panel (colors, typography)
  useEffect(() => {
    const ID = 'site-style-overrides'
    let el = document.getElementById(ID) as HTMLStyleElement | null
    if (!el) {
      el = document.createElement('style')
      el.id = ID
      document.head.appendChild(el)
    }
    const gold = overrides['style.color.gold']
    const goldSoft = overrides['style.color.goldSoft']
    const cream = overrides['style.color.cream']
    const beige = overrides['style.color.beige']
    const bg = overrides['style.color.bg']
    const ff = overrides['style.font.family']
    const fbase = overrides['style.font.base']
    const h1scale = parseFloat(overrides['style.font.h1'] || '1') || 1
    const rules: string[] = []
    if (bg) rules.push(`body { background-color: ${bg} !important; }`)
    if (gold) rules.push(`a { } :root { --gold-override: ${gold}; }`)
    if (ff) rules.push(`body, p, span, div, button, input, textarea, select, h1, h2, h3, h4, h5, h6, a, li, code { font-family: ${ff} !important; }`)
    if (fbase) rules.push(`body { font-size: ${fbase}; }`)
    if (h1scale !== 1) rules.push(`h1 { scale: ${h1scale}; } h2 { scale: ${Math.min(h1scale, 1.15)}; }`)
    void goldSoft; void cream; void beige
    el.textContent = rules.join('\n')
  }, [overrides])

  const t = (k: TKey) => overrides[`${k}.${lang}`] ?? dict[k][lang]
  return <Ctx.Provider value={{ lang, setLang, t, overrides }}>{children}</Ctx.Provider>
}

export function useLang(): LangCtx {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useLang must be used inside LanguageProvider')
  return ctx
}
