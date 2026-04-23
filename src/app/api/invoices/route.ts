
import { NextResponse } from "next/server";
import { bushaFetch } from "@/lib/busha";
import type {
  BushaPaymentLink,
  BushaCreatePaymentLinkPayload,
  BushaResponse,
  BushaPaginatedResponse,
} from "@/lib/busha.types";

// POST /api/invoices
// Called by the generate-link page form.
// Creates a Busha payment link and returns the hosted URL to the client.
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
    if (!amount || isNaN(Number(amount))) {
      return NextResponse.json(
        { success: false, error: "A valid numeric amount is required" },
        { status: 400 }
      );
    }

    // 3. Build the payload with exact Busha field names (all 6 required fields present)
    const payload: BushaCreatePaymentLinkPayload = {
      type: "payment_link",
      fixed,
      one_time: oneTime,
      name,
      title,
      description,
      target_currency: currency,
      target_amount: String(amount),
    };
    const result = await bushaFetch<BushaResponse<BushaPaymentLink>>("/payments/links", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    const link = result.data;

    // TODO: Persist to database
    //    Save link.id, link.status, link.target_amount to your DB
    //    so the Invoices page can list them without re-fetching Busha.

    return NextResponse.json(
      {
        success: true,
        url: link.link,
        id: link.id,
        status: link.status,
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("[/api/invoices POST] Error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to generate payment link" },
      { status: 500 }
    );
  }
}

// GET /api/invoices
// Returns all payment links/invoices on the Busha account.
// Used on the Invoices page to list historical links.
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
