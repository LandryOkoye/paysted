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

    // ── DIAGNOSTIC LOG — shows exactly what the frontend sent ────────────────
    console.log("[/api/recipients POST] Received:", {
      bankName,
      bankCode,           // <-- this is what Busha validates
      bankCodeLength: String(bankCode ?? "").length,
      bankCodeAsInt:  parseInt(String(bankCode ?? ""), 10),
      accountNumber,
      accountName,
    });

    // ── Server-side validation (mirrors Busha's own rules) ──────────────────
    const trimmedName   = (accountName ?? "").trim();
    const cleanedAccNum = (accountNumber ?? "").replace(/\D/g, "");

    if (!bankCode) {
      return NextResponse.json({ success: false, error: "Bank code is required" }, { status: 400 });
    }

    if (trimmedName.length < 2 || trimmedName.length > 100) {
      return NextResponse.json(
        { success: false, error: "Account name must be between 2 and 100 characters" },
        { status: 400 }
      );
    }
    if (cleanedAccNum.length !== 10) {
      return NextResponse.json(
        { success: false, error: `Account number must be exactly 10 digits (got ${cleanedAccNum.length})` },
        { status: 400 }
      );
    }

    const payload: BushaCreateNgnRecipientPayload = {
      currency_id: "NGN",
      country_id:  "NG",
      type:        "ngn_bank_transfer",
      legal_entity_type: "personal",   // personal bank account — not a business
      fields: [
        // bank_name is informational only — omitting avoids sandbox validation quirks
        { name: "account_number", value: cleanedAccNum },
        { name: "bank_code",      value: bankCode },
        { name: "account_name",   value: trimmedName },
      ],
    };


    // Log the exact payload sent to Busha for debugging
    console.log("[/api/recipients POST] Sending to Busha:", JSON.stringify(payload, null, 2));

    const result = await bushaFetch<BushaResponse<BushaRecipient>>("/recipients", {
      method: "POST",
      body: JSON.stringify(payload),
    });

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
