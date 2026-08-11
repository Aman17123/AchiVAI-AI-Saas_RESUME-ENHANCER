import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "../../../../lib/supabaseServer";
import { getRazorpay, PREMIUM_PRICE_PAISE } from "../../../../lib/razorpayServer";

export const runtime = "nodejs";

export async function POST() {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    return json({ error: "Payments are not configured yet." }, 500);
  }

  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return json({ error: "Please sign in to purchase Premium." }, 401);
    }

    const order = await getRazorpay().orders.create({
      amount: PREMIUM_PRICE_PAISE,
      currency: "INR",
      receipt: `${user.id}-${Date.now()}`,
      notes: { userId: user.id },
    });

    return json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    console.error("create-order error:", err);
    return json({ error: "Failed to create payment order. Please try again." }, 500);
  }
}

function json(body, status) {
  return NextResponse.json(body, {
    status,
    headers: { "Content-Type": "application/json" },
  });
}