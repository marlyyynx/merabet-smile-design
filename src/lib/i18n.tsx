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
    "hero.title": "Your smile deserves the best care",
    "hero.subtitle": "Modern, gentle dental care for the whole family at Merabet Dental Center.",
    "hero.cta": "Book Your Visit",
    "about.kicker": "Welcome",
    "about.title": "Welcome to Merabet Dental Center",
    "about.desc": "A team of passionate professionals dedicated to your comfort and a healthy, radiant smile.",
    "team.dr1.name": "Dr. Amine Merabet",
    "team.dr1.role": "Founder · Implantologist",
    "team.dr2.name": "Dr. Lina Merabet",
    "team.dr2.role": "Orthodontist",
    "team.dr3.name": "Dr. Sami Bensaid",
    "team.dr3.role": "Cosmetic Dentistry",
    "services.title": "Our Dental Services",
    "services.cleaning": "Cleaning",
    "services.cleaning.desc": "Professional scaling and polishing for a fresh, healthy mouth.",
    "services.whitening": "Whitening",
    "services.whitening.desc": "Brighten your smile by several shades, safely.",
    "services.implants": "Implants",
    "services.implants.desc": "Restore missing teeth with durable titanium implants.",
    "services.ortho": "Orthodontics",
    "services.ortho.desc": "Braces and aligners for perfectly aligned teeth.",
    "services.cavity": "Cavity Care",
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
    "contact.title": "Visit Us",
    "contact.address": "Address",
    "contact.addressVal": "12 Avenue des Roses, Algiers",
    "contact.hours": "Working Hours",
    "contact.hoursVal": "Sat – Thu · 9:00 – 19:00",
    "contact.phone": "Phone",
    "contact.phoneVal": "+213 555 123 456",
    "contact.map": "Interactive Map",
    "footer.rights": "All rights reserved.",
    "booking.title": "Book Your Appointment",
    "booking.subtitle": "Fill in your details and we'll call you to confirm.",
    "booking.name": "Patient Name",
    "booking.phone": "Phone Number",
    "booking.date": "Requested Date",
    "booking.reason": "Reason for Visit",
    "booking.reason.cleaning": "Cleaning",
    "booking.reason.whitening": "Whitening",
    "booking.reason.consultation": "Consultation",
    "booking.reason.emergency": "Pain / Emergency",
    "booking.submit": "Submit Request",
    "booking.success": "Request sent! We will call you to confirm.",
    "booking.back": "← Back to home",
  },
  fr: {
    "nav.home": "Accueil",
    "nav.about": "À propos",
    "nav.services": "Services",
    "nav.contact": "Contact",
    "nav.book": "Prendre RDV",
    "hero.title": "Votre sourire mérite les meilleurs soins",
    "hero.subtitle": "Des soins dentaires modernes et doux pour toute la famille au Centre Dentaire Merabet.",
    "hero.cta": "Réserver une visite",
    "about.kicker": "Bienvenue",
    "about.title": "Bienvenue au Centre Dentaire Merabet",
    "about.desc": "Une équipe de professionnels passionnés, dédiée à votre confort et à un sourire sain et éclatant.",
    "team.dr1.name": "Dr. Amine Merabet",
    "team.dr1.role": "Fondateur · Implantologue",
    "team.dr2.name": "Dr. Lina Merabet",
    "team.dr2.role": "Orthodontiste",
    "team.dr3.name": "Dr. Sami Bensaid",
    "team.dr3.role": "Dentisterie esthétique",
    "services.title": "Nos services dentaires",
    "services.cleaning": "Détartrage",
    "services.cleaning.desc": "Nettoyage professionnel pour une bouche saine et fraîche.",
    "services.whitening": "Blanchiment",
    "services.whitening.desc": "Éclaircissez votre sourire de plusieurs teintes, en toute sécurité.",
    "services.implants": "Implants",
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
    "contact.title": "Rendez-nous visite",
    "contact.address": "Adresse",
    "contact.addressVal": "12 Avenue des Roses, Alger",
    "contact.hours": "Horaires",
    "contact.hoursVal": "Sam – Jeu · 9h00 – 19h00",
    "contact.phone": "Téléphone",
    "contact.phoneVal": "+213 555 123 456",
    "contact.map": "Carte interactive",
    "footer.rights": "Tous droits réservés.",
    "booking.title": "Réservez votre rendez-vous",
    "booking.subtitle": "Remplissez vos coordonnées et nous vous appellerons pour confirmer.",
    "booking.name": "Nom du patient",
    "booking.phone": "Numéro de téléphone",
    "booking.date": "Date souhaitée",
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
    "hero.title": "ابتسامتك تستحق أفضل رعاية",
    "hero.subtitle": "رعاية أسنان حديثة ولطيفة لكل العائلة في مركز مرابط لطب الأسنان.",
    "hero.cta": "احجز زيارتك",
    "about.kicker": "مرحبًا",
    "about.title": "مرحبًا بكم في مركز مرابط لطب الأسنان",
    "about.desc": "فريق من المحترفين الشغوفين، مكرّس لراحتك وابتسامة صحية مشرقة.",
    "team.dr1.name": "د. أمين مرابط",
    "team.dr1.role": "المؤسس · أخصائي زراعة الأسنان",
    "team.dr2.name": "د. لينا مرابط",
    "team.dr2.role": "أخصائية تقويم الأسنان",
    "team.dr3.name": "د. سامي بن سعيد",
    "team.dr3.role": "طب الأسنان التجميلي",
    "services.title": "خدماتنا الطبية للأسنان",
    "services.cleaning": "تنظيف الأسنان",
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
    "contact.title": "قم بزيارتنا",
    "contact.address": "العنوان",
    "contact.addressVal": "12 شارع الورود، الجزائر",
    "contact.hours": "ساعات العمل",
    "contact.hoursVal": "السبت – الخميس · 9:00 – 19:00",
    "contact.phone": "الهاتف",
    "contact.phoneVal": "+213 555 123 456",
    "contact.map": "خريطة تفاعلية",
    "footer.rights": "جميع الحقوق محفوظة.",
    "booking.title": "احجز موعدك",
    "booking.subtitle": "املأ معلوماتك وسنتصل بك لتأكيد الموعد.",
    "booking.name": "اسم المريض",
    "booking.phone": "رقم الهاتف",
    "booking.date": "التاريخ المطلوب",
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
  const [lang, setLangState] = useState<Lang>("en");

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
