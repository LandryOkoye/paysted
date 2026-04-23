
import { NextResponse } from "next/server";
import { bushaFetch } from "@/lib/busha";
import type {
  BushaBalance,
  BushaPaginatedResponse,
} from "@/lib/busha.types";

// GET /api/balances
export async function GET() {
  try {
    const response = await bushaFetch<BushaPaginatedResponse<BushaBalance>>("/balances");

    const cur = response.data.find((balance) => balance.currency === "USDC" || "USDT");

    if (!cur) {
      return NextResponse.json(
        {
          success: true,
          vault: null,
          message: "No USDC balance found on this account",
        },
        { status: 200 }
      );
    }


    return NextResponse.json(
      { success: true, vault: cur },
      { status: 200 }
    );

  } catch (error) {

    console.error("[/api/balances GET] Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch vault balance" },
      { status: 500 }
    );
  }
}
