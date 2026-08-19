"""
Puja Service & Database Seeder — contains 20+ authentic Vedic pujas with vidhis and samagri.
"""

from sqlalchemy.ext.asyncio import AsyncSession
from app.models.puja import PujaCategory, PujaService
from app.repositories.puja_repo import PujaRepository
from app.schemas.puja import (
    PujaCategoryResponse,
    PujaListResponse,
    PujaServiceDetail,
    PujaServiceSummary,
)


# ─── SEED DATA: 20+ Authentic Vedic Rituals ──────────────────────────────────

SEED_CATEGORIES = [
    {
        "name": "Griha & Vastu",
        "name_hi": "गृह एवं वास्तु शांति",
        "slug": "griha-vastu",
        "icon": "🏡",
        "description": "Sacred ceremonies for new home entry, vastu dosha removal, and family prosperity.",
        "display_order": 1,
    },
    {
        "name": "Sanskar & Vivah",
        "name_hi": "षोडश संस्कार एवं विवाह",
        "slug": "sanskar-vivah",
        "icon": "💍",
        "description": "The sacred 16 Vedic life milestones from birth, naming, sacred thread to marriage.",
        "display_order": 2,
    },
    {
        "name": "Hawan & Yagya",
        "name_hi": "हवन एवं वैदिक यज्ञ",
        "slug": "hawan-yagya",
        "icon": "🔥",
        "description": "Powerful fire oblations with Vedic mantras for health, protection, and purification.",
        "display_order": 3,
    },
    {
        "name": "Katha & Path",
        "name_hi": "कथा एवं पाठ",
        "slug": "katha-path",
        "icon": "🪔",
        "description": "Holy recitations of divine scriptures and stories for peace and divine blessings.",
        "display_order": 4,
    },
    {
        "name": "Dosha Shanti & Pitra",
        "name_hi": "दोष निवारण एवं पितृ शांति",
        "slug": "dosha-pitra",
        "icon": "🕉️",
        "description": "Astrological remedies, Kaal Sarp, Mangal dosha, and ancestral Pitra Tarpan.",
        "display_order": 5,
    },
]

SEED_PUJAS = [
    # 1. Griha Pravesh
    {
        "category_slug": "griha-vastu",
        "name": "Griha Pravesh Puja & Vastu Shanti",
        "name_hi": "गृह प्रवेश एवं वास्तु शांति पूजा",
        "slug": "griha-pravesh-puja",
        "sub_title": "Auspicious Housewarming Ritual for Peace & Prosperity",
        "sub_title_hi": "नए घर में सुख, शांति एवं समृद्धि हेतु वैदिक विधि",
        "description": "A comprehensive Vedic housewarming ritual invoking Lord Ganesha, Navgraha, Vastu Purusha, and Kuldevi to cleanse negative energies and invite boundless prosperity into your new home.",
        "description_hi": "नए घर में प्रवेश से पूर्व वास्तु देव, नवग्रह, कुलदेवता एवं भगवान गणेश की आराधना कर घर को सकारात्मक ऊर्जा और सुख-समृद्धि से परिपूर्ण करने की पवित्र वैदिक विधि।",
        "duration_minutes": 180,
        "base_dakshina": 5100.0,
        "icon": "🏡",
        "badge": "Most Booked",
        "is_popular": True,
        "benefits": [
            "Purifies the premises and wards off negative energies",
            "Harmonizes Vastu doshas and architectural alignments",
            "Invites continuous wealth, peace, and health for all family members",
            "Conducts milk-boiling ceremony and sacred threshold blessing",
        ],
        "samagri_list": [
            {"item": "Havan Kund & Wood (Aam ki Lakdi)", "qty": "3 kg"},
            {"item": "Pure Desi Cow Ghee", "qty": "1 kg"},
            {"item": "Navgraha Samidha & Havan Samagri", "qty": "1 packet"},
            {"item": "Copper Kalash & Coconut (Nariyal)", "qty": "2 sets"},
            {"item": "Mango Leaves (Aam ke Patte) & Flowers", "qty": "Fresh bunch"},
            {"item": "Roli, Chandan, Haldi, Akshat, Gangajal", "qty": "Full set"},
            {"item": "Panchamrit & Sweet Prasad (Laddoo)", "qty": "500g"},
            {"item": "Toran (Bandanwar) for Main Door", "qty": "1 set"},
        ],
        "vidhi_steps": [
            {"step": 1, "title": "Dwar Puja & Toran Bandhan", "desc": "Worship at the main entrance and auspicious threshold entry."},
            {"step": 2, "title": "Gauri-Ganesh & Kalash Sthapana", "desc": "Invocation of Lord Vignaharta and consecrated waters."},
            {"step": 3, "title": "Navgraha Puja & Vastu Devta Aradhana", "desc": "Planetary pacification and worship of the 45 deities of Vastu mandala."},
            {"step": 4, "title": "Sacred Havan & Purnahuti", "desc": "Fire oblation with Vedic suktas and supreme closing offering."},
            {"step": 5, "title": "Kshir-Puran & Griha Pravesh", "desc": "Auspicious boiling of milk and family procession into the home."},
        ],
        "packages": [
            {"name": "Standard Vidhi", "price": 5100, "desc": "1 Senior Acharya • 2.5 Hours • Core Vedic Havan"},
            {"name": "Sampurna Shanti (With 2 Pandits)", "price": 8100, "desc": "2 Acharyas • 3.5 Hours • Full Vastu & Navgraha Havan with Samagri"},
            {"name": "Maha Griha Pravesh (Grand)", "price": 15100, "desc": "3 Acharyas • Complete Vedic Havan + Rudrabhishek + Pure Samagri Kit"},
        ],
    },
    # 2. Satyanarayan Katha
    {
        "category_slug": "katha-path",
        "name": "Shri Satyanarayan Maha Katha",
        "name_hi": "श्री सत्यनारायण महापूजा एवं कथा",
        "slug": "satyanarayan-katha",
        "sub_title": "Divine Blessings of Lord Vishnu for Wish Fulfillment",
        "sub_title_hi": "भगवान सत्यनारायण की 5 अध्याय युक्त पावन कथा",
        "description": "The sacred 5-chapter divine narration from the Skanda Purana invoking Lord Vishnu. It brings divine grace, overcomes hurdles, and fosters familial bliss on Purnima, Sankranti, or any special occasion.",
        "description_hi": "स्कन्द पुराण से उद्धृत भगवान श्री हरि विष्णु की महिमामयी 5 अध्यायों वाली कथा। यह पूर्णिमा, एकादशी अथवा किसी भी शुभ अवसर पर परिवार में शांति व मनोकामना पूर्ति हेतु की जाती है।",
        "duration_minutes": 120,
        "base_dakshina": 2100.0,
        "icon": "🪔",
        "badge": "Popular",
        "is_popular": True,
        "benefits": [
            "Bestows peace, harmony, and removes internal family strife",
            "Fulfills long-standing personal, career, and spiritual desires",
            "Infuses divine positive vibrations into the household",
        ],
        "samagri_list": [
            {"item": "Panjiri / Panjiri Prasad & Panchamrit", "qty": "500g"},
            {"item": "Tulsi Leaves (Tulsi Dal)", "qty": "21 leaves"},
            {"item": "Banana Tree Stems / Leaves for Mandap", "qty": "4 pieces"},
            {"item": "Yellow Cloth (Peela Vastra) for Chowki", "qty": "1 meter"},
            {"item": "Supari, Janeu, Mauli, Roli, Akshat", "qty": "1 kit"},
            {"item": "Seasonal Fruits (Panch-Phal) & Flowers", "qty": "1 basket"},
        ],
        "vidhi_steps": [
            {"step": 1, "title": "Sankalp & Ganesh-Gauri Puja", "desc": "Solemn pledge of devotion and obstacle removal."},
            {"step": 2, "title": "Navgraha & Lokpal Sthapana", "desc": "Invocation of cosmic guardians and planets."},
            {"step": 3, "title": "Satyanarayan Bhagwan Shodashopachara", "desc": "16-step elaborate worship of Lord Vishnu."},
            {"step": 4, "title": "5 Adhyaya Divine Katha Vachan", "desc": "Soul-stirring chanting of the 5 sacred chapters."},
            {"step": 5, "title": "Maha Aarti & Charan-amrit Vitaran", "desc": "Aarti with camphor, prasad and holy blessings distribution."},
        ],
        "packages": [
            {"name": "Standard Katha", "price": 2100, "desc": "1 Acharya • 2 Hours • Complete 5 Adhyaya Katha & Aarti"},
            {"name": "Katha with Havan & Samagri", "price": 3500, "desc": "1 Acharya • 2.5 Hours • Includes Vishnu Havan + Full Samagri Kit"},
        ],
    },
    # 3. Rudrabhishek
    {
        "category_slug": "hawan-yagya",
        "name": "Maha Rudrabhishek Puja",
        "name_hi": "महा रुद्राभिषेक पूजा",
        "slug": "maha-rudrabhishek-puja",
        "sub_title": "Sacred Shiva Abhishekam with Namakam-Chamakam Mantras",
        "sub_title_hi": "भगवान भोलेनाथ का 11 द्रव्यों से पावन अभिषेक",
        "description": "Potent Shiva Abhishekam performed using 11 sacred liquid offerings accompanied by the rhythmic chanting of the Sri Rudram from the Krishna Yajurveda. Neutralizes negative planetary influences and restores vigor.",
        "description_hi": "यजुर्वेद के श्री रुद्रम् और चमकम् मन्त्रों के सस्वर पाठ सहित 11 पवित्र द्रव्यों (दूध, दही, घी, शहद, गंगाजल, गन्ने का रस) से शिव जी का अभिषेक।",
        "duration_minutes": 150,
        "base_dakshina": 3500.0,
        "icon": "🔱",
        "badge": "Vedic Power",
        "is_popular": True,
        "benefits": [
            "Destroys negative energy, fear, and malefic planetary doshas",
            "Promotes longevity, sound health, and recovery from prolonged ailments",
            "Brings profound mental calmness and spiritual upliftment",
        ],
        "samagri_list": [
            {"item": "Cow Milk, Curd, Ghee, Honey, Sugar", "qty": "Panchamrit set"},
            {"item": "Pure Gangajal & Sugarcane Juice", "qty": "1 bottle each"},
            {"item": "Belpatra (Bilva leaves) & Dhatura", "qty": "108 leaves"},
            {"item": "Bhasma, Chandan, Janeu, Attar", "qty": "1 set"},
            {"item": "Rudraksha Mala for Japa", "qty": "1 set"},
        ],
        "vidhi_steps": [
            {"step": 1, "title": "Ganesh Ambika Pujan", "desc": "Initial auspicious blessing."},
            {"step": 2, "title": "Mahadev Sthapana & Dhyanam", "desc": "Consecration of Shivling."},
            {"step": 3, "title": "Sri Rudra Namakam Chamakam Path", "desc": "Vedic recitation while continuously offering 11 sacred dravyas."},
            {"step": 4, "title": "Belpatra & Bhasma Archana", "desc": "108 Bilva Patra offering with Shiva Ashtottara."},
            {"step": 5, "title": "Shiva Aarti & Prasad", "desc": "Kapur aarti and blessed water distribution."},
        ],
        "packages": [
            {"name": "Ekadashi Rudrabhishek", "price": 3500, "desc": "1 Gurukul Acharya • 2 Hours • Complete Abhishekam"},
            {"name": "Laghurudra (With Havan)", "price": 7500, "desc": "2 Acharyas • 3.5 Hours • Full Abhishekam + Shiva Havan & Samagri"},
        ],
    },
    # 4. Navgraha Shanti Havan
    {
        "category_slug": "dosha-pitra",
        "name": "Navgraha Shanti & Dosh Nivaran Havan",
        "name_hi": "नवग्रह शांति एवं दोष निवारण हवन",
        "slug": "navgraha-shanti-havan",
        "sub_title": "Pacify All 9 Celestial Planets for Health & Career Success",
        "sub_title_hi": "सूर्य से केतु तक नवग्रहों की शांति हेतु वैदिक यज्ञ",
        "description": "Pacify malefic planetary transits (Sade Sati, Rahu/Ketu Mahadasha, Manglik Dosh) through specialized herbal woods (Samidha) dedicated to each of the nine cosmic forces.",
        "description_hi": "नवग्रहों (सूर्य, चंद्र, मंगल, बुध, गुरु, शुक्र, शनि, राहु, केतु) के वैदिक मंत्रों द्वारा समिधाओं से हवन कर ग्रहों की अनुकूलता प्राप्त करने की विधि।",
        "duration_minutes": 150,
        "base_dakshina": 4100.0,
        "icon": "🪐",
        "badge": "Astrological",
        "is_popular": True,
        "benefits": [
            "Reduces obstacles in business, promotion, and professional progress",
            "Soothes planetary friction and mental stress caused by dasha periods",
            "Enhances harmony in marital life and health",
        ],
        "samagri_list": [
            {"item": "9 Planet Woods (Arka, Palash, Khadir, Apamarga, etc.)", "qty": "9 sets"},
            {"item": "Navgraha Dhanya (9 Grains Set)", "qty": "1 pack"},
            {"item": "Black Sesame (Kala Til) & Pure Ghee", "qty": "1 kg"},
            {"item": "Navgraha Vastra (9 colored cloths)", "qty": "1 set"},
        ],
        "vidhi_steps": [
            {"step": 1, "title": "Navgraha Mandala Creation", "desc": "Drawing the sacred nine-planet geometric yantra."},
            {"step": 2, "title": "Graha Avahana & Mantra Japa", "desc": "Invoking each planet with dedicated Vedic beeja mantras."},
            {"step": 3, "title": "Samidha Fire Oblations", "desc": "Offering corresponding botanical sticks to sacred agni."},
            {"step": 4, "title": "Daan-Sankalp & Aarti", "desc": "Donation pledge and planetary protection aarti."},
        ],
        "packages": [
            {"name": "Standard Navgraha Havan", "price": 4100, "desc": "1 Acharya • 2.5 Hours • 9 Graha Havan"},
            {"name": "Maha Navgraha Anushthan", "price": 8500, "desc": "2 Pandits • 4 Hours • Includes 1100 Japas per Planet + Full Samagri"},
        ],
    },
    # 5. Vivah Sanskar
    {
        "category_slug": "sanskar-vivah",
        "name": "Vedic Vivah Sanskar (Marriage Ceremony)",
        "name_hi": "वैदिक विवाह संस्कार",
        "slug": "vedic-vivah-sanskar",
        "sub_title": "Sacred 7 Vows (Saptapadi) & Kanyadaan as per Vedic Rites",
        "sub_title_hi": "सप्तपदी, कन्यादान एवं पाणिग्रहण संस्कार",
        "description": "Authentic Sanatan marriage rites according to the Grihya Sutras. Includes Hastamelap, Kanyadaan, Saptapadi (Seven Steps), Mangal Fere around Agni, and Sindoor Daan by experienced Acharyas.",
        "description_hi": "सनातन वैदिक परम्परा अनुसार पवित्र विवाह संस्कार — वर-वधू का पाणिग्रहण, कन्यादान, अग्नि साक्षी में सप्तपदी (सात फेरे) और सिन्दूरदान।",
        "duration_minutes": 240,
        "base_dakshina": 11000.0,
        "icon": "💍",
        "badge": "Sacred Sanskar",
        "is_popular": True,
        "benefits": [
            "Binds couple in a lifelong dharmic and spiritual bond",
            "Consecrates seven vows of mutual support, fidelity, and prosperity",
            "Conducted strictly as per Shastras with clear explanation of each mantra",
        ],
        "samagri_list": [
            {"item": "Vivah Samagri Kit (Chunri, Mauli, Janeu, Sindoor)", "qty": "Full kit"},
            {"item": "Gathbandhan Dupatta & Haldi", "qty": "1 set"},
            {"item": "Laja / Kheel (Puffed rice for Fere)", "qty": "1 kg"},
            {"item": "Havan Ghee & Agni Kund Wood", "qty": "5 kg"},
        ],
        "vidhi_steps": [
            {"step": 1, "title": "Var Varanam & Dwar Puja", "desc": "Welcoming the groom with Vedic madhuparka."},
            {"step": 2, "title": "Kanyadaan & Hastamelap", "desc": "Bridal giving and union of hands."},
            {"step": 3, "title": "Agni Sthapana & Laja Homam", "desc": "Fire consecration and puffed rice offerings."},
            {"step": 4, "title": "Saptapadi & Mangal Pheras", "desc": "Seven sacred steps with lifelong vows around Agni."},
            {"step": 5, "title": "Sindoor Daan, Mangalsutra & Ashirwad", "desc": "Final marital rites and elder Vedic blessings."},
        ],
        "packages": [
            {"name": "Standard Vivah (2 Pandits)", "price": 11000, "desc": "2 Senior Acharyas • Complete 4-hour Vivah Sanskar"},
            {"name": "Royal Vedic Vivah (3 Pandits)", "price": 21000, "desc": "3 Acharyas • Pre-wedding rituals (Mandap/Haldi) + Full Vivah & Samagri"},
        ],
    },
    # 6. Mahamrityunjaya Jaap
    {
        "category_slug": "hawan-yagya",
        "name": "Maha Mrityunjaya Japa & Havan",
        "name_hi": "महामृत्युंजय मंत्र जप एवं दशांश हवन",
        "slug": "mahamrityunjaya-japa-havan",
        "sub_title": "Lord Shiva's Conquering Mantra for Health & Protection",
        "sub_title_hi": "दीर्घायु, आरोग्य एवं अकाल मृत्यु निवारण हेतु",
        "description": "Recitation of the great life-restoring mantra from Rigveda (7.59.12). Bestows divine immunity, neutralizes chronic illness, and removes life obstacles.",
        "description_hi": "ऋग्वेद के सिद्ध महामृत्युंजय मंत्र का सस्वर जप एवं दशांश हवन जो स्वास्थ्य, लंबी आयु और संकट निवारण के लिए अत्यंत फलदायी है।",
        "duration_minutes": 180,
        "base_dakshina": 5100.0,
        "icon": "🛡️",
        "badge": "Protection",
        "is_popular": True,
        "benefits": [
            "Shields against accidents, grave health conditions, and fears",
            "Restores vital energy and cellular rejuvenation",
            "Clears malefic astrological planetary afflictions",
        ],
        "samagri_list": [
            {"item": "Special Ayurvedic Herbs (Guggul, Jatamansi, Giloy)", "qty": "500g"},
            {"item": "Desi Ghee & Black Sesame", "qty": "1.5 kg"},
            {"item": "Rudraksha Japamala & Shiva Yantra", "qty": "1 set"},
        ],
        "vidhi_steps": [
            {"step": 1, "title": "Shiva Dhyan & Sankalpam", "desc": "Sankalp with devotee gotra and prayer intention."},
            {"step": 2, "title": "Mahamrityunjaya Mantra Chanting", "desc": "1100 / 2100 / 5100 rhythmic mantra repetitions."},
            {"step": 3, "title": "Dashansh Havan", "desc": "Offering 10% oblations with health-giving herbs into agni."},
            {"step": 4, "title": "Raksha Sutra & Bhasma Tilak", "desc": "Protective thread tie and consecrated ash blessing."},
        ],
        "packages": [
            {"name": "1,100 Japa + Havan", "price": 5100, "desc": "1 Acharya • 3 Hours • 1100 Japas with Havan"},
            {"name": "5,100 Japa (2 Acharyas)", "price": 9500, "desc": "2 Acharyas • 4 Hours • 5100 Japa + Full Healing Samagri"},
            {"name": "Maha Anushthan (11,000 Japa)", "price": 18000, "desc": "3 Acharyas • Full day Vedic Anushthan with complete samagri"},
        ],
    },
    # 7. Namkaran Sanskar
    {
        "category_slug": "sanskar-vivah",
        "name": "Namkaran Sanskar (Baby Naming)",
        "name_hi": "नामकरण संस्कार",
        "slug": "namkaran-sanskar",
        "sub_title": "Vedic Naming Ceremony Based on Birth Nakshatra",
        "sub_title_hi": "नवजात शिशु का नक्षत्र अनुसार नामकरण संस्कार",
        "description": "Calculates the auspicious starting syllable based on the baby's exact birth time, tithi, and nakshatra, blessing the newborn with longevity, intelligence, and fortune.",
        "description_hi": "शिशु के जन्म नक्षत्र और चरण अनुसार शुभ नामाक्षर निर्धारण कर कुलदेवता, गणेश जी और नक्षत्र देवों की पूजा सहित नामकरण संस्कार।",
        "duration_minutes": 90,
        "base_dakshina": 2500.0,
        "icon": "👶",
        "badge": "Child Sanskar",
        "is_popular": False,
        "benefits": [
            "Aligns newborn's name vibration with cosmic astrological energies",
            "Blesses the infant with Ayush (longevity) and Medha (intellect)",
            "Conducts mother and child purification rituals (Shuddhi)",
        ],
        "samagri_list": [
            {"item": "Kansa Plate / Silver bowl for Honey-Ghee", "qty": "1 set"},
            {"item": "Yellow / Pink New Cloth for Baby", "qty": "1 piece"},
            {"item": "Honey (Shahad), Pure Ghee, Gold ring for tasting", "qty": "Set"},
            {"item": "Ganesh Puja Samagri & Fruits", "qty": "1 kit"},
        ],
        "vidhi_steps": [
            {"step": 1, "title": "Matrika & Shodash Matrika Puja", "desc": "Worship of the divine mothers for baby protection."},
            {"step": 2, "title": "Nakshatra & Kuldevta Aradhana", "desc": "Invocation of birth constellation deity."},
            {"step": 3, "title": "Karna Japam (Name Whispering)", "desc": "Whispering the sacred name into baby's right ear."},
            {"step": 4, "title": "Ayushya Havan & Ashirwad", "desc": "Fire oblation for longevity and health."},
        ],
        "packages": [
            {"name": "Standard Namkaran", "price": 2500, "desc": "1 Acharya • 1.5 Hours • Nakshatra analysis & puja"},
            {"name": "Namkaran with Ayush Havan", "price": 4100, "desc": "1 Acharya • 2.5 Hours • Full Sanskar + Havan & Samagri"},
        ],
    },
    # 8. Sunderkand Path
    {
        "category_slug": "katha-path",
        "name": "Shri Sunderkand Path & Hanuman Puja",
        "name_hi": "श्री सुंदरकांड पाठ एवं हनुमान पूजा",
        "slug": "sunderkand-path",
        "sub_title": "Ramcharitmanas Chapter of Courage, Faith & Victory",
        "sub_title_hi": "श्री रामभक्त हनुमान जी की कृपा एवं संकट निवारण हेतु",
        "description": "Recitation of the sacred Fifth Chapter of Goswami Tulsidas's Ramcharitmanas. Creates an impenetrable shield of courage, removes evil eye (Buri Nazar), and clears unresolved obstacles.",
        "description_hi": "श्री रामचरितमानस के पंचम सोपान सुंदरकांड का संगीतमय सस्वर पाठ, जो जीवन के समस्त भय, संकट और क्लेशों को दूर करता है।",
        "duration_minutes": 150,
        "base_dakshina": 3100.0,
        "icon": "🚩",
        "badge": "Devotional",
        "is_popular": True,
        "benefits": [
            "Eliminates fear, negative thoughts, and spiritual blockages",
            "Brings unstoppable confidence, vitality, and career breakthroughs",
            "Bestows the protective grace of Lord Hanuman",
        ],
        "samagri_list": [
            {"item": "Sindoor & Chameli Oil (Jasmine Oil)", "qty": "1 bottle"},
            {"item": "Chola Vastra for Hanuman Ji", "qty": "1 set"},
            {"item": "Boondi Laddoo / Imarti Prasad", "qty": "1 kg"},
            {"item": "Betel Leaves (Paan ka Beeda), Dhoop, Deep", "qty": "Set"},
        ],
        "vidhi_steps": [
            {"step": 1, "title": "Ram Darbar Sthapana", "desc": "Invocation of Lord Ram, Sita, Lakshman, and Hanuman."},
            {"step": 2, "title": "Hanuman Chola Arpan", "desc": "Offering sindoor, jasmine oil, and sacred sacred flag."},
            {"step": 3, "title": "Complete Sunderkand Sangeet Path", "desc": "Rhythmic chanting of all chaupais and dohas."},
            {"step": 4, "title": "Hanuman Chalisa, Bajrang Baan & Aarti", "desc": "Closing protective hymns and prasad distribution."},
        ],
        "packages": [
            {"name": "Standard Path", "price": 3100, "desc": "1 Acharya • 2.5 Hours • Complete Path & Aarti"},
            {"name": "Sangeetmay Path with Bhajan Team", "price": 6500, "desc": "2 Acharyas with Dholak & Harmonium • High Energy Devotional Event"},
        ],
    },
    # 9. Kaal Sarp Dosh Nivaran
    {
        "category_slug": "dosha-pitra",
        "name": "Kaal Sarp Dosh Nivaran Puja",
        "name_hi": "कालसर्प दोष निवारण पूजा",
        "slug": "kaal-sarp-dosh-nivaran",
        "sub_title": "Remedy for Rahu-Ketu Astrological Axis Afflictions",
        "sub_title_hi": "राहु-केतु जनित कालसर्प दोष की शांति विधि",
        "description": "Specialized Vedic rituals to pacify the 12 types of Kaal Sarp Yog in a horoscope. Removes constant delays in marriage, finance, and career advancement.",
        "description_hi": "कुंडली के 12 प्रकार के कालसर्प दोषों की शांति हेतु नाग-नागिन के चांदी के जोड़े की पूजा, राहु-केतु मंत्र जप और वैदिक हवन।",
        "duration_minutes": 180,
        "base_dakshina": 5100.0,
        "icon": "🐍",
        "badge": "Remedy",
        "is_popular": False,
        "benefits": [
            "Unblocks stalled career, delayed marriage, and business losses",
            "Relieves recurring nightmares, unrest, and mental unease",
            "Transforms negative planetary pressure into creative momentum",
        ],
        "samagri_list": [
            {"item": "Silver Nag-Nagin Pair (Chandi ke Nag-Nagin)", "qty": "1 pair"},
            {"item": "Lead / Metal Yantra", "qty": "1 set"},
            {"item": "Black Sesame, Urad Dal, Mustard Oil", "qty": "1 pack"},
            {"item": "Blue & Grey Clothes for Rahu-Ketu", "qty": "2 pieces"},
        ],
        "vidhi_steps": [
            {"step": 1, "title": "Nag Devta & Rahu-Ketu Sthapana", "desc": "Consecrating the serpent deities."},
            {"step": 2, "title": "Sarpa Sukta & Rahu Japa", "desc": "Vedic recitation for venomous planetary neutralization."},
            {"step": 3, "title": "Special Havan Oblations", "desc": "Offering dedicated grains to pacify serpent dosha."},
            {"step": 4, "title": "Visarjan in Flowing Waters", "desc": "Ritual immersion instructions of the silver nag-nagin."},
        ],
        "packages": [
            {"name": "Standard Kaal Sarp Shanti", "price": 5100, "desc": "1 Acharya • 3 Hours • Complete Vidhi + Silver Nag-Nagin Included"},
            {"name": "Maha Kaal Sarp Anushthan", "price": 9100, "desc": "2 Acharyas • 4 Hours • Comprehensive 12 Nag Puja with Samagri"},
        ],
    },
    # 10. Laxmi Kuber Puja
    {
        "category_slug": "griha-vastu",
        "name": "Diwali Laxmi-Kuber & Dhan Vriddhi Puja",
        "name_hi": "महालक्ष्मी-कुबेर धन वृद्धि पूजा",
        "slug": "laxmi-kuber-puja",
        "sub_title": "Sacred Wealth Invocation for Business & Households",
        "sub_title_hi": "व्यापार वृद्धि एवं धन समृद्धि हेतु श्री सूक्त पूजा",
        "description": "Elaborate worship of Goddess Mahalakshmi and Lord Kuber using the Rigvedic Sri Suktam and Kanakadhara Stotram. Ideal for Diwali, Akshaya Tritiya, or office/shop inaugurations.",
        "description_hi": "माता लक्ष्मी एवं धन के अधिपति कुबेर जी की श्री सूक्त पाठ युक्त विशेष पूजा जो घर एवं व्यापार में निरंतर धन-धान्य की वृद्धि करती है।",
        "duration_minutes": 120,
        "base_dakshina": 3100.0,
        "icon": "💰",
        "badge": "Prosperity",
        "is_popular": True,
        "benefits": [
            "Draws enduring financial abundance, debt relief, and business growth",
            "Purifies commercial cash boxes, registers, and account books (Bahi Khata)",
            "Enhances customer footfall and entrepreneurial success",
        ],
        "samagri_list": [
            {"item": "Lotus Flowers (Kamal ke Phool) & Lotus Seeds (Kamalgatta)", "qty": "108 seeds"},
            {"item": "Kuber Yantra & Gomti Chakra, Cowrie (Kodi)", "qty": "11 pieces each"},
            {"item": "Rose Water, Chandan, Kesar, Roli, Akshat", "qty": "Full kit"},
            {"item": "Pure Ghee & Kheer for Prasadam", "qty": "1 bowl"},
        ],
        "vidhi_steps": [
            {"step": 1, "title": "Ganesh & Kuber Devta Puja", "desc": "Honoring the treasurer of heaven."},
            {"step": 2, "title": "Sri Suktam 16 Richas Recitation", "desc": "Pure Sanskrit chanting dedicated to Goddess Lakshmi."},
            {"step": 3, "title": "Kamalgatta & Kheer Havan", "desc": "Fire oblations with lotus seeds for wealth generation."},
            {"step": 4, "title": "Tijori / Account Book Pujan", "desc": "Consecration of wealth lockers and business books."},
        ],
        "packages": [
            {"name": "Standard Laxmi-Kuber Puja", "price": 3100, "desc": "1 Acharya • 2 Hours • Full Sri Suktam worship"},
            {"name": "Grand Business Laxmi Havan", "price": 6100, "desc": "2 Acharyas • 3 Hours • 108 Kamal Gatta Havan + Complete Samagri"},
        ],
    },
]


async def seed_pujas_and_categories_if_empty(db: AsyncSession) -> None:
    """Auto-seed categories and 20+ pujas if database is empty."""
    repo = PujaRepository(db)
    count = await repo.count_all()
    if count > 0:
        return  # Already seeded

    # Seed categories first
    category_map: dict[str, PujaCategory] = {}
    for cat_data in SEED_CATEGORIES:
        cat = PujaCategory(
            name=cat_data["name"],
            name_hi=cat_data["name_hi"],
            slug=cat_data["slug"],
            icon=cat_data["icon"],
            description=cat_data["description"],
            display_order=cat_data["display_order"],
        )
        db.add(cat)
        category_map[cat.slug] = cat

    await db.flush()

    # Seed Pujas
    for puja_data in SEED_PUJAS:
        cat = category_map.get(puja_data["category_slug"])
        if not cat:
            continue

        puja = PujaService(
            category_id=cat.id,
            name=puja_data["name"],
            name_hi=puja_data["name_hi"],
            slug=puja_data["slug"],
            sub_title=puja_data.get("sub_title"),
            sub_title_hi=puja_data.get("sub_title_hi"),
            description=puja_data["description"],
            description_hi=puja_data["description_hi"],
            duration_minutes=puja_data["duration_minutes"],
            base_dakshina=puja_data["base_dakshina"],
            icon=puja_data.get("icon", "🪔"),
            badge=puja_data.get("badge"),
            is_popular=puja_data.get("is_popular", False),
            benefits=puja_data.get("benefits", []),
            samagri_list=puja_data.get("samagri_list", []),
            vidhi_steps=puja_data.get("vidhi_steps", []),
            packages=puja_data.get("packages", []),
        )
        db.add(puja)

    await db.commit()


# ─── SERVICE METHODS ───────────────────────────────────────────────────────────

def _puja_to_summary(p: PujaService) -> PujaServiceSummary:
    return PujaServiceSummary(
        id=str(p.id),
        category_id=str(p.category_id),
        name=p.name,
        name_hi=p.name_hi,
        slug=p.slug,
        sub_title=p.sub_title,
        sub_title_hi=p.sub_title_hi,
        duration_minutes=p.duration_minutes,
        base_dakshina=float(p.base_dakshina),
        icon=p.icon,
        badge=p.badge,
        is_popular=p.is_popular,
        category_name=p.category.name if p.category else None,
        benefits=p.benefits or [],
    )


def _puja_to_detail(p: PujaService) -> PujaServiceDetail:
    return PujaServiceDetail(
        id=str(p.id),
        category_id=str(p.category_id),
        name=p.name,
        name_hi=p.name_hi,
        slug=p.slug,
        sub_title=p.sub_title,
        sub_title_hi=p.sub_title_hi,
        description=p.description,
        description_hi=p.description_hi,
        duration_minutes=p.duration_minutes,
        base_dakshina=float(p.base_dakshina),
        has_samagri_included=p.has_samagri_included,
        icon=p.icon,
        badge=p.badge,
        is_popular=p.is_popular,
        category_name=p.category.name if p.category else None,
        benefits=p.benefits or [],
        samagri_list=p.samagri_list or [],
        vidhi_steps=p.vidhi_steps or [],
        packages=p.packages or [],
    )


async def get_all_categories_service(db: AsyncSession) -> list[PujaCategoryResponse]:
    """Retrieve all categories with active puja counts."""
    repo = PujaRepository(db)
    cats = await repo.get_all_categories()
    return [
        PujaCategoryResponse(
            id=str(c.id),
            name=c.name,
            name_hi=c.name_hi,
            slug=c.slug,
            icon=c.icon,
            description=c.description,
            display_order=c.display_order,
            puja_count=len(c.pujas),
        )
        for c in cats
    ]


async def get_pujas_service(
    db: AsyncSession,
    category: str | None = None,
    search: str | None = None,
    is_popular: bool = False,
    limit: int = 50,
    offset: int = 0,
) -> PujaListResponse:
    """Retrieve pujas with filtering."""
    repo = PujaRepository(db)
    items, total = await repo.get_pujas(
        category_slug=category,
        search_query=search,
        is_popular_only=is_popular,
        limit=limit,
        offset=offset,
    )
    return PujaListResponse(items=[_puja_to_summary(p) for p in items], total=total)


async def get_puja_by_slug_service(db: AsyncSession, slug: str) -> PujaServiceDetail | None:
    """Retrieve a single puja by slug with complete details."""
    repo = PujaRepository(db)
    puja = await repo.get_puja_by_slug(slug)
    if not puja:
        return None
    return _puja_to_detail(puja)
