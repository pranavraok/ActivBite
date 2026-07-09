import { NextRequest, NextResponse } from 'next/server';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  const payload = await request.json().catch(() => null);
  const email = typeof payload?.email === 'string' ? payload.email.trim() : '';

  if (!EMAIL_PATTERN.test(email)) {
    return NextResponse.json(
      { message: 'Please enter a valid email.' },
      { status: 400 }
    );
  }

  const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
  const waitlistEntry = {
    email,
    source: 'ActivBite coming soon page',
    createdAt: new Date().toISOString(),
  };

  if (webhookUrl) {
    const sheetResponse = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(waitlistEntry),
    });

    const responseText = await sheetResponse.text();
    console.log('[Waitlist] Google Sheets response status:', sheetResponse.status);
    console.log('[Waitlist] Google Sheets response body:', responseText);

    if (!sheetResponse.ok) {
      return NextResponse.json(
        { message: 'Could not save right now. Please try again.' },
        { status: 502 }
      );
    }
  }

  return NextResponse.json({
    message: "You're on the list. We will notify you first.",
  });
}
