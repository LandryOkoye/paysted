// Manages payout recipients — Nigerian bank accounts that USDC can be sent to.
// A recipient must exist on Busha before a transfer/payout can be created.

import { NextResponse } from "next/server";
import { bushaFetch } from "@/lib/busha";
import type {
  BushaRecipient,
  BushaCreateNgnRecipientPayload,
  BushaResponse,
  BushaPaginatedResponse,
} from "@/lib/busha.types";

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/recipients
// Called by the AddRecipientModal when the user adds a new bank account.
// Registers the account on Busha and returns the created recipient object.

export async function POST(request: Request) {
  try {
    const { bankName, bankCode, accountNumber, accountName } = await request.json();

    if (!bankCode || !accountNumber || !accountName) {
      return NextResponse.json(
        {
          success: false,
          error: "bankCode, accountNumber, and accountName are all required",
        },
        { status: 400 }
      );
    }


    const payload: BushaCreateNgnRecipientPayload = {
      currency_id: "NGN",
      country_id: "NG",
      type: "ngn_bank_transfer",
      legal_entity_type: "business",
      fields: [
        { name: "bank_name", value: bankName ?? "" },
        { name: "account_number", value: accountNumber },
        { name: "bank_code", value: bankCode },
        { name: "account_name", value: accountName },
      ],
    };


    const result = await bushaFetch<BushaResponse<BushaRecipient>>("/recipients", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    // I need to persists the result.data.id and the bank details in my DB so the
    // user doesn't have to re-enter them on every payout. For now we return
    // the raw Busha response and let the frontend handle caching.

    return NextResponse.json(
      { success: true, recipient: result.data },
      { status: 201 }
    );

  } catch (error) {
    console.error("[/api/recipients POST] Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to create recipient",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const response = await bushaFetch<BushaPaginatedResponse<BushaRecipient>>("/recipients");

    return NextResponse.json(
      { success: true, recipients: response.data },
      { status: 200 }
    );

  } catch (error) {
    console.error("[/api/recipients GET] Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch recipients" },
      { status: 500 }
    );
  }
}
