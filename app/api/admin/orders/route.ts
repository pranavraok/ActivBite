import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { ADMIN_SESSION_COOKIE, verifyAdminSessionToken } from '@/lib/admin-auth';
import { isOrderStatus } from '@/lib/order-types';
import { listAdminOrders, updateAdminOrderStatus } from '@/lib/server/orders';

export const dynamic = 'force-dynamic';

const isAuthorized = async () => {
  const cookieStore = await cookies();
  return verifyAdminSessionToken(cookieStore.get(ADMIN_SESSION_COOKIE)?.value);
};

export async function GET() {
  if (!(await isAuthorized())) {
    return NextResponse.json({ message: 'Unauthorized.' }, { status: 401 });
  }

  try {
    const result = await listAdminOrders();
    return NextResponse.json(
      {
        ...result,
        sheetUrl:
          process.env.ORDERS_SHEET_URL ||
          process.env.WHOLESALE_ENQUIRIES_SHEET_URL ||
          null,
      },
      { headers: { 'Cache-Control': 'no-store' } }
    );
  } catch (error) {
    console.error('[Admin orders list]', error);
    return NextResponse.json({ message: 'Could not load orders.' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  if (!(await isAuthorized())) {
    return NextResponse.json({ message: 'Unauthorized.' }, { status: 401 });
  }

  const payload = await request.json().catch(() => null);
  const trackingId =
    typeof payload?.trackingId === 'string' ? payload.trackingId.trim().toUpperCase() : '';
  const status = payload?.status;

  if (!/^AB[A-HJ-NP-Z2-9]{6}$/.test(trackingId) || !isOrderStatus(status)) {
    return NextResponse.json({ message: 'Invalid order update.' }, { status: 400 });
  }

  try {
    const order = await updateAdminOrderStatus(trackingId, status);
    return NextResponse.json({ order });
  } catch (error) {
    console.error('[Admin order update]', error);
    return NextResponse.json({ message: 'Could not update the order.' }, { status: 500 });
  }
}
