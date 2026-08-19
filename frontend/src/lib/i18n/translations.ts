export type Language = "hi" | "en";

export interface Translations {
  // Top Mantra Bar
  mantra: string;
  muhuratText: string;
  verifiedAcharyaBadge: string;

  // Header & Brand
  brandName: string;
  brandTagline: string;
  brandBadge: string;
  navServices: string;
  navPandits: string;
  navHowItWorks: string;
  navSamagri: string;
  navFaq: string;
  btnPanditRegister: string;
  btnBookPuja: string;

  // Hero Section
  heroBadge: string;
  heroTitlePrefix: string;
  heroTitleHighlight: string;
  heroDescription: string;
  searchLabelPuja: string;
  searchLabelCity: string;
  searchLabelDate: string;
  searchBtnText: string;
  trustGurukul: string;
  trustVidhi: string;
  trustSamagri: string;
  trustRating: string;

  // Search options
  pujaOptions: string[];
  cityOptions: string[];

  // Services Section
  servicesSubtitle: string;
  servicesTitle: string;
  servicesDesc: string;
  servicesBtnAll: string;
  dakshinaLabel: string;
  btnBookThisPuja: string;
  services: Array<{
    name: string;
    subName: string;
    category: string;
    duration: string;
    price: string;
    icon: string;
    badge: string;
    description: string;
    samagri: string;
  }>;

  // Pandits Section
  panditsSubtitle: string;
  panditsTitle: string;
  panditsDesc: string;
  verifiedPanditBadge: string;
  expLabel: string;
  gurukulLabel: string;
  langLabel: string;
  locLabel: string;
  specLabel: string;
  yajmanLabel: string;
  btnViewProfile: string;
  pandits: Array<{
    name: string;
    title: string;
    experience: string;
    gurukul: string;
    languages: string[];
    rating: string;
    reviewsCount: number;
    specialization: string;
    location: string;
  }>;

  // How It Works
  howSubtitle: string;
  howTitle: string;
  howSteps: Array<{
    step: string;
    sanskrit: string;
    title: string;
    description: string;
  }>;

  // Why Choose Us
  whySubtitle: string;
  whyTitle: string;
  whyValues: Array<{
    sanskrit: string;
    title: string;
    description: string;
  }>;

  // FAQ
  faqSubtitle: string;
  faqTitle: string;
  faqs: Array<{
    q: string;
    a: string;
  }>;

  // CTA Banner
  ctaShloka: string;
  ctaTitle: string;
  ctaDesc: string;
  ctaBtnPrimary: string;
  ctaBtnSecondary: string;

  // Footer
  footerDesc: string;
  footerMotto: string;
  footerColServices: string;
  footerColSanskars: string;
  footerColSupport: string;
  footerHelpline: string;
  footerEmail: string;
  footerTiming: string;
  footerLocation: string;
  footerBtnJoinPandit: string;
  footerCopyright: string;
  footerPeaceChant: string;
  footerMadeWith: string;
}

export const translations: Record<Language, Translations> = {
  // ==========================================
  // HINDI TRANSLATIONS (हिन्दी)
  // ==========================================
  hi: {
    mantra: "ॐ भूर्भुवः स्वः तत्सवितुर्वरेण्यं भर्गो देवस्य धीमहि धियो यो नः प्रचोदयात्",
    muhuratText: "आज का शुभ मुहूर्त: प्रातः ०६:१४ - १०:४८ | सायं ०४:३० - ०७:१५",
    verifiedAcharyaBadge: "🙏 १००% गुरुकुल प्रमाणित वेदपाठी पंडित जी",

    brandName: "पुरोहितधाम",
    brandTagline: "॥ धर्मो रक्षति रक्षितः ॥ Purohitdham Vedic Marketplace",
    brandBadge: "सनातन सेवा",
    navServices: "पूजा सेवाएं",
    navPandits: "विद्वान पुरोहित",
    navHowItWorks: "कार्यप्रणाली",
    navSamagri: "पवित्र सामग्री",
    navFaq: "प्रश्नोत्तरी",
    btnPanditRegister: "पंडित पंजीकरण",
    btnBookPuja: "पूजा बुक करें",

    heroBadge: "॥ श्री गणेशाय नमः ॥ संपूर्ण वैदिक कर्मकांड एवं शुद्ध अनुष्ठान",
    heroTitlePrefix: "घर बैठे पाएं प्रामाणिक",
    heroTitleHighlight: "वेदपाठी पंडित जी की पावन सेवा",
    heroDescription:
      "गृह प्रवेश, सत्यनारायण कथा, महा रुद्राभिषेक, नवग्रह शांति, विवाह एवं षोडश संस्कार हेतु काशी व हरिद्वार से प्रशिक्षित विद्वान पुरोहितों का सुगम व विश्वसनीय ऑनलाइन वरण।",
    searchLabelPuja: "१. पूजा का चयन करें",
    searchLabelCity: "२. अपना शहर / स्थान",
    searchLabelDate: "३. शुभ तिथि",
    searchBtnText: "उपलब्ध पंडित खोजें →",
    trustGurukul: "१००% गुरुकुल प्रमाणित",
    trustVidhi: "शुद्ध वैदिक विधि-विधान",
    trustSamagri: "शुद्ध सात्विक सामग्री",
    trustRating: "४.९५/५ श्रद्धा रेटिंग",

    pujaOptions: [
      "श्री सत्यनारायण कथा",
      "गृह प्रवेश एवं वास्तु शांति",
      "महा रुद्राभिषेक",
      "नवग्रह शांति हवन",
      "सुंदरकांड पाठ",
      "महामृत्युंजय जप",
      "विवाह संस्कार",
      "नामकरण / मुंडन",
    ],
    cityOptions: [
      "दिल्ली एनसीआर (Delhi NCR)",
      "मुंबई / ठाणे (Mumbai)",
      "बेंगलुरु (Bengaluru)",
      "पुणे (Pune)",
      "अहमदाबाद (Ahmedabad)",
      "वाराणसी (Varanasi)",
      "जयपुर (Jaipur)",
      "लखनऊ (Lucknow)",
    ],

    servicesSubtitle: "सनातन वैदिक अनुष्ठान",
    servicesTitle: "लोकप्रिय पूजा एवं हवन सेवाएं",
    servicesDesc:
      "आपके घर, प्रतिष्ठान एवं मांगलिक अवसरों पर सुख, शांति, स्वास्थ्य और समृद्धि हेतु शास्त्रसम्मत पूजन।",
    servicesBtnAll: "सम्पूर्ण ४०+ पूजा एवं अनुष्ठान सूची देखें →",
    dakshinaLabel: "दक्षिणा",
    btnBookThisPuja: "पंडित जी चुनें एवं बुक करें",
    services: [
      {
        name: "श्री सत्यनारायण व्रत कथा",
        subName: "Shri Satyanarayan Katha",
        category: "सुख-समृद्धि एवं मनोकामना",
        duration: "२.५ - ३ घंटे",
        price: "₹२,१००",
        icon: "🙏",
        badge: "सर्वाधिक लोकप्रिय",
        description:
          "पारिवारिक शांति, आरोग्य एवं धन-धान्य वृद्धि हेतु संपूर्ण विधि-विधान से कथा एवं आरती।",
        samagri: "शुद्ध हवन सामग्री सम्मिलित",
      },
      {
        name: "गृह प्रवेश एवं वास्तु शांति पूजा",
        subName: "Griha Pravesh & Vastu Shanti",
        category: "नवीन गृह शुद्धि",
        duration: "३ - ४ घंटे",
        price: "₹४,१००",
        icon: "🏠",
        badge: "शुभ मुहूर्त विशेष",
        description:
          "द्वार पूजा, वास्तु पुरुष पूजन, नवग्रह हवन, कलश स्थापना एवं गऊ पूजा सहित।",
        samagri: "सम्पूर्ण वैदिक सामग्री",
      },
      {
        name: "महा रुद्राभिषेक एवं शिव पूजन",
        subName: "Maha Rudrabhishek",
        category: "कष्ट निवारण एवं शिव कृपा",
        duration: "२ - ३ घंटे",
        price: "₹३,१००",
        icon: "🔱",
        badge: "सोमवार एवं प्रदोष",
        description:
          "दूध, दही, गंगाजल, पंचामृत एवं भस्म से द्वादश ज्योतिर्लिंग मंत्रोच्चार सहित अभिषेक।",
        samagri: "पंचामृत व बेलपत्र सूची",
      },
      {
        name: "नवग्रह शांति एवं महायज्ञ",
        subName: "Navgrah Shanti Havan",
        category: "ग्रह दोष निवारण",
        duration: "२ - २.५ घंटे",
        price: "₹२,५००",
        icon: "🔥",
        badge: "ग्रह बाधा मुक्ति",
        description:
          "सूर्य, चन्द्र, मंगल आदि नवग्रहों की अनुकूलता एवं शांति हेतु वैदिक समिधा आहुति।",
        samagri: "९ ग्रहों की विशिष्ट समिधा",
      },
      {
        name: "सम्पूर्ण वैदिक विवाह संस्कार",
        subName: "Vivah Sanskar (Wedding)",
        category: "षोडश संस्कार",
        duration: "४ - ६ घंटे",
        price: "₹११,०००",
        icon: "💍",
        badge: "शास्त्रीय विधि",
        description:
          "सप्तपदी, पाणिग्रहण, सिंदूर दान, कन्यादान एवं अग्नि साक्षी विवाह अनुष्ठान।",
        samagri: "वर-वधू संस्कार सूची",
      },
      {
        name: "महामृत्युंजय जप एवं अनुष्ठान",
        subName: "Maha Mrityunjaya Jaap",
        category: "दीर्घायु एवं स्वास्थ्य",
        duration: "विशिष्ट संकल्प",
        price: "₹५,१००",
        icon: "🕉️",
        badge: "संजीवनी महामंत्र",
        description:
          "दीर्घायु, असाध्य रोग मुक्ति एवं अकाल मृत्यु भय निवारणार्थ सवा लाख या एकादश जप।",
        samagri: "रुद्राक्ष माला जप",
      },
      {
        name: "श्री सुंदरकांड पाठ एवं संकीर्तन",
        subName: "Sunderkand & Hanuman Path",
        category: "भय-संकट मुक्ति",
        duration: "२ - ३ घंटे",
        price: "₹२,१००",
        icon: "📖",
        badge: "मंगलवार/शनिवार",
        description:
          "संगीतमय सुंदरकांड पाठ, हनुमान चालीसा, बजरंग बाण एवं महाआरती।",
        samagri: "भोग-प्रसाद व्यवस्था",
      },
      {
        name: "नामकरण एवं मुंडन संस्कार",
        subName: "Naamkaran & Mundan",
        category: "बाल संस्कार",
        duration: "१.५ - २ घंटे",
        price: "₹२,१००",
        icon: "👶",
        badge: "शुभ नक्षत्र",
        description:
          "शिशु के जन्म नक्षत्र अनुसार नामकरण, सूर्य दर्शन एवं शुभ मुंडन संस्कार।",
        samagri: "वैदिक विधि अनुसार",
      },
    ],

    panditsSubtitle: "विद्वान आचार्य परिषद",
    panditsTitle: "हमारे सत्यापित एवं अनुभवी पंडित जी",
    panditsDesc:
      "प्रत्येक पंडित जी की पृष्ठभूमि, गुरुकुल उपाधि एवं कर्मकांड ज्ञान का हमारी विद्वत समिति द्वारा शत-प्रतिशत सत्यापन।",
    verifiedPanditBadge: "✓ सत्यापित आचार्य",
    expLabel: "अनुभव:",
    gurukulLabel: "गुरुकुल:",
    langLabel: "भाषा ज्ञान:",
    locLabel: "कार्यक्षेत्र:",
    specLabel: "मुख्य विशेषज्ञता:",
    yajmanLabel: "यजमान",
    btnViewProfile: "प्रोफ़ाइल देखें",
    pandits: [
      {
        name: "आचार्य पं. विद्याधर शास्त्री",
        title: "शुक्ल यजुर्वेद एवं कर्मकांड मर्मज्ञ",
        experience: "२२+ वर्ष अनुभव",
        gurukul: "सम्पूर्णानन्द संस्कृत विश्वविद्यालय, वाराणसी",
        languages: ["संस्कृत", "हिन्दी", "मैथिली"],
        rating: "४.९८",
        reviewsCount: 340,
        specialization: "गृह प्रवेश, रुद्राभिषेक, विवाह संस्कार",
        location: "दिल्ली एनसीआर / गुरुग्राम",
      },
      {
        name: "पं. देवेन्द्र नारायण चतुर्वेदी",
        title: "सामवेद एवं ज्योतिष विशारद",
        experience: "१८+ वर्ष अनुभव",
        gurukul: "ऋषिकेश वेद पाठशाला",
        languages: ["संस्कृत", "हिन्दी", "गुजराती"],
        rating: "४.९५",
        reviewsCount: 280,
        specialization: "नवग्रह शांति, महामृत्युंजय जप, कालसर्प दोष",
        location: "मुंबई / ठाणे / नवी मुंबई",
      },
      {
        name: "पं. राघवेंद्र दीक्षित जी",
        title: "ऋग्वेद एवं वास्तु शास्त्र आचार्य",
        experience: "१५+ वर्ष अनुभव",
        gurukul: "कांची कामकोटि वेद पाठशाळा",
        languages: ["संस्कृत", "हिन्दी", "मराठी", "तेलुगु"],
        rating: "४.९६",
        reviewsCount: 215,
        specialization: "सत्यनारायण कथा, वास्तु शुद्धि, चंडी पाठ",
        location: "बेंगलुरु / हैदराबाद",
      },
    ],

    howSubtitle: "सुगम कार्यप्रणाली",
    howTitle: "चार सरल चरणों में पूजा सम्पन्न",
    howSteps: [
      {
        step: "१",
        sanskrit: "सङ्कल्प सिद्धि",
        title: "पूजा एवं संकल्प का चयन",
        description: "अपनी आवश्यकतानुसार वैदिक पूजा, हवन या संस्कार सेवा चुनें।",
      },
      {
        step: "२",
        sanskrit: "शुभ मुहूर्त",
        title: "शुभ मुहूर्त व स्थान",
        description:
          "अपनी सुविधानुसार शुभ तिथि, समय और घर/स्थान का पता दर्ज करें।",
      },
      {
        step: "३",
        sanskrit: "विद्वान वरणम्",
        title: "प्रमाणित पंडित जी का चयन",
        description:
          "अपने क्षेत्र के गुरुकुल प्रशिक्षित, अनुभवी वेदपाठी पंडित जी चुनें।",
      },
      {
        step: "४",
        sanskrit: "निर्विघ्न पूजनम्",
        title: "घर पर निर्विघ्न पूजा",
        description:
          "पंडित जी नियत समय पर संपूर्ण वैदिक विधि से पूजा संपन्न कराएंगे।",
      },
    ],

    whySubtitle: "सनातन धर्म निष्ठा",
    whyTitle: "पुरोहितधाम ही क्यों चुनें?",
    whyValues: [
      {
        sanskrit: "वेदोक्त कर्मकाण्ड",
        title: "१००% प्रामाणिक वैदिक परंपरा",
        description:
          "काशी, हरिद्वार और अयोध्या गुरुकुलों से दीक्षित प्रामाणिक विद्वान पंडित जी द्वारा शास्त्रोक्त विधि।",
      },
      {
        sanskrit: "पवित्र द्रव्य संग्रह",
        title: "शुद्ध एवं सात्विक हवन सामग्री",
        description:
          "गाय का शुद्ध घी, पवित्र गंगाजल, प्राकृतिक जड़ी-बूटियाँ एवं अक्षत-रोली की पूर्ण व्यवस्था।",
      },
      {
        sanskrit: "स्पष्ट दक्षिणा नीति",
        title: "पारदर्शी दक्षिणा — कोई छिपा शुल्क नहीं",
        description:
          "पूर्व-निर्धारित एवं उचित दक्षिणा। पूजा के उपरांत किसी भी प्रकार की अतिरिक्त अनचाही मांग नहीं।",
      },
      {
        sanskrit: "कुलरीति संरक्षण",
        title: "गोत्र व कुल परंपरानुसार पूजन",
        description:
          "आपके गोत्र, प्रवर, कुलदेवी/कुलदेवता एवं क्षेत्रीय रीति-रिवाजों के अनुरूप विशेष पूजा संकल्प।",
      },
    ],

    faqSubtitle: "जिज्ञासा समाधान",
    faqTitle: "अक्सर पूछे जाने वाले प्रश्न (FAQ)",
    faqs: [
      {
        q: "क्या पूजा की संपूर्ण सामग्री पुरोहितधाम द्वारा उपलब्ध कराई जाएगी?",
        a: "हाँ। आप 'सामग्री सहित' विकल्प चुन सकते हैं, जिसमें गाय का शुद्ध घी, नवग्रह समिधा, गंगाजल, अक्षत, रोली, कलावा, धूप, दीप आदि संपूर्ण सामग्री पंडित जी स्वयं लाते हैं।",
      },
      {
        q: "पंडित जी का सत्यापन किस प्रकार किया जाता है?",
        a: "हमारे सभी पंडित जी काशी, हरिद्वार, अयोध्या आदि प्रतिष्ठित गुरुकुलों व वेद पाठशालाओं से प्रमाणित होते हैं। उनके अनुभव, वेद ज्ञान एवं प्रमाण पत्रों का भौतिक सत्यापन किया जाता है।",
      },
      {
        q: "क्या मैं अपने गोत्र एवं कुल परंपरा अनुसार पूजा करवा सकता हूँ?",
        a: "बिल्कुल। बुकिंग के समय आप अपना गोत्र, प्रवर, और कुल रीति दर्ज कर सकते हैं। पंडित जी उसी अनुरूप आपका संकल्प व पूजा संपन्न करेंगे।",
      },
      {
        q: "यदि मुझे शुभ मुहूर्त की जानकारी न हो तो क्या सहायता मिलेगी?",
        a: "हाँ, हमारे अनुभवी ज्योतिषाचार्य आपके जन्म विवरण एवं स्थान अनुसार निशुल्क शुद्ध पंचांगीय शुभ मुहूर्त परामर्श प्रदान करते हैं।",
      },
      {
        q: "ऑनलाइन भुगतान कितना सुरक्षित है?",
        a: "शत-प्रतिशत सुरक्षित। आपका भुगतान Razorpay के माध्यम से सुरक्षित रहता है और पूजा निर्विघ्न संपन्न होने के उपरांत ही मान्य होता है।",
      },
    ],

    ctaShloka: "॥ सर्वे भवन्तु सुखिनः सर्वे सन्तु निरामयाः ॥",
    ctaTitle: "आज ही अपने घर लाएं सुख-शांति व देव कृपा",
    ctaDesc:
      "किसी भी धार्मिक अनुष्ठान, कथा या संस्कार हेतु अनुभवी वेदपाठी पुरोहित जी का तुरंत चयन करें।",
    ctaBtnPrimary: "अभी पूजा बुक करें",
    ctaBtnSecondary: "📞 पंडित जी से परामर्श लें",

    footerDesc:
      "सनातन धर्म की पवित्र परंपराओं का संरक्षण एवं प्रामाणिक वैदिक सेवाओं का आधुनिक सेतु। काशी, हरिद्वार व अयोध्या के विद्वान पुरोहितों का विश्वास।",
    footerMotto: "॥ धर्म एव हतो हन्ति धर्मो रक्षति रक्षितः ॥",
    footerColServices: "प्रमुख पूजा अनुष्ठान",
    footerColSanskars: "षोडश संस्कार सेवा",
    footerColSupport: "संपर्क एवं सहायता",
    footerHelpline: "📞 हेल्पलाइन: १८००-XXX-XXXX",
    footerEmail: "📧 ईमेल: acharya@purohitdham.com",
    footerTiming: "⏰ सेवा समय: प्रातः ६:०० से सायं ९:००",
    footerLocation: "📍 मुख्य केंद्र: वाराणसी / दिल्ली एनसीआर",
    footerBtnJoinPandit: "पंडित जी के रूप में जुड़ें",
    footerCopyright: "© २०२६ पुरोहितधाम (Purohitdham). सर्वाधिकार सुरक्षित।",
    footerPeaceChant: "॥ ॐ शान्तिः शान्तिः शान्तिः ॥",
    footerMadeWith: "Made with 🙏 for Sanatan Dharma",
  },

  // ==========================================
  // ENGLISH TRANSLATIONS (English)
  // ==========================================
  en: {
    mantra: "Om Bhūr Bhuvaḥ Svaḥ Tat-Savitur Vareṇyaṁ Bhargo Devasya Dhīmahi Dhiyo Yo Naḥ Prachodayāt",
    muhuratText: "Shubh Muhurat: 06:14 AM - 10:48 AM | 04:30 PM - 07:15 PM",
    verifiedAcharyaBadge: "🙏 100% Gurukul-Certified Pandits",

    brandName: "Purohitdham",
    brandTagline: "॥ Dharmo Rakshati Rakshitah ॥ Vedic & Puja Services",
    brandBadge: "Sanatan Seva",
    navServices: "Puja Services",
    navPandits: "Verified Pandits",
    navHowItWorks: "How It Works",
    navSamagri: "Pure Samagri",
    navFaq: "FAQ",
    btnPanditRegister: "Join as Pandit",
    btnBookPuja: "Book a Pandit",

    heroBadge: "॥ Shree Ganeshay Namah ॥ 100% Authentic Vedic Rituals",
    heroTitlePrefix: "Book Verified & Trusted",
    heroTitleHighlight: "Vedic Pandit Ji at Your Doorstep",
    heroDescription:
      "Simple, reliable online booking of learned Purohits trained in Varanasi, Haridwar & Rishikesh Gurukuls for Griha Pravesh, Satyanarayan Katha, Maha Rudrabhishek, Navgrah Shanti, Vivah and all 16 Sanskars.",
    searchLabelPuja: "1. Select Puja Service",
    searchLabelCity: "2. Your City / Location",
    searchLabelDate: "3. Auspicious Date",
    searchBtnText: "Find Available Pandits →",
    trustGurukul: "100% Gurukul Certified",
    trustVidhi: "Authentic Vedic Vidhi",
    trustSamagri: "Pure & Organic Samagri",
    trustRating: "4.95/5 Devotion Rating",

    pujaOptions: [
      "Shri Satyanarayan Katha",
      "Griha Pravesh & Vastu Shanti",
      "Maha Rudrabhishek",
      "Navgrah Shanti Havan",
      "Sunderkand Path",
      "Maha Mrityunjaya Jaap",
      "Vivah Sanskar (Wedding)",
      "Naamkaran / Mundan Sanskar",
    ],
    cityOptions: [
      "Delhi NCR (Gurugram / Noida)",
      "Mumbai / Thane / Navi Mumbai",
      "Bengaluru (Bangalore)",
      "Pune",
      "Ahmedabad",
      "Varanasi (Kashi)",
      "Jaipur",
      "Lucknow",
    ],

    servicesSubtitle: "Authentic Vedic Rituals",
    servicesTitle: "Popular Puja & Havan Ceremonies",
    servicesDesc:
      "Scripture-based sacred ceremonies performed at your home or workplace for peace, good health, prosperity, and divine blessings.",
    servicesBtnAll: "View All 40+ Pujas & Anushthans →",
    dakshinaLabel: "Dakshina",
    btnBookThisPuja: "Select Pandit & Book Now",
    services: [
      {
        name: "Shri Satyanarayan Vrat Katha",
        subName: "श्री सत्यनारायण व्रत कथा",
        category: "Peace, Prosperity & Fulfilment",
        duration: "2.5 - 3 Hours",
        price: "₹2,100",
        icon: "🙏",
        badge: "Most Popular",
        description:
          "Complete authentic Katha, Panchamrit preparation, Havan and Maha Aarti for family peace, good health and prosperity.",
        samagri: "Pure Havan Samagri Included",
      },
      {
        name: "Griha Pravesh & Vastu Shanti",
        subName: "गृह प्रवेश एवं वास्तु शांति",
        category: "New Home Purification",
        duration: "3 - 4 Hours",
        price: "₹4,100",
        icon: "🏠",
        badge: "Muhurat Special",
        description:
          "Dwar Puja, Vastu Purush Pujan, Navgrah Havan, Kalash Sthapana, Gau Puja and complete threshold purification.",
        samagri: "Complete Vedic Samagri Kit",
      },
      {
        name: "Maha Rudrabhishek & Shiva Puja",
        subName: "महा रुद्राभिषेक एवं शिव पूजन",
        category: "Overcoming Obstacles & Shiva Blessings",
        duration: "2 - 3 Hours",
        price: "₹3,100",
        icon: "🔱",
        badge: "Mondays & Pradosh",
        description:
          "Sacred Abhishek with milk, curd, Gangajal, honey, Panchamrit and Bhasma chanting Shukla Yajurveda Rudri path.",
        samagri: "Panchamrit & Belpatra List",
      },
      {
        name: "Navgrah Shanti Mahayagna",
        subName: "नवग्रह शांति एवं महायज्ञ",
        category: "Planetary Dosha Remedies",
        duration: "2 - 2.5 Hours",
        price: "₹2,500",
        icon: "🔥",
        badge: "Graha Shanti",
        description:
          "Appeasement of the 9 celestial planetary deities (Sun, Moon, Mars, etc.) with dedicated wood sticks (Samidha) and mantras.",
        samagri: "9 Graha Specific Samidha",
      },
      {
        name: "Complete Vedic Vivah Sanskar",
        subName: "सम्पूर्ण वैदिक विवाह संस्कार",
        category: "16 Sacred Sanskars",
        duration: "4 - 6 Hours",
        price: "₹11,000",
        icon: "💍",
        badge: "Scriptural Vidhi",
        description:
          "Saptapadi, Panigrahana, Sindoor Daan, Kanyadaan, Laja Homa and sacred Agni witness marriage ritual.",
        samagri: "Bride & Groom Ritual List",
      },
      {
        name: "Maha Mrityunjaya Jaap Anushthan",
        subName: "महामृत्युंजय जप एवं अनुष्ठान",
        category: "Longevity & Health Recovery",
        duration: "Custom Sankalp",
        price: "₹5,100",
        icon: "🕉️",
        badge: "Sanjeevani Mantra",
        description:
          "Chanting 1.25 Lakh or 11,000 Maha Mrityunjaya Mahamantra with Rudraksha Mala for recovery from ailments and longevity.",
        samagri: "Rudraksha Rosary Chanting",
      },
      {
        name: "Sunderkand Path & Sankirtan",
        subName: "श्री सुंदरकांड पाठ एवं संकीर्तन",
        category: "Fear & Obstacle Removal",
        duration: "2 - 3 Hours",
        price: "₹2,100",
        icon: "📖",
        badge: "Tuesdays / Saturdays",
        description:
          "Melodious musical Sunderkand Path from Ramcharitmanas, Hanuman Chalisa, Bajrang Baan and Grand Aarti.",
        samagri: "Bhog & Prasad Guidance",
      },
      {
        name: "Naamkaran & Mundan Sanskar",
        subName: "नामकरण एवं मुंडन संस्कार",
        category: "Child Vedic Rites",
        duration: "1.5 - 2 Hours",
        price: "₹2,100",
        icon: "👶",
        badge: "Auspicious Nakshatra",
        description:
          "Vedic naming ceremony per newborn's birth constellation (Nakshatra), Surya Darshan and auspicious head-shaving rite.",
        samagri: "As per Vedic Scriptures",
      },
    ],

    panditsSubtitle: "Learned Acharya Council",
    panditsTitle: "Our Verified & Experienced Pandits",
    panditsDesc:
      "Every Pandit's credentials, Gurukul pedigree, and ceremonial knowledge are 100% verified by our senior Vedic scholars.",
    verifiedPanditBadge: "✓ Verified Acharya",
    expLabel: "Experience:",
    gurukulLabel: "Gurukul:",
    langLabel: "Languages:",
    locLabel: "Service City:",
    specLabel: "Expertise:",
    yajmanLabel: "Devotees",
    btnViewProfile: "View Profile",
    pandits: [
      {
        name: "Acharya Pt. Vidyadhar Shastri",
        title: "Shukla Yajurveda & Karmakand Scholar",
        experience: "22+ Years Experience",
        gurukul: "Sampurnanand Sanskrit University, Varanasi",
        languages: ["Sanskrit", "Hindi", "Maithili"],
        rating: "4.98",
        reviewsCount: 340,
        specialization: "Griha Pravesh, Rudrabhishek, Wedding Rites",
        location: "Delhi NCR / Gurugram",
      },
      {
        name: "Pt. Devendra Narayan Chaturvedi",
        title: "Samaveda & Jyotish Visharad",
        experience: "18+ Years Experience",
        gurukul: "Rishikesh Veda Pathshala",
        languages: ["Sanskrit", "Hindi", "Gujarati"],
        rating: "4.95",
        reviewsCount: 280,
        specialization: "Navgrah Shanti, Mrityunjaya Jaap, Kalsarp Dosha",
        location: "Mumbai / Thane / Navi Mumbai",
      },
      {
        name: "Pt. Raghvendra Dixit Ji",
        title: "Rigveda & Vastu Shastra Acharya",
        experience: "15+ Years Experience",
        gurukul: "Kanchi Kamakoti Veda Pathashala",
        languages: ["Sanskrit", "Hindi", "Marathi", "Telugu"],
        rating: "4.96",
        reviewsCount: 215,
        specialization: "Satyanarayan Katha, Vastu Shuddhi, Chandi Path",
        location: "Bengaluru / Hyderabad",
      },
    ],

    howSubtitle: "Simple & Seamless Process",
    howTitle: "Complete Your Puja in 4 Easy Steps",
    howSteps: [
      {
        step: "1",
        sanskrit: "Sankalpa Siddhi",
        title: "Choose Puja & Sankalp",
        description: "Browse and select the Vedic puja, havan or sanskar ceremony you need.",
      },
      {
        step: "2",
        sanskrit: "Shubh Muhurat",
        title: "Select Date & Location",
        description: "Choose your convenient auspicious date, preferred time slot and home address.",
      },
      {
        step: "3",
        sanskrit: "Vidvan Varanam",
        title: "Select Certified Pandit Ji",
        description: "Review profiles and select verified, Gurukul-trained Pandits in your area.",
      },
      {
        step: "4",
        sanskrit: "Nirvighna Pujan",
        title: "Puja at Your Doorstep",
        description: "Pandit Ji arrives on time and conducts the sacred ceremony with complete Vedic vidhi.",
      },
    ],

    whySubtitle: "Commitment to Sanatan Values",
    whyTitle: "Why Choose Purohitdham?",
    whyValues: [
      {
        sanskrit: "Veda-Guided Vidhi",
        title: "100% Authentic Vedic Tradition",
        description:
          "Rituals performed strictly according to Shastras by scholars trained in Varanasi, Haridwar & Ayodhya Gurukuls.",
      },
      {
        sanskrit: "Pure Sacred Items",
        title: "Pure & Organic Samagri Kit",
        description:
          "Pure desi cow ghee, Gangajal, natural herbs, Navgrah wood, Roli, Akshat and certified sacred items provided.",
      },
      {
        sanskrit: "Transparent Dakshina",
        title: "Fixed Dakshina — No Hidden Demands",
        description:
          "Pre-agreed, transparent pricing. No awkward post-puja price negotiations or unexpected demands.",
      },
      {
        sanskrit: "Custom Gotra Sankalp",
        title: "Tailored to Your Gotra & Lineage",
        description:
          "Ceremony customized with your family Gotra, Pravara, Kuldevi/Kuldevta and regional ancestral traditions.",
      },
    ],

    faqSubtitle: "Got Questions?",
    faqTitle: "Frequently Asked Questions (FAQ)",
    faqs: [
      {
        q: "Will complete Puja Samagri be provided by Purohitdham?",
        a: "Yes. You can select the 'With Samagri' option, wherein pure desi cow ghee, Gangajal, Navgrah wood, Akshat, Roli, sacred thread, Dhoop, and lamps are brought directly by Pandit Ji.",
      },
      {
        q: "How are Pandits verified on Purohitdham?",
        a: "All Pandits on our platform undergo a rigorous background check. We physically verify their Gurukul diplomas, years of Vedic experience, and conduct oral reviews of their mantra recitation.",
      },
      {
        q: "Can I perform the Puja according to my Gotra and ancestral traditions?",
        a: "Absolutely. During the booking, you can mention your Gotra, Pravara, and regional customs. Pandit Ji will customize the Vedic Sankalp and ritual steps accordingly.",
      },
      {
        q: "What if I need help finding the right auspicious Muhurat?",
        a: "Our experienced Vedic astrologers provide complimentary Muhurat consultation based on your birth chart details, Tithi, and planetary positions.",
      },
      {
        q: "Is online payment safe and refundable?",
        a: "100% secure. Payments are processed through Razorpay encryption. Free cancellation and 100% refund is guaranteed for cancellations made at least 48 hours prior.",
      },
    ],

    ctaShloka: "॥ Sarve Bhavantu Sukhinah Sarve Santu Niramayah ॥",
    ctaTitle: "Bring Divine Peace, Health & Prosperity to Your Home",
    ctaDesc:
      "Book an experienced, verified Vedic Purohit for any religious ceremony with complete peace of mind.",
    ctaBtnPrimary: "Book a Puja Now",
    ctaBtnSecondary: "📞 Consult a Pandit Ji",

    footerDesc:
      "Preserving sacred Sanatan Dharma traditions with modern convenience. Connecting families with learned Purohits from Kashi, Haridwar & Ayodhya Gurukuls.",
    footerMotto: "॥ Dharmo Rakshati Rakshitah ॥",
    footerColServices: "Major Puja Ceremonies",
    footerColSanskars: "16 Sacred Sanskars",
    footerColSupport: "Contact & Support",
    footerHelpline: "📞 Helpline: 1800-XXX-XXXX",
    footerEmail: "📧 Email: acharya@purohitdham.com",
    footerTiming: "⏰ Hours: 6:00 AM to 9:00 PM IST",
    footerLocation: "📍 Centers: Varanasi / Delhi NCR / Mumbai",
    footerBtnJoinPandit: "Register as a Pandit Ji",
    footerCopyright: "© 2026 Purohitdham. All rights reserved.",
    footerPeaceChant: "॥ Om Shantih Shantih Shantih ॥",
    footerMadeWith: "Made with 🙏 for Sanatan Dharma",
  },
};
