import { NextResponse } from "next/server";
import { verifyWebhookSignature } from "../../../../lib/razorpayServer";
import { getSupabaseAdmin } from "../../../../lib/supabaseAdmin";

export const runtime = "nodejs";

export async function POST(request) {
  const body = await request.text();
  const signature = request.headers.get("x-razorpay-signature") || "";

  if (!verifyWebhookSignature(body, signature)) {
    return NextResponse.json(
      { error: "Invalid webhook signature." },
      { status: 400 }
    );
  }

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return NextResponse.json(
      { error: "Authentication is not configured on this server." },
      { status: 500 }
    );
  }

  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json(
      { error: "Webhook processing is not configured on the server." },
      { status: 500 }
    );
  }

  try {
    const event = JSON.parse(body);
    const payment = event.payload?.payment?.entity;

    // Webhook events carry order notes (userId) so we can attribute the user.
    const userId =
      payment?.notes?.userId ||
      payment?.order?.notes?.userId ||
      event.payload?.order?.entity?.notes?.userId;

    if (!userId) {
      return NextResponse.json({ received: true });
    }

    switch (event.event) {
      case "payment.captured":
      case "order.paid":
        await getSupabaseAdmin().from("subscriptions")
          .upsert(
            {
              user_id: userId,
              plan: "premium",
              status: "active",
              razorpay_subscription_id: payment?.id || null,
              updated_at: new Date().toISOString(),
            },
            { onConflict: "user_id" }
          );
        break;

      case "payment.failed":
      case "payment.refunded":
        await getSupabaseAdmin().from("subscriptions")
          .update({ status: "inactive", updated_at: new Date().toISOString() })
          .eq("user_id", userId);
        break;
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("webhook error:", err);
    return NextResponse.json(
      { error: "Webhook processing failed." },
      { status: 500 }
    );
  }
}