## Plan: Admin Dashboard + Real Booking System

### 1. Enable Lovable Cloud (Supabase)
Provision database, auth, and storage in one click.

### 2. Database schema (migration)
- `dentists` — id, name, name_ar, name_fr, active
- `working_hours` — id, dentist_id, weekday (0–6), start_time, end_time, slot_minutes (default 30)
- `reasons` — id, key, label_en, label_fr, label_ar, active, sort_order (admin-editable)
- `appointments` — id, dentist_id, patient_name, patient_phone, date, hour, reason_id, status (pending/confirmed/cancelled/done), notes, created_at
- `user_roles` + `app_role` enum + `has_role()` security-definer function (per project rules)
- Seed: Dr. Merabet Mohammed, Dr. Houfani Chafia, default reasons, default working hours (Sun–Sat except Fri, 9:00–16:00)
- RLS:
  - Public can `INSERT` appointments and `SELECT` dentists/reasons/working_hours (read-only)
  - Public can `SELECT` taken slots (date + hour + dentist only) to gray out
  - Only admins can `SELECT/UPDATE/DELETE` full appointments, and manage dentists/hours/reasons
- Grants on every public table per project rules

### 3. Booking page updates (`Booking.tsx`)
- Add **dentist selector** (radio cards with both dentists)
- After dentist + date chosen, fetch working hours for that weekday + already-booked slots
- Generate slot list dynamically; gray out taken slots (disabled + "Booked" label)
- Reasons loaded from DB (admin-editable list)
- Submit inserts into `appointments` table (status = pending)
- Success toast

### 4. Default language = Arabic
- Change `useState<Lang>("en")` → `"ar"` in `i18n.tsx` (still respects stored preference)

### 5. Admin auth
- `/auth` page: email + password sign-in only (no signup UI; you create the account, I grant admin role via SQL after)
- `_authenticated/` layout (managed by integration)

### 6. Admin dashboard `/admin` (protected, admin-only)
Tabs:
- **Reservations**: table of all appointments, filter by status/date/dentist, actions: Confirm / Cancel / Mark done / Delete, click row to see details
- **Dentists & Hours**: list dentists, edit weekly working hours per dentist (Sun–Sat rows, start/end time, toggle off = closed)
- **Reasons**: CRUD on visit reasons with EN/FR/AR labels and active toggle
- Sign-out button

### 7. Technical notes
- TanStack server functions (`*.functions.ts`) for all DB reads/writes
- `requireSupabaseAuth` middleware + `has_role` check on admin mutations
- Public booking writes via a public server fn (admin client, validated input with Zod)
- Slot availability: server fn returns `{ workingHours, takenSlots }` for a given dentist + date

### Out of scope (ask if you want them)
- Email/SMS confirmation to patient
- Calendar view UI (table view first)
- Multi-clinic / multiple chairs per dentist

Confirm and I'll build it.