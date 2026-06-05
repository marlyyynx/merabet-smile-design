import { useEffect, useRef } from "react";
import { Link } from "@tanstack/react-router";
import { useI18n, type Lang } from "@/lib/i18n";
import logoAsset from "@/assets/merabet-logo.png.asset.json";
import heroImg from "@/assets/hero-smile.jpg";
import "./Home.css";

function useScrollReveal() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const els = document.querySelectorAll(".mdc-reveal");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

export function Navbar() {
  const { t, lang, setLang, dir } = useI18n();
  const navRef = useRef<HTMLElement>(null);
  const langs: Lang[] = ["en", "fr", "ar"];

  const toggle = () => navRef.current?.classList.toggle("is-open");
  const close = () => navRef.current?.classList.remove("is-open");

  return (
    <nav ref={navRef} className="mdc-nav" dir={dir}>
      <Link to="/" className="mdc-nav-brand" onClick={close}>
        <img src={logoAsset.url} alt="Merabet Dental Center logo" />
        <strong>Merabet Dental</strong>
      </Link>
      <div className="mdc-nav-links">
        <a href="#home" onClick={close}>{t("nav.home")}</a>
        <a href="#about" onClick={close}>{t("nav.about")}</a>
        <a href="#services" onClick={close}>{t("nav.services")}</a>
        <a href="#contact" onClick={close}>{t("nav.contact")}</a>
      </div>
      <div className="mdc-nav-right">
        <div className="mdc-lang" role="group" aria-label="Language">
          {langs.map((l) => (
            <button
              key={l}
              type="button"
              className={l === lang ? "active" : ""}
              onClick={() => setLang(l)}
            >
              {l}
            </button>
          ))}
        </div>
        <Link to="/booking" className="mdc-btn mdc-btn-primary" onClick={close}>
          {t("nav.book")}
        </Link>
        <button className="mdc-nav-toggle" onClick={toggle} aria-label="Toggle menu">
          ☰
        </button>
      </div>
    </nav>
  );
}

export function Background() {
  return (
    <>
      <div className="mdc-orb mdc-orb-1" />
      <div className="mdc-orb mdc-orb-2" />
      <div className="mdc-orb mdc-orb-3" />
    </>
  );
}

const SERVICES = [
  { icon: "🪥", key: "cleaning" },
  { icon: "✨", key: "whitening" },
  { icon: "🦷", key: "implants" },
  { icon: "📏", key: "ortho" },
  { icon: "🛡️", key: "cavity" },
  { icon: "🚑", key: "emergency" },
];

const TEAM = [
  { initials: "AM", key: "dr1" },
  { initials: "LM", key: "dr2" },
  { initials: "SB", key: "dr3" },
];

const REVIEWS = ["r1", "r2", "r3"];

export default function Home() {
  const { t, dir } = useI18n();
  useScrollReveal();

  return (
    <div className="mdc-root" dir={dir}>
      <Background />
      <Navbar />

      {/* HERO */}
      <header id="home" className="mdc-hero">
        <div className="mdc-hero-wrap">
          <div className="mdc-glass mdc-hero-card mdc-reveal">
            <span className="mdc-kicker">Merabet Dental Center</span>
            <h1>
              <span>{t("hero.title")}</span>
            </h1>
            <p>{t("hero.subtitle")}</p>
            <Link to="/booking" className="mdc-btn mdc-btn-primary">
              {t("hero.cta")} →
            </Link>
          </div>
          <div className="mdc-hero-img mdc-reveal">
            <img src={heroImg} alt="Bright confident smile" />
          </div>
        </div>
      </header>

      {/* ABOUT / TEAM */}
      <section id="about" className="mdc-section">
        <div className="mdc-section-head mdc-reveal">
          <span className="mdc-kicker">{t("about.kicker")}</span>
          <h2>{t("about.title")}</h2>
          <p className="lead">{t("about.desc")}</p>
        </div>
        <div className="mdc-team-grid">
          {TEAM.map((m) => (
            <div key={m.key} className="mdc-glass mdc-team-card mdc-reveal">
              <div className="mdc-avatar">{m.initials}</div>
              <h3>{t(`team.${m.key}.name`)}</h3>
              <p>{t(`team.${m.key}.role`)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="mdc-section">
        <div className="mdc-section-head mdc-reveal">
          <h2>{t("services.title")}</h2>
        </div>
        <div className="mdc-services-grid">
          {SERVICES.map((s) => (
            <div key={s.key} className="mdc-glass mdc-service mdc-reveal">
              <div className="mdc-service-icon">{s.icon}</div>
              <h3>{t(`services.${s.key}`)}</h3>
              <p>{t(`services.${s.key}.desc`)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* REVIEWS */}
      <section className="mdc-section">
        <div className="mdc-section-head mdc-reveal">
          <h2>{t("reviews.title")}</h2>
        </div>
        <div className="mdc-reviews-grid">
          {REVIEWS.map((r) => (
            <div key={r} className="mdc-glass mdc-review mdc-reveal">
              <div className="mdc-stars">★★★★★</div>
              <p>"{t(`reviews.${r}`)}"</p>
              <div className="name">— {t(`reviews.${r}.name`)}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="mdc-section">
        <div className="mdc-section-head mdc-reveal">
          <h2>{t("contact.title")}</h2>
        </div>
        <div className="mdc-contact-grid">
          <div className="mdc-glass mdc-contact-info mdc-reveal">
            <div className="mdc-contact-item">
              <div className="icon">📍</div>
              <div>
                <h4>{t("contact.address")}</h4>
                <p>{t("contact.addressVal")}</p>
              </div>
            </div>
            <div className="mdc-contact-item">
              <div className="icon">🕒</div>
              <div>
                <h4>{t("contact.hours")}</h4>
                <p>{t("contact.hoursVal")}</p>
              </div>
            </div>
            <div className="mdc-contact-item">
              <div className="icon">📞</div>
              <div>
                <h4>{t("contact.phone")}</h4>
                <p>{t("contact.phoneVal")}</p>
              </div>
            </div>
          </div>
          <div className="mdc-glass mdc-map mdc-reveal">
            <div className="pin" aria-hidden />
            <div className="label">{t("contact.map")}</div>
          </div>
        </div>
      </section>

      <footer className="mdc-footer">
        © {new Date().getFullYear()} Merabet Dental Center — {t("footer.rights")}
      </footer>
    </div>
  );
}
