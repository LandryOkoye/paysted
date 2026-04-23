
function getBearerToken(): string {
    const apiKey = process.env.BUSHA_API_KEY;

    if (!apiKey) {
        throw new Error(
            "Missing Busha credentials. Set BUSHA_API_KEY in .env.local"
        );
    }

    return Buffer.from(`${apiKey}:`).toString("base64");
}
function getBaseUrl(): string {
    return process.env.BUSHA_BASE_URL ?? "https://api.sandbox.busha.so/v1";
}

export async function bushaFetch<T = unknown>(
    path: string,
    options: RequestInit = {}
): Promise<T> {
    const url = `${getBaseUrl()}${path}`;
    const token = getBearerToken();

    const profileId = process.env.BUSHA_PROFILE_ID;

    if (!profileId) {
        throw new Error(
            "Missing BUSHA_PROFILE_ID. Set it in .env.local (found in Busha Business Dashboard)"
        );
    }

    const response = await fetch(url, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
            "X-BU-PROFILE-ID": profileId,
            ...(options.headers ?? {}),
        },
    });

    const data = await response.json();

    if (!response.ok) {
        const message =
            data?.error?.message ??
            data?.message ??
            `Busha API error ${response.status} ${response.statusText}`;
        throw new Error(message);
    }

    return data as T;
}