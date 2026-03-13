import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const TRAINER_CODE = "12345678910";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
      },
    });
  }

  try {
    const { email, code } = await req.json();

    if (code !== TRAINER_CODE) {
      return new Response(JSON.stringify({ error: "Código de seguridad inválido" }), {
        status: 403,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceKey);

    // Find user by email in profiles or auth
    const { data: users, error: listError } = await supabase.auth.admin.listUsers();
    if (listError) throw listError;

    const targetUser = users.users.find((u) => u.email === email);
    if (!targetUser) {
      return new Response(JSON.stringify({ error: "No se encontró un usuario con ese email" }), {
        status: 404,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      });
    }

    // Check if already trainer
    const { data: existing } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", targetUser.id)
      .single();

    if (existing?.role === "trainer") {
      return new Response(JSON.stringify({ error: "Este usuario ya es entrenador" }), {
        status: 400,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      });
    }

    // Update role to trainer
    const { error: updateError } = await supabase
      .from("user_roles")
      .update({ role: "trainer" })
      .eq("user_id", targetUser.id);

    if (updateError) throw updateError;

    return new Response(JSON.stringify({ success: true, message: "Usuario promovido a entrenador" }), {
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    });
  }
});
