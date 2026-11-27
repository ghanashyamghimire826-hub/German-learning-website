import crypto from "crypto";

export type CefrLevel = "A1" | "A2" | "B1" | "B2";
export type PlanType = "single" | "all";
export type PaymentProvider = "esewa" | "khalti";

export interface UserSubscription {
  plan: "free" | "single" | "all";
  allowedLevels: CefrLevel[];
  status: "active" | "expired" | "none";
  startedAt: string | null;
  expiresAt: string | null;
  lastTransactionId?: string;
}

export interface PaymentOrder {
  id: string;
  userId: string;
  userEmail: string;
  provider: PaymentProvider;
  planType: PlanType;
  selectedLevel?: CefrLevel;
  amountNpr: number;
  status: "PENDING" | "PAID" | "FAILED";
  providerRefId?: string;
  createdAt: string;
  verifiedAt?: string;
}

const ALL_LEVELS: CefrLevel[] = ["A1", "A2", "B1", "B2"];

export function getPlanConfig(planType: PlanType, selectedLevel?: string) {
  if (planType === "all") {
    return {
      planId: "plan_all_levels_monthly",
      planType: "all" as PlanType,
      selectedLevel: undefined,
      amountNpr: 100,
      allowedLevels: [...ALL_LEVELS],
      label: "Viel Erfolg Complete Access (A1-B2) - 1 Month",
    };
  }

  if (
    planType === "single" &&
    selectedLevel &&
    ALL_LEVELS.includes(selectedLevel as CefrLevel)
  ) {
    const level = selectedLevel as CefrLevel;
    return {
      planId: plan_single_${level.toLowerCase()}_monthly,
      planType: "single" as PlanType,
      selectedLevel: level,
      amountNpr: 30,
      allowedLevels: [level],
      label: Viel Erfolg ${level} Access - 1 Month,
    };
  }

  throw new Error("Please select a valid plan and CEFR level (A1, A2, B1, or B2).");
}

export function hasActiveLevelAccess(
  sub: UserSubscription | undefined,
  level: CefrLevel
): boolean {
  if (!sub || sub.plan === "free" || !sub.expiresAt) return false;
  if (new Date(sub.expiresAt).getTime() <= Date.now()) return false;
  return sub.allowedLevels.includes(level);
}

export function buildNextSubscription(
  existing: UserSubscription | undefined,
  planType: PlanType,
  allowedLevels: CefrLevel[],
  transactionId: string
): UserSubscription {
  const nowMs = Date.now();
  const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000;
  const isCurrentlyActive =
    Boolean(existing?.expiresAt) && new Date(existing!.expiresAt!).getTime() > nowMs;

  const baseMs = isCurrentlyActive
    ? new Date(existing!.expiresAt!).getTime()
    : nowMs;

  const combinedLevels = isCurrentlyActive
    ? Array.from(new Set([...(existing?.allowedLevels || []), ...allowedLevels]))
    : allowedLevels;

  return {
    plan: combinedLevels.length === 4 ? "all" : planType,
    allowedLevels: combinedLevels,
    status: "active",
    startedAt: existing?.startedAt || new Date(nowMs).toISOString(),
    expiresAt: new Date(baseMs + thirtyDaysMs).toISOString(),
    lastTransactionId: transactionId,
  };
}

export function signEsewaPayload(
  totalAmount: number,
  transactionUuid: string,
  productCode: string
): string {
  const secretKey = process.env.ESEWA_SECRET_KEY;
  if (!secretKey) {
    throw new Error("ESEWA_SECRET_KEY is not configured on the server.");
  }
  const signedMessage = total_amount=${totalAmount},transaction_uuid=${transactionUuid},product_code=${productCode};
  return crypto.createHmac("sha256", secretKey).update(signedMessage).digest("base64");
}

export async function verifyEsewaWithGateway(
  transactionUuid: string,
  expectedAmountNpr: number
): Promise<{ refId: string }> {
  const productCode = process.env.ESEWA_PRODUCT_CODE || "EPAYTEST";
  const statusUrl =
    process.env.ESEWA_STATUS_URL ||
    "https://rc.esewa.com.np/api/epay/transaction/status/";

  const endpoint = `${statusUrl}?product_code=${encodeURIComponent(
    productCode
  )}&total_amount=${expectedAmountNpr}&transaction_uuid=${encodeURIComponent(
    transactionUuid
  )}`;

  const response = await fetch(endpoint);
  if (!response.ok) {
    throw new Error("Unable to verify payment with eSewa.");
  }

  const data = await response.json();
  if (data.status !== "COMPLETE" || Number(data.total_amount) !== expectedAmountNpr) {
    throw new Error(eSewa payment is not completed (status: ${data.status || "unknown"}).);
  }

  return { refId: String(data.ref_id || transactionUuid) };
}

export async function createKhaltiCheckout(params: {
  purchaseOrderId: string;
  purchaseOrderName: string;
  amountNpr: number;
  customerName: string;
  customerEmail: string;
}): Promise<{ pidx: string; paymentUrl: string }> {
  const secretKey = process.env.KHALTI_SECRET_KEY;
  if (!secretKey) {
    throw new Error("KHALTI_SECRET_KEY is not configured on the server.");
  }

  const baseUrl = process.env.KHALTI_BASE_URL || "https://a.khalti.com/api/v2";
  const appUrl = process.env.APP_BASE_URL || "https://german-learning-website.onrender.com";

  const response = await fetch(${baseUrl}/epayment/initiate/, {
    method: "POST",
    headers: {
      Authorization: Key ${secretKey},
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      return_url: ${appUrl}/payment/callback?provider=khalti,
      website_url: appUrl,
      amount: params.amountNpr * 100,
      purchase_order_id: params.purchaseOrderId,
      purchase_order_name: params.purchaseOrderName,
      customer_info: {
        name: params.customerName || "Viel Erfolg Learner",
        email: params.customerEmail,
      },
    }),
  });

  const data = await response.json();
  if (!response.ok || !data.payment_url || !data.pidx) {
    throw new Error(data.detail || "Unable to start Khalti payment.");
  }

  return {
    pidx: String(data.pidx),
    paymentUrl: String(data.payment_url),
  };
}

export async function verifyKhaltiWithGateway(
  pidx: string,
  expectedAmountNpr: number
): Promise<{ transactionId: string }> {
  const secretKey = process.env.KHALTI_SECRET_KEY;
  if (!secretKey) {
    throw new Error("KHALTI_SECRET_KEY is not configured on the server.");
  }

  const baseUrl = process.env.KHALTI_BASE_URL || "https://a.khalti.com/api/v2";
  const response = await fetch(${baseUrl}/epayment/lookup/, {
    method: "POST",
    headers: {
      Authorization: Key ${secretKey},
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ pidx }),
  });

  const data = await response.json();
  if (
    !response.ok ||
    data.status !== "Completed" ||
    Number(data.total_amount) !== expectedAmountNpr * 100
  ) {
    throw new Error(Khalti payment is not completed (status: ${data.status || "unknown"}).);
  }

  return { transactionId: String(data.transaction_id || pidx) };