import { NextRequest, NextResponse } from 'next/server';
import { ACTIVBITE_PAYMENT_CONFIG, isDummyPaymentConfig } from '@/lib/payment-config';
import { getPublicOrder } from '@/lib/server/orders';
import { verifyPaymentOrderToken } from '@/lib/server/order-payment-token';

const cleanText = (value: unknown, limit = 1000) =>
  typeof value === 'string' ? value.trim().slice(0, limit) : '';

export async function POST(request: NextRequest) {
  const payload = await request.json().catch(() => null);

  const orderId = cleanText(payload?.orderId, 80).toUpperCase();
  const paymentToken = cleanText(payload?.paymentToken, 4000);
  const paymentReference = cleanText(payload?.paymentReference, 120);
  const customerName = cleanText(payload?.customerName, 140);
  const phone = cleanText(payload?.phone, 40).replace(/\D/g, '');
  const email = cleanText(payload?.email, 180).toLowerCase();
  const deliveryPoint = cleanText(payload?.deliveryPoint, 120);
  const hostelBlock = cleanText(payload?.hostelBlock, 180);
  const roomOrLandmark = cleanText(payload?.roomOrLandmark, 220);
  if (orderId.length < 4) {
    return NextResponse.json({ message: 'Order ID is missing.' }, { status: 400 });
  }

  if (paymentReference.length < 6) {
    return NextResponse.json(
      { message: 'Please enter a valid UPI transaction/reference ID.' },
      { status: 400 }
    );
  }

  const signedOrder = verifyPaymentOrderToken(paymentToken, orderId);
  let savedOrder: Awaited<ReturnType<typeof getPublicOrder>> = null;
  if (!signedOrder) {
    try {
      savedOrder = await getPublicOrder(orderId);
    } catch (error) {
      console.error('[Payment order lookup]', error instanceof Error ? error.message : String(error));
    }
  }

  const confirmedOrder = signedOrder || savedOrder;

  if (!confirmedOrder || confirmedOrder.total < 1) {
    return NextResponse.json({ message: 'The saved order could not be found.' }, { status: 404 });
  }

  const { packLabel, packCount, quantity, total } = confirmedOrder;

  const confirmation = {
    type: 'upi_payment_confirmation',
    orderId,
    paymentReference,
    paymentStatus: 'submitted_for_manual_verification',
    paymentMethod: 'UPI QR',
    payeeName: ACTIVBITE_PAYMENT_CONFIG.payeeName,
    upiId: ACTIVBITE_PAYMENT_CONFIG.upiId,
    isDummyPaymentConfig,
    customerName,
    phone,
    email,
    deliveryPoint,
    hostelBlock,
    roomOrLandmark,
    packLabel,
    packCount,
    quantity,
    total,
    source: 'ActivBite order-status page',
    createdAt: new Date().toISOString(),
  };

  const webhookUrl =
    process.env.PAYMENT_CONFIRMATION_WEBHOOK_URL || process.env.GOOGLE_SHEETS_WEBHOOK_URL;

  if (webhookUrl) {
    const webhookResponse = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(confirmation),
    });
    const webhookText = await webhookResponse.text();
    let webhookResult: { ok?: boolean; message?: string } | null = null;

    try {
      webhookResult = JSON.parse(webhookText) as { ok?: boolean; message?: string };
    } catch {
      webhookResult = null;
    }

    if (!webhookResponse.ok || webhookResult?.ok !== true) {
      return NextResponse.json(
        {
          message:
            webhookResult?.message ||
            'Could not save the payment reference right now. Please try again.',
        },
        { status: 502 }
      );
    }
  } else {
    console.log('[UPI payment confirmation]', confirmation);
  }

  return NextResponse.json({
    message:
      'Payment reference received. ActivBite will verify it and contact you if anything is needed.',
  });
}
