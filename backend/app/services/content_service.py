"""
Homepage-content service — read helpers, an aggregate, and first-run seed for
features, testimonials, FAQs, banners, and stat counters.

NOTE: the seeded testimonials and stat numbers are SAMPLE/placeholder content
so the homepage isn't empty in dev. They are ordinary DB rows — the owner is
expected to edit or delete them from the admin panel before going live.
"""

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.content import Banner, FaqItem, HomeFeature, StatCounter, Testimonial
from app.schemas.content import (
    BannerResponse,
    FaqResponse,
    FeatureResponse,
    HomepageContent,
    StatResponse,
    TestimonialResponse,
)


# ─── SEED DATA ────────────────────────────────────────────────────────────────

SEED_FEATURES: list[dict] = [
    {"icon": "🛡️", "title": "Verified Pandit Ji", "title_hi": "सत्यापित पंडित जी",
     "description": "Every Pandit Ji is identity-verified and assessed for Vedic scholarship before joining the platform.",
     "description_hi": "प्रत्येक पंडित जी की पहचान सत्यापित की जाती है एवं वैदिक ज्ञान का मूल्यांकन किया जाता है।"},
    {"icon": "📜", "title": "Shastra-Accurate Vidhi", "title_hi": "शास्त्रोक्त विधि",
     "description": "Rituals are performed strictly as per authentic scriptures, with correct mantras and procedure.",
     "description_hi": "प्रत्येक अनुष्ठान शास्त्रों के अनुसार शुद्ध मंत्रोच्चार एवं विधि से संपन्न होता है।"},
    {"icon": "💰", "title": "Transparent Pricing", "title_hi": "पारदर्शी मूल्य",
     "description": "Clear dakshina and samagri costs shown upfront. No hidden charges, ever.",
     "description_hi": "दक्षिणा एवं सामग्री का मूल्य पहले से स्पष्ट। कोई छुपा हुआ शुल्क नहीं।"},
    {"icon": "📦", "title": "Samagri Included", "title_hi": "सामग्री सहित",
     "description": "Complete, pure puja samagri arranged and delivered wherever you need it.",
     "description_hi": "संपूर्ण एवं शुद्ध पूजन सामग्री की व्यवस्था आपके स्थान पर।"},
    {"icon": "🌏", "title": "Pan-India Availability", "title_hi": "पूरे भारत में उपलब्ध",
     "description": "Book learned Pandit Ji across major cities and towns of India.",
     "description_hi": "भारत के प्रमुख शहरों एवं कस्बों में विद्वान पंडित जी बुक करें।"},
    {"icon": "🙏", "title": "Dedicated Support", "title_hi": "समर्पित सहायता",
     "description": "Guidance from booking to completion — in your language.",
     "description_hi": "बुकिंग से लेकर अनुष्ठान पूर्ण होने तक, आपकी भाषा में मार्गदर्शन।"},
]

# Sample testimonials — replace/delete from the admin panel before launch.
SEED_TESTIMONIALS: list[dict] = [
    {"author_name": "Rajesh Sharma", "author_location": "New Delhi", "author_role": "Griha Pravesh Puja", "rating": 5,
     "content": "The Pandit Ji arrived on time and performed our Griha Pravesh beautifully. He explained every step and mantra. Truly a blessed experience for our family.",
     "content_hi": "पंडित जी समय पर पधारे और गृह प्रवेश अत्यंत सुंदर विधि से संपन्न कराया। प्रत्येक चरण समझाया। हमारे परिवार के लिए मंगलमय अनुभव रहा।"},
    {"author_name": "Anita Verma", "author_location": "Jaipur", "author_role": "Satyanarayan Katha", "rating": 5,
     "content": "Booking was simple and the samagri was arranged for us. The katha was melodious and heartfelt. Highly recommend Purohitdham.",
     "content_hi": "बुकिंग सरल थी और सामग्री की व्यवस्था हो गई। कथा मधुर एवं भावपूर्ण रही। पुरोहितधाम की अनुशंसा करती हूँ।"},
    {"author_name": "Suresh Iyer", "author_location": "Bengaluru", "author_role": "Navgraha Shanti Havan", "rating": 5,
     "content": "Very knowledgeable Acharya Ji. The havan was conducted with full authenticity and we felt genuine positivity afterwards.",
     "content_hi": "अत्यंत विद्वान आचार्य जी। हवन पूर्ण प्रामाणिकता से संपन्न हुआ और हमें सकारात्मक ऊर्जा का अनुभव हुआ।"},
    {"author_name": "Priya Gupta", "author_location": "Lucknow", "author_role": "Namkaran Sanskar", "rating": 5,
     "content": "The naming ceremony for our newborn was perfect. Pandit Ji calculated the auspicious syllable and guided us with patience.",
     "content_hi": "हमारे नवजात का नामकरण संस्कार उत्तम रहा। पंडित जी ने शुभ नामाक्षर निकाला और धैर्यपूर्वक मार्गदर्शन किया।"},
    {"author_name": "Vikram Singh", "author_location": "Pune", "author_role": "Maha Rudrabhishek", "rating": 5,
     "content": "Seamless from start to finish. Transparent pricing and a very learned Pandit Ji. Will book again for future pujas.",
     "content_hi": "आरंभ से अंत तक सहज अनुभव। पारदर्शी मूल्य एवं अत्यंत विद्वान पंडित जी। भविष्य में पुनः बुक करूँगा।"},
]

SEED_FAQS: list[dict] = [
    {"category": "Booking", "question": "How do I book a Pandit Ji?",
     "question_hi": "मैं पंडित जी कैसे बुक करूँ?",
     "answer": "Browse our pujas, choose the ritual and package you need, pick your date and location, and confirm. We match you with a verified Pandit Ji for your ceremony.",
     "answer_hi": "पूजा चुनें, अनुष्ठान एवं पैकेज का चयन करें, तिथि व स्थान चुनें और पुष्टि करें। हम आपके लिए सत्यापित पंडित जी की व्यवस्था करते हैं।"},
    {"category": "Pandit", "question": "Are the Pandit Ji verified?",
     "question_hi": "क्या पंडित जी सत्यापित होते हैं?",
     "answer": "Yes. Every Pandit Ji goes through identity verification and an assessment of their Vedic knowledge and experience before they can accept bookings.",
     "answer_hi": "हाँ। प्रत्येक पंडित जी की पहचान एवं वैदिक ज्ञान व अनुभव का मूल्यांकन बुकिंग स्वीकार करने से पूर्व किया जाता है।"},
    {"category": "Booking", "question": "Is the puja samagri included?",
     "question_hi": "क्या पूजा सामग्री शामिल है?",
     "answer": "Most pujas offer a samagri-included option. The samagri list is shown on each puja page, and you can choose whether we arrange it or you provide it yourself.",
     "answer_hi": "अधिकांश पूजाओं में सामग्री सहित विकल्प उपलब्ध है। सामग्री सूची प्रत्येक पूजा पृष्ठ पर दी गई है।"},
    {"category": "Payment", "question": "What payment options are available?",
     "question_hi": "भुगतान के कौन से विकल्प हैं?",
     "answer": "Payments are made securely online. Supported payment methods are shown at checkout.",
     "answer_hi": "भुगतान सुरक्षित रूप से ऑनलाइन किया जाता है। उपलब्ध विकल्प चेकआउट पर दिखाए जाते हैं।"},
    {"category": "Booking", "question": "Can I choose the date and muhurat?",
     "question_hi": "क्या मैं तिथि एवं मुहूर्त चुन सकता हूँ?",
     "answer": "Yes, you select your preferred date and time during booking. Your Pandit Ji can also advise on an auspicious muhurat for the ceremony.",
     "answer_hi": "हाँ, बुकिंग के समय आप अपनी पसंदीदा तिथि व समय चुनते हैं। पंडित जी शुभ मुहूर्त हेतु परामर्श भी दे सकते हैं।"},
    {"category": "Payment", "question": "What is your cancellation policy?",
     "question_hi": "रद्दीकरण नीति क्या है?",
     "answer": "You can request a cancellation from your bookings page. Refund eligibility depends on how far in advance you cancel; the applicable terms are shown to you at the time of booking.",
     "answer_hi": "आप अपने बुकिंग पृष्ठ से रद्दीकरण का अनुरोध कर सकते हैं। रिफंड पात्रता इस पर निर्भर करती है कि आप कितना पहले रद्द करते हैं; लागू शर्तें बुकिंग के समय दिखाई जाती हैं।"},
    {"category": "Pandit", "question": "In which languages are the pujas performed?",
     "question_hi": "पूजा किन भाषाओं में संपन्न होती है?",
     "answer": "Our Pandit Ji perform rituals in Sanskrit as per the Shastras, and can explain the procedure in Hindi, English, and several regional languages.",
     "answer_hi": "पंडित जी शास्त्रानुसार संस्कृत में अनुष्ठान करते हैं तथा हिंदी, अंग्रेज़ी व अनेक क्षेत्रीय भाषाओं में विधि समझा सकते हैं।"},
    {"category": "General", "question": "Do you serve my city?",
     "question_hi": "क्या आप मेरे शहर में सेवा देते हैं?",
     "answer": "We are available across major cities and towns in India, and are expanding continuously. Select your state and city during booking to see availability.",
     "answer_hi": "हम भारत के प्रमुख शहरों एवं कस्बों में उपलब्ध हैं और निरंतर विस्तार कर रहे हैं। बुकिंग के समय अपना राज्य व शहर चुनें।"},
]

SEED_BANNERS: list[dict] = [
    {"placement": "top_strip", "title": "Now serving 50+ cities across India — find a verified Pandit Ji near you.",
     "title_hi": "अब भारत के 50+ शहरों में उपलब्ध — अपने निकट सत्यापित पंडित जी खोजें।",
     "cta_label": "Explore Pujas", "cta_label_hi": "पूजाएँ देखें", "cta_url": "/pujas",
     "bg_color": "#7c2d12", "display_order": 0},
    {"placement": "promo", "title": "Planning a Griha Pravesh?", "title_hi": "गृह प्रवेश की योजना है?",
     "subtitle": "Book an auspicious muhurat with a verified Pandit Ji and let us handle the samagri.",
     "subtitle_hi": "सत्यापित पंडित जी के साथ शुभ मुहूर्त बुक करें, सामग्री की व्यवस्था हम पर छोड़ें।",
     "cta_label": "Book Griha Pravesh", "cta_label_hi": "गृह प्रवेश बुक करें",
     "cta_url": "/pujas/griha-pravesh-puja", "display_order": 1},
]

# Sample marketing figures — edit to real numbers in the admin panel before launch.
SEED_STATS: list[dict] = [
    {"icon": "🙏", "label": "Verified Pandit Ji", "label_hi": "सत्यापित पंडित जी", "value": "500+"},
    {"icon": "🪔", "label": "Pujas Performed", "label_hi": "संपन्न पूजाएँ", "value": "10,000+"},
    {"icon": "🌏", "label": "Cities Served", "label_hi": "सेवित शहर", "value": "50+"},
    {"icon": "⭐", "label": "Devotee Rating", "label_hi": "भक्त रेटिंग", "value": "4.9/5"},
]


async def seed_content_if_empty(db: AsyncSession) -> None:
    """Populate homepage content on a fresh database (idempotent per table)."""
    # Features
    if (await db.execute(select(HomeFeature.id).limit(1))).first() is None:
        for order, f in enumerate(SEED_FEATURES):
            db.add(HomeFeature(**f, display_order=order))
    # Testimonials
    if (await db.execute(select(Testimonial.id).limit(1))).first() is None:
        for order, t in enumerate(SEED_TESTIMONIALS):
            db.add(Testimonial(**t, display_order=order))
    # FAQs
    if (await db.execute(select(FaqItem.id).limit(1))).first() is None:
        for order, q in enumerate(SEED_FAQS):
            db.add(FaqItem(**q, display_order=order))
    # Banners
    if (await db.execute(select(Banner.id).limit(1))).first() is None:
        for b in SEED_BANNERS:
            db.add(Banner(**b))
    # Stats
    if (await db.execute(select(StatCounter.id).limit(1))).first() is None:
        for order, s in enumerate(SEED_STATS):
            db.add(StatCounter(**s, display_order=order))

    await db.commit()


# ─── READ HELPERS ──────────────────────────────────────────────────────────────

async def get_features_service(db: AsyncSession, include_inactive: bool = False) -> list[FeatureResponse]:
    query = select(HomeFeature).order_by(HomeFeature.display_order)
    if not include_inactive:
        query = query.where(HomeFeature.is_active.is_(True))
    result = await db.execute(query)
    return [FeatureResponse.model_validate(row) for row in result.scalars().all()]


async def get_testimonials_service(db: AsyncSession, include_inactive: bool = False) -> list[TestimonialResponse]:
    query = select(Testimonial).order_by(Testimonial.display_order)
    if not include_inactive:
        query = query.where(Testimonial.is_active.is_(True))
    result = await db.execute(query)
    return [TestimonialResponse.model_validate(row) for row in result.scalars().all()]


async def get_faqs_service(db: AsyncSession, include_inactive: bool = False) -> list[FaqResponse]:
    query = select(FaqItem).order_by(FaqItem.display_order)
    if not include_inactive:
        query = query.where(FaqItem.is_active.is_(True))
    result = await db.execute(query)
    return [FaqResponse.model_validate(row) for row in result.scalars().all()]


async def get_banners_service(
    db: AsyncSession, placement: str | None = None, include_inactive: bool = False
) -> list[BannerResponse]:
    query = select(Banner).order_by(Banner.display_order)
    if placement:
        query = query.where(Banner.placement == placement)
    if not include_inactive:
        query = query.where(Banner.is_active.is_(True))
    result = await db.execute(query)
    return [BannerResponse.model_validate(row) for row in result.scalars().all()]


async def get_stats_service(db: AsyncSession, include_inactive: bool = False) -> list[StatResponse]:
    query = select(StatCounter).order_by(StatCounter.display_order)
    if not include_inactive:
        query = query.where(StatCounter.is_active.is_(True))
    result = await db.execute(query)
    return [StatResponse.model_validate(row) for row in result.scalars().all()]


async def get_homepage_content_service(db: AsyncSession) -> HomepageContent:
    """One aggregate payload of all active homepage content."""
    return HomepageContent(
        features=await get_features_service(db),
        testimonials=await get_testimonials_service(db),
        faqs=await get_faqs_service(db),
        banners=await get_banners_service(db),
        stats=await get_stats_service(db),
    )
