import { useEffect, useRef } from "react";
import { Link } from "@tanstack/react-router";
import { useI18n, type Lang } from "@/lib/i18n";
import logoAsset from "@/assets/merabet-logo.png.asset.json";
import heroImg from "@/assets/hero-clinic.jpg";
import svcCleaning from "@/assets/services/cleaning.png.asset.json";
import svcWhitening from "@/assets/services/whitening.png.asset.json";
import svcImplants from "@/assets/services/implants.png.asset.json";
import svcOrtho from "@/assets/services/ortho.png.asset.json";
import svcCavity from "@/assets/services/cavity.png.asset.json";
import svcEmergency from "@/assets/services/emergency.png.asset.json";
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
  { key: "cleaning", img: svcCleaning.url },
  { key: "whitening", img: svcWhitening.url },
  { key: "implants", img: svcImplants.url },
  { key: "ortho", img: svcOrtho.url },
  { key: "cavity", img: svcCavity.url },
  { key: "emergency", img: svcEmergency.url },
];

const TEAM = [
  { initials: "MM", key: "dr1" },
  { initials: "HC", key: "dr2" },
];

const REVIEWS = ["r1", "r2", "r3"];

const STATS = [
  { num: "+2500", key: "stats.patients" },
  { num: "5★", key: "stats.reviews" },
  { num: "10+", key: "stats.years" },
  { num: "24/7", key: "stats.support" },
];

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
          <div className="mdc-hero-content mdc-reveal">
            <span className="mdc-eyebrow">{t("hero.eyebrow")}</span>
            <h1 className="mdc-hero-title">
              {t("hero.title.before")}
              <span className="mdc-grad-text">{t("hero.title.highlight")}</span>
              {t("hero.title.after")}
            </h1>
            <p className="mdc-hero-sub">{t("hero.subtitle")}</p>

            <div className="mdc-badges">
              <span className="mdc-badge">✨ {t("hero.badge.team")}</span>
              <span className="mdc-badge">🦷 {t("hero.badge.tech")}</span>
              <span className="mdc-badge">💗 {t("hero.badge.welcome")}</span>
            </div>

            <div className="mdc-hero-ctas">
              <Link to="/booking" className="mdc-btn mdc-btn-primary">
                {t("hero.cta")} →
              </Link>
              <a href="#services" className="mdc-btn mdc-btn-ghost">
                {t("hero.cta2")}
              </a>
            </div>
          </div>

          <div className="mdc-hero-img mdc-reveal">
            <img src={heroImg} alt="Merabet Dental Center interior" width={1280} height={1024} />
          </div>
        </div>

        {/* Floating stats bar */}
        <div className="mdc-stats db-card mdc-reveal">
          {STATS.map((s) => (
            <div key={s.key} className="mdc-stat">
              <div className="mdc-stat-num">{s.num}</div>
              <div className="mdc-stat-label">{t(s.key)}</div>
            </div>
          ))}
        </div>
      </header>

      {/* BOOKING PUSH CTA */}
      <section className="mdc-section mdc-cta-section">
        <div className="mdc-cta-card mdc-reveal">
          <div>
            <h2>{t("cta.title")}</h2>
            <p>{t("cta.desc")}</p>
          </div>
          <Link to="/booking" className="mdc-btn mdc-btn-primary mdc-cta-btn">
            {t("cta.btn")} →
          </Link>
        </div>
      </section>

      {/* TEAM */}
      <section id="about" className="mdc-section">
        <div className="mdc-section-head mdc-reveal">
          <span className="mdc-kicker">{t("about.kicker")}</span>
          <h2>{t("about.title")}</h2>
          <p className="lead">{t("about.desc")}</p>
        </div>
        <div className="mdc-team-grid mdc-team-grid-2">
          {TEAM.map((m) => (
            <div key={m.key} className="mdc-glass mdc-team-card mdc-reveal">
              <div className="mdc-avatar">{m.initials}</div>
              <h3>{t(`team.${m.key}.name`)}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* SERVICES — image card grid */}
      <section id="services" className="mdc-section">
        <div className="mdc-section-head mdc-reveal">
          <span className="mdc-kicker">{t("services.kicker")}</span>
          <h2>{t("services.title")}</h2>
        </div>
        <div className="mdc-svc-grid">
          {SERVICES.map((s) => (
            <article key={s.key} className="mdc-glass mdc-svc-card mdc-reveal">
              <div className="mdc-svc-img">
                <img src={s.img} alt={t(`services.${s.key}`)} loading="lazy" />
              </div>
              <div className="mdc-svc-body">
                <h3>{t(`services.${s.key}`)}</h3>
                <p>{t(`services.${s.key}.desc`)}</p>
              </div>
            </article>
          ))}
        </div>
        <div className="mdc-svc-foot mdc-reveal">
          <Link to="/booking" className="mdc-btn mdc-btn-primary">{t("nav.book")} →</Link>
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
        <div className="mdc-contact-grid">
          <div className="mdc-contact-info mdc-reveal">
            <h2 className="mdc-contact-h2">{t("contact.title")}</h2>
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
                <p><a href="tel:+213664596991">{t("contact.phoneVal")}</a></p>
                <p><a href="mailto:merabetmohammed7@gmail.com">{t("contact.emailVal")}</a></p>
                <p className="mdc-fb">
                  <span className="mdc-fb-icon" aria-hidden>
                    <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                      <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.51 1.49-3.9 3.78-3.9 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.77l-.44 2.89h-2.33v6.99A10 10 0 0 0 22 12z"/>
                    </svg>
                  </span>
                  <a
                    href="https://www.facebook.com/search/top?q=%D8%B9%D9%8A%D8%A7%D8%AF%D8%A9%20%D8%A7%D9%84%D8%AF%D9%83%D8%AA%D9%88%D8%B1%20%D9%85%D8%B1%D8%A7%D8%A8%D8%B7%20%D9%85%D8%AD%D9%85%D8%AF"
                    target="_blank" rel="noopener noreferrer"
                  >{t("contact.facebookVal")}</a>
                </p>
              </div>
            </div>
          </div>
          <div className="mdc-map-pin mdc-reveal" aria-label={t("contact.map")}>
            <div className="mdc-map-pin-inner">
              <iframe
                title="Map"
                src="https://www.google.com/maps?q=Djemorah,+Biskra,+Algeria&output=embed"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <div className="mdc-map-pin-tail" />
          </div>
        </div>
      </section>

      <footer className="mdc-footer">
        © {new Date().getFullYear()} Merabet Dental Center — {t("footer.rights")}
      </footer>
    </div>
  );
}
