import { NextRequest, NextResponse } from 'next/server';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^[0-9]{10}$/;

const cleanText = (value: unknown, limit = 1000) =>
  typeof value === 'string' ? value.trim().slice(0, limit) : '';

export async function POST(request: NextRequest) {
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

  if (message.length < 10) {
    return NextResponse.json(
      { message: 'Please add a little more detail to your message.' },
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
    type: 'contact_enquiry',
    fullName,
    phone,
    email,
    location,
    topic,
    message,
    source: 'ActivBite contact page',
    createdAt: new Date().toISOString(),
  };

  const webhookUrl =
    process.env.CONTACT_ENQUIRY_WEBHOOK_URL || process.env.GOOGLE_SHEETS_WEBHOOK_URL;

  if (webhookUrl) {
    const webhookResponse = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(enquiry),
    });

    if (!webhookResponse.ok) {
      return NextResponse.json(
        { message: 'Could not send the signal right now. Please try again.' },
        { status: 502 }
      );
    }
  } else {
    console.log('[Contact enquiry]', enquiry);
  }

  return NextResponse.json({
    message: 'Signal received. The ActivBite team will contact you soon.',
  });
}
