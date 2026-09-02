'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { AlertCircle, CheckCircle2, Package, PackageX, ShoppingCart, TrendingUp } from 'lucide-react';
import { ORDER_STATUS_LABELS, type AdminOrderRecord } from '@/lib/order-types';
import type { InventoryItem } from '@/lib/inventory-types';

type OrdersResponse = {
  orders?: AdminOrderRecord[];
  message?: string;
};

const formatPrice = (price: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency', currency: 'INR', maximumFractionDigits: 0,
  }).format(price);

const formatDate = (value: string) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? 'Just now'
    : new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium', timeStyle: 'short' }).format(date);
};

export default function AdminDashboard() {
  const [orders, setOrders] = useState<AdminOrderRecord[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const loadOrders = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const [ordersResponse, inventoryResponse] = await Promise.all([
        fetch('/api/admin/orders', { cache: 'no-store' }),
        fetch('/api/admin/inventory', { cache: 'no-store' }),
      ]);
      const data = (await ordersResponse.json()) as OrdersResponse;
      const inventoryData = await inventoryResponse.json().catch(() => ({}));
      if (ordersResponse.status === 401 || inventoryResponse.status === 401) {
        window.location.href = '/admin/login';
        return;
      }
      if (!ordersResponse.ok || !Array.isArray(data.orders)) {
        throw new Error(data.message || 'Could not load the live order summary.');
      }
      setOrders(data.orders);
      if (inventoryResponse.ok && Array.isArray(inventoryData.inventory)) setInventory(inventoryData.inventory);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Could not load the live order summary.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { void loadOrders(); }, [loadOrders]);

  const stats = useMemo(() => {
    const paidOrders = orders.filter((order) => order.status !== 'awaiting_payment' && order.status !== 'cancelled');
    const revenue = paidOrders.reduce((sum, order) => sum + order.total, 0);
    const attention = orders.filter((order) =>
      ['awaiting_payment', 'payment_verification'].includes(order.status)
    ).length;
    const delivered = orders.filter((order) => order.status === 'delivered').length;
    return [
      { label: 'Total orders', value: String(orders.length), note: 'From the Shop', icon: ShoppingCart },
      { label: 'Payment-stage value', value: formatPrice(revenue), note: 'Excludes unpaid and cancelled', icon: TrendingUp },
      { label: 'Needs attention', value: String(attention), note: 'Payment action needed', icon: AlertCircle },
      { label: 'Delivered', value: String(delivered), note: 'Completed orders', icon: CheckCircle2 },
    ];
  }, [orders]);

  const stockAlerts = inventory.filter((item) => item.status !== 'in_stock');

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">Today at ActivBite</p>
        <h1 className="mt-1 text-3xl font-bold text-foreground">Live command centre</h1>
        <p className="mt-2 text-muted-foreground">Real Shop orders and delivery progress, directly from Google Sheets.</p>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-800">
          {error} <button type="button" onClick={() => void loadOrders()} className="ml-2 underline">Try again</button>
        </div>
      )}

      {stockAlerts.length > 0 && (
        <Link href="/admin/products" className="flex items-start gap-3 rounded-xl border border-amber-300 bg-amber-50 p-4 text-amber-950">
          <PackageX className="mt-0.5 shrink-0 text-amber-700" size={22} />
          <div><p className="font-black">Stock attention needed</p><p className="mt-1 text-sm">{stockAlerts.map((item) => `${item.packLabel}: ${item.status === 'not_set' ? 'opening stock not set' : item.status === 'out_of_stock' ? 'out of stock' : `${item.unitsRemaining} left`}`).join(' · ')}</p></div>
        </Link>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ label, value, note, icon: Icon }) => (
          <Link key={label} href="/admin/orders" className="rounded-xl border border-border bg-white p-5 transition-shadow hover:shadow-md">
            <div className="flex items-center justify-between">
              <div className="grid h-11 w-11 place-items-center rounded-lg bg-primary/10"><Icon size={22} className="text-primary" /></div>
              {isLoading && <span className="text-xs font-semibold text-muted-foreground">Loading…</span>}
            </div>
            <h2 className="mt-4 text-sm font-medium text-muted-foreground">{label}</h2>
            <p className="mt-1 text-3xl font-bold text-foreground">{isLoading ? '—' : value}</p>
            <p className="mt-1 text-xs font-semibold text-primary">{note}</p>
          </Link>
        ))}
      </div>

      <section className="overflow-hidden rounded-xl border border-border bg-white">
        <div className="flex items-center justify-between border-b border-border p-5">
          <div>
            <h2 className="text-xl font-bold text-foreground">Recent orders</h2>
            <p className="mt-1 text-sm text-muted-foreground">Latest customer checkouts</p>
          </div>
          <Link href="/admin/orders" className="text-sm font-semibold text-primary hover:underline">Manage orders →</Link>
        </div>

        {isLoading ? (
          <div className="p-10 text-center text-sm text-muted-foreground">Loading recent orders…</div>
        ) : orders.length === 0 ? (
          <div className="p-10 text-center">
            <Package size={34} className="mx-auto text-primary" />
            <p className="mt-3 font-semibold text-foreground">No Shop orders yet</p>
            <p className="mt-1 text-sm text-muted-foreground">The first checkout will appear here automatically.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[44rem]">
              <thead className="bg-secondary">
                <tr>
                  {['Tracking ID', 'Customer', 'Order', 'Amount', 'Status', 'Placed'].map((heading) => (
                    <th key={heading} className="px-5 py-3 text-left text-xs font-bold text-foreground">{heading}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {orders.slice(0, 5).map((order) => (
                  <tr key={order.trackingId} className="hover:bg-secondary/50">
                    <td className="px-5 py-4 text-sm font-black tracking-[0.06em] text-foreground">{order.trackingId}</td>
                    <td className="px-5 py-4 text-sm text-foreground">{order.customerName}</td>
                    <td className="px-5 py-4 text-sm text-muted-foreground">{order.packLabel} × {order.quantity}</td>
                    <td className="px-5 py-4 text-sm font-bold text-foreground">{formatPrice(order.total)}</td>
                    <td className="px-5 py-4 text-sm font-semibold text-primary">{ORDER_STATUS_LABELS[order.status]}</td>
                    <td className="px-5 py-4 text-xs text-muted-foreground">{formatDate(order.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <div className="grid gap-4 md:grid-cols-3">
        <Link href="/admin/waitlist" className="rounded-xl border border-border bg-white p-5 hover:shadow-md">
          <h2 className="font-bold text-foreground">Waitlist emails</h2><p className="mt-1 text-sm text-muted-foreground">Launch sign-ups from the website</p>
        </Link>
        <Link href="/admin/wholesale" className="rounded-xl border border-border bg-white p-5 hover:shadow-md">
          <h2 className="font-bold text-foreground">Wholesale enquiries</h2><p className="mt-1 text-sm text-muted-foreground">Bulk and partner requests</p>
        </Link>
        <Link href="/admin/contact-enquiries" className="rounded-xl border border-border bg-white p-5 hover:shadow-md">
          <h2 className="font-bold text-foreground">Contact forms</h2><p className="mt-1 text-sm text-muted-foreground">Customer questions and support</p>
        </Link>
      </div>
    </div>
  );
}
