import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { ADMIN_SESSION_COOKIE, verifyAdminSessionToken } from '@/lib/admin-auth';
import { listWholesaleEnquiries } from '@/lib/server/wholesale-enquiries';

export const dynamic = 'force-dynamic';

export async function GET() {
  const cookieStore = await cookies();
  const session = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;

  if (!verifyAdminSessionToken(session)) {
    return NextResponse.json({ message: 'Unauthorized.' }, { status: 401 });
  }

  try {
    const result = await listWholesaleEnquiries();
    return NextResponse.json(
      {
        ...result,
        sheetUrl: process.env.WHOLESALE_ENQUIRIES_SHEET_URL || null,
      },
      { headers: { 'Cache-Control': 'no-store' } }
    );
  } catch (error) {
    console.error('[Wholesale enquiries list]', error);
    return NextResponse.json(
      { message: 'Could not load wholesale enquiries.' },
      { status: 500 }
    );
  }
}
