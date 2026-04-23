// src/app/api/webhooks/busha/route.ts
// ─────────────────────────────────────────────────────────────────────────────
// Receives real-time event notifications from Busha.
// Busha calls this URL automatically when payment events occur on your account.
//
// Setup: Register this URL in your Busha Business Dashboard:
//   Developer Tools → Webhooks → Add Endpoint
//   URL: https://your-domain.com/api/webhooks/busha
//
// Security: Before processing any event, we verify the request signature
// using HMAC-SHA256 to ensure the payload genuinely came from Busha.
//
// ⚠️  IMPORTANT: Always respond with HTTP 200 quickly.
//     Busha retries failed webhooks — a slow or non-200 response causes retries.
// ─────────────────────────────────────────────────────────────────────────────
import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();

    const signature = request.headers.get("x-busha-signature") ?? "";

    const expectedSignature = crypto
      .createHmac("sha256", process.env.BUSHA_WEBHOOK_SECRET!)
      .update(rawBody)
      .digest("hex");

    const receivedBuffer = Buffer.from(signature, "hex");
    const expectedBuffer = Buffer.from(expectedSignature, "hex");

    if (
      receivedBuffer.length !== expectedBuffer.length ||
      !crypto.timingSafeEqual(receivedBuffer, expectedBuffer)
    ) {
      console.warn("[webhook/busha] Invalid signature — request rejected");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }



    const payload = JSON.parse(rawBody);

    // ── Step 5: Route the event to the correct handler ───────────────────────
    // Busha sends a `payload.event` string that identifies what happened.
    // Each case below should update your database to reflect the new state.
    switch (payload.event) {

      // ── A customer successfully paid a payment link ─────────────────────────
      // The USDC has arrived in the Busha vault.
      case "transfer.funds_delivered":
        // TODO: Mark the matching payment link / invoice as "paid" in your DB.
        // TODO: Credit the user's internal USDC ledger balance.
        // TODO: Send a "Payment received!" notification to the business owner.
        console.log("[webhook] Payment received — transfer ID:", payload.data?.id);
        break;

      // ── A payout to a bank account was sent successfully ────────────────────
      // The NGN funds have left Busha and are in transit to the bank.
      case "transfer.outgoing_payment_sent":
        // TODO: Update the payout record status to "sent" in your DB.
        // TODO: Notify the user that their payout is on the way.
        console.log("[webhook] Payout sent — transfer ID:", payload.data?.id);
        break;

      // ── A payout failed to reach the bank ──────────────────────────────────
      // The funds were NOT delivered (e.g. invalid account number).
      case "transfer.funds_not_delivered":
        // TODO: Update the payout record status to "failed" in your DB.
        // TODO: Release any locked vault balance back to available.
        // TODO: Notify the user so they can retry with correct bank details.
        console.log("[webhook] Payout failed — transfer ID:", payload.data?.id);
        break;


      default:
        console.log("[webhook] Unhandled event:", payload.event, payload.data);
    }

    return NextResponse.json({ received: true }, { status: 200 });

  } catch (error) {
    console.error("[/api/webhooks/busha] Error:", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 400 });
  }
}
