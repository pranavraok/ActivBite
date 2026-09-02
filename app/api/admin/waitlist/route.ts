import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { ADMIN_SESSION_COOKIE, verifyAdminSessionToken } from '@/lib/admin-auth';
import { listWaitlistEntries } from '@/lib/server/waitlist-entries';

export const dynamic = 'force-dynamic';

export async function GET() {
  const cookieStore = await cookies();
  const session = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;

  if (!verifyAdminSessionToken(session)) {
    return NextResponse.json({ message: 'Unauthorized.' }, { status: 401 });
  }

  try {
    const result = await listWaitlistEntries();
    return NextResponse.json(
      {
        ...result,
        sheetUrl: process.env.WHOLESALE_ENQUIRIES_SHEET_URL || null,
      },
      { headers: { 'Cache-Control': 'no-store' } }
    );
  } catch (error) {
    console.error('[Waitlist entries]', error);
    return NextResponse.json(
      { message: 'Could not load waitlist emails.' },
      { status: 500 }
    );
  }
}
