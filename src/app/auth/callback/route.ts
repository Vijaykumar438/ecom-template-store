import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      // Role-based redirect
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role, tenant_id")
          .eq("user_id", user.id)
          .single();

        if (profile?.role === "super_admin" || profile?.role === "admin") {
          return NextResponse.redirect(`${origin}/admin`);
        }
      }
      // Default: customers and unknown roles go to home
      return NextResponse.redirect(`${origin}/`);
    }
  }

  // Return the user to login page with error
  return NextResponse.redirect(`${origin}/auth/login?error=auth_failed`);
}
