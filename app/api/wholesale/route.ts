import { NextRequest, NextResponse } from 'next/server';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^[0-9]{10}$/;

const cleanText = (value: unknown) =>
  typeof value === 'string' ? value.trim().slice(0, 1000) : '';

export async function POST(request: NextRequest) {
  const payload = await request.json().catch(() => null);

  const shopName = cleanText(payload?.shopName);
  const contactName = cleanText(payload?.contactName);
  const phone = cleanText(payload?.phone).replace(/\D/g, '');
  const email = cleanText(payload?.email).toLowerCase();
  const shopType = cleanText(payload?.shopType);
  const location = cleanText(payload?.location);
  const monthlyRequirement = cleanText(payload?.monthlyRequirement);
  const preferredPack = cleanText(payload?.preferredPack);
  const message = cleanText(payload?.message);

  if (shopName.length < 2) {
    return NextResponse.json({ message: 'Please enter the shop name.' }, { status: 400 });
  }

  if (contactName.length < 2) {
    return NextResponse.json({ message: 'Please enter the contact person name.' }, { status: 400 });
  }

  if (!PHONE_PATTERN.test(phone)) {
    return NextResponse.json({ message: 'Please enter a valid 10 digit phone number.' }, { status: 400 });
  }

  if (!EMAIL_PATTERN.test(email)) {
    return NextResponse.json({ message: 'Please enter a valid email address.' }, { status: 400 });
  }

  if (!shopType || !location || !monthlyRequirement || !preferredPack) {
    return NextResponse.json({ message: 'Please complete all required wholesale details.' }, { status: 400 });
  }

  const enquiry = {
    type: 'wholesale_enquiry',
    shopName,
    contactName,
    phone,
    email,
    shopType,
    location,
    monthlyRequirement,
    preferredPack,
    message,
    source: 'ActivBite wholesale page',
    createdAt: new Date().toISOString(),
  };

  const webhookUrl =
    process.env.WHOLESALE_ENQUIRY_WEBHOOK_URL || process.env.GOOGLE_SHEETS_WEBHOOK_URL;

  if (webhookUrl) {
    const sheetResponse = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(enquiry),
    });

    if (!sheetResponse.ok) {
      return NextResponse.json(
        { message: 'Could not send the enquiry right now. Please try again.' },
        { status: 502 }
      );
    }
  } else {
    console.log('[Wholesale enquiry]', enquiry);
  }

  return NextResponse.json({
    message: 'Wholesale enquiry received. The ActivBite team will contact you soon.',
  });
}
