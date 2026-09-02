import 'server-only';
import {
  ORDER_STATUS_MESSAGES,
  isOrderStatus,
  type AdminOrderRecord,
  type OrderStatus,
  type PublicOrder,
} from '@/lib/order-types';

export type { AdminOrderRecord, OrderStatus, PublicOrder } from '@/lib/order-types';

export type NewOrder = {
  trackingId: string;
  customerName: string;
  phone: string;
  email: string;
  deliveryPoint: string;
  hostelBlock: string;
  roomOrLandmark: string;
  packLabel: string;
  packCount: number;
  quantity: number;
  total: number;
  source: string;
  createdAt: string;
};

type SheetWriteResponse = { ok?: boolean; id?: string; message?: string };
type SheetReadResponse = { ok?: boolean; order?: PublicOrder; message?: string };
type SheetAdminReadResponse = {
  ok?: boolean;
  orders?: AdminOrderRecord[];
  message?: string;
};

const getWebhookUrl = () => {
  const value = process.env.GOOGLE_SHEETS_WEBHOOK_URL;

  if (!value?.trim()) {
    throw new Error('The Google Sheets order webhook is not configured.');
  }

  return value.trim();
};

const parseJson = <T>(value: string): T | null => {
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
};

const RETRY_DELAYS_MS = [0, 400, 1_200] as const;

const wait = (milliseconds: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, milliseconds));

const isRetryableStatus = (status: number) =>
  status === 408 || status === 429 || status >= 500;

const fetchOrderSheet = async (
  input: URL | string,
  init: RequestInit = {},
  attempts: number = RETRY_DELAYS_MS.length
) => {
  let lastError: unknown;

  for (let attempt = 0; attempt < attempts; attempt += 1) {
    if (RETRY_DELAYS_MS[attempt] > 0) {
      await wait(RETRY_DELAYS_MS[attempt]);
    }

    try {
      const response = await fetch(input, {
        ...init,
        cache: 'no-store',
        redirect: 'follow',
        signal: init.signal ?? AbortSignal.timeout(12_000),
      });

      if (
        isRetryableStatus(response.status) &&
        attempt < attempts - 1
      ) {
        continue;
      }

      return response;
    } catch (error) {
      lastError = error;
      console.warn('[Google Sheets orders] transient connection failure', {
        attempt: attempt + 1,
        message: error instanceof Error ? error.message : String(error),
      });

      if (attempt === attempts - 1) {
        throw error;
      }
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new Error('Google Sheets could not be reached.');
};

export const createOrder = async (order: NewOrder) => {
  let lastError: unknown;

  for (let attempt = 0; attempt < RETRY_DELAYS_MS.length; attempt += 1) {
    if (attempt > 0) {
      await wait(RETRY_DELAYS_MS[attempt]);

      // A POST can reach Apps Script even if its redirect response is interrupted.
      // Confirm the Track ID before retrying so the Sheet never gets a duplicate row.
      const existingOrder = await getPublicOrder(order.trackingId).catch(() => null);
      if (existingOrder) {
        return { trackingId: order.trackingId, storage: 'google-sheets' as const };
      }
    }

    try {
      const response = await fetchOrderSheet(
        getWebhookUrl(),
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ type: 'order_created', ...order }),
        },
        1
      );
      const result = parseJson<SheetWriteResponse>(await response.text());

      if (!response.ok || result?.ok !== true) {
        throw new Error(result?.message || 'Google Sheets could not save the order.');
      }

      return {
        trackingId: result.id || order.trackingId,
        storage: 'google-sheets' as const,
      };
    } catch (error) {
      lastError = error;
    }
  }

  const existingOrder = await getPublicOrder(order.trackingId).catch(() => null);
  if (existingOrder) {
    return { trackingId: order.trackingId, storage: 'google-sheets' as const };
  }

  throw lastError instanceof Error
    ? lastError
    : new Error('Google Sheets could not save the order.');
};

export const getPublicOrder = async (trackingId: string) => {
  const url = new URL(getWebhookUrl());
  url.searchParams.set('action', 'track_order');
  url.searchParams.set('trackingId', trackingId);

  const response = await fetchOrderSheet(url, {
    method: 'GET',
  });
  const result = parseJson<SheetReadResponse>(await response.text());

  if (!response.ok || !result || result.ok !== true || !result.order) {
    return null;
  }

  const order = result.order;
  return {
    trackingId: String(order.trackingId || trackingId),
    status: String(order.status || 'awaiting_payment') as OrderStatus,
    statusMessage: String(order.statusMessage || ''),
    packLabel: String(order.packLabel || ''),
    packCount: Number(order.packCount) || 0,
    quantity: Number(order.quantity) || 1,
    total: Number(order.total) || 0,
    deliveryPoint: String(order.deliveryPoint || ''),
    createdAt: String(order.createdAt || ''),
    updatedAt: String(order.updatedAt || ''),
  } satisfies PublicOrder;
};

const getAdminReadSecret = () => {
  const value = process.env.WHOLESALE_ADMIN_READ_SECRET;

  if (!value?.trim()) {
    throw new Error('The Google Sheets admin read secret is not configured.');
  }

  return value.trim();
};

const normalizeAdminOrder = (order: AdminOrderRecord): AdminOrderRecord => {
  const status = isOrderStatus(order.status) ? order.status : 'awaiting_payment';
  return {
    trackingId: String(order.trackingId || ''),
    createdAt: String(order.createdAt || ''),
    updatedAt: String(order.updatedAt || ''),
    status,
    statusMessage: String(order.statusMessage || ORDER_STATUS_MESSAGES[status]),
    customerName: String(order.customerName || ''),
    phone: String(order.phone || ''),
    email: String(order.email || ''),
    deliveryPoint: String(order.deliveryPoint || ''),
    hostelBlock: String(order.hostelBlock || ''),
    roomOrLandmark: String(order.roomOrLandmark || ''),
    packLabel: String(order.packLabel || ''),
    packCount: Number(order.packCount) || 0,
    quantity: Number(order.quantity) || 1,
    total: Number(order.total) || 0,
    paymentReference: String(order.paymentReference || ''),
    source: String(order.source || 'ActivBite checkout'),
  };
};

export const listAdminOrders = async () => {
  const url = new URL(getWebhookUrl());
  url.searchParams.set('action', 'orders');
  url.searchParams.set('secret', getAdminReadSecret());

  const response = await fetchOrderSheet(url);
  const result = parseJson<SheetAdminReadResponse>(await response.text());

  if (!response.ok || result?.ok !== true || !Array.isArray(result.orders)) {
    throw new Error(result?.message || 'Google Sheets could not load the orders.');
  }

  return {
    orders: result.orders
      .filter((order) => order && typeof order === 'object')
      .map(normalizeAdminOrder)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    storage: 'google-sheets' as const,
  };
};

export const updateAdminOrderStatus = async (
  trackingId: string,
  status: OrderStatus
) => {
  const statusMessage = ORDER_STATUS_MESSAGES[status];
  const response = await fetchOrderSheet(getWebhookUrl(), {
    method: 'POST',
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    body: JSON.stringify({
      type: 'admin_update_order',
      secret: getAdminReadSecret(),
      trackingId,
      status,
      statusMessage,
      updatedAt: new Date().toISOString(),
    }),
  });
  const result = parseJson<SheetWriteResponse>(await response.text());

  if (!response.ok || result?.ok !== true) {
    throw new Error(result?.message || 'Google Sheets could not update the order.');
  }

  return { trackingId, status, statusMessage };
};
