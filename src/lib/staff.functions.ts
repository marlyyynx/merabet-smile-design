import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

async function ensureAdmin(ctx: { supabase: any; userId: string }) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin
    .from("user_roles")
    .select("role")
    .eq("user_id", ctx.userId)
    .eq("role", "admin")
    .maybeSingle();
  if (error || !data) throw new Error("Forbidden: admin only");
}

export const getAdminStatus = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: role, error } = await supabaseAdmin
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId)
      .eq("role", "admin")
      .maybeSingle();

    if (error) throw new Error(error.message);

    const { data: userData } = await supabaseAdmin.auth.admin.getUserById(context.userId);
    return {
      userId: context.userId,
      email: userData.user?.email ?? "",
      isAdmin: !!role,
    };
  });

export interface StaffMember {
  user_id: string;
  email: string;
  role: "admin" | "staff";
  created_at: string;
}

export const listStaff = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<StaffMember[]> => {
    await ensureAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: roles, error } = await supabaseAdmin
      .from("user_roles").select("user_id, role, created_at").order("created_at", { ascending: true });
    if (error) throw new Error(error.message);
    const out: StaffMember[] = [];
    for (const r of roles || []) {
      const { data: u } = await supabaseAdmin.auth.admin.getUserById(r.user_id);
      out.push({ user_id: r.user_id, role: r.role as "admin" | "staff", created_at: r.created_at, email: u?.user?.email ?? "(unknown)" });
    }
    return out;
  });

export const addStaff = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { email: string; password: string; role: "admin" | "staff" }) => {
    if (!d.email || !d.password || d.password.length < 6) throw new Error("Email and 6+ char password required");
    if (d.role !== "admin" && d.role !== "staff") throw new Error("Invalid role");
    return d;
  })
  .handler(async ({ data, context }) => {
    await ensureAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // Check if user already exists
    const { data: list } = await supabaseAdmin.auth.admin.listUsers();
    const existing = list?.users.find((u) => u.email?.toLowerCase() === data.email.toLowerCase());
    let userId: string;
    if (existing) {
      userId = existing.id;
    } else {
      const { data: created, error } = await supabaseAdmin.auth.admin.createUser({
        email: data.email,
        password: data.password,
        email_confirm: true,
      });
      if (error || !created.user) throw new Error(error?.message || "Create user failed");
      userId = created.user.id;
    }
    const { error: rErr } = await supabaseAdmin
      .from("user_roles").insert({ user_id: userId, role: data.role });
    if (rErr && !rErr.message.includes("duplicate")) throw new Error(rErr.message);
    return { ok: true, user_id: userId };
  });

export const removeStaff = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { user_id: string; role: "admin" | "staff" }) => d)
  .handler(async ({ data, context }) => {
    await ensureAdmin(context);
    if (data.user_id === context.userId && data.role === "admin") {
      throw new Error("You cannot remove your own admin role");
    }
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("user_roles").delete().eq("user_id", data.user_id).eq("role", data.role);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
