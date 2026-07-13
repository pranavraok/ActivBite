import { NextRequest, NextResponse } from 'next/server';
import { ACTIVBITE_PAYMENT_CONFIG, isDummyPaymentConfig } from '@/lib/payment-config';

const cleanText = (value: unknown, limit = 1000) =>
  typeof value === 'string' ? value.trim().slice(0, limit) : '';

export async function POST(request: NextRequest) {
  const payload = await request.json().catch(() => null);

  const orderId = cleanText(payload?.orderId, 80);
  const paymentReference = cleanText(payload?.paymentReference, 120);
  const customerName = cleanText(payload?.customerName, 140);
  const phone = cleanText(payload?.phone, 40).replace(/\D/g, '');
  const email = cleanText(payload?.email, 180).toLowerCase();
  const deliveryPoint = cleanText(payload?.deliveryPoint, 120);
  const hostelBlock = cleanText(payload?.hostelBlock, 180);
  const roomOrLandmark = cleanText(payload?.roomOrLandmark, 220);
  const packLabel = cleanText(payload?.packLabel, 80);
  const packCount = Number(payload?.packCount) || 0;
  const quantity = Number(payload?.quantity) || 1;
  const total = Number(payload?.total) || 0;

  if (orderId.length < 4) {
    return NextResponse.json({ message: 'Order ID is missing.' }, { status: 400 });
  }

  if (paymentReference.length < 6) {
    return NextResponse.json(
      { message: 'Please enter a valid UPI transaction/reference ID.' },
      { status: 400 }
    );
  }

  if (!total || total < 1) {
    return NextResponse.json({ message: 'Order amount is missing.' }, { status: 400 });
  }

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

    if (!webhookResponse.ok) {
      return NextResponse.json(
        { message: 'Could not save the payment reference right now. Please try again.' },
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
