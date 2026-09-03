import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { ADMIN_SESSION_COOKIE, verifyAdminSessionToken } from '@/lib/admin-auth';
import { isOrderStatus } from '@/lib/order-types';
import { listAdminOrders, updateAdminOrderStatus } from '@/lib/server/orders';
import { listInventory, updateInventoryItem } from '@/lib/server/inventory';

export const dynamic = 'force-dynamic';

const isAuthorized = async () => {
  const cookieStore = await cookies();
  return verifyAdminSessionToken(cookieStore.get(ADMIN_SESSION_COOKIE)?.value);
};

const parseMixedCart = (source: string) => {
  const match = source.match(/Cart:\s*([0-9x,]+)/i);
  if (!match) return [];
  return match[1].split(',').map((entry) => {
    const [packCount, quantity] = entry.split('x').map(Number);
    return { packCount, quantity };
  }).filter((item) => [5, 10, 20, 30].includes(item.packCount) && item.quantity > 0);
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
    const before = (await listAdminOrders()).orders.find((order) => order.trackingId === trackingId);
    const order = await updateAdminOrderStatus(trackingId, status);
    const cart = before ? parseMixedCart(before.source) : [];
    const handledBySheet = cart.length <= 1;
    const confirmedStatuses = ['confirmed', 'preparing', 'out_for_delivery', 'delivered'];
    const shouldDeduct = status === 'confirmed' && before && !confirmedStatuses.includes(before.status);
    const shouldRestore = status === 'cancelled' && before && confirmedStatuses.includes(before.status);

    if (!handledBySheet && (shouldDeduct || shouldRestore)) {
      const inventory = await listInventory();
      await Promise.all(cart.map(async (cartItem) => {
        const item = inventory.find((candidate) => candidate.packCount === cartItem.packCount);
        if (!item || item.unitsRemaining === null) return;
        const nextStock = Math.max(0, item.unitsRemaining + (shouldRestore ? cartItem.quantity : -cartItem.quantity));
        await updateInventoryItem({
          sku: item.sku,
          unitsRemaining: nextStock,
          lowStockThreshold: item.lowStockThreshold,
          notes: `${shouldRestore ? 'Restored' : 'Deducted'} by mixed order ${trackingId}`,
          updatedBy: 'Order workflow',
        });
      }));
    }
    return NextResponse.json({ order });
  } catch (error) {
    console.error('[Admin order update]', error);
    return NextResponse.json({ message: 'Could not update the order.' }, { status: 500 });
  }
}
