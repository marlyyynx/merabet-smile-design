import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Background } from "@/components/Home";
import "@/components/Home.css";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Admin Sign In — Merabet Dental Center" }] }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/admin" });
    });
  }, [navigate]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const fn =
      mode === "signin"
        ? supabase.auth.signInWithPassword({ email, password })
        : supabase.auth.signUp({ email, password, options: { emailRedirectTo: window.location.origin + "/admin" } });
    const { error: err } = await fn;
    setLoading(false);
    if (err) {
      setError(err.message);
      return;
    }
    navigate({ to: "/admin" });
  };

  return (
    <div className="mdc-root">
      <Background />
      <div className="auth-root">
        <div className="auth-card">
          <h1>{mode === "signin" ? "Admin sign in" : "Create admin account"}</h1>
          <p className="sub">Merabet Dental Center — staff only</p>
          <form onSubmit={onSubmit}>
            <div className="db-field">
              <label>Email</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="db-field">
              <label>Password</label>
              <input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            {error && <div className="db-error">{error}</div>}
            <button type="submit" disabled={loading} className="mdc-btn mdc-btn-primary db-submit">
              {loading ? "…" : mode === "signin" ? "Sign in" : "Sign up"}
            </button>
          </form>
          <div style={{ marginTop: "1rem", fontSize: ".85rem", color: "#64748b", textAlign: "center" }}>
            {mode === "signin" ? (
              <button type="button" onClick={() => setMode("signup")} style={{ background: "none", border: 0, color: "#4f46e5", cursor: "pointer" }}>
                Need an account? Sign up
              </button>
            ) : (
              <button type="button" onClick={() => setMode("signin")} style={{ background: "none", border: 0, color: "#4f46e5", cursor: "pointer" }}>
                Already have an account? Sign in
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
