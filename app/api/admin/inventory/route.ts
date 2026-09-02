import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { ADMIN_SESSION_COOKIE, verifyAdminSessionToken } from '@/lib/admin-auth';
import { listInventory, updateInventoryItem } from '@/lib/server/inventory';

export const dynamic = 'force-dynamic';

const authorized = async () => {
  const store = await cookies();
  return verifyAdminSessionToken(store.get(ADMIN_SESSION_COOKIE)?.value);
};

export async function GET() {
  if (!(await authorized())) return NextResponse.json({ message: 'Unauthorized.' }, { status: 401 });
  try {
    const inventory = await listInventory();
    return NextResponse.json({ inventory, sheetUrl: process.env.ORDERS_SHEET_URL || process.env.WHOLESALE_ENQUIRIES_SHEET_URL || null },
      { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    console.error('[Admin inventory list]', error);
    return NextResponse.json({ message: 'Could not load inventory.' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  if (!(await authorized())) return NextResponse.json({ message: 'Unauthorized.' }, { status: 401 });
  const payload = await request.json().catch(() => null);
  const sku = typeof payload?.sku === 'string' ? payload.sku.trim().toUpperCase() : '';
  const unitsRemaining = Number(payload?.unitsRemaining);
  const lowStockThreshold = Number(payload?.lowStockThreshold);
  const notes = typeof payload?.notes === 'string' ? payload.notes.trim().slice(0, 300) : '';
  if (!/^AB-PACK-(05|10|20|30)$/.test(sku) || !Number.isInteger(unitsRemaining) || unitsRemaining < 0 || unitsRemaining > 100000 ||
      !Number.isInteger(lowStockThreshold) || lowStockThreshold < 0 || lowStockThreshold > 100000) {
    return NextResponse.json({ message: 'Enter valid stock and alert quantities.' }, { status: 400 });
  }
  try {
    const item = await updateInventoryItem({ sku, unitsRemaining, lowStockThreshold, notes, updatedBy: 'ActivBite admin' });
    return NextResponse.json({ item });
  } catch (error) {
    console.error('[Admin inventory update]', error);
    return NextResponse.json({ message: 'Could not update inventory.' }, { status: 500 });
  }
}
