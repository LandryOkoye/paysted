// GET /api/rate
// Returns the live USDC→NGN sell rate via GET /v1/pairs?base=USDC&counter=NGN.
// The Pairs endpoint is lightweight (no quote creation) and perfect for
// displaying the live rate on the payouts page.
// The POST handler creates a real locked quote for a specific amount,
// returning the quoteId needed by POST /api/payouts.

import { NextResponse } from "next/server";
import { bushaFetch } from "@/lib/busha";
import type {
  BushaQuote,
  BushaCreateQuotePayload,
  BushaResponse,
} from "@/lib/busha.types";

// ── Pairs shape (GET /v1/pairs) ───────────────────────────────────────────────
interface BushaPriceAmount {
  amount:   string;
  currency: string;
}

interface BushaPair {
  id:                   string;    // e.g. "USDCNGN"
  base:                 string;    // e.g. "USDC"
  counter:              string;    // e.g. "NGN"
  buy_price:            BushaPriceAmount;
  sell_price:           BushaPriceAmount;
  is_sell_supported:    boolean;
}

interface BushaPairsResponse {
  status: "success" | "error";
  data:   BushaPair[];
}

// ── GET /api/rate — fetch live USDC/NGN sell price from Pairs ─────────────────
export async function GET() {
  try {
    // Pairs endpoint: GET /v1/pairs?base=USDC&counter=NGN
    // Returns buy_price and sell_price without creating a quote.
    const result = await bushaFetch<BushaPairsResponse>(
      "/pairs?base=USDC&counter=NGN"
    );

    const pair = result.data?.find(
      (p) => p.base === "USDC" && p.counter === "NGN"
    );

    if (!pair) {
      // Fallback: try generic stablecoin filter
      const allResult = await bushaFetch<BushaPairsResponse>(
        "/pairs?type=stablecoin"
      );
      const fallbackPair = allResult.data?.find(
        (p) => p.base === "USDC" && p.counter === "NGN"
      );

      if (!fallbackPair) {
        throw new Error("USDC/NGN pair not found in Busha pairs list");
      }

      const rate = parseFloat(fallbackPair.sell_price?.amount ?? fallbackPair.buy_price?.amount);
      return NextResponse.json({ success: true, rate }, { status: 200 });
    }

    // Use sell_price — the rate the user gets when selling USDC for NGN
    const rate = parseFloat(pair.sell_price?.amount ?? pair.buy_price?.amount);

    return NextResponse.json({ success: true, rate }, { status: 200 });

  } catch (error) {
    console.error("[/api/rate GET] Pairs fetch failed:", error);

    // Last resort: try creating a 1-USDC quote and extract the implied rate
    try {
      const payload: BushaCreateQuotePayload = {
        source_currency: "USDC",
        target_currency: "NGN",
        source_amount:   "1",
      };
      const result = await bushaFetch<BushaResponse<BushaQuote>>("/quotes", {
        method: "POST",
        body:   JSON.stringify(payload),
      });
      const quote = result.data;
      const rate  = parseFloat(quote.rate ?? quote.target_amount);
      return NextResponse.json(
        { success: true, rate, quoteId: quote.id },
        { status: 200 }
      );
    } catch (quoteError) {
      console.error("[/api/rate GET] Quote fallback also failed:", quoteError);
      return NextResponse.json(
        {
          success: false,
          error: quoteError instanceof Error ? quoteError.message : "Failed to fetch rate",
        },
        { status: 500 }
      );
    }
  }
}

// ── POST /api/rate — create a locked quote for the user's actual USDC amount ──
// Returns quoteId which is passed directly to POST /api/payouts to execute.
export async function POST(request: Request) {
  try {
    const { amount } = await request.json();

    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      return NextResponse.json(
        { success: false, error: "A valid USDC amount is required" },
        { status: 400 }
      );
    }

    const payload: BushaCreateQuotePayload = {
      source_currency: "USDC",
      target_currency: "NGN",
      source_amount:   String(amount),
    };

    const result = await bushaFetch<BushaResponse<BushaQuote>>("/quotes", {
      method: "POST",
      body:   JSON.stringify(payload),
    });

    const quote = result.data;

    return NextResponse.json(
      {
        success:      true,
        quoteId:      quote.id,
        rate:         parseFloat(quote.rate ?? quote.target_amount),
        sourceAmount: quote.source_amount,
        targetAmount: quote.target_amount,
        expiresAt:    quote.expires_at,
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("[/api/rate POST] Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to create quote",
      },
      { status: 500 }
    );
  }
}
