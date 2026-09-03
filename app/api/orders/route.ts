import { NextRequest, NextResponse } from 'next/server';
import { randomBytes } from 'node:crypto';
import { createOrder } from '@/lib/server/orders';
import { createPaymentOrderToken } from '@/lib/server/order-payment-token';
import { listInventory } from '@/lib/server/inventory';
import { isPackAvailable } from '@/lib/inventory-types';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^[0-9]{10}$/;
const TRACKING_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

const PACKS = {
  5: { label: 'Mini Pack', price: 225 },
  10: { label: 'Starter Pack', price: 420 },
  20: { label: 'Routine Pack', price: 825 },
  30: { label: 'Power Pack', price: 1149 },
} as const;
type PackCount = keyof typeof PACKS;
type CartItem = { packCount: PackCount; quantity: number };

const cleanText = (value: unknown, limit = 1000) =>
  typeof value === 'string' ? value.trim().slice(0, limit) : '';

const createTrackingId = () => {
  const bytes = randomBytes(6);
  return `AB${Array.from(bytes, (value) => TRACKING_ALPHABET[value % TRACKING_ALPHABET.length]).join('')}`;
};

export async function POST(request: NextRequest) {
  const payload = await request.json().catch(() => null);
  const customerName = cleanText(payload?.customerName, 140);
  const phone = cleanText(payload?.phone, 40).replace(/\D/g, '');
  const email = cleanText(payload?.email, 180).toLowerCase();
  const deliveryPoint = cleanText(payload?.deliveryPoint, 120);
  const hostelBlock = cleanText(payload?.hostelBlock, 180);
  const roomOrLandmark = cleanText(payload?.roomOrLandmark, 220);
  const requestedItems: unknown[] = Array.isArray(payload?.items)
    ? payload.items
    : [{ packCount: payload?.packCount, quantity: payload?.quantity }];
  const items: CartItem[] = requestedItems.map((rawItem) => {
    const item = (rawItem && typeof rawItem === 'object' ? rawItem : {}) as { packCount?: unknown; quantity?: unknown };
    return { packCount: Number(item.packCount) as PackCount, quantity: Number(item.quantity) };
  });

  if (customerName.length < 2) {
    return NextResponse.json({ message: 'Please enter the customer name.' }, { status: 400 });
  }
  if (!PHONE_PATTERN.test(phone)) {
    return NextResponse.json({ message: 'Please enter a valid 10 digit phone number.' }, { status: 400 });
  }
  if (!EMAIL_PATTERN.test(email)) {
    return NextResponse.json({ message: 'Please enter a valid email.' }, { status: 400 });
  }
  if (!deliveryPoint || hostelBlock.length < 2 || roomOrLandmark.length < 2) {
    return NextResponse.json({ message: 'Please complete the delivery details.' }, { status: 400 });
  }
  if (
    items.length < 1 || items.length > 4 ||
    items.some((item) => !PACKS[item.packCount] || !Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 10) ||
    new Set(items.map((item) => item.packCount)).size !== items.length
  ) {
    return NextResponse.json({ message: 'The selected pack or quantity is invalid.' }, { status: 400 });
  }

  const packLabel = items.map((item) => `${PACKS[item.packCount].label} × ${item.quantity}`).join(' + ');
  const total = items.reduce((sum, item) => sum + PACKS[item.packCount].price * item.quantity, 0);
  const storedPackCount = items.length === 1 ? items[0].packCount : 0;
  const storedQuantity = items.length === 1 ? items[0].quantity : 1;
  const source = `ActivBite checkout | Cart: ${items.map((item) => `${item.packCount}x${item.quantity}`).join(',')}`;

  try {
    const inventory = await listInventory();
    const unavailableItem = items.find((item) => !isPackAvailable(inventory.find((stock) => stock.packCount === item.packCount), item.quantity));
    if (unavailableItem) {
      return NextResponse.json(
        { message: `${PACKS[unavailableItem.packCount].label} does not have enough stock for this order.` },
        { status: 409 }
      );
    }

    let saved: Awaited<ReturnType<typeof createOrder>> | null = null;

    for (let attempt = 0; attempt < 3 && !saved; attempt += 1) {
      const trackingId = createTrackingId();
      try {
        saved = await createOrder({
          trackingId,
          customerName,
          phone,
          email,
          deliveryPoint,
          hostelBlock,
          roomOrLandmark,
          packLabel,
          packCount: storedPackCount,
          quantity: storedQuantity,
          total,
          source,
          createdAt: new Date().toISOString(),
        });
      } catch (error) {
        const message = error instanceof Error ? error.message : '';
        if (!message.toLowerCase().includes('already exists') || attempt === 2) throw error;
      }
    }

    if (!saved) throw new Error('Could not generate a unique tracking ID.');

    const order = {
      trackingId: saved.trackingId,
      packLabel,
      packCount: storedPackCount,
      quantity: storedQuantity,
      total,
    };

    return NextResponse.json({
      trackingId: saved.trackingId,
      status: 'awaiting_payment',
      storage: saved.storage,
      order,
      paymentToken: createPaymentOrderToken(order),
    });
  } catch (error) {
    console.error('[Order creation]', error instanceof Error ? error.message : String(error));
    return NextResponse.json(
      { message: 'Could not save your order right now. Please try again.' },
      { status: 500 }
    );
  }
}
