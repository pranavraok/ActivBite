import 'server-only';

import { randomUUID } from 'node:crypto';

export type WholesaleEnquiryRecord = {
  id: string;
  shopName: string;
  contactName: string;
  phone: string;
  email: string;
  shopType: string;
  location: string;
  monthlyRequirement: string;
  preferredPack: string;
  message: string;
  source: string;
  createdAt: string;
};

export type NewWholesaleEnquiry = Omit<WholesaleEnquiryRecord, 'id'>;

type SheetWriteResponse = { ok?: boolean; id?: string; message?: string };
type SheetReadResponse = {
  ok?: boolean;
  enquiries?: WholesaleEnquiryRecord[];
  message?: string;
};

const getWebhookUrl = () => {
  const value =
    process.env.WHOLESALE_ENQUIRY_WEBHOOK_URL ||
    process.env.GOOGLE_SHEETS_WEBHOOK_URL;

  if (!value?.trim()) {
    throw new Error('The Google Sheets webhook is not configured.');
  }

  return value.trim();
};

const parseJson = <T>(value: string): T | null => {
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
};

export const saveWholesaleEnquiry = async (enquiry: NewWholesaleEnquiry) => {
  const id = randomUUID();
  const response = await fetch(getWebhookUrl(), {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      type: 'wholesale_enquiry',
      submissionId: id,
      ...enquiry,
    }),
    cache: 'no-store',
    redirect: 'follow',
  });

  const responseText = await response.text();
  const result = parseJson<SheetWriteResponse>(responseText);

  if (!response.ok || result?.ok !== true) {
    throw new Error(result?.message || 'Google Sheets could not save the enquiry.');
  }

  return { id: result?.id || id, storage: 'google-sheets' as const };
};

export const listWholesaleEnquiries = async () => {
  const readSecret = process.env.WHOLESALE_ADMIN_READ_SECRET?.trim();

  if (!readSecret) {
    throw new Error('The Google Sheets admin read secret is not configured.');
  }

  const url = new URL(getWebhookUrl());
  url.searchParams.set('action', 'wholesale_enquiries');
  url.searchParams.set('secret', readSecret);

  const response = await fetch(url, {
    method: 'GET',
    cache: 'no-store',
    redirect: 'follow',
  });
  const responseText = await response.text();
  const result = parseJson<SheetReadResponse>(responseText);

  if (!response.ok || !result || result.ok === false || !Array.isArray(result.enquiries)) {
    throw new Error(result?.message || 'Google Sheets could not load the enquiries.');
  }

  const enquiries = result.enquiries
    .filter((entry) => entry && typeof entry === 'object')
    .map((entry) => ({
      id: String(entry.id || ''),
      shopName: String(entry.shopName || ''),
      contactName: String(entry.contactName || ''),
      phone: String(entry.phone || ''),
      email: String(entry.email || ''),
      shopType: String(entry.shopType || ''),
      location: String(entry.location || ''),
      monthlyRequirement: String(entry.monthlyRequirement || ''),
      preferredPack: String(entry.preferredPack || ''),
      message: String(entry.message || ''),
      source: String(entry.source || 'ActivBite wholesale page'),
      createdAt: String(entry.createdAt || ''),
    }))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  return { enquiries, storage: 'google-sheets' as const };
};
