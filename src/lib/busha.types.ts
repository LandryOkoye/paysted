
export interface BushaResponse<T> {
    status: "success" | "error";
    message: string;
    data: T;
}

export interface BushaPaginatedResponse<T> {
    status: "success" | "error";
    message: string;
    pagination: {
        current_entries_size: number;
        next_cursor: string | null;
        previous_cursor: string | null;
    };
    data: T[];
}


export interface BushaBalanceAmount {
    amount: string;
    currency: string;
    fiat: {
        amount: string;
        currency: string;
    };
}

export interface BushaBalance {
    id: string;
    user_id: string;
    profile_id: string;
    currency: string;
    name: string;
    type: "crypto" | "fiat";
    pending: BushaBalanceAmount;
    available: BushaBalanceAmount;
    savings: BushaBalanceAmount;
    investments: BushaBalanceAmount;
    total: BushaBalanceAmount;
}

export interface BushaPaymentLink {
    id: string;
    profile_id: string;
    type: "payment_link" | "invoice";
    fixed: boolean;
    one_time: boolean;
    link: string;
    name: string;
    title: string;
    description: string;
    target_currency: string;
    target_amount: string;
    quote_amount: string;
    quote_currency: string;
    status: "draft" | "active" | "pending" | "expired" | "deleted";
    created_at: string;
    updated_at: string;
    expires_at: string | null;
    pub_key: string;
    meta: {
        customer_email?: string;
        customer_name?: string;
        due_date?: string;
        note?: string;
        images?: string[];
        allow_customer_amount?: boolean;
        allow_quantity_selection?: boolean;
        items?: Array<{
            item: string;
            quantity: number;
            amount: string;
        }>;
        amount_limit?: {
            min_amount: string;
            max_amount: string;
        };
    };
}

export interface BushaCreatePaymentLinkPayload {
    type: "payment_link";
    fixed: boolean;
    one_time: boolean;
    name: string;
    title: string;
    description: string;
    target_currency: string;
    target_amount?: string;
    quote_amount?: string;
    quote_currency?: string;
    dry_run?: boolean;
}

export interface BushaRecipientField {
    name: string;
    value: string;
    display_name: string;
    is_copyable: boolean;
    is_visible: boolean;
    required: boolean;
}

export interface BushaRecipient {
    object: "recipient";
    id: string;
    user_id: string;
    profile_id: string;
    currency_id: string;  // e.g. "NGN"
    country_id: string;  // e.g. "NG"
    type: string;  // e.g. "ngn_bank_transfer"
    legal_entity_type: "personal" | "business";
    owned_by_customer: boolean;
    active: boolean;
    created_at: string;
    updated_at: string;
    fields: BushaRecipientField[];
}

export interface BushaCreateNgnRecipientPayload {
    currency_id: "NGN";
    country_id: "NG";
    type: "ngn_bank_transfer";
    legal_entity_type: "personal" | "business";
    fields: Array<{
        name: "bank_name" | "account_number" | "bank_code" | "account_name";
        value: string;
    }>;
}

// ── Transfer ──────────────────────────────────────────────────────────────────
// IMPORTANT: Transfers in Busha are quote-based.
// You must first create a Quote to get a `quote_id`,
// then pass that `quote_id` to POST /v1/transfers.
// The transfer represents the full payment flow (on/off-ramp).
export interface BushaTransfer {
    id: string;
    quote_id: string;
    description: string;
    sub_description: string;
    source_currency: string;
    target_currency: string;
    source_amount: string;
    target_amount: string;
    profile_id: string;
    status:
    | "pending"
    | "processing"
    | "cancelled"
    | "funds_converted"
    | "funds_received"
    | "outgoing_payment_sent"
    | "funds_delivered"
    | "funds_not_delivered"
    | "funds_refunded"
    | "reverse_fund_conversion";
    created_at: string;
    updated_at: string;
    expires_at: string | null;
    stages: string[];   // e.g. ["deposit", "conversion"]
    category: string;
    rate: {
        product: string;
        rate_explained: string;
        source_currency: string;
        target_currency: string;
        rate: string;
        side: "buy" | "sell";
        type: "FIXED" | "FLOATING";
    };
    fees: Array<{
        name: string;
        amount: { amount: string; currency: string };
        type: "FIXED" | "PERCENTAGE";
        converted_amount: { amount: string; currency: string };
    }>;
    pay_in: BushaTransferLeg;
    pay_out: BushaTransferLeg;
    timeline: {
        total_steps: number;
        current_step: number;
        transfer_status: string;
        events: Array<{
            step: number;
            done: boolean;
            status: string;
            title: string;
            description: string;
            timestamp: string;
        }>;
    };
}

// Shared shape for pay_in and pay_out legs of a transfer
export interface BushaTransferLeg {
    type: string;
    recipient_id: string;
    address?: string;
    network?: string;
    narration?: string;
    blockchain_hash?: string;
    blockchain_url?: string;
    expires_at: string | null;
    recipient_details: {
        account_name: string;
        bank_name: string;
        account_number: string;
        country_code: string;
        currency: string;
        bank_code: string;
        phone_number?: string;
        name?: string;
        email?: string;
    };
}

// Body for creating a transfer (POST /v1/transfers)
// NOTE: Transfers require a `quote_id` from a prior Quote API call.
// See: https://docs.busha.io/api-reference/quotes
export interface BushaCreateTransferPayload {
    quote_id: string;  // Required: ID from a previously created quote
}
