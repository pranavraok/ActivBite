import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { ADMIN_SESSION_COOKIE, verifyAdminSessionToken } from '@/lib/admin-auth';
import { REPORT_CATEGORIES } from '@/lib/report-types';
import { deleteReport, listReports, uploadReport } from '@/lib/server/reports';

export const dynamic = 'force-dynamic';
const MAX_FILE_BYTES = 8 * 1024 * 1024;
const ALLOWED_MIME_TYPES = new Set([
  'application/pdf', 'image/png', 'image/jpeg', 'image/webp',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]);

const authorized = async () => {
  const store = await cookies();
  return verifyAdminSessionToken(store.get(ADMIN_SESSION_COOKIE)?.value);
};

export async function GET() {
  if (!(await authorized())) return NextResponse.json({ message: 'Unauthorized.' }, { status: 401 });
  try {
    const reports = await listReports();
    return NextResponse.json({
      reports,
      sheetUrl: process.env.ORDERS_SHEET_URL || process.env.WHOLESALE_ENQUIRIES_SHEET_URL || null,
    }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    console.error('[Admin reports list]', error);
    return NextResponse.json({ message: 'Could not load reports.' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (!(await authorized())) return NextResponse.json({ message: 'Unauthorized.' }, { status: 401 });
  const form = await request.formData().catch(() => null);
  const file = form?.get('file');
  const reportName = String(form?.get('reportName') || '').trim().slice(0, 160);
  const category = String(form?.get('category') || '').trim();
  const reportDate = String(form?.get('reportDate') || '').trim();
  const notes = String(form?.get('notes') || '').trim().slice(0, 500);
  if (!(file instanceof File) || !reportName ||
      !REPORT_CATEGORIES.includes(category as typeof REPORT_CATEGORIES[number])) {
    return NextResponse.json({ message: 'Complete the report details and choose a file.' }, { status: 400 });
  }
  if (file.size === 0 || file.size > MAX_FILE_BYTES || !ALLOWED_MIME_TYPES.has(file.type)) {
    return NextResponse.json({ message: 'Upload a PDF, image, Word, or Excel file up to 8 MB.' }, { status: 400 });
  }
  try {
    const report = await uploadReport({
      reportName, category, reportDate, notes, fileName: file.name.slice(0, 180),
      mimeType: file.type, fileBase64: Buffer.from(await file.arrayBuffer()).toString('base64'),
      uploadedBy: 'ActivBite admin',
    });
    return NextResponse.json({ report });
  } catch (error) {
    console.error('[Admin report upload]', error);
    return NextResponse.json({ message: 'Could not upload the report.' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  if (!(await authorized())) return NextResponse.json({ message: 'Unauthorized.' }, { status: 401 });
  const payload = await request.json().catch(() => null);
  const reportId = typeof payload?.reportId === 'string' ? payload.reportId.trim() : '';
  if (!reportId) return NextResponse.json({ message: 'Report ID is required.' }, { status: 400 });
  try {
    await deleteReport(reportId);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('[Admin report delete]', error);
    return NextResponse.json({ message: 'Could not delete the report.' }, { status: 500 });
  }
}
