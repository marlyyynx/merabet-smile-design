
-- Roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE POLICY "Users view own roles" ON public.user_roles FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

-- Dentists
CREATE TABLE public.dentists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name_en text NOT NULL,
  name_fr text NOT NULL,
  name_ar text NOT NULL,
  active boolean NOT NULL DEFAULT true,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.dentists TO anon, authenticated;
GRANT ALL ON public.dentists TO service_role;
ALTER TABLE public.dentists ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view active dentists" ON public.dentists FOR SELECT
  USING (active = true OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage dentists" ON public.dentists FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Working hours: per dentist, per weekday (0=Sunday .. 6=Saturday)
CREATE TABLE public.working_hours (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  dentist_id uuid NOT NULL REFERENCES public.dentists(id) ON DELETE CASCADE,
  weekday smallint NOT NULL CHECK (weekday BETWEEN 0 AND 6),
  is_open boolean NOT NULL DEFAULT true,
  start_time time NOT NULL DEFAULT '09:00',
  end_time time NOT NULL DEFAULT '16:00',
  slot_minutes int NOT NULL DEFAULT 30,
  UNIQUE (dentist_id, weekday)
);
GRANT SELECT ON public.working_hours TO anon, authenticated;
GRANT ALL ON public.working_hours TO service_role;
ALTER TABLE public.working_hours ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public view hours" ON public.working_hours FOR SELECT USING (true);
CREATE POLICY "Admins manage hours" ON public.working_hours FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Reasons
CREATE TABLE public.reasons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  label_en text NOT NULL,
  label_fr text NOT NULL,
  label_ar text NOT NULL,
  active boolean NOT NULL DEFAULT true,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.reasons TO anon, authenticated;
GRANT ALL ON public.reasons TO service_role;
ALTER TABLE public.reasons ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public view active reasons" ON public.reasons FOR SELECT
  USING (active = true OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage reasons" ON public.reasons FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Appointments
CREATE TYPE public.appointment_status AS ENUM ('pending','confirmed','cancelled','done');

CREATE TABLE public.appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  dentist_id uuid NOT NULL REFERENCES public.dentists(id) ON DELETE RESTRICT,
  patient_name text NOT NULL,
  patient_phone text NOT NULL,
  appt_date date NOT NULL,
  appt_hour time NOT NULL,
  reason_id uuid REFERENCES public.reasons(id) ON DELETE SET NULL,
  status public.appointment_status NOT NULL DEFAULT 'pending',
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (dentist_id, appt_date, appt_hour)
);
GRANT INSERT ON public.appointments TO anon, authenticated;
GRANT ALL ON public.appointments TO service_role;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can book" ON public.appointments FOR INSERT
  WITH CHECK (status = 'pending');
CREATE POLICY "Admins view appointments" ON public.appointments FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update appointments" ON public.appointments FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete appointments" ON public.appointments FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Public view: taken slots only (no PII)
CREATE VIEW public.taken_slots WITH (security_invoker = on) AS
  SELECT dentist_id, appt_date, appt_hour
  FROM public.appointments
  WHERE status <> 'cancelled';
GRANT SELECT ON public.taken_slots TO anon, authenticated;

-- updated_at trigger
CREATE OR REPLACE FUNCTION public.tg_set_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END $$;
CREATE TRIGGER appt_updated BEFORE UPDATE ON public.appointments
  FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- Seed dentists
INSERT INTO public.dentists (name_en, name_fr, name_ar, sort_order) VALUES
  ('Dr. Merabet Mohammed','Dr. Merabet Mohammed','د. مرابط محمد', 1),
  ('Dr. Houfani Chafia','Dr. Houfani Chafia','د. حوفاني شافية', 2);

-- Seed reasons
INSERT INTO public.reasons (label_en, label_fr, label_ar, sort_order) VALUES
  ('Cleaning','Détartrage','تنظيف الأسنان',1),
  ('Whitening','Blanchiment','تبييض الأسنان',2),
  ('Consultation','Consultation','استشارة',3),
  ('Pain / Emergency','Douleur / Urgence','ألم / طوارئ',4);

-- Seed working hours: Sunday(0)..Thursday(4)+Saturday(6) open; Friday(5) closed
INSERT INTO public.working_hours (dentist_id, weekday, is_open, start_time, end_time, slot_minutes)
SELECT d.id, wd, CASE WHEN wd = 5 THEN false ELSE true END, '09:00'::time, '16:00'::time, 30
FROM public.dentists d, generate_series(0,6) AS wd;
