'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { AlertTriangle, Boxes, CheckCircle2, ExternalLink, PackageX, RefreshCw, Save } from 'lucide-react';
import type { InventoryItem } from '@/lib/inventory-types';

type InventoryResponse = { inventory?: InventoryItem[]; sheetUrl?: string | null; message?: string };
type Draft = { unitsRemaining: string; lowStockThreshold: string; notes: string };
const statusStyles: Record<InventoryItem['status'], string> = { not_set: 'bg-slate-100 text-slate-700', in_stock: 'bg-green-100 text-green-800', low_stock: 'bg-amber-100 text-amber-900', out_of_stock: 'bg-red-100 text-red-800' };
const statusLabels: Record<InventoryItem['status'], string> = { not_set: 'Opening stock not set', in_stock: 'In stock', low_stock: 'Low stock', out_of_stock: 'Out of stock' };

export default function ProductsPage() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [drafts, setDrafts] = useState<Record<string, Draft>>({});
  const [sheetUrl, setSheetUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingSku, setUpdatingSku] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const loadInventory = useCallback(async () => {
    setIsLoading(true); setError('');
    try {
      const response = await fetch('/api/admin/inventory', { cache: 'no-store' });
      const data = (await response.json()) as InventoryResponse;
      if (response.status === 401) { window.location.href = '/admin/login'; return; }
      if (!response.ok || !Array.isArray(data.inventory)) throw new Error(data.message || 'Could not load inventory.');
      setInventory(data.inventory); setSheetUrl(data.sheetUrl || null);
      setDrafts(Object.fromEntries(data.inventory.map((item) => [item.sku, { unitsRemaining: item.unitsRemaining === null ? '' : String(item.unitsRemaining), lowStockThreshold: String(item.lowStockThreshold), notes: item.notes }])));
    } catch (loadError) { setError(loadError instanceof Error ? loadError.message : 'Could not load inventory.'); }
    finally { setIsLoading(false); }
  }, []);
  useEffect(() => { void loadInventory(); }, [loadInventory]);

  const alerts = useMemo(() => inventory.filter((item) => item.status !== 'in_stock'), [inventory]);
  const updateStock = async (item: InventoryItem) => {
    const draft = drafts[item.sku];
    if (!draft || draft.unitsRemaining === '') { setError('Enter the real remaining quantity before saving.'); return; }
    setUpdatingSku(item.sku); setError(''); setNotice('');
    try {
      const response = await fetch('/api/admin/inventory', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ sku: item.sku, unitsRemaining: Number(draft.unitsRemaining), lowStockThreshold: Number(draft.lowStockThreshold), notes: draft.notes }) });
      const data = await response.json().catch(() => ({}));
      if (response.status === 401) { window.location.href = '/admin/login'; return; }
      if (!response.ok || !data.item) throw new Error(data.message || 'Could not update stock.');
      setInventory((current) => current.map((entry) => entry.sku === item.sku ? data.item : entry));
      setNotice(`${item.packLabel} now has ${data.item.unitsRemaining} pack${data.item.unitsRemaining === 1 ? '' : 's'} remaining.`);
    } catch (updateError) { setError(updateError instanceof Error ? updateError.message : 'Could not update stock.'); }
    finally { setUpdatingSku(''); }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div><p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">Live stock desk</p><h1 className="mt-1 text-3xl font-bold text-foreground">Product inventory</h1><p className="mt-2 text-muted-foreground">Update pack quantities here. Zero stock is immediately reflected on the Shop page.</p></div>
        <div className="flex flex-wrap gap-2">
          {sheetUrl && <a href={`${sheetUrl.split('#')[0]}#gid=2026090201`} target="_blank" rel="noreferrer" className="inline-flex h-10 items-center gap-2 rounded-lg border border-border bg-white px-4 text-sm font-semibold text-foreground hover:bg-secondary">Open inventory sheet <ExternalLink size={16} /></a>}
          <button type="button" onClick={() => void loadInventory()} disabled={isLoading} className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-white disabled:opacity-60"><RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} /> Refresh</button>
        </div>
      </div>
      {alerts.length > 0 && !isLoading && <section className="rounded-xl border border-amber-300 bg-amber-50 p-4" role="status"><div className="flex items-start gap-3"><AlertTriangle className="mt-0.5 shrink-0 text-amber-700" size={21} /><div><h2 className="font-black text-amber-950">{alerts.length} stock item{alerts.length === 1 ? '' : 's'} need attention</h2><p className="mt-1 text-sm text-amber-900">{alerts.map((item) => `${item.packLabel}: ${statusLabels[item.status]}`).join(' · ')}</p></div></div></section>}
      {notice && <p className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm font-semibold text-green-800">{notice}</p>}
      {error && <p className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-800">{error}</p>}
      {isLoading ? <div className="rounded-xl border border-border bg-white p-12 text-center text-sm text-muted-foreground">Loading inventory from Google Sheets…</div> : (
        <div className="grid gap-5 lg:grid-cols-2">{inventory.map((item) => {
          const draft = drafts[item.sku] || { unitsRemaining: '', lowStockThreshold: '5', notes: '' };
          const percentage = item.unitsRemaining === null ? 0 : Math.min(100, (item.unitsRemaining / Math.max(item.lowStockThreshold * 3, 1)) * 100);
          const StatusIcon = item.status === 'out_of_stock' ? PackageX : item.status === 'in_stock' ? CheckCircle2 : AlertTriangle;
          return <article key={item.sku} className="overflow-hidden rounded-xl border border-border bg-white shadow-sm">
            <div className="flex items-start justify-between border-b border-border bg-secondary/40 p-5"><div><p className="text-xs font-black uppercase tracking-[0.13em] text-primary">{item.sku}</p><h2 className="mt-1 text-xl font-black text-foreground">{item.packLabel}</h2><p className="mt-1 text-sm text-muted-foreground">{item.packCount} bars in each pack</p></div><span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-black ${statusStyles[item.status]}`}><StatusIcon size={14} /> {statusLabels[item.status]}</span></div>
            <div className="space-y-4 p-5">
              <div><div className="flex items-end justify-between"><span className="text-sm font-semibold text-muted-foreground">Remaining packs</span><strong className="text-3xl font-black text-foreground">{item.unitsRemaining === null ? '—' : item.unitsRemaining}</strong></div><div className="mt-2 h-2 overflow-hidden rounded-full bg-secondary"><div className={`h-full rounded-full ${item.status === 'out_of_stock' ? 'bg-red-500' : item.status === 'low_stock' ? 'bg-amber-500' : 'bg-green-500'}`} style={{ width: `${percentage}%` }} /></div></div>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="text-sm font-bold text-foreground">Remaining quantity<input type="number" min="0" step="1" value={draft.unitsRemaining} onChange={(event) => setDrafts((current) => ({ ...current, [item.sku]: { ...draft, unitsRemaining: event.target.value } }))} placeholder="Enter opening stock" className="mt-1.5 h-11 w-full rounded-lg border border-border bg-background px-3 text-base outline-none focus:ring-2 focus:ring-primary/30" /></label>
                <label className="text-sm font-bold text-foreground">Low-stock alert at<input type="number" min="0" step="1" value={draft.lowStockThreshold} onChange={(event) => setDrafts((current) => ({ ...current, [item.sku]: { ...draft, lowStockThreshold: event.target.value } }))} className="mt-1.5 h-11 w-full rounded-lg border border-border bg-background px-3 text-base outline-none focus:ring-2 focus:ring-primary/30" /></label>
              </div>
              <label className="block text-sm font-bold text-foreground">Stock note<input value={draft.notes} onChange={(event) => setDrafts((current) => ({ ...current, [item.sku]: { ...draft, notes: event.target.value } }))} placeholder="Batch, storage, or restock note" className="mt-1.5 h-11 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary/30" /></label>
              <button type="button" onClick={() => void updateStock(item)} disabled={updatingSku === item.sku} className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-black text-white disabled:opacity-60"><Save size={17} /> {updatingSku === item.sku ? 'Saving to Google Sheets…' : 'Update stock'}</button>
            </div>
          </article>;
        })}</div>
      )}
      <section className="flex items-start gap-3 rounded-xl border border-border bg-white p-5"><Boxes className="mt-0.5 shrink-0 text-primary" size={23} /><div><h2 className="font-black text-foreground">Automatic stock movement</h2><p className="mt-1 text-sm leading-6 text-muted-foreground">Inventory is deducted when an order is approved, not when an unpaid checkout is created. Every change is logged in the Inventory Movements tab.</p></div></section>
    </div>
  );
}
