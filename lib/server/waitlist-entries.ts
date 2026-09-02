import 'server-only';

export type WaitlistEntry = {
  id: string;
  email: string;
  source: string;
  createdAt: string;
};

type WaitlistReadResponse = {
  ok?: boolean;
  entries?: WaitlistEntry[];
  message?: string;
};

const parseJson = (value: string): WaitlistReadResponse | null => {
  try {
    return JSON.parse(value) as WaitlistReadResponse;
  } catch {
    return null;
  }
};

export const listWaitlistEntries = async () => {
  const webhookUrl =
    process.env.GOOGLE_SHEETS_WEBHOOK_URL ||
    process.env.WHOLESALE_ENQUIRY_WEBHOOK_URL;
  const readSecret = process.env.WHOLESALE_ADMIN_READ_SECRET?.trim();

  if (!webhookUrl?.trim() || !readSecret) {
    throw new Error('The Google Sheets connection is not configured.');
  }

  const url = new URL(webhookUrl.trim());
  url.searchParams.set('action', 'waitlist_entries');
  url.searchParams.set('secret', readSecret);

  const response = await fetch(url, {
    cache: 'no-store',
    redirect: 'follow',
  });
  const result = parseJson(await response.text());

  if (!response.ok || !result || result.ok === false || !Array.isArray(result.entries)) {
    throw new Error(result?.message || 'Google Sheets could not load the waitlist.');
  }

  const entries = result.entries
    .map((entry) => ({
      id: String(entry.id || ''),
      email: String(entry.email || ''),
      source: String(entry.source || ''),
      createdAt: String(entry.createdAt || ''),
    }))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  return { entries, storage: 'google-sheets' as const };
};
