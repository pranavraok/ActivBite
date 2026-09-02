import 'server-only';
import type { AdminReportRecord } from '@/lib/report-types';

type ReportsResponse = { ok?: boolean; reports?: AdminReportRecord[]; report?: AdminReportRecord; message?: string };

const webhookUrl = () => {
  const value = process.env.GOOGLE_SHEETS_WEBHOOK_URL?.trim();
  if (!value) throw new Error('The Google Sheets report bridge is not configured.');
  return value;
};

const adminSecret = () => {
  const value = process.env.WHOLESALE_ADMIN_READ_SECRET?.trim();
  if (!value) throw new Error('The reports admin secret is not configured.');
  return value;
};

const parseJson = <T>(value: string): T | null => {
  try { return JSON.parse(value) as T; } catch { return null; }
};

const request = async (input: URL | string, init?: RequestInit) => {
  const response = await fetch(input, {
    ...init, cache: 'no-store', redirect: 'follow', signal: AbortSignal.timeout(25_000),
  });
  const result = parseJson<ReportsResponse>(await response.text());
  if (!response.ok || result?.ok !== true) {
    throw new Error(result?.message || 'Google Sheets could not complete the report request.');
  }
  return result;
};

export const listReports = async () => {
  const url = new URL(webhookUrl());
  url.searchParams.set('action', 'reports');
  url.searchParams.set('secret', adminSecret());
  const result = await request(url);
  return Array.isArray(result.reports) ? result.reports : [];
};

export const uploadReport = async (input: {
  reportName: string; category: string; reportDate: string; notes: string;
  fileName: string; mimeType: string; fileBase64: string; uploadedBy: string;
}) => {
  const result = await request(webhookUrl(), {
    method: 'POST',
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    body: JSON.stringify({
      type: 'admin_upload_report', secret: adminSecret(), ...input,
      reportId: crypto.randomUUID(), uploadedAt: new Date().toISOString(),
    }),
  });
  if (!result.report) throw new Error('The report was uploaded but its record could not be returned.');
  return result.report;
};

export const deleteReport = async (reportId: string) => {
  await request(webhookUrl(), {
    method: 'POST',
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    body: JSON.stringify({ type: 'admin_delete_report', secret: adminSecret(), reportId }),
  });
};
