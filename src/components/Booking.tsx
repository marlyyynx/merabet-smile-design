import { useState, type FormEvent } from "react";
import { Link } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n";
import { Background, Navbar } from "./Home";
import "./Home.css";

interface BookingData {
  name: string;
  phone: string;
  date: string;
  hour: string;
  reason: string;
}

const HOURS = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "13:30", "14:00", "14:30", "15:00", "15:30",
  "16:00", "16:30", "17:00", "17:30", "18:00", "18:30",
];

export default function Booking() {
  const { t, dir } = useI18n();
  const [data, setData] = useState<BookingData>({
    name: "", phone: "", date: "", hour: "", reason: "cleaning",
  });
  const [sent, setSent] = useState(false);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log("Booking request:", data);
    setSent(true);
  };

  const update =
    (k: keyof BookingData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setData((d) => ({ ...d, [k]: e.target.value }));

  return (
    <div className="mdc-root db-root" dir={dir}>
      <Background />
      <Navbar />
      <div className="db-card">
        <Link to="/" className="db-back">{t("booking.back")}</Link>
        <h1>{t("booking.title")}</h1>
        <p className="db-sub">{t("booking.subtitle")}</p>

        <form onSubmit={onSubmit}>
          <div className="db-field">
            <label htmlFor="name">{t("booking.name")}</label>
            <input id="name" type="text" required value={data.name} onChange={update("name")} />
          </div>
          <div className="db-field">
            <label htmlFor="phone">{t("booking.phone")}</label>
            <input id="phone" type="tel" required value={data.phone} onChange={update("phone")} />
          </div>
          <div className="db-field">
            <label htmlFor="date">{t("booking.date")}</label>
            <input id="date" type="date" required value={data.date} onChange={update("date")} />
          </div>

          <div className="db-field">
            <label>{t("booking.hour")}</label>
            <div className="db-hours">
              {HOURS.map((h) => (
                <button
                  key={h}
                  type="button"
                  className={`db-hour ${data.hour === h ? "active" : ""}`}
                  onClick={() => setData((d) => ({ ...d, hour: h }))}
                >
                  {h}
                </button>
              ))}
            </div>
          </div>

          <div className="db-field">
            <label htmlFor="reason">{t("booking.reason")}</label>
            <select id="reason" value={data.reason} onChange={update("reason")}>
              <option value="cleaning">{t("booking.reason.cleaning")}</option>
              <option value="whitening">{t("booking.reason.whitening")}</option>
              <option value="consultation">{t("booking.reason.consultation")}</option>
              <option value="emergency">{t("booking.reason.emergency")}</option>
            </select>
          </div>

          <button type="submit" className="mdc-btn mdc-btn-primary db-submit" disabled={!data.hour}>
            {t("booking.submit")}
          </button>
        </form>

        {sent && <div className="db-success">{t("booking.success")}</div>}
      </div>
    </div>
  );
}
