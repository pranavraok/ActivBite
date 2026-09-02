import { NextRequest, NextResponse } from 'next/server';
import { saveWholesaleEnquiry } from '@/lib/server/wholesale-enquiries';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^[0-9]{10}$/;

const cleanText = (value: unknown) =>
  typeof value === 'string' ? value.trim().slice(0, 1000) : '';

export async function POST(request: NextRequest) {
  const startedAt = Date.now();
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

  try {
    const saved = await saveWholesaleEnquiry(enquiry);

    console.info('[Wholesale enquiry saved]', {
      id: saved.id,
      durationMs: Date.now() - startedAt,
    });

    return NextResponse.json({
      message: 'Wholesale enquiry received. The ActivBite team will contact you soon.',
      id: saved.id,
      storage: saved.storage,
    });
  } catch (error) {
    console.error('[Wholesale enquiry Google Sheet]', {
      durationMs: Date.now() - startedAt,
      error: error instanceof Error ? error.message : String(error),
    });
    return NextResponse.json(
      { message: 'Could not save the enquiry right now. Please try again.' },
      { status: 500 }
    );
  }
}
