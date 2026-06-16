import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Link } from "@tanstack/react-router";
import { useI18n, type Lang } from "@/lib/i18n";
import { supabase } from "@/integrations/supabase/client";
import { Background, Navbar } from "./Home";
import "./Home.css";

interface Dentist {
  id: string;
  name_en: string;
  name_fr: string;
  name_ar: string;
}
interface Reason {
  id: string;
  label_en: string;
  label_fr: string;
  label_ar: string;
}
interface WorkingHour {
  weekday: number;
  is_open: boolean;
  start_time: string;
  end_time: string;
  slot_minutes: number;
}

function pickName(d: Dentist, lang: Lang) {
  return lang === "ar" ? d.name_ar : lang === "fr" ? d.name_fr : d.name_en;
}
function pickReason(r: Reason, lang: Lang) {
  return lang === "ar" ? r.label_ar : lang === "fr" ? r.label_fr : r.label_en;
}

function generateSlots(start: string, end: string, minutes: number): string[] {
  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);
  const startMin = sh * 60 + sm;
  const endMin = eh * 60 + em;
  const out: string[] = [];
  for (let t = startMin; t + minutes <= endMin; t += minutes) {
    const h = Math.floor(t / 60);
    const m = t % 60;
    out.push(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
  }
  return out;
}

export default function Booking() {
  const { t, dir, lang } = useI18n();
  const [dentists, setDentists] = useState<Dentist[]>([]);
  const [reasons, setReasons] = useState<Reason[]>([]);
  const [dentistId, setDentistId] = useState("");
  const [reasonId, setReasonId] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [hour, setHour] = useState("");

  const [workingHours, setWorkingHours] = useState<WorkingHour[]>([]);
  const [takenHours, setTakenHours] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  // Load dentists + reasons
  useEffect(() => {
    (async () => {
      const [d, r] = await Promise.all([
        supabase.from("dentists").select("id,name_en,name_fr,name_ar").eq("active", true).order("sort_order"),
        supabase.from("reasons").select("id,label_en,label_fr,label_ar").eq("active", true).order("sort_order"),
      ]);
      if (d.data) {
        setDentists(d.data);
        if (d.data.length && !dentistId) setDentistId(d.data[0].id);
      }
      if (r.data) {
        setReasons(r.data);
        if (r.data.length && !reasonId) setReasonId(r.data[0].id);
      }
    })();
     
  }, []);

  // Load working hours for chosen dentist
  useEffect(() => {
    if (!dentistId) return;
    (async () => {
      const { data } = await supabase
        .from("working_hours")
        .select("weekday,is_open,start_time,end_time,slot_minutes")
        .eq("dentist_id", dentistId);
      setWorkingHours((data as WorkingHour[]) || []);
    })();
  }, [dentistId]);

  // Load taken slots for chosen dentist+date
  useEffect(() => {
    setHour("");
    if (!dentistId || !date) {
      setTakenHours([]);
      return;
    }
    setLoadingSlots(true);
    (async () => {
      const { data } = await supabase
        .from("taken_slots")
        .select("appt_hour")
        .eq("dentist_id", dentistId)
        .eq("appt_date", date);
      setTakenHours((data || []).map((row: { appt_hour: string }) => row.appt_hour.slice(0, 5)));
      setLoadingSlots(false);
    })();
  }, [dentistId, date]);

  const todayWH = useMemo(() => {
    if (!date) return null;
    const wd = new Date(date + "T00:00:00").getDay(); // 0=Sun
    return workingHours.find((w) => w.weekday === wd) || null;
  }, [date, workingHours]);

  const slots = useMemo(() => {
    if (!todayWH || !todayWH.is_open) return [];
    return generateSlots(todayWH.start_time.slice(0, 5), todayWH.end_time.slice(0, 5), todayWH.slot_minutes);
  }, [todayWH]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    if (!dentistId || !date || !hour || !name || !phone) return;
    setSubmitting(true);
    const { error: err } = await supabase.from("appointments").insert({
      dentist_id: dentistId,
      patient_name: name.trim().slice(0, 100),
      patient_phone: phone.trim().slice(0, 30),
      appt_date: date,
      appt_hour: hour,
      reason_id: reasonId || null,
      status: "pending",
    });
    setSubmitting(false);
    if (err) {
      setError(t("booking.error"));
      return;
    }
    setSent(true);
    setTakenHours((prev) => [...prev, hour]);
    setHour("");
  };

  const minDate = new Date().toISOString().slice(0, 10);

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
            <label>{t("booking.dentist")}</label>
            <div className="db-dentists">
              {dentists.map((d) => (
                <button
                  key={d.id}
                  type="button"
                  className={`db-dentist ${dentistId === d.id ? "active" : ""}`}
                  onClick={() => setDentistId(d.id)}
                >
                  {pickName(d, lang)}
                </button>
              ))}
            </div>
          </div>

          <div className="db-field">
            <label htmlFor="name">{t("booking.name")}</label>
            <input id="name" type="text" required maxLength={100} value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="db-field">
            <label htmlFor="phone">{t("booking.phone")}</label>
            <input id="phone" type="tel" required maxLength={30} value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
          <div className="db-field">
            <label htmlFor="date">{t("booking.date")}</label>
            <input id="date" type="date" required min={minDate} value={date} onChange={(e) => setDate(e.target.value)} />
          </div>

          <div className="db-field">
            <label>{t("booking.hour")}</label>
            {!date && <div className="db-hint">{t("booking.pickDate")}</div>}
            {date && todayWH && !todayWH.is_open && <div className="db-hint">{t("booking.closed")}</div>}
            {date && slots.length > 0 && (
              <div className="db-hours">
                {slots.map((h) => {
                  const taken = takenHours.includes(h);
                  return (
                    <button
                      key={h}
                      type="button"
                      disabled={taken || loadingSlots}
                      className={`db-hour ${hour === h ? "active" : ""} ${taken ? "taken" : ""}`}
                      onClick={() => setHour(h)}
                      title={taken ? t("booking.taken") : ""}
                    >
                      {h}
                      {taken && <span className="db-hour-taken">{t("booking.taken")}</span>}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div className="db-field">
            <label htmlFor="reason">{t("booking.reason")}</label>
            <select id="reason" value={reasonId} onChange={(e) => setReasonId(e.target.value)}>
              {reasons.map((r) => (
                <option key={r.id} value={r.id}>{pickReason(r, lang)}</option>
              ))}
            </select>
          </div>

          {error && <div className="db-error">{error}</div>}

          <button type="submit" className="mdc-btn mdc-btn-primary db-submit" disabled={!hour || submitting}>
            {submitting ? "…" : t("booking.submit")}
          </button>
        </form>

        {sent && <div className="db-success">{t("booking.success")}</div>}
      </div>
    </div>
  );
}
