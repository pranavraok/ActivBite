import 'server-only';
import { inventoryStatus, type InventoryItem } from '@/lib/inventory-types';

type InventoryResponse = { ok?: boolean; inventory?: InventoryItem[]; message?: string };
type WriteResponse = { ok?: boolean; item?: InventoryItem; message?: string };

const webhookUrl = () => {
  const value = process.env.GOOGLE_SHEETS_WEBHOOK_URL?.trim();
  if (!value) throw new Error('The Google Sheets inventory bridge is not configured.');
  return value;
};

const adminSecret = () => {
  const value = process.env.WHOLESALE_ADMIN_READ_SECRET?.trim();
  if (!value) throw new Error('The inventory admin secret is not configured.');
  return value;
};

const parseJson = <T>(value: string): T | null => {
  try { return JSON.parse(value) as T; } catch { return null; }
};

const normalizeItem = (item: InventoryItem): InventoryItem => {
  const rawStock = item.unitsRemaining;
  const unitsRemaining = rawStock === null || rawStock === undefined
    ? null
    : Math.max(0, Math.floor(Number(rawStock) || 0));
  const lowStockThreshold = Math.max(0, Math.floor(Number(item.lowStockThreshold) || 0));
  return {
    sku: String(item.sku || ''),
    packLabel: String(item.packLabel || ''),
    packCount: Math.max(0, Math.floor(Number(item.packCount) || 0)),
    unitsRemaining,
    lowStockThreshold,
    status: inventoryStatus(unitsRemaining, lowStockThreshold),
    updatedAt: String(item.updatedAt || ''),
    updatedBy: String(item.updatedBy || ''),
    notes: String(item.notes || ''),
  };
};

export const listInventory = async () => {
  const url = new URL(webhookUrl());
  url.searchParams.set('action', 'inventory');
  const response = await fetch(url, { cache: 'no-store', signal: AbortSignal.timeout(12_000) });
  const result = parseJson<InventoryResponse>(await response.text());
  if (!response.ok || result?.ok !== true || !Array.isArray(result.inventory)) {
    throw new Error(result?.message || 'Google Sheets could not load inventory.');
  }
  return result.inventory.map(normalizeItem).sort((a, b) => a.packCount - b.packCount);
};

export const updateInventoryItem = async (input: {
  sku: string; unitsRemaining: number; lowStockThreshold: number; notes: string; updatedBy: string;
}) => {
  const response = await fetch(webhookUrl(), {
    method: 'POST', cache: 'no-store', signal: AbortSignal.timeout(12_000),
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    body: JSON.stringify({
      type: 'admin_update_inventory', secret: adminSecret(), ...input,
      updatedAt: new Date().toISOString(),
    }),
  });
  const result = parseJson<WriteResponse>(await response.text());
  if (!response.ok || result?.ok !== true || !result.item) {
    throw new Error(result?.message || 'Google Sheets could not update inventory.');
  }
  return normalizeItem(result.item);
};
