
import { NextResponse } from "next/server";
import { bushaFetch } from "@/lib/busha";
import type {
  BushaPaymentLink,
  BushaCreatePaymentLinkPayload,
  BushaResponse,
  BushaPaginatedResponse,
} from "@/lib/busha.types";

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/invoices
// Called by the generate-link page form.
// Creates a Busha payment link and returns the link ID / URL to the client.
// ─────────────────────────────────────────────────────────────────────────────
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name,
      title,
      description,
      currency = "USDC",
      amount,
      fixed = true,
      oneTime = false,
    } = body;

    if (!name || !title || !description) {
      return NextResponse.json(
        { success: false, error: "name, title, and description are all required" },
        { status: 400 }
      );
    }
    // `target_amount` is only required when fixed=true.
    // When fixed=false the payer enters their own amount on the Busha payment page,
    // so we must NOT send target_amount in the payload (Busha will reject it).
    if (fixed && (!amount || isNaN(Number(amount)))) {
      return NextResponse.json(
        { success: false, error: "A valid numeric amount is required when the amount is fixed" },
        { status: 400 }
      );
    }

    const payload: BushaCreatePaymentLinkPayload = {
      type: "payment_link",
      fixed,
      one_time: oneTime,
      name,
      title,
      description,
      target_currency: currency,
      // Only include target_amount when fixed=true.
      // Omitting it when fixed=false lets the payer choose their amount.
      ...(fixed && amount ? { target_amount: String(amount) } : {}),

      // require_extra_info: tells Busha which fields to collect from the PAYER.
      // This is NOT about the creator's details — it's the payer's info Busha collects
      // on the payment page. Email is required by the Busha API for every link.
      require_extra_info: [
        { field_name: "email", required: true },
      ],
    };

    const result = await bushaFetch<BushaResponse<BushaPaymentLink>>("/payments/links", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    const link = result.data;

    // NOTE: In the sandbox, Busha returns a short ID in `link.link` (e.g. "Sm3crmNQjDWc").
    // In production this will be the full hosted payment page URL.
    // Construct the full URL so it's always a clickable link.
    const paymentUrl = link.link.startsWith("http")
      ? link.link
      : `https://checkout.busha.io/${link.link}`;

    // 5. TODO: Persist to database
    //    Save link.id + link.status + paymentUrl to your DB
    //    so the Invoices page can list them without re-fetching Busha.

    // 6. Return the payment URL to the frontend
    return NextResponse.json(
      {
        success: true,
        url: paymentUrl,
        id: link.id,
        status: link.status,
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("[/api/invoices POST] Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to generate payment link",
      },
      { status: 500 }
    );
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/invoices
// Returns all payment links on the Busha account.
// Used on the Invoices page to list historical links.
// ─────────────────────────────────────────────────────────────────────────────
export async function GET() {
  try {
    // Call Busha: GET /v1/payments/links
    const response = await bushaFetch<BushaPaginatedResponse<BushaPaymentLink>>("/payments/links");

    return NextResponse.json(
      { success: true, invoices: response.data },
      { status: 200 }
    );

  } catch (error) {
    console.error("[/api/invoices GET] Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch invoices" },
      { status: 500 }
    );
  }
}
