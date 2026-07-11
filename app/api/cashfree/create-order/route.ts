import { randomUUID } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';

const PACK_PRICES = {
  10: 400,
  20: 800,
  30: 1200,
} as const;

const CASHFREE_API_VERSION = process.env.CASHFREE_API_VERSION || '2025-01-01';
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^[0-9]{10}$/;

const getCashfreeMode = () => {
  const rawMode = (process.env.CASHFREE_MODE || process.env.CASHFREE_ENVIRONMENT || 'sandbox').toLowerCase();
  return rawMode === 'production' || rawMode === 'prod' || rawMode === 'live' ? 'production' : 'sandbox';
};

const getSiteUrl = (request: NextRequest) =>
  (process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || request.nextUrl.origin).replace(/\/$/, '');

const cleanText = (value: unknown, maxLength = 120) =>
  typeof value === 'string' ? value.trim().replace(/\s+/g, ' ').slice(0, maxLength) : '';

export async function POST(request: NextRequest) {
  const clientId = process.env.CASHFREE_CLIENT_ID || process.env.CASHFREE_APP_ID || process.env.NEXT_PUBLIC_CASHFREE_APP_ID;
  const clientSecret = process.env.CASHFREE_CLIENT_SECRET || process.env.CASHFREE_SECRET_KEY;

  if (!clientId || !clientSecret) {
    return NextResponse.json(
      {
        error: 'Cashfree keys are not configured yet. Add CASHFREE_CLIENT_ID and CASHFREE_CLIENT_SECRET.',
      },
      { status: 503 }
    );
  }

  const body = await request.json().catch(() => null);
  const packCount = Number(body?.packCount);
  const quantity = Number(body?.quantity || 1);
  const customer = body?.customer || {};
  const customerName = cleanText(customer.name, 80);
  const customerPhone = cleanText(customer.phone, 20).replace(/\D/g, '');
  const customerEmail = cleanText(customer.email, 120).toLowerCase();
  const deliveryCampus =
    cleanText(customer.campus, 120) || 'National Institute of Technology Karnataka (NITK)';
  const deliveryPoint = cleanText(customer.deliveryPoint, 80);
  const hostelBlock = cleanText(customer.hostelBlock, 120);
  const roomOrLandmark = cleanText(customer.roomOrLandmark, 160);
  const deliveryNote = cleanText(customer.deliveryNote, 220);

  if (!(packCount === 10 || packCount === 20 || packCount === 30)) {
    return NextResponse.json({ error: 'Please select a valid pack.' }, { status: 400 });
  }

  if (!Number.isInteger(quantity) || quantity < 1 || quantity > 10) {
    return NextResponse.json({ error: 'Please select a valid quantity.' }, { status: 400 });
  }

  if (customerName.length < 2) {
    return NextResponse.json({ error: 'Please enter the customer name.' }, { status: 400 });
  }

  if (!PHONE_PATTERN.test(customerPhone)) {
    return NextResponse.json({ error: 'Please enter a valid 10 digit phone number.' }, { status: 400 });
  }

  if (!EMAIL_PATTERN.test(customerEmail)) {
    return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
  }

  if (deliveryPoint.length < 2 || hostelBlock.length < 2 || roomOrLandmark.length < 2) {
    return NextResponse.json(
      { error: 'Please enter the complete NITK delivery details.' },
      { status: 400 }
    );
  }

  const mode = getCashfreeMode();
  const apiBaseUrl = mode === 'production' ? 'https://api.cashfree.com/pg' : 'https://sandbox.cashfree.com/pg';
  const orderId = `AB_${Date.now()}_${packCount}_${randomUUID().slice(0, 8)}`;
  const orderAmount = PACK_PRICES[packCount] * quantity;
  const siteUrl = getSiteUrl(request);
  const returnUrl = process.env.CASHFREE_RETURN_URL || `${siteUrl}/shop?order_id={order_id}`;
  const notifyUrl = process.env.CASHFREE_NOTIFY_URL;
  const deliverySummary = [
    deliveryCampus,
    deliveryPoint,
    hostelBlock,
    roomOrLandmark,
    deliveryNote ? `Note: ${deliveryNote}` : '',
  ].filter(Boolean).join(' | ');

  const cashfreeResponse = await fetch(`${apiBaseUrl}/orders`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'x-api-version': CASHFREE_API_VERSION,
      'x-client-id': clientId,
      'x-client-secret': clientSecret,
      'x-idempotency-key': randomUUID(),
    },
    body: JSON.stringify({
      order_id: orderId,
      order_amount: orderAmount,
      order_currency: 'INR',
      customer_details: {
        customer_id: `ab_${customerPhone}_${randomUUID().slice(0, 6)}`,
        customer_name: customerName,
        customer_email: customerEmail,
        customer_phone: customerPhone,
      },
      order_meta: {
        return_url: returnUrl,
        ...(notifyUrl ? { notify_url: notifyUrl } : {}),
      },
      order_note: `ActivBite Breakfast Bar - Pack of ${packCount} x ${quantity}. Delivery: ${deliverySummary}`.slice(0, 250),
      order_tags: {
        product: 'breakfast-bar',
        pack_count: String(packCount),
        quantity: String(quantity),
        campus: 'NITK',
        delivery_point: deliveryPoint,
      },
    }),
  });

  const cashfreeData = await cashfreeResponse.json().catch(() => null);

  if (!cashfreeResponse.ok || !cashfreeData?.payment_session_id) {
    return NextResponse.json(
      {
        error: cashfreeData?.message || 'Cashfree could not create the payment session.',
      },
      { status: cashfreeResponse.status || 502 }
    );
  }

  return NextResponse.json({
    mode,
    orderId: cashfreeData.order_id,
    paymentSessionId: cashfreeData.payment_session_id,
  });
}
