import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "../../../../lib/supabaseServer";

export const runtime = "nodejs";

export async function GET() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return NextResponse.json({ plan: "guest", email: null }, { status: 200 });
  }

  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ plan: "guest", email: null }, { status: 200 });
    }

    const { data } = await supabase
      .from("subscriptions")
      .select("plan, status")
      .eq("user_id", user.id)
      .maybeSingle();

    const isPremium = data?.plan === "premium" && data?.status === "active";

    return NextResponse.json({
      plan: isPremium ? "premium" : "free",
      email: user.email,
      user_id: user.id,
    });
  } catch (err) {
    console.error("user/plan error:", err);
    return NextResponse.json({ plan: "guest", email: null }, { status: 200 });
  }
}