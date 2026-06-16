import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "en" | "fr" | "ar";

type Dict = Record<string, string>;

const dictionaries: Record<Lang, Dict> = {
  en: {
    "nav.home": "Home",
    "nav.about": "About",
    "nav.services": "Services",
    "nav.contact": "Contact",
    "nav.book": "Book Appointment",

    "hero.eyebrow": "Your Trusted Dental Center",
    "hero.title.before": "Your ",
    "hero.title.highlight": "smile",
    "hero.title.after": ", our commitment",
    "hero.subtitle": "Personalized, human-centered dental care for the whole family — modern technology meets a warm, welcoming touch.",
    "hero.cta": "Book Appointment",
    "hero.cta2": "Discover Services",
    "hero.badge.team": "Expert Team",
    "hero.badge.tech": "Advanced Tech",
    "hero.badge.welcome": "Warm Welcome",

    "stats.patients": "Happy Patients",
    "stats.reviews": "Google Reviews",
    "stats.years": "Years Experience",
    "stats.support": "Support",

    "cta.title": "Ready to transform your smile?",
    "cta.desc": "Book your appointment in less than 60 seconds. We'll confirm by phone.",
    "cta.btn": "Book Your Visit Now",

    "about.kicker": "Our Doctors",
    "about.title": "Meet the team behind your smile",
    "about.desc": "A small, dedicated team of passionate professionals — focused on your comfort and a healthy, radiant smile.",
    "team.dr1.name": "Dr. Merabet Mohammed",
    "team.dr1.role": "Founder · General & Implant Dentistry",
    "team.dr2.name": "Dr. Houfani Chafia",
    "team.dr2.role": "Orthodontics & Cosmetic Dentistry",

    "services.kicker": "What we do",
    "services.title": "Our Dental Services",
    "services.cleaning": "Cleaning & Scaling",
    "services.cleaning.desc": "Professional scaling and polishing for a fresh, healthy mouth.",
    "services.whitening": "Teeth Whitening",
    "services.whitening.desc": "Brighten your smile by several shades, safely and comfortably.",
    "services.implants": "Dental Implants",
    "services.implants.desc": "Restore missing teeth with durable titanium implants.",
    "services.ortho": "Orthodontics",
    "services.ortho.desc": "Braces and aligners for perfectly aligned teeth.",
    "services.cavity": "Cavity & Restoration",
    "services.cavity.desc": "Gentle, modern fillings and restorations.",
    "services.emergency": "Emergencies",
    "services.emergency.desc": "Same-day care when pain can't wait.",

    "reviews.title": "What Our Patients Say",
    "reviews.r1": "Truly the most caring dental team I've visited. My smile has never looked better!",
    "reviews.r1.name": "Sara K.",
    "reviews.r2": "Painless, professional and incredibly welcoming. Highly recommended.",
    "reviews.r2.name": "Mehdi B.",
    "reviews.r3": "Beautiful clinic, modern equipment and a doctor who truly listens.",
    "reviews.r3.name": "Yasmine R.",

    "contact.title": "Visit Our Sanctuary",
    "contact.address": "Clinic Address",
    "contact.addressVal": "123, rue, Djmorah, Biskra, Algeria, 07025",
    "contact.hours": "Working Hours",
    "contact.hoursVal": "Sunday – Saturday (closed Friday) · 9:00 – 16:00",
    "contact.phone": "Contact",
    "contact.phoneVal": "+213 (0) 664 59 69 91",
    "contact.email": "Email",
    "contact.emailVal": "merabetmohammed7@gmail.com",
    "contact.facebook": "Facebook",
    "contact.facebookVal": "عيادة الدكتور مرابط محمد لزراعة تجميل وتقويم الأسنان",
    "contact.map": "Djmorah, Biskra",
    "footer.rights": "All rights reserved.",

    "booking.title": "Book Your Appointment",
    "booking.subtitle": "Fill in your details and we'll call you to confirm.",
    "booking.name": "Patient Name",
    "booking.phone": "Phone Number",
    "booking.date": "Requested Date",
    "booking.hour": "Preferred Hour",
    "booking.reason": "Reason for Visit",
    "booking.reason.cleaning": "Cleaning",
    "booking.reason.whitening": "Whitening",
    "booking.reason.consultation": "Consultation",
    "booking.reason.emergency": "Pain / Emergency",
    "booking.submit": "Submit Request",
    "booking.success": "Request sent! We will call you to confirm.",
    "booking.back": "← Back to home",
    "booking.dentist": "Choose your dentist",
    "booking.taken": "Booked",
    "booking.closed": "Closed on this day. Please pick another date.",
    "booking.pickDate": "Please pick a date first.",
    "booking.error": "Could not send your request. Please try again.",
  },
  fr: {
    "nav.home": "Accueil",
    "nav.about": "À propos",
    "nav.services": "Services",
    "nav.contact": "Contact",
    "nav.book": "Prendre RDV",

    "hero.eyebrow": "Votre centre dentaire de confiance",
    "hero.title.before": "Votre ",
    "hero.title.highlight": "sourire",
    "hero.title.after": ", notre engagement",
    "hero.subtitle": "Des soins dentaires personnalisés et humains pour toute la famille — technologie moderne et accueil chaleureux.",
    "hero.cta": "Prendre rendez-vous",
    "hero.cta2": "Découvrir les services",
    "hero.badge.team": "Équipe experte",
    "hero.badge.tech": "Technologie avancée",
    "hero.badge.welcome": "Accueil chaleureux",

    "stats.patients": "Patients heureux",
    "stats.reviews": "Avis Google",
    "stats.years": "Années d'expérience",
    "stats.support": "Support",

    "cta.title": "Prêt à transformer votre sourire ?",
    "cta.desc": "Réservez votre rendez-vous en moins de 60 secondes. Nous vous confirmons par téléphone.",
    "cta.btn": "Réserver maintenant",

    "about.kicker": "Nos médecins",
    "about.title": "L'équipe derrière votre sourire",
    "about.desc": "Une petite équipe dévouée et passionnée — axée sur votre confort et un sourire sain et éclatant.",
    "team.dr1.name": "Dr. Merabet Mohammed",
    "team.dr1.role": "Fondateur · Dentisterie générale & implantologie",
    "team.dr2.name": "Dr. Houfani Chafia",
    "team.dr2.role": "Orthodontie & dentisterie esthétique",

    "services.kicker": "Ce que nous faisons",
    "services.title": "Nos services dentaires",
    "services.cleaning": "Détartrage",
    "services.cleaning.desc": "Nettoyage professionnel pour une bouche saine et fraîche.",
    "services.whitening": "Blanchiment",
    "services.whitening.desc": "Éclaircissez votre sourire de plusieurs teintes, en toute sécurité.",
    "services.implants": "Implants dentaires",
    "services.implants.desc": "Remplacez les dents manquantes avec des implants en titane.",
    "services.ortho": "Orthodontie",
    "services.ortho.desc": "Bagues et aligneurs pour des dents parfaitement alignées.",
    "services.cavity": "Soins des caries",
    "services.cavity.desc": "Plombages et restaurations modernes et indolores.",
    "services.emergency": "Urgences",
    "services.emergency.desc": "Soins le jour même quand la douleur ne peut pas attendre.",

    "reviews.title": "Ce que disent nos patients",
    "reviews.r1": "Vraiment l'équipe dentaire la plus attentionnée. Mon sourire n'a jamais été aussi beau !",
    "reviews.r1.name": "Sara K.",
    "reviews.r2": "Indolore, professionnel et incroyablement accueillant. Hautement recommandé.",
    "reviews.r2.name": "Mehdi B.",
    "reviews.r3": "Belle clinique, équipement moderne et un médecin qui écoute vraiment.",
    "reviews.r3.name": "Yasmine R.",

    "contact.title": "Visitez notre sanctuaire",
    "contact.address": "Adresse de la clinique",
    "contact.addressVal": "123, rue, Djmorah, Biskra, Algérie, 07025",
    "contact.hours": "Heures de travail",
    "contact.hoursVal": "Dimanche – Samedi (fermé vendredi) · 9h00 – 16h00",
    "contact.phone": "Coordonnées",
    "contact.phoneVal": "+213 (0) 664 59 69 91",
    "contact.email": "Email",
    "contact.emailVal": "merabetmohammed7@gmail.com",
    "contact.facebook": "Facebook",
    "contact.facebookVal": "عيادة الدكتور مرابط محمد لزراعة تجميل وتقويم الأسنان",
    "contact.map": "Djmorah, Biskra",
    "footer.rights": "Tous droits réservés.",

    "booking.title": "Réservez votre rendez-vous",
    "booking.subtitle": "Remplissez vos coordonnées et nous vous appellerons pour confirmer.",
    "booking.name": "Nom du patient",
    "booking.phone": "Numéro de téléphone",
    "booking.date": "Date souhaitée",
    "booking.hour": "Heure préférée",
    "booking.reason": "Motif de la visite",
    "booking.reason.cleaning": "Détartrage",
    "booking.reason.whitening": "Blanchiment",
    "booking.reason.consultation": "Consultation",
    "booking.reason.emergency": "Douleur / Urgence",
    "booking.submit": "Envoyer la demande",
    "booking.success": "Demande envoyée ! Nous vous appellerons pour confirmer.",
    "booking.back": "← Retour à l'accueil",
  },
  ar: {
    "nav.home": "الرئيسية",
    "nav.about": "من نحن",
    "nav.services": "الخدمات",
    "nav.contact": "اتصل بنا",
    "nav.book": "احجز موعدًا",

    "hero.eyebrow": "مركز أسنانكم الموثوق",
    "hero.title.before": "",
    "hero.title.highlight": "ابتسامتك",
    "hero.title.after": "، التزامنا",
    "hero.subtitle": "رعاية أسنان مخصصة وإنسانية لكل العائلة — تقنية حديثة مع لمسة دافئة ومرحّبة.",
    "hero.cta": "احجز موعدًا",
    "hero.cta2": "اكتشف الخدمات",
    "hero.badge.team": "فريق خبير",
    "hero.badge.tech": "تقنية متقدمة",
    "hero.badge.welcome": "استقبال دافئ",

    "stats.patients": "مرضى سعداء",
    "stats.reviews": "تقييمات Google",
    "stats.years": "سنوات خبرة",
    "stats.support": "دعم",

    "cta.title": "هل أنت مستعد لتغيير ابتسامتك؟",
    "cta.desc": "احجز موعدك في أقل من 60 ثانية. سنؤكد عبر الهاتف.",
    "cta.btn": "احجز زيارتك الآن",

    "about.kicker": "أطباؤنا",
    "about.title": "تعرّف على الفريق وراء ابتسامتك",
    "about.desc": "فريق صغير ومتفاني من المحترفين الشغوفين — يركّز على راحتك وابتسامة صحية مشرقة.",
    "team.dr1.name": "د. مرابط محمد",
    "team.dr1.role": "المؤسس · طب الأسنان العام والزراعة",
    "team.dr2.name": "د. حوفاني شافية",
    "team.dr2.role": "تقويم الأسنان وطب الأسنان التجميلي",

    "services.kicker": "ما نقدمه",
    "services.title": "خدماتنا الطبية للأسنان",
    "services.cleaning": "تنظيف وتلميع",
    "services.cleaning.desc": "تنظيف وتلميع احترافي لفم صحي ومنعش.",
    "services.whitening": "تبييض الأسنان",
    "services.whitening.desc": "أشرِق ابتسامتك بعدة درجات، بأمان تام.",
    "services.implants": "زراعة الأسنان",
    "services.implants.desc": "استبدل الأسنان المفقودة بزرعات تيتانيوم متينة.",
    "services.ortho": "تقويم الأسنان",
    "services.ortho.desc": "تقويم ومصففات لأسنان متراصفة بشكل مثالي.",
    "services.cavity": "علاج التسوس",
    "services.cavity.desc": "حشوات وترميمات حديثة وغير مؤلمة.",
    "services.emergency": "الحالات الطارئة",
    "services.emergency.desc": "رعاية في نفس اليوم عندما لا يحتمل الألم الانتظار.",

    "reviews.title": "ماذا يقول مرضانا",
    "reviews.r1": "حقًا أكثر فريق أسنان اهتمامًا قابلته. لم تكن ابتسامتي أجمل من ذي قبل!",
    "reviews.r1.name": "سارة ك.",
    "reviews.r2": "بدون ألم، احترافي ومرحب بشكل لا يصدق. أنصح به بشدة.",
    "reviews.r2.name": "مهدي ب.",
    "reviews.r3": "عيادة جميلة، تجهيزات حديثة وطبيب يستمع فعلًا.",
    "reviews.r3.name": "ياسمين ر.",

    "contact.title": "زوروا عيادتنا",
    "contact.address": "عنوان العيادة",
    "contact.addressVal": "123، شارع، جمورة، بسكرة، الجزائر، 07025",
    "contact.hours": "ساعات العمل",
    "contact.hoursVal": "الأحد – السبت (مغلق الجمعة) · 9:00 – 16:00",
    "contact.phone": "للتواصل",
    "contact.phoneVal": "+213 (0) 664 59 69 91",
    "contact.email": "البريد الإلكتروني",
    "contact.emailVal": "merabetmohammed7@gmail.com",
    "contact.facebook": "فيسبوك",
    "contact.facebookVal": "عيادة الدكتور مرابط محمد لزراعة تجميل وتقويم الأسنان",
    "contact.map": "جمورة، بسكرة",
    "footer.rights": "جميع الحقوق محفوظة.",

    "booking.title": "احجز موعدك",
    "booking.subtitle": "املأ معلوماتك وسنتصل بك لتأكيد الموعد.",
    "booking.name": "اسم المريض",
    "booking.phone": "رقم الهاتف",
    "booking.date": "التاريخ المطلوب",
    "booking.hour": "الساعة المفضلة",
    "booking.reason": "سبب الزيارة",
    "booking.reason.cleaning": "تنظيف الأسنان",
    "booking.reason.whitening": "تبييض الأسنان",
    "booking.reason.consultation": "استشارة",
    "booking.reason.emergency": "ألم / طوارئ",
    "booking.submit": "إرسال الطلب",
    "booking.success": "تم إرسال الطلب! سنتصل بك للتأكيد.",
    "booking.back": "← العودة إلى الرئيسية",
  },
};

interface I18nContextValue {
  lang: Lang;
  dir: "ltr" | "rtl";
  setLang: (l: Lang) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("ar");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem("mdc-lang") as Lang | null;
    if (stored && ["en", "fr", "ar"].includes(stored)) setLangState(stored);
  }, []);

  const dir: "ltr" | "rtl" = lang === "ar" ? "rtl" : "ltr";

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
  }, [lang, dir]);

  const setLang = (l: Lang) => {
    setLangState(l);
    if (typeof window !== "undefined") window.localStorage.setItem("mdc-lang", l);
  };

  const t = (key: string) => dictionaries[lang][key] ?? key;

  return (
    <I18nContext.Provider value={{ lang, dir, setLang, t }}>{children}</I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used inside I18nProvider");
  return ctx;
}
