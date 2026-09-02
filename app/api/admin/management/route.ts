import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { ADMIN_SESSION_COOKIE, verifyAdminSessionToken } from '@/lib/admin-auth';
import type { ManagementDatasetKey } from '@/lib/management-types';
import { addManagementRecord, listManagementData, updateManagementRecord } from '@/lib/server/management';

export const dynamic = 'force-dynamic';

const allowedDatasets = new Set<ManagementDatasetKey>([
  'products',
  'purchases',
  'sales',
  'customers',
  'suppliers',
  'payments_received',
  'payments_made',
  'expenses',
  'production_batches',
  'batch_traceability',
]);

const authorized = async () => {
  const store = await cookies();
  return verifyAdminSessionToken(store.get(ADMIN_SESSION_COOKIE)?.value);
};

export async function GET() {
  if (!(await authorized())) return NextResponse.json({ message: 'Unauthorized.' }, { status: 401 });
  try {
    const datasets = await listManagementData();
    return NextResponse.json(
      { datasets, sheetUrl: process.env.MANAGEMENT_SHEET_URL || 'https://docs.google.com/spreadsheets/d/1LWCfQAnhINz48MmN9SgWv5HLK03RHA_hFltrQS-p6kw/edit' },
      { headers: { 'Cache-Control': 'no-store' } }
    );
  } catch (error) {
    console.error('[Admin management workbook]', error);
    return NextResponse.json({ message: 'Could not load the management workbook.' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (!(await authorized())) return NextResponse.json({ message: 'Unauthorized.' }, { status: 401 });
  const payload = await request.json().catch(() => null);
  const dataset = payload?.dataset as ManagementDatasetKey;
  const sourceValues = payload?.values;
  if (!allowedDatasets.has(dataset) || !sourceValues || typeof sourceValues !== 'object' || Array.isArray(sourceValues)) {
    return NextResponse.json({ message: 'Choose a valid record type and complete its fields.' }, { status: 400 });
  }

  const values = Object.fromEntries(
    Object.entries(sourceValues)
      .slice(0, 20)
      .map(([key, value]) => [String(key).slice(0, 80), String(value ?? '').trim().slice(0, 500)])
  );
  if (!Object.values(values).some(Boolean)) {
    return NextResponse.json({ message: 'Add at least one value before saving.' }, { status: 400 });
  }

  try {
    const result = await addManagementRecord(dataset, values);
    return NextResponse.json(result);
  } catch (error) {
    console.error('[Admin management record]', error);
    return NextResponse.json({ message: 'Could not save this record to Google Sheets.' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  if (!(await authorized())) return NextResponse.json({ message: 'Unauthorized.' }, { status: 401 });
  const payload = await request.json().catch(() => null);
  const dataset = payload?.dataset as ManagementDatasetKey;
  const rowNumber = Number(payload?.rowNumber);
  const sourceValues = payload?.values;
  if (!allowedDatasets.has(dataset) || !Number.isInteger(rowNumber) || rowNumber < 2 || !sourceValues || typeof sourceValues !== 'object' || Array.isArray(sourceValues)) {
    return NextResponse.json({ message: 'Choose a valid record to update.' }, { status: 400 });
  }
  const values = Object.fromEntries(
    Object.entries(sourceValues)
      .slice(0, 20)
      .map(([key, value]) => [String(key).slice(0, 80), String(value ?? '').trim().slice(0, 500)])
  );
  try {
    return NextResponse.json(await updateManagementRecord(dataset, rowNumber, values));
  } catch (error) {
    console.error('[Admin management record update]', error);
    return NextResponse.json({ message: 'Could not update this record in Google Sheets.' }, { status: 500 });
  }
}
