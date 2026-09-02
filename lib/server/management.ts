import 'server-only';
import type {
  ManagementDataResponse,
  ManagementDatasetKey,
  ManagementWriteResponse,
} from '@/lib/management-types';

const webhookUrl = () => {
  const value = process.env.GOOGLE_SHEETS_WEBHOOK_URL?.trim();
  if (!value) throw new Error('The Google Sheets management bridge is not configured.');
  return value;
};

const adminSecret = () => {
  const value = process.env.WHOLESALE_ADMIN_READ_SECRET?.trim();
  if (!value) throw new Error('The management admin secret is not configured.');
  return value;
};

const parseJson = <T>(value: string): T | null => {
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
};

export const listManagementData = async () => {
  const url = new URL(webhookUrl());
  url.searchParams.set('action', 'management_data');
  url.searchParams.set('secret', adminSecret());
  const response = await fetch(url, {
    cache: 'no-store',
    signal: AbortSignal.timeout(20_000),
  });
  const result = parseJson<ManagementDataResponse>(await response.text());
  if (!response.ok || result?.ok !== true || !Array.isArray(result.datasets)) {
    throw new Error(result?.message || 'Google Sheets could not load the management workbook.');
  }
  return result.datasets;
};

export const addManagementRecord = async (
  dataset: ManagementDatasetKey,
  values: Record<string, string | number>
) => {
  const response = await fetch(webhookUrl(), {
    method: 'POST',
    cache: 'no-store',
    signal: AbortSignal.timeout(20_000),
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    body: JSON.stringify({
      type: 'admin_add_management_record',
      secret: adminSecret(),
      dataset,
      values,
    }),
  });
  const result = parseJson<ManagementWriteResponse>(await response.text());
  if (!response.ok || result?.ok !== true || !Array.isArray(result.row)) {
    throw new Error(result?.message || 'Google Sheets could not save this record.');
  }
  return result;
};

export const updateManagementRecord = async (
  dataset: ManagementDatasetKey,
  rowNumber: number,
  values: Record<string, string | number>
) => {
  const response = await fetch(webhookUrl(), {
    method: 'POST',
    cache: 'no-store',
    signal: AbortSignal.timeout(20_000),
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    body: JSON.stringify({
      type: 'admin_update_management_record',
      secret: adminSecret(),
      dataset,
      rowNumber,
      values,
    }),
  });
  const result = parseJson<ManagementWriteResponse>(await response.text());
  if (!response.ok || result?.ok !== true || !Array.isArray(result.row)) {
    throw new Error(result?.message || 'Google Sheets could not update this record.');
  }
  return result;
};
