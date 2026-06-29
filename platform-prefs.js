/* ============================================================
   InstaSpace Platform — shared preferences + i18n engine
   Included by every surface (hub, web app, PM portal, admin).
   Persists language (with RTL), currency, theme, density to
   localStorage under 'instaspace-prefs' and applies them to
   <html> so all linked modules stay in sync across tabs.
   ============================================================ */
(function(){
'use strict';

var LS_KEY = 'instaspace-prefs';

/* ---------- supported languages (global, region-neutral set) ---------- */
var LANGS = [
  { code:'en', label:'English',     native:'English',     dir:'ltr', flag:'EN' },
  { code:'ar', label:'Arabic',      native:'العربية',      dir:'rtl', flag:'ع' },
  { code:'fr', label:'French',      native:'Français',    dir:'ltr', flag:'FR' },
  { code:'es', label:'Spanish',     native:'Español',     dir:'ltr', flag:'ES' },
  { code:'ur', label:'Urdu',        native:'اردو',         dir:'rtl', flag:'اُ' },
  { code:'az', label:'Azerbaijani', native:'Azərbaycan',  dir:'ltr', flag:'AZ' },
  { code:'tr', label:'Turkish',     native:'Türkçe',      dir:'ltr', flag:'TR' },
  { code:'zh', label:'Chinese',     native:'中文',         dir:'ltr', flag:'中' }
];

/* ---------- currencies (multi-market) ---------- */
var CURRENCIES = [
  { code:'USD', sym:'$',     name:'US Dollar' },
  { code:'EUR', sym:'€',     name:'Euro' },
  { code:'GBP', sym:'£',     name:'Pound' },
  { code:'AED', sym:'AED ',  name:'Dirham' },
  { code:'SAR', sym:'SAR ',  name:'Riyal' },
  { code:'PKR', sym:'PKR ',  name:'Rupee' },
  { code:'TRY', sym:'₺',     name:'Lira' },
  { code:'AZN', sym:'₼',     name:'Manat' }
];

/* ---------- translation dictionary (core shell + hub strings) ----------
   Keyed by id. English is the source of truth; missing keys fall back. */
var DICT = {
  en:{
    tagline:'Instant booking and settlement for verified spaces.',
    subtag:'Book residential, commercial, and industrial spaces anywhere, with identity, compliance, and payment all proven before the keys change hands.',
    choose:'Choose your workspace',
    chooseSub:'One platform, four connected ways in. Your identity, wallet, and verified spaces follow you across every one.',
    enter:'Enter',
    open:'Open',
    guest:'Guest', host:'Host', manager:'Property Manager', admin:'Admin & Ops',
    guestDesc:'Discover, book, and check in to verified spaces with funds protected until arrival.',
    hostDesc:'List your space, set smart pricing, and get paid the moment a guest checks in.',
    managerDesc:'Run portfolios for owners across markets, with one inbox, ledger, and compliance view.',
    adminDesc:'Verify identity and listings, resolve disputes, and oversee compliance platform-wide.',
    modules:'Linked modules',
    modulesSub:'Every workspace draws on the same trust infrastructure.',
    instapass:'InstaPass', instapassD:'Verified identity, once. Reused everywhere.',
    govshield:'GovShield', govshieldD:'Legal right to lease, checked by category.',
    aiyield:'AI-Yield', aiyieldD:'Smart pricing that adapts to demand.',
    wallet:'Wallet & Settlement', walletD:'Escrow held, released the instant check-in is proven.',
    disputes:'Disputes', disputesD:'Evidence-based resolution, both sides protected.',
    auditor:'AI-Auditor', auditorD:'Condition verified at check-in and checkout.',
    prefs:'Preferences', language:'Language', currency:'Currency', theme:'Theme', density:'Density',
    light:'Light', dark:'Dark', comfortable:'Comfortable', compact:'Compact',
    home:'Home', browse:'Browse', properties:'Properties', messages:'Messages',
    account:'Account', trips:'My trips', settings:'Settings', help:'Help',
    backHub:'Platform', getStarted:'Get started', signIn:'Sign in', deployReady:'Deploy ready',
    howItWorks:'How it works', step1:'Verify once', step1d:'Prove identity and rights with InstaPass and GovShield.',
    step2:'Book or list', step2d:'Reserve a space or publish one in minutes.',
    step3:'Hold in escrow', step3d:'Funds are protected until check-in is proven.',
    step4:'Settle instantly', step4d:'Payment releases the moment AI-Auditor confirms arrival.',
    everyType:'Every type of space', residential:'Residential', commercial:'Commercial', industrial:'Industrial',
    residentialD:'Homes, apartments, and serviced stays.',
    commercialD:'Offices, retail, and co-working suites.',
    industrialD:'Warehouses, logistics bays, and storage.'
  },
  ar:{
    tagline:'حجز وتسوية فورية للمساحات الموثّقة.',
    subtag:'احجز مساحات سكنية وتجارية وصناعية في أي مكان، مع التحقق من الهوية والامتثال والدفع قبل تسليم المفاتيح.',
    choose:'اختر مساحة عملك', chooseSub:'منصة واحدة، أربع طرق متصلة للدخول. هويتك ومحفظتك ومساحاتك الموثّقة معك في كل مكان.',
    enter:'دخول', open:'فتح',
    guest:'ضيف', host:'مضيف', manager:'مدير عقارات', admin:'الإدارة والتشغيل',
    guestDesc:'اكتشف واحجز وسجّل الدخول لمساحات موثّقة مع حماية الأموال حتى الوصول.',
    hostDesc:'أدرج مساحتك، حدّد تسعيرًا ذكيًا، واحصل على أموالك لحظة تسجيل دخول الضيف.',
    managerDesc:'أدر محافظ الملاك عبر الأسواق، بصندوق وارد ودفتر أستاذ وامتثال موحّد.',
    adminDesc:'تحقق من الهوية والقوائم، وحلّ النزاعات، وأشرف على الامتثال على مستوى المنصة.',
    modules:'وحدات مترابطة', modulesSub:'كل مساحة عمل تعتمد على البنية ذاتها للثقة.',
    instapass:'إنستا باس', instapassD:'هوية موثّقة مرة واحدة. تُستخدم في كل مكان.',
    govshield:'جوف شيلد', govshieldD:'الحق القانوني في التأجير، مُتحقَّق حسب الفئة.',
    aiyield:'العائد الذكي', aiyieldD:'تسعير ذكي يتكيّف مع الطلب.',
    wallet:'المحفظة والتسوية', walletD:'الضمان محتجز، يُحرَّر لحظة إثبات تسجيل الدخول.',
    disputes:'النزاعات', disputesD:'حل قائم على الأدلة، يحمي الطرفين.',
    auditor:'المدقق الذكي', auditorD:'التحقق من الحالة عند الدخول والخروج.',
    prefs:'التفضيلات', language:'اللغة', currency:'العملة', theme:'المظهر', density:'الكثافة',
    light:'فاتح', dark:'داكن', comfortable:'مريح', compact:'مضغوط',
    home:'الرئيسية', browse:'تصفّح', properties:'العقارات', messages:'الرسائل',
    account:'الحساب', trips:'رحلاتي', settings:'الإعدادات', help:'مساعدة',
    backHub:'المنصة', getStarted:'ابدأ الآن', signIn:'تسجيل الدخول', deployReady:'جاهز للنشر',
    howItWorks:'كيف تعمل', step1:'تحقق مرة واحدة', step1d:'أثبت الهوية والحقوق عبر إنستا باس وجوف شيلد.',
    step2:'احجز أو أدرج', step2d:'احجز مساحة أو انشر واحدة خلال دقائق.',
    step3:'احتجاز بالضمان', step3d:'الأموال محمية حتى إثبات تسجيل الدخول.',
    step4:'تسوية فورية', step4d:'يُحرَّر الدفع لحظة تأكيد الوصول.',
    everyType:'كل أنواع المساحات', residential:'سكني', commercial:'تجاري', industrial:'صناعي',
    residentialD:'منازل وشقق وإقامات مخدومة.', commercialD:'مكاتب ومتاجر ومساحات عمل مشتركة.',
    industrialD:'مستودعات وأرصفة لوجستية وتخزين.'
  },
  fr:{
    tagline:'Réservation et règlement instantanés d’espaces vérifiés.',
    subtag:'Réservez des espaces résidentiels, commerciaux et industriels partout, avec identité, conformité et paiement prouvés avant la remise des clés.',
    choose:'Choisissez votre espace de travail', chooseSub:'Une plateforme, quatre accès connectés. Votre identité, portefeuille et espaces vérifiés vous suivent partout.',
    enter:'Entrer', open:'Ouvrir',
    guest:'Voyageur', host:'Hôte', manager:'Gestionnaire', admin:'Admin & Ops',
    guestDesc:'Découvrez, réservez et arrivez dans des espaces vérifiés, fonds protégés jusqu’à l’arrivée.',
    hostDesc:'Publiez votre espace, fixez un prix intelligent et soyez payé dès l’arrivée du voyageur.',
    managerDesc:'Gérez des portefeuilles pour les propriétaires, avec une boîte, un grand livre et une conformité uniques.',
    adminDesc:'Vérifiez identités et annonces, résolvez les litiges et supervisez la conformité.',
    modules:'Modules liés', modulesSub:'Chaque espace s’appuie sur la même infrastructure de confiance.',
    instapass:'InstaPass', instapassD:'Identité vérifiée une fois. Réutilisée partout.',
    govshield:'GovShield', govshieldD:'Droit légal de louer, vérifié par catégorie.',
    aiyield:'AI-Yield', aiyieldD:'Tarification intelligente adaptée à la demande.',
    wallet:'Portefeuille & Règlement', walletD:'Séquestre libéré dès l’arrivée prouvée.',
    disputes:'Litiges', disputesD:'Résolution fondée sur les preuves, deux parties protégées.',
    auditor:'AI-Auditor', auditorD:'État vérifié à l’arrivée et au départ.',
    prefs:'Préférences', language:'Langue', currency:'Devise', theme:'Thème', density:'Densité',
    light:'Clair', dark:'Sombre', comfortable:'Confortable', compact:'Compact',
    home:'Accueil', browse:'Explorer', properties:'Biens', messages:'Messages',
    account:'Compte', trips:'Mes séjours', settings:'Réglages', help:'Aide',
    backHub:'Plateforme', getStarted:'Commencer', signIn:'Connexion', deployReady:'Prêt à déployer',
    howItWorks:'Comment ça marche', step1:'Vérifiez une fois', step1d:'Prouvez identité et droits via InstaPass et GovShield.',
    step2:'Réservez ou publiez', step2d:'Réservez un espace ou publiez-en un en minutes.',
    step3:'Séquestre', step3d:'Les fonds sont protégés jusqu’à l’arrivée prouvée.',
    step4:'Règlement instantané', step4d:'Le paiement se libère dès la confirmation d’arrivée.',
    everyType:'Tous types d’espaces', residential:'Résidentiel', commercial:'Commercial', industrial:'Industriel',
    residentialD:'Logements, appartements et séjours services.', commercialD:'Bureaux, commerces et coworking.',
    industrialD:'Entrepôts, quais logistiques et stockage.'
  },
  es:{
    tagline:'Reserva y liquidación instantáneas de espacios verificados.',
    subtag:'Reserva espacios residenciales, comerciales e industriales en cualquier lugar, con identidad, cumplimiento y pago probados antes de entregar las llaves.',
    choose:'Elige tu espacio de trabajo', chooseSub:'Una plataforma, cuatro accesos conectados. Tu identidad, billetera y espacios verificados te acompañan en todos.',
    enter:'Entrar', open:'Abrir',
    guest:'Huésped', host:'Anfitrión', manager:'Gestor', admin:'Admin y Ops',
    guestDesc:'Descubre, reserva y llega a espacios verificados con fondos protegidos hasta la llegada.',
    hostDesc:'Publica tu espacio, fija precios inteligentes y cobra al instante del check-in.',
    managerDesc:'Gestiona carteras para propietarios, con una bandeja, libro mayor y cumplimiento únicos.',
    adminDesc:'Verifica identidad y anuncios, resuelve disputas y supervisa el cumplimiento.',
    modules:'Módulos enlazados', modulesSub:'Cada espacio usa la misma infraestructura de confianza.',
    instapass:'InstaPass', instapassD:'Identidad verificada una vez. Reutilizada en todo.',
    govshield:'GovShield', govshieldD:'Derecho legal a arrendar, verificado por categoría.',
    aiyield:'AI-Yield', aiyieldD:'Precios inteligentes que se adaptan a la demanda.',
    wallet:'Billetera y Liquidación', walletD:'Depósito liberado al probar el check-in.',
    disputes:'Disputas', disputesD:'Resolución con pruebas, ambas partes protegidas.',
    auditor:'AI-Auditor', auditorD:'Estado verificado en entrada y salida.',
    prefs:'Preferencias', language:'Idioma', currency:'Moneda', theme:'Tema', density:'Densidad',
    light:'Claro', dark:'Oscuro', comfortable:'Cómodo', compact:'Compacto',
    home:'Inicio', browse:'Explorar', properties:'Propiedades', messages:'Mensajes',
    account:'Cuenta', trips:'Mis viajes', settings:'Ajustes', help:'Ayuda',
    backHub:'Plataforma', getStarted:'Empezar', signIn:'Entrar', deployReady:'Listo para desplegar',
    howItWorks:'Cómo funciona', step1:'Verifica una vez', step1d:'Prueba identidad y derechos con InstaPass y GovShield.',
    step2:'Reserva o publica', step2d:'Reserva un espacio o publica uno en minutos.',
    step3:'Depósito en garantía', step3d:'Los fondos están protegidos hasta probar el check-in.',
    step4:'Liquidación instantánea', step4d:'El pago se libera al confirmar la llegada.',
    everyType:'Todo tipo de espacios', residential:'Residencial', commercial:'Comercial', industrial:'Industrial',
    residentialD:'Casas, apartamentos y estancias con servicio.', commercialD:'Oficinas, comercios y coworking.',
    industrialD:'Almacenes, muelles logísticos y depósito.'
  },
  ur:{
    tagline:'تصدیق شدہ جگہوں کی فوری بکنگ اور تصفیہ۔',
    subtag:'ہر جگہ رہائشی، تجارتی اور صنعتی مقامات بک کریں، شناخت، تعمیل اور ادائیگی چابیاں سونپنے سے پہلے ثابت۔',
    choose:'اپنا ورک اسپیس منتخب کریں', chooseSub:'ایک پلیٹ فارم، چار جڑے ہوئے راستے۔ آپ کی شناخت، والٹ اور تصدیق شدہ جگہیں ہر جگہ ساتھ۔',
    enter:'داخل ہوں', open:'کھولیں',
    guest:'مہمان', host:'میزبان', manager:'پراپرٹی منیجر', admin:'ایڈمن و آپریشنز',
    guestDesc:'تصدیق شدہ جگہیں دریافت کریں، بک کریں اور چیک اِن کریں، آمد تک رقم محفوظ۔',
    hostDesc:'اپنی جگہ درج کریں، ذہین قیمت مقرر کریں، مہمان کے چیک اِن پر ادائیگی پائیں۔',
    managerDesc:'مالکان کے پورٹ فولیو چلائیں، ایک اِن باکس، لیجر اور تعمیل کے ساتھ۔',
    adminDesc:'شناخت اور فہرستوں کی تصدیق، تنازعات حل کریں اور تعمیل کی نگرانی کریں۔',
    modules:'منسلک ماڈیولز', modulesSub:'ہر ورک اسپیس ایک ہی اعتماد کے ڈھانچے پر چلتا ہے۔',
    instapass:'انسٹا پاس', instapassD:'ایک بار تصدیق شدہ شناخت۔ ہر جگہ استعمال۔',
    govshield:'گَوو شیلڈ', govshieldD:'کرایہ دینے کا قانونی حق، زمرے کے مطابق جانچ۔',
    aiyield:'اے آئی ییلڈ', aiyieldD:'ذہین قیمت جو طلب کے مطابق ڈھلے۔',
    wallet:'والٹ اور تصفیہ', walletD:'ایسکرو محفوظ، چیک اِن ثابت ہوتے ہی جاری۔',
    disputes:'تنازعات', disputesD:'شواہد پر مبنی حل، دونوں فریق محفوظ۔',
    auditor:'اے آئی آڈیٹر', auditorD:'چیک اِن اور چیک آؤٹ پر حالت کی تصدیق۔',
    prefs:'ترجیحات', language:'زبان', currency:'کرنسی', theme:'تھیم', density:'کثافت',
    light:'روشن', dark:'گہرا', comfortable:'آرام دہ', compact:'مختصر',
    home:'ہوم', browse:'تلاش', properties:'جائیدادیں', messages:'پیغامات',
    account:'اکاؤنٹ', trips:'میرے سفر', settings:'ترتیبات', help:'مدد',
    backHub:'پلیٹ فارم', getStarted:'شروع کریں', signIn:'سائن اِن', deployReady:'تعیناتی کے لیے تیار',
    howItWorks:'یہ کیسے کام کرتا ہے', step1:'ایک بار تصدیق', step1d:'انسٹا پاس اور گَوو شیلڈ سے شناخت و حقوق ثابت کریں۔',
    step2:'بک کریں یا درج کریں', step2d:'منٹوں میں جگہ بک کریں یا شائع کریں۔',
    step3:'ایسکرو میں محفوظ', step3d:'چیک اِن ثابت ہونے تک رقم محفوظ۔',
    step4:'فوری تصفیہ', step4d:'آمد کی تصدیق پر ادائیگی جاری۔',
    everyType:'ہر قسم کی جگہ', residential:'رہائشی', commercial:'تجارتی', industrial:'صنعتی',
    residentialD:'گھر، اپارٹمنٹ اور سروسڈ قیام۔', commercialD:'دفاتر، ریٹیل اور کو ورکنگ۔',
    industrialD:'گودام، لاجسٹکس بے اور اسٹوریج۔'
  },
  az:{
    tagline:'Təsdiqlənmiş məkanlar üçün ani rezervasiya və hesablaşma.',
    subtag:'İstənilən yerdə yaşayış, kommersiya və sənaye məkanlarını bron edin; şəxsiyyət, uyğunluq və ödəniş açarlar təhvil verilməzdən əvvəl təsdiqlənir.',
    choose:'İş sahənizi seçin', chooseSub:'Bir platforma, dörd əlaqəli giriş. Şəxsiyyətiniz, pul kisəniz və təsdiqlənmiş məkanlar hər yerdə sizinlədir.',
    enter:'Daxil ol', open:'Aç',
    guest:'Qonaq', host:'Ev sahibi', manager:'Əmlak meneceri', admin:'Admin və Əməliyyat',
    guestDesc:'Təsdiqlənmiş məkanları kəşf edin, bron edin və daxil olun, vəsait gələnə qədər qorunur.',
    hostDesc:'Məkanınızı yerləşdirin, ağıllı qiymət təyin edin və qonaq daxil olan an ödəniş alın.',
    managerDesc:'Sahiblər üçün portfelləri idarə edin; bir gələn qutusu, mühasibat və uyğunluq.',
    adminDesc:'Şəxsiyyət və elanları yoxlayın, mübahisələri həll edin və uyğunluğa nəzarət edin.',
    modules:'Əlaqəli modullar', modulesSub:'Hər iş sahəsi eyni etibar infrastrukturuna əsaslanır.',
    instapass:'InstaPass', instapassD:'Bir dəfə təsdiqlənmiş şəxsiyyət. Hər yerdə istifadə.',
    govshield:'GovShield', govshieldD:'İcarə hüququ, kateqoriyaya görə yoxlanılır.',
    aiyield:'AI-Yield', aiyieldD:'Tələbə uyğunlaşan ağıllı qiymət.',
    wallet:'Pul kisəsi və Hesablaşma', walletD:'Eskrow saxlanılır, giriş təsdiqlənən an buraxılır.',
    disputes:'Mübahisələr', disputesD:'Sübuta əsaslanan həll, hər iki tərəf qorunur.',
    auditor:'AI-Auditor', auditorD:'Giriş və çıxışda vəziyyət təsdiqlənir.',
    prefs:'Tənzimləmələr', language:'Dil', currency:'Valyuta', theme:'Tema', density:'Sıxlıq',
    light:'İşıqlı', dark:'Qaranlıq', comfortable:'Rahat', compact:'Yığcam',
    home:'Ana səhifə', browse:'Axtar', properties:'Əmlaklar', messages:'Mesajlar',
    account:'Hesab', trips:'Səfərlərim', settings:'Parametrlər', help:'Kömək',
    backHub:'Platforma', getStarted:'Başla', signIn:'Daxil ol', deployReady:'Yerləşdirməyə hazır',
    howItWorks:'Necə işləyir', step1:'Bir dəfə təsdiqlə', step1d:'InstaPass və GovShield ilə şəxsiyyət və hüquqları təsdiqlə.',
    step2:'Bron et və ya yerləşdir', step2d:'Dəqiqələr içində məkan bron et və ya yerləşdir.',
    step3:'Eskrowda saxla', step3d:'Vəsait giriş təsdiqlənənə qədər qorunur.',
    step4:'Ani hesablaşma', step4d:'Gəliş təsdiqlənən an ödəniş buraxılır.',
    everyType:'Hər növ məkan', residential:'Yaşayış', commercial:'Kommersiya', industrial:'Sənaye',
    residentialD:'Evlər, mənzillər və xidmətli qalmalar.', commercialD:'Ofislər, pərakəndə və koworkinq.',
    industrialD:'Anbarlar, logistika körfəzləri və saxlama.'
  },
  tr:{
    tagline:'Doğrulanmış alanlar için anında rezervasyon ve ödeme.',
    subtag:'Her yerde konut, ticari ve endüstriyel alanları kiralayın; kimlik, uyum ve ödeme anahtarlar teslim edilmeden önce kanıtlanır.',
    choose:'Çalışma alanınızı seçin', chooseSub:'Tek platform, dört bağlı giriş. Kimliğiniz, cüzdanınız ve doğrulanmış alanlarınız her yerde sizinle.',
    enter:'Gir', open:'Aç',
    guest:'Misafir', host:'Ev sahibi', manager:'Mülk Yöneticisi', admin:'Yönetim & Ops',
    guestDesc:'Doğrulanmış alanları keşfedin, kiralayın ve giriş yapın; varışa kadar fonlar korunur.',
    hostDesc:'Alanınızı yayınlayın, akıllı fiyat belirleyin ve misafir giriş yaptığı an ödeme alın.',
    managerDesc:'Sahipler için portföyleri tek gelen kutusu, defter ve uyumla yönetin.',
    adminDesc:'Kimlik ve ilanları doğrulayın, anlaşmazlıkları çözün ve uyumu denetleyin.',
    modules:'Bağlı modüller', modulesSub:'Her çalışma alanı aynı güven altyapısını kullanır.',
    instapass:'InstaPass', instapassD:'Bir kez doğrulanan kimlik. Her yerde kullanılır.',
    govshield:'GovShield', govshieldD:'Kiralama hakkı, kategoriye göre doğrulanır.',
    aiyield:'AI-Yield', aiyieldD:'Talebe uyum sağlayan akıllı fiyatlandırma.',
    wallet:'Cüzdan & Ödeme', walletD:'Emanet, giriş kanıtlandığı an serbest bırakılır.',
    disputes:'Anlaşmazlıklar', disputesD:'Kanıta dayalı çözüm, iki taraf da korunur.',
    auditor:'AI-Auditor', auditorD:'Giriş ve çıkışta durum doğrulanır.',
    prefs:'Tercihler', language:'Dil', currency:'Para birimi', theme:'Tema', density:'Yoğunluk',
    light:'Açık', dark:'Koyu', comfortable:'Rahat', compact:'Sıkışık',
    home:'Ana sayfa', browse:'Keşfet', properties:'Mülkler', messages:'Mesajlar',
    account:'Hesap', trips:'Gezilerim', settings:'Ayarlar', help:'Yardım',
    backHub:'Platform', getStarted:'Başla', signIn:'Giriş', deployReady:'Dağıtıma hazır',
    howItWorks:'Nasıl çalışır', step1:'Bir kez doğrula', step1d:'InstaPass ve GovShield ile kimlik ve hakları kanıtla.',
    step2:'Kirala veya yayınla', step2d:'Dakikalar içinde alan kirala veya yayınla.',
    step3:'Emanette tut', step3d:'Fonlar giriş kanıtlanana dek korunur.',
    step4:'Anında ödeme', step4d:'Varış onaylandığı an ödeme serbest kalır.',
    everyType:'Her tür alan', residential:'Konut', commercial:'Ticari', industrial:'Endüstriyel',
    residentialD:'Evler, daireler ve hizmetli konaklamalar.', commercialD:'Ofisler, perakende ve ortak çalışma.',
    industrialD:'Depolar, lojistik körfezler ve depolama.'
  },
  zh:{
    tagline:'已验证空间的即时预订与结算。',
    subtag:'随时随地预订住宅、商业和工业空间，身份、合规与付款在交付钥匙前全部得到验证。',
    choose:'选择你的工作区', chooseSub:'一个平台，四个互联入口。你的身份、钱包与已验证空间随处相伴。',
    enter:'进入', open:'打开',
    guest:'住客', host:'房东', manager:'物业经理', admin:'管理与运营',
    guestDesc:'发现、预订并入住已验证空间，资金在到达前受保护。',
    hostDesc:'发布空间，设定智能定价，住客入住即收款。',
    managerDesc:'为业主管理跨市场组合，统一收件箱、账本与合规。',
    adminDesc:'验证身份与房源，解决纠纷，全平台监督合规。',
    modules:'关联模块', modulesSub:'每个工作区都基于同一套信任基础设施。',
    instapass:'InstaPass', instapassD:'身份一次验证，处处复用。',
    govshield:'GovShield', govshieldD:'按类别核验出租的合法权利。',
    aiyield:'AI-Yield', aiyieldD:'随需求自适应的智能定价。',
    wallet:'钱包与结算', walletD:'托管资金，入住验证即释放。',
    disputes:'纠纷', disputesD:'基于证据的解决，双方受保护。',
    auditor:'AI-Auditor', auditorD:'入住与退房时验证状况。',
    prefs:'偏好', language:'语言', currency:'货币', theme:'主题', density:'密度',
    light:'浅色', dark:'深色', comfortable:'舒适', compact:'紧凑',
    home:'首页', browse:'浏览', properties:'房产', messages:'消息',
    account:'账户', trips:'我的行程', settings:'设置', help:'帮助',
    backHub:'平台', getStarted:'开始', signIn:'登录', deployReady:'可部署',
    howItWorks:'运作方式', step1:'一次验证', step1d:'用 InstaPass 与 GovShield 证明身份与权利。',
    step2:'预订或发布', step2d:'几分钟内预订或发布空间。',
    step3:'托管保护', step3d:'入住验证前资金受保护。',
    step4:'即时结算', step4d:'到达确认即释放付款。',
    everyType:'各类空间', residential:'住宅', commercial:'商业', industrial:'工业',
    residentialD:'住宅、公寓与服务式公寓。', commercialD:'办公室、零售与联合办公。',
    industrialD:'仓库、物流区与仓储。'
  }
};

/* ---------- store ---------- */
function load(){ try{ var r=localStorage.getItem(LS_KEY); if(r) return JSON.parse(r); }catch(e){} return null; }
var defaults = { lang:'en', currency:'USD', theme:'dark', density:'comfortable' };
var state = Object.assign({}, defaults, load()||{});

function langMeta(code){ for(var i=0;i<LANGS.length;i++){ if(LANGS[i].code===(code||state.lang)) return LANGS[i]; } return LANGS[0]; }
function curMeta(code){ for(var i=0;i<CURRENCIES.length;i++){ if(CURRENCIES[i].code===(code||state.currency)) return CURRENCIES[i]; } return CURRENCIES[0]; }

function t(key){
  var d = DICT[state.lang] || {};
  if(d[key]!=null) return d[key];
  return (DICT.en[key]!=null) ? DICT.en[key] : key;
}

/* apply to <html>: dir, lang, theme, density */
function apply(){
  var meta = langMeta();
  var html = document.documentElement;
  html.setAttribute('lang', meta.code);
  html.setAttribute('dir', meta.dir);
  html.setAttribute('data-theme', state.theme);
  html.setAttribute('data-density', state.density);
}

var listeners = [];
function onChange(fn){ listeners.push(fn); }
function emit(){ listeners.forEach(function(fn){ try{ fn(state); }catch(e){} }); }

function set(patch){
  Object.assign(state, patch);
  try{ localStorage.setItem(LS_KEY, JSON.stringify(state)); }catch(e){}
  apply();
  emit();
}

/* cross-tab sync */
window.addEventListener('storage', function(e){
  if(e.key===LS_KEY && e.newValue){
    try{ state = Object.assign({}, defaults, JSON.parse(e.newValue)); apply(); emit(); }catch(err){}
  }
});

/* money formatter honoring current currency */
function money(n){
  var c = curMeta();
  var s = (Math.round(n)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return c.sym + s;
}

apply();

window.ISPrefs = {
  LANGS:LANGS, CURRENCIES:CURRENCIES,
  get:function(){ return state; },
  set:set, t:t, apply:apply, onChange:onChange,
  langMeta:langMeta, curMeta:curMeta, money:money
};
})();
