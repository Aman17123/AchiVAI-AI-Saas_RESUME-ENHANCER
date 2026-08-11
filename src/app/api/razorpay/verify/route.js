import { NextResponse } from "next/server";
import { getRazorpay, verifyRazorpaySignature } from "../../../../lib/razorpayServer";
import { getSupabaseAdmin } from "../../../../lib/supabaseAdmin";
import { createServerSupabaseClient } from "../../../../lib/supabaseServer";

export const runtime = "nodejs";

export async function POST(request) {
  let orderId, paymentId, signature;
  try {
    const body = await request.json();
    orderId = body.orderId;
    paymentId = body.paymentId;
    signature = body.signature;
  } catch {
    return json({ error: "Invalid request body." }, 400);
  }

  if (!orderId || !paymentId || !signature) {
    return json({ error: "Missing payment details." }, 400);
  }

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return json({ error: "Authentication is not configured on this server." }, 500);
  }

  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return json({ error: "Premium activation is not configured on the server." }, 500);
  }

  // 1. Confirm the client is logged in
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return json({ error: "Please sign in." }, 401);
  }

  // 2. Verify HMAC signature
  if (!verifyRazorpaySignature(orderId, paymentId, signature)) {
    return json({ error: "Invalid payment signature." }, 400);
  }

  try {
    // 3. Double-check the payment was actually captured
    const payment = await getRazorpay().payments.fetch(paymentId);
    if (payment.status !== "captured") {
      return json({ error: "Payment was not completed." }, 400);
    }

    // 4. Mark user as premium using the admin client (bypasses RLS)
    const { error } = await getSupabaseAdmin().from("subscriptions")
      .upsert(
        {
          user_id: user.id,
          plan: "premium",
          status: "active",
          razorpay_subscription_id: paymentId,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" }
      );

    if (error) {
      console.error("verify upsert error:", error);
      return json({ error: "Failed to activate Premium." }, 500);
    }

    return json({ success: true, plan: "premium" });
  } catch (err) {
    console.error("verify error:", err);
    return json({ error: "Payment verification failed." }, 500);
  }
}

function json(body, status) {
  return NextResponse.json(body, {
    status,
    headers: { "Content-Type": "application/json" },
  });
}