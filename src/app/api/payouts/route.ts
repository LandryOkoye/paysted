
import { NextResponse } from "next/server";
import { bushaFetch } from "@/lib/busha";
import type {
  BushaTransfer,
  BushaCreateTransferPayload,
  BushaResponse,
} from "@/lib/busha.types";

// POST /api/payouts
// Accepts a `quoteId` from the client and executes the transfer on Busha.
// The quote must have been created beforehand via POST /v1/quotes.
export async function POST(request: Request) {
  try {

    const { quoteId } = await request.json();

    if (!quoteId) {
      return NextResponse.json(
        {
          success: false,
          error:
            "quoteId is required. First call POST /v1/quotes to get a locked rate, then pass the returned id here.",
        },
        { status: 400 }
      );
    }

    const payload: BushaCreateTransferPayload = {
      quote_id: quoteId,
    };

    const result = await bushaFetch<BushaResponse<BushaTransfer>>("/transfers", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    const transfer = result.data;

    // After a successful Busha response, you should:
    //   a) Save transfer.id to the DB so the user can track it on the Payouts page.
    //   b) Mark the vault balance as "locked" (deduct source_amount optimistically).
    //   c) Listen for the "transfer.funds_delivered" webhook to confirm final delivery.

    return NextResponse.json(
      {
        success: true,
        message: "Payout initiated successfully",
        transactionId: transfer.id,
        status: transfer.status,
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("[/api/payouts POST] Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to process payout",
      },
      { status: 500 }
    );
  }
}
