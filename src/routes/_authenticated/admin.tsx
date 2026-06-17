import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { Background } from "@/components/Home";
import { getAdminStatus, listStaff, addStaff, removeStaff, type StaffMember } from "@/lib/staff.functions";
import "@/components/Home.css";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({ meta: [{ title: "Admin Dashboard — Merabet Dental Center" }] }),
  component: AdminPage,
});

type ApptStatus = "pending" | "confirmed" | "cancelled" | "done";
type Tab = "reservations" | "hours" | "reasons" | "staff";

interface Appointment {
  id: string;
  dentist_id: string;
  patient_name: string;
  patient_phone: string;
  appt_date: string;
  appt_hour: string;
  status: string;
  notes: string | null;
  reason_id: string | null;
  created_at: string;
}
interface Dentist { id: string; name_en: string; name_ar: string; name_fr: string; active: boolean }
interface Reason { id: string; label_en: string; label_fr: string; label_ar: string; active: boolean; sort_order: number }
interface WH { id: string; dentist_id: string; weekday: number; is_open: boolean; start_time: string; end_time: string; slot_minutes: number }

const WEEKDAYS = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

function AdminPage() {
  const navigate = useNavigate();
  const checkAdmin = useServerFn(getAdminStatus);
  const [tab, setTab] = useState<Tab>("reservations");
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [email, setEmail] = useState("");
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const status = await checkAdmin();
        setEmail(status.email);
        setCurrentUserId(status.userId);
        setIsAdmin(status.isAdmin);
      } catch {
        navigate({ to: "/auth" });
      }
    })();
  }, [checkAdmin, navigate]);

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/auth" });
  };

  if (isAdmin === null) {
    return <div className="mdc-root"><Background /><div className="adm-root"><p>Loading…</p></div></div>;
  }
  if (!isAdmin) {
    const claim = async () => {
      const { data, error } = await supabase.rpc("claim_first_admin");
      if (error) { alert(error.message); return; }
      if (data) { setIsAdmin(true); } else { alert("An admin already exists. Ask them to grant you access."); }
    };
    return (
      <div className="mdc-root"><Background />
        <div className="adm-root">
          <div className="adm-card">
            <h2>Not authorized</h2>
            <p>Your account ({email}) is signed in but does not have admin access.</p>
            <p style={{ fontSize: ".85rem", color: "#64748b" }}>
              If this is the very first admin account, click the button below to claim admin access. After that, this button will be disabled for everyone else.
            </p>
            <div style={{ display: "flex", gap: ".6rem", marginTop: ".5rem" }}>
              <button className="adm-btn adm-btn-primary" onClick={claim}>Claim admin access</button>
              <button className="adm-btn" onClick={signOut}>Sign out</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mdc-root"><Background />
      <div className="adm-root">
        <div className="adm-head">
          <h1>Admin Dashboard</h1>
          <div style={{ display: "flex", gap: ".6rem", alignItems: "center" }}>
            <Link to="/" className="adm-btn">View site</Link>
            <span style={{ fontSize: ".85rem", color: "#64748b" }}>{email}</span>
            <button className="adm-btn" onClick={signOut}>Sign out</button>
          </div>
        </div>
        <div className="adm-tabs">
          <button className={`adm-tab ${tab === "reservations" ? "active" : ""}`} onClick={() => setTab("reservations")}>Reservations</button>
          <button className={`adm-tab ${tab === "hours" ? "active" : ""}`} onClick={() => setTab("hours")}>Dentists & Hours</button>
          <button className={`adm-tab ${tab === "reasons" ? "active" : ""}`} onClick={() => setTab("reasons")}>Visit Reasons</button>
          <button className={`adm-tab ${tab === "staff" ? "active" : ""}`} onClick={() => setTab("staff")}>Staff</button>
        </div>
        {tab === "reservations" && <Reservations />}
        {tab === "hours" && <HoursPanel />}
        {tab === "reasons" && <ReasonsPanel />}
        {tab === "staff" && <StaffPanel currentUserId={currentUserId} />}
      </div>
    </div>
  );
}

/* ---------------- Reservations ---------------- */
function Reservations() {
  const [appts, setAppts] = useState<Appointment[]>([]);
  const [dentists, setDentists] = useState<Dentist[]>([]);
  const [reasons, setReasons] = useState<Reason[]>([]);
  const [statusFilter, setStatusFilter] = useState<""|ApptStatus>("");
  const [dentistFilter, setDentistFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    let q = supabase.from("appointments").select("*").order("appt_date", { ascending: false }).order("appt_hour", { ascending: true });
    if (statusFilter) q = q.eq("status", statusFilter as ApptStatus);
    if (dentistFilter) q = q.eq("dentist_id", dentistFilter);
    if (dateFilter) q = q.eq("appt_date", dateFilter);
    const { data } = await q;
    setAppts((data as Appointment[]) || []);
    setLoading(false);
  };

  useEffect(() => {
    supabase.from("dentists").select("*").then(({ data }) => setDentists((data as Dentist[]) || []));
    supabase.from("reasons").select("*").then(({ data }) => setReasons((data as Reason[]) || []));
  }, []);

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [statusFilter, dentistFilter, dateFilter]);

  const setStatus = async (id: string, status: ApptStatus) => {
    await supabase.from("appointments").update({ status }).eq("id", id);
    load();
  };
  const remove = async (id: string) => {
    if (!confirm("Delete this appointment?")) return;
    await supabase.from("appointments").delete().eq("id", id);
    load();
  };

  const dentistName = (id: string) => dentists.find((d) => d.id === id)?.name_en ?? "—";
  const reasonName = (id: string | null) => (id ? reasons.find((r) => r.id === id)?.label_en ?? "—" : "—");

  return (
    <div className="adm-card">
      <div className="adm-filters">
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as ""|ApptStatus)}>
          <option value="">All statuses</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="done">Done</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <select value={dentistFilter} onChange={(e) => setDentistFilter(e.target.value)}>
          <option value="">All dentists</option>
          {dentists.map((d) => <option key={d.id} value={d.id}>{d.name_en}</option>)}
        </select>
        <input type="date" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} />
        <button className="adm-btn" onClick={() => { setStatusFilter(""); setDentistFilter(""); setDateFilter(""); }}>Clear</button>
      </div>
      {loading ? <p>Loading…</p> : appts.length === 0 ? <p>No reservations.</p> : (
        <div style={{ overflowX: "auto" }}>
          <table className="adm-table">
            <thead><tr>
              <th>Date</th><th>Hour</th><th>Patient</th><th>Phone</th><th>Dentist</th><th>Reason</th><th>Status</th><th></th>
            </tr></thead>
            <tbody>
              {appts.map((a) => (
                <tr key={a.id}>
                  <td>{a.appt_date}</td>
                  <td>{a.appt_hour.slice(0,5)}</td>
                  <td>{a.patient_name}</td>
                  <td><a href={`tel:${a.patient_phone}`}>{a.patient_phone}</a></td>
                  <td>{dentistName(a.dentist_id)}</td>
                  <td>{reasonName(a.reason_id)}</td>
                  <td><span className={`adm-status ${a.status}`}>{a.status}</span></td>
                  <td>
                    <div className="adm-row-actions">
                      {a.status !== "confirmed" && <button className="adm-btn" onClick={() => setStatus(a.id, "confirmed")}>Confirm</button>}
                      {a.status !== "done" && <button className="adm-btn" onClick={() => setStatus(a.id, "done")}>Done</button>}
                      {a.status !== "cancelled" && <button className="adm-btn" onClick={() => setStatus(a.id, "cancelled")}>Cancel</button>}
                      <button className="adm-btn adm-btn-danger" onClick={() => remove(a.id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/* ---------------- Hours ---------------- */
function HoursPanel() {
  const [dentists, setDentists] = useState<Dentist[]>([]);
  const [hours, setHours] = useState<WH[]>([]);
  const load = async () => {
    const [d, h] = await Promise.all([
      supabase.from("dentists").select("*").order("sort_order"),
      supabase.from("working_hours").select("*"),
    ]);
    setDentists((d.data as Dentist[]) || []);
    setHours((h.data as WH[]) || []);
  };
  useEffect(() => { load(); }, []);

  const updateWH = async (id: string, patch: Partial<WH>) => {
    setHours((prev) => prev.map((w) => (w.id === id ? { ...w, ...patch } : w)));
    await supabase.from("working_hours").update(patch).eq("id", id);
  };

  return (
    <div className="adm-grid">
      {dentists.map((d) => {
        const dHours = [...hours.filter((w) => w.dentist_id === d.id)].sort((a, b) => a.weekday - b.weekday);
        return (
          <div key={d.id} className="adm-card">
            <h3 style={{ margin: "0 0 .8rem" }}>{d.name_en}</h3>
            <div className="adm-wh-row" style={{ fontWeight: 700, color: "#475569" }}>
              <div>Day</div><div>Open</div><div>Start</div><div>End</div><div>Min</div>
            </div>
            {dHours.map((w) => (
              <div key={w.id} className="adm-wh-row">
                <div>{WEEKDAYS[w.weekday]}</div>
                <div><input type="checkbox" checked={w.is_open} onChange={(e) => updateWH(w.id, { is_open: e.target.checked })} /></div>
                <div><input className="adm-input" type="time" value={w.start_time.slice(0,5)} onChange={(e) => updateWH(w.id, { start_time: e.target.value })} disabled={!w.is_open} /></div>
                <div><input className="adm-input" type="time" value={w.end_time.slice(0,5)} onChange={(e) => updateWH(w.id, { end_time: e.target.value })} disabled={!w.is_open} /></div>
                <div><input className="adm-input" type="number" min={10} max={120} step={5} value={w.slot_minutes} onChange={(e) => updateWH(w.id, { slot_minutes: Number(e.target.value) })} disabled={!w.is_open} /></div>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}

/* ---------------- Reasons ---------------- */
function ReasonsPanel() {
  const [reasons, setReasons] = useState<Reason[]>([]);
  const [draft, setDraft] = useState({ label_en: "", label_fr: "", label_ar: "" });

  const load = async () => {
    const { data } = await supabase.from("reasons").select("*").order("sort_order");
    setReasons((data as Reason[]) || []);
  };
  useEffect(() => { load(); }, []);

  const add = async () => {
    if (!draft.label_en || !draft.label_fr || !draft.label_ar) return;
    const sort = (reasons[reasons.length - 1]?.sort_order ?? 0) + 1;
    await supabase.from("reasons").insert({ ...draft, sort_order: sort });
    setDraft({ label_en: "", label_fr: "", label_ar: "" });
    load();
  };
  const update = async (id: string, patch: Partial<Reason>) => {
    setReasons((p) => p.map((r) => (r.id === id ? { ...r, ...patch } : r)));
    await supabase.from("reasons").update(patch).eq("id", id);
  };
  const remove = async (id: string) => {
    if (!confirm("Delete this reason?")) return;
    await supabase.from("reasons").delete().eq("id", id);
    load();
  };

  return (
    <div className="adm-card">
      <table className="adm-table">
        <thead><tr><th>EN</th><th>FR</th><th>AR</th><th>Active</th><th></th></tr></thead>
        <tbody>
          {reasons.map((r) => (
            <tr key={r.id}>
              <td><input className="adm-input" value={r.label_en} onChange={(e) => update(r.id, { label_en: e.target.value })} /></td>
              <td><input className="adm-input" value={r.label_fr} onChange={(e) => update(r.id, { label_fr: e.target.value })} /></td>
              <td><input className="adm-input" dir="rtl" value={r.label_ar} onChange={(e) => update(r.id, { label_ar: e.target.value })} /></td>
              <td><input type="checkbox" checked={r.active} onChange={(e) => update(r.id, { active: e.target.checked })} /></td>
              <td><button className="adm-btn adm-btn-danger" onClick={() => remove(r.id)}>Delete</button></td>
            </tr>
          ))}
          <tr>
            <td><input className="adm-input" placeholder="English" value={draft.label_en} onChange={(e) => setDraft({ ...draft, label_en: e.target.value })} /></td>
            <td><input className="adm-input" placeholder="Français" value={draft.label_fr} onChange={(e) => setDraft({ ...draft, label_fr: e.target.value })} /></td>
            <td><input className="adm-input" dir="rtl" placeholder="العربية" value={draft.label_ar} onChange={(e) => setDraft({ ...draft, label_ar: e.target.value })} /></td>
            <td></td>
            <td><button className="adm-btn adm-btn-primary" onClick={add}>Add</button></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

/* ---------------- Staff ---------------- */
function StaffPanel({ currentUserId }: { currentUserId: string | null }) {
  const list = useServerFn(listStaff);
  const add = useServerFn(addStaff);
  const remove = useServerFn(removeStaff);
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [draft, setDraft] = useState<{ email: string; password: string; role: "admin" | "staff" }>({
    email: "", password: "", role: "staff",
  });

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await list();
      setStaff(data);
    } catch (e: any) {
      setError(e.message || "Failed to load staff");
    }
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const onAdd = async () => {
    if (!draft.email || !draft.password) return;
    setBusy(true); setError("");
    try {
      await add({ data: draft });
      setDraft({ email: "", password: "", role: "staff" });
      await load();
    } catch (e: any) {
      setError(e.message || "Failed to add");
    }
    setBusy(false);
  };

  const onRemove = async (m: StaffMember) => {
    if (!confirm(`Remove ${m.role} role from ${m.email}?`)) return;
    try {
      await remove({ data: { user_id: m.user_id, role: m.role } });
      await load();
    } catch (e: any) {
      alert(e.message || "Failed to remove");
    }
  };

  return (
    <div className="adm-card">
      <h3 style={{ margin: "0 0 .8rem" }}>Add a staff or admin account</h3>
      <div className="adm-filters" style={{ marginBottom: "1rem" }}>
        <input className="adm-input" placeholder="email@example.com" value={draft.email}
          onChange={(e) => setDraft({ ...draft, email: e.target.value })} />
        <input className="adm-input" type="password" placeholder="Password (min 6)" value={draft.password}
          onChange={(e) => setDraft({ ...draft, password: e.target.value })} />
        <select value={draft.role} onChange={(e) => setDraft({ ...draft, role: e.target.value as "admin" | "staff" })}>
          <option value="staff">Staff</option>
          <option value="admin">Admin</option>
        </select>
        <button className="adm-btn adm-btn-primary" onClick={onAdd} disabled={busy}>
          {busy ? "Adding…" : "Add account"}
        </button>
      </div>
      {error && <div className="db-error" style={{ marginBottom: "1rem" }}>{error}</div>}

      <h3 style={{ margin: "0 0 .8rem" }}>Current staff</h3>
      {loading ? <p>Loading…</p> : staff.length === 0 ? <p>No staff yet.</p> : (
        <table className="adm-table">
          <thead><tr><th>Email</th><th>Role</th><th>Added</th><th></th></tr></thead>
          <tbody>
            {staff.map((m) => (
              <tr key={`${m.user_id}-${m.role}`}>
                <td>{m.email}</td>
                <td><span className={`adm-status ${m.role === "admin" ? "confirmed" : "pending"}`}>{m.role}</span></td>
                <td>{new Date(m.created_at).toLocaleDateString()}</td>
                <td>
                  <button className="adm-btn adm-btn-danger" onClick={() => onRemove(m)}>Remove</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
