import 'server-only';
import { createHmac, timingSafeEqual } from 'node:crypto';

export type PaymentOrderSnapshot = {
  trackingId: string;
  packLabel: string;
  packCount: number;
  quantity: number;
  total: number;
};

type PaymentTokenPayload = {
  version: 1;
  expiresAt: number;
  order: PaymentOrderSnapshot;
};

const TRACKING_ID_PATTERN = /^AB[A-HJ-NP-Z2-9]{6}$/;
const TOKEN_LIFETIME_MS = 24 * 60 * 60 * 1000;

const getTokenSecret = () => {
  const value =
    process.env.ORDER_PAYMENT_TOKEN_SECRET?.trim() ||
    process.env.ADMIN_SESSION_SECRET?.trim();

  if (!value) {
    throw new Error('The order payment token secret is not configured.');
  }

  return value;
};

const sign = (encodedPayload: string) =>
  createHmac('sha256', getTokenSecret()).update(encodedPayload).digest('base64url');

const signaturesMatch = (left: string, right: string) => {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  return (
    leftBuffer.length === rightBuffer.length &&
    timingSafeEqual(leftBuffer, rightBuffer)
  );
};

const isValidOrder = (order: unknown): order is PaymentOrderSnapshot => {
  if (!order || typeof order !== 'object') return false;
  const value = order as Partial<PaymentOrderSnapshot>;
  return (
    typeof value.trackingId === 'string' &&
    TRACKING_ID_PATTERN.test(value.trackingId) &&
    typeof value.packLabel === 'string' &&
    value.packLabel.length > 0 &&
    Number.isInteger(value.packCount) &&
    Number.isInteger(value.quantity) &&
    Number(value.quantity) > 0 &&
    Number.isFinite(value.total) &&
    Number(value.total) > 0
  );
};

export const createPaymentOrderToken = (order: PaymentOrderSnapshot) => {
  const payload: PaymentTokenPayload = {
    version: 1,
    expiresAt: Date.now() + TOKEN_LIFETIME_MS,
    order,
  };
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64url');
  return `${encodedPayload}.${sign(encodedPayload)}`;
};

export const verifyPaymentOrderToken = (
  token: string,
  expectedTrackingId: string
): PaymentOrderSnapshot | null => {
  const [encodedPayload, signature, ...rest] = token.split('.');
  if (!encodedPayload || !signature || rest.length > 0) return null;

  let expectedSignature: string;
  try {
    expectedSignature = sign(encodedPayload);
  } catch {
    return null;
  }

  if (!signaturesMatch(signature, expectedSignature)) return null;

  try {
    const payload = JSON.parse(
      Buffer.from(encodedPayload, 'base64url').toString('utf8')
    ) as Partial<PaymentTokenPayload>;

    if (
      payload.version !== 1 ||
      typeof payload.expiresAt !== 'number' ||
      payload.expiresAt <= Date.now() ||
      !isValidOrder(payload.order) ||
      payload.order.trackingId !== expectedTrackingId
    ) {
      return null;
    }

    return payload.order;
  } catch {
    return null;
  }
};
