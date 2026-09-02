import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { ADMIN_SESSION_COOKIE, verifyAdminSessionToken } from '@/lib/admin-auth';
import { listContactEnquiries } from '@/lib/server/contact-enquiries';

export const dynamic = 'force-dynamic';

export async function GET() {
  const cookieStore = await cookies();
  const session = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;

  if (!verifyAdminSessionToken(session)) {
    return NextResponse.json({ message: 'Unauthorized.' }, { status: 401 });
  }

  try {
    const result = await listContactEnquiries();
    return NextResponse.json(
      {
        ...result,
        sheetUrl: process.env.CONTACT_ENQUIRIES_SHEET_URL || null,
      },
      { headers: { 'Cache-Control': 'no-store' } }
    );
  } catch (error) {
    console.error('[Contact enquiries list]', error);
    return NextResponse.json(
      { message: 'Could not load contact messages.' },
      { status: 500 }
    );
  }
}
