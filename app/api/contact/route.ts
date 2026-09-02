import { NextRequest, NextResponse } from 'next/server';
import { saveContactEnquiry } from '@/lib/server/contact-enquiries';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^[0-9]{10}$/;

const cleanText = (value: unknown, limit = 1000) =>
  typeof value === 'string' ? value.trim().slice(0, limit) : '';

export async function POST(request: NextRequest) {
  const startedAt = Date.now();
  const payload = await request.json().catch(() => null);

  const fullName = cleanText(payload?.fullName, 120);
  const phone = cleanText(payload?.phone, 40).replace(/\D/g, '');
  const email = cleanText(payload?.email, 160).toLowerCase();
  const location = cleanText(payload?.location, 180);
  const topic = cleanText(payload?.topic, 80);
  const message = cleanText(payload?.message, 1400);
  const consent = Boolean(payload?.consent);

  if (fullName.length < 2) {
    return NextResponse.json({ message: 'Please enter your name.' }, { status: 400 });
  }

  if (!PHONE_PATTERN.test(phone)) {
    return NextResponse.json(
      { message: 'Please enter a valid 10 digit phone number.' },
      { status: 400 }
    );
  }

  if (!EMAIL_PATTERN.test(email)) {
    return NextResponse.json(
      { message: 'Please enter a valid email address.' },
      { status: 400 }
    );
  }

  if (location.length < 2) {
    return NextResponse.json(
      { message: 'Please enter your campus, hostel, shop, or area.' },
      { status: 400 }
    );
  }

  if (!topic) {
    return NextResponse.json({ message: 'Please choose what this is about.' }, { status: 400 });
  }

  if (!message) {
    return NextResponse.json(
      { message: 'Please enter your message.' },
      { status: 400 }
    );
  }

  if (!consent) {
    return NextResponse.json(
      { message: 'Please confirm that ActivBite may contact you.' },
      { status: 400 }
    );
  }

  const enquiry = {
    fullName,
    phone,
    email,
    location,
    topic,
    message,
    source: 'ActivBite contact page',
    createdAt: new Date().toISOString(),
  };

  try {
    const saved = await saveContactEnquiry(enquiry);

    console.info('[Contact message saved]', {
      id: saved.id,
      durationMs: Date.now() - startedAt,
    });

    return NextResponse.json({
      message: 'Message received. The ActivBite team will contact you soon.',
      id: saved.id,
      storage: saved.storage,
    });
  } catch (error) {
    console.error('[Contact message Google Sheet]', {
      durationMs: Date.now() - startedAt,
      error: error instanceof Error ? error.message : String(error),
    });
    return NextResponse.json(
      { message: 'Could not save your message right now. Please try again.' },
      { status: 500 }
    );
  }
}
