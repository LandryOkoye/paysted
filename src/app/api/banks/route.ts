// Proxies Busha's bank list so the frontend always gets Busha-native bank codes.
// Busha's internal codes (e.g. "100020") differ from standard NIBSS codes.
// We log the raw response so you can verify the exact codes Busha returns.

import { NextResponse } from "next/server";
import { bushaFetch } from "@/lib/busha";

// Busha may return banks with different field shapes — normalise them all.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normaliseBanks(data: any[]): { name: string; code: string }[] {
  return data
    .map((b) => ({
      name: b.name ?? b.bank_name ?? b.bankName ?? "",
      code: String(b.code ?? b.bank_code ?? b.bankCode ?? b.sort_code ?? ""),
    }))
    .filter((b) => b.name && b.code);  // drop any entries missing either field
}

export async function GET() {
  // Try /banks first, then /miscellaneous/banks as a fallback
  const paths = ["/banks", "/miscellaneous/banks"];

  for (const path of paths) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result = await bushaFetch<any>(path);

      // Log the raw response so you can see what Busha actually returns
      console.log(`[/api/banks] Raw response from ${path}:`, JSON.stringify(result, null, 2));

      const rawData = result?.data ?? result?.banks ?? [];
      if (!Array.isArray(rawData) || rawData.length === 0) {
        console.warn(`[/api/banks] ${path} returned empty data, trying next path…`);
        continue;
      }

      const banks = normaliseBanks(rawData);
      console.log(`[/api/banks] Normalised ${banks.length} banks. First 3:`, banks.slice(0, 3));

      return NextResponse.json({ success: true, banks }, { status: 200 });

    } catch (err) {
      console.warn(`[/api/banks] ${path} failed:`, err instanceof Error ? err.message : err);
    }
  }

  // Both paths failed — return error so frontend falls back gracefully
  return NextResponse.json(
    { success: false, error: "Could not fetch bank list from Busha" },
    { status: 500 }
  );
}
