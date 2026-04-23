// src/lib/busha.ts
// ─────────────────────────────────────────────────────────────────────────────
// Central Busha API client — all API routes import bushaFetch from here.
// Docs: https://docs.busha.io/api-reference
// ─────────────────────────────────────────────────────────────────────────────

// ── Auth helper ──────────────────────────────────────────────────────────────
// Busha provides the full Bearer token in the dashboard.
// The value of BUSHA_API_KEY is used directly — do NOT base64-encode it again.
// Authorization header format: "Bearer <BUSHA_API_KEY>"
function getBearerToken(): string {
    const apiKey = process.env.BUSHA_API_KEY;

    if (!apiKey) {
        throw new Error(
            "Missing Busha credentials. Set BUSHA_API_KEY in .env.local"
        );
    }

    // Use the key directly — Busha provides the pre-encoded token from the dashboard
    return apiKey.trim();
}

// ── Base URL helper ──────────────────────────────────────────────────────────
// IMPORTANT: use lowercase /v1 (not /V1).
// The sandbox URL is https://api.sandbox.busha.so/v1
// The production URL is https://api.busha.io/v1
function getBaseUrl(): string {
    const url = process.env.BUSHA_BASE_URL ?? "https://api.sandbox.busha.so/v1";
    // Strip any trailing slash so paths like "/balances" join cleanly
    return url.replace(/\/+$/, "");
}

// ── Core fetch wrapper ───────────────────────────────────────────────────────
// Prepends the base URL, attaches auth headers, and throws on non-2xx responses.
// All API routes call this instead of native fetch.
export async function bushaFetch<T = unknown>(
    path: string,              // e.g. "/balances" or "/payments/links"
    options: RequestInit = {}  // Standard fetch options (method, body, etc.)
): Promise<T> {
    const url       = `${getBaseUrl()}${path}`;
    const token     = getBearerToken();
    const profileId = process.env.BUSHA_PROFILE_ID?.trim();

    if (!profileId) {
        throw new Error(
            "Missing BUSHA_PROFILE_ID. Set it in .env (found in Busha Business Dashboard)"
        );
    }

    // Log the exact URL being called (visible in the Next.js server terminal)
    console.log(`[bushaFetch] ${options.method ?? "GET"} ${url}`);

    const response = await fetch(url, {
        ...options,
        headers: {
            "Content-Type":    "application/json",
            "Authorization":   `Bearer ${token}`,
            "X-BU-PROFILE-ID": profileId, // Required on EVERY Busha API request
            ...(options.headers ?? {}),
        },
    });

    // Parse JSON body regardless of status so we can forward Busha's error message
    const data = await response.json();

    if (!response.ok) {
        // Busha error format: { error: { name: "...", message: "..." } }
        const message =
            data?.error?.message ??
            data?.message ??
            `Busha API error ${response.status} ${response.statusText}`;
        throw new Error(message);
    }

    return data as T;
}