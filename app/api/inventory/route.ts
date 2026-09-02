import { NextResponse } from 'next/server';
import { listInventory } from '@/lib/server/inventory';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const inventory = await listInventory();
    return NextResponse.json({ inventory }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    console.error('[Public inventory]', error);
    return NextResponse.json({ message: 'Could not load product availability.' }, { status: 500 });
  }
}
