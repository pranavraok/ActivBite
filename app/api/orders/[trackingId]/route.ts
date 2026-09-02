import { NextRequest, NextResponse } from 'next/server';
import { getPublicOrder } from '@/lib/server/orders';

const TRACKING_ID_PATTERN = /^AB[A-HJ-NP-Z2-9]{6}$/;

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ trackingId: string }> }
) {
  const { trackingId: rawTrackingId } = await params;
  const trackingId = decodeURIComponent(rawTrackingId || '').trim().toUpperCase();

  if (!TRACKING_ID_PATTERN.test(trackingId)) {
    return NextResponse.json(
      { message: 'Enter the 8-character ActivBite tracking ID.' },
      { status: 400 }
    );
  }

  try {
    const order = await getPublicOrder(trackingId);

    if (!order) {
      return NextResponse.json(
        { message: 'We could not find that tracking ID. Please check it and try again.' },
        { status: 404 }
      );
    }

    return NextResponse.json({ order, storage: 'google-sheets' });
  } catch (error) {
    console.error('[Order lookup]', error instanceof Error ? error.message : String(error));
    return NextResponse.json(
      { message: 'Could not load the order status right now. Please try again.' },
      { status: 500 }
    );
  }
}
