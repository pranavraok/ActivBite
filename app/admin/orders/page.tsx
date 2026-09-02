'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  CheckCircle2,
  ExternalLink,
  Mail,
  MapPin,
  Package,
  Phone,
  RefreshCw,
  Search,
  Truck,
  WalletCards,
} from 'lucide-react';
import {
  ORDER_STATUSES,
  ORDER_STATUS_LABELS,
  ORDER_STATUS_MESSAGES,
  type AdminOrderRecord,
  type OrderStatus,
} from '@/lib/order-types';

type OrdersResponse = {
  orders: AdminOrderRecord[];
  storage: 'google-sheets';
  sheetUrl: string | null;
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

const statusClass: Record<OrderStatus, string> = {
  awaiting_payment: 'bg-amber-100 text-amber-900',
  payment_verification: 'bg-orange-100 text-orange-900',
  confirmed: 'bg-blue-100 text-blue-900',
  preparing: 'bg-violet-100 text-violet-900',
  out_for_delivery: 'bg-cyan-100 text-cyan-900',
  delivered: 'bg-green-100 text-green-900',
  cancelled: 'bg-red-100 text-red-900',
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<AdminOrderRecord[]>([]);
  const [sheetUrl, setSheetUrl] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | OrderStatus>('all');
  const [draftStatuses, setDraftStatuses] = useState<Record<string, OrderStatus>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const loadOrders = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await fetch('/api/admin/orders', { cache: 'no-store' });
      const data = (await response.json()) as OrdersResponse;
      if (response.status === 401) {
        window.location.href = '/admin/login';
        return;
      }
      if (!response.ok) throw new Error(data.message || 'Could not load orders.');
      setOrders(data.orders);
      setSheetUrl(data.sheetUrl);
      setDraftStatuses(Object.fromEntries(data.orders.map((order) => [order.trackingId, order.status])));
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Could not load orders.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { void loadOrders(); }, [loadOrders]);

  const filteredOrders = useMemo(() => {
    const query = search.trim().toLowerCase();
    return orders.filter((order) => {
      const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
      const matchesSearch = !query || [
        order.trackingId, order.customerName, order.phone, order.email,
        order.deliveryPoint, order.hostelBlock, order.paymentReference,
      ].some((value) => value.toLowerCase().includes(query));
      return matchesStatus && matchesSearch;
    });
  }, [orders, search, statusFilter]);

  const updateStatus = async (order: AdminOrderRecord) => {
    const status = draftStatuses[order.trackingId] || order.status;
    if (status === order.status) return;
    setUpdatingId(order.trackingId);
    setError('');
    setNotice('');
    try {
      const response = await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trackingId: order.trackingId, status }),
      });
      const data = await response.json().catch(() => ({}));
      if (response.status === 401) {
        window.location.href = '/admin/login';
        return;
      }
      if (!response.ok) throw new Error(data.message || 'Could not update the order.');
      setOrders((current) => current.map((item) =>
        item.trackingId === order.trackingId
          ? { ...item, status, statusMessage: ORDER_STATUS_MESSAGES[status], updatedAt: new Date().toISOString() }
          : item
      ));
      setNotice(`${order.trackingId} is now ${ORDER_STATUS_LABELS[status]}.`);
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : 'Could not update the order.');
      setDraftStatuses((current) => ({ ...current, [order.trackingId]: order.status }));
    } finally {
      setUpdatingId('');
    }
  };

  const activeOrders = orders.filter((order) =>
    ['confirmed', 'preparing', 'out_for_delivery'].includes(order.status)
  ).length;
  const paymentChecks = orders.filter((order) => order.status === 'payment_verification').length;
  const paymentPending = orders.filter((order) => order.status === 'awaiting_payment').length;
  const delivered = orders.filter((order) => order.status === 'delivered').length;

  const orderSections = [
    {
      key: 'approval',
      title: 'Awaiting approval',
      description: 'Payment IDs submitted by customers and ready for your verification.',
      orders: filteredOrders.filter((order) => order.status === 'payment_verification'),
      headingClass: 'border-orange-200 bg-orange-50',
    },
    {
      key: 'payment-pending',
      title: 'Payment pending',
      description: 'Orders created successfully, but no payment ID has been submitted yet.',
      orders: filteredOrders.filter((order) => order.status === 'awaiting_payment'),
      headingClass: 'border-amber-200 bg-amber-50',
    },
    {
      key: 'other-orders',
      title: 'Active & completed orders',
      description: 'Approved, packing, delivery, completed, and cancelled orders.',
      orders: filteredOrders.filter(
        (order) => !['awaiting_payment', 'payment_verification'].includes(order.status)
      ),
      headingClass: 'border-border bg-secondary/60',
    },
  ];

  const visibleSections = orderSections.filter(
    (section) => statusFilter === 'all' || section.orders.length > 0
  );

  const renderOrderCard = (order: AdminOrderRecord) => {
    const draftStatus = draftStatuses[order.trackingId] || order.status;
    const isUpdating = updatingId === order.trackingId;

    return (
      <article key={order.trackingId} className="p-5">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <a href={`/order-status?track=${order.trackingId}`} target="_blank" rel="noreferrer"
                className="text-lg font-black tracking-[0.08em] text-foreground hover:text-primary">
                {order.trackingId}
              </a>
              <span className={`rounded-full px-3 py-1 text-xs font-bold ${statusClass[order.status]}`}>
                {ORDER_STATUS_LABELS[order.status]}
              </span>
            </div>
            <h2 className="mt-2 text-lg font-bold text-foreground">{order.customerName}</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {order.packLabel} × {order.quantity} · {formatPrice(order.total)} · {formatDate(order.createdAt)}
            </p>
          </div>

          <div className="grid w-full gap-2 sm:grid-cols-[minmax(0,13rem)_auto] xl:w-auto">
            <label>
              <span className="sr-only">Status for {order.trackingId}</span>
              <select value={draftStatus} onChange={(event) => setDraftStatuses((current) => ({
                ...current, [order.trackingId]: event.target.value as OrderStatus,
              }))} className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm font-semibold outline-none focus:ring-2 focus:ring-primary/30">
                {ORDER_STATUSES.map((status) => <option key={status} value={status}>{ORDER_STATUS_LABELS[status]}</option>)}
              </select>
            </label>
            <button type="button" onClick={() => void updateStatus(order)}
              disabled={isUpdating || draftStatus === order.status}
              className="h-10 rounded-lg bg-primary px-4 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-45">
              {isUpdating ? 'Updating…' : 'Update status'}
            </button>
          </div>
        </div>

        <div className="mt-4 grid gap-3 text-sm md:grid-cols-2 xl:grid-cols-4">
          <a href={`tel:${order.phone}`} className="flex items-center gap-2 text-foreground"><Phone size={16} className="text-primary" /> {order.phone}</a>
          <a href={`mailto:${order.email}`} className="flex items-center gap-2 text-foreground"><Mail size={16} className="text-primary" /> {order.email}</a>
          <p className="flex items-start gap-2 text-foreground"><MapPin size={16} className="mt-0.5 shrink-0 text-primary" /> {[order.deliveryPoint, order.hostelBlock, order.roomOrLandmark].filter(Boolean).join(' · ')}</p>
          <p className="font-semibold text-foreground">Payment: {order.paymentReference || 'Not submitted'}</p>
        </div>

        <p className="mt-4 rounded-lg bg-secondary px-4 py-3 text-sm leading-6 text-foreground">
          Customer sees: {order.statusMessage}
        </p>
      </article>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">Live order desk</p>
          <h1 className="mt-1 text-3xl font-bold text-foreground">Orders</h1>
          <p className="mt-2 text-muted-foreground">
            Shop orders appear here automatically. Updating a status updates customer tracking too.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {sheetUrl && (
            <a href={`${sheetUrl.split('#')[0]}#gid=1109132164`} target="_blank" rel="noreferrer"
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-border bg-white px-4 text-sm font-semibold text-foreground hover:bg-secondary">
              Open order sheet <ExternalLink size={16} />
            </a>
          )}
          <button type="button" onClick={() => void loadOrders()} disabled={isLoading}
            className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-white disabled:opacity-60">
            <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} /> Refresh
          </button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {[
          { label: 'Total orders', value: orders.length, icon: Package },
          { label: 'Awaiting approval', value: paymentChecks, icon: WalletCards },
          { label: 'Payment pending', value: paymentPending, icon: WalletCards },
          { label: 'Active deliveries', value: activeOrders, icon: Truck },
          { label: 'Delivered', value: delivered, icon: CheckCircle2 },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className="rounded-xl border border-border bg-white p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground">{label}</p>
              <Icon size={20} className="text-primary" />
            </div>
            <p className="mt-2 text-3xl font-bold text-foreground">{value}</p>
          </div>
        ))}
      </div>

      <section className="overflow-hidden rounded-xl border border-border bg-white">
        <div className="grid gap-3 border-b border-border p-4 md:grid-cols-[minmax(0,1fr)_15rem]">
          <label className="relative block">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <span className="sr-only">Search orders</span>
            <input value={search} onChange={(event) => setSearch(event.target.value)}
              placeholder="Search tracking ID, customer, phone, or payment"
              className="h-10 w-full rounded-lg border border-border bg-background pl-10 pr-3 text-sm outline-none focus:ring-2 focus:ring-primary/30" />
          </label>
          <label>
            <span className="sr-only">Filter by status</span>
            <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as 'all' | OrderStatus)}
              className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm font-semibold outline-none focus:ring-2 focus:ring-primary/30">
              <option value="all">All statuses</option>
              {ORDER_STATUSES.map((status) => <option key={status} value={status}>{ORDER_STATUS_LABELS[status]}</option>)}
            </select>
          </label>
        </div>

        {notice && <p className="border-b border-green-200 bg-green-50 px-4 py-3 text-sm font-semibold text-green-800">{notice}</p>}
        {error ? (
          <div className="p-10 text-center">
            <p className="font-semibold text-destructive">{error}</p>
            <button type="button" onClick={() => void loadOrders()} className="mt-4 text-sm font-semibold text-primary">Try again</button>
          </div>
        ) : isLoading ? (
          <div className="p-12 text-center text-sm text-muted-foreground">Loading live orders…</div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-12 text-center">
            <Package size={36} className="mx-auto text-primary" />
            <p className="mt-3 font-semibold text-foreground">{orders.length ? 'No matching orders' : 'No orders yet'}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {orders.length ? 'Try another search or status.' : 'The first completed checkout will appear here automatically.'}
            </p>
          </div>
        ) : (
          <div className="space-y-5 bg-secondary/25 p-4 sm:p-5">
            {visibleSections.map((section) => (
              <section key={section.key} className="overflow-hidden rounded-xl border border-border bg-white">
                <div className={`flex flex-col gap-2 border-b px-5 py-4 sm:flex-row sm:items-center sm:justify-between ${section.headingClass}`}>
                  <div>
                    <h2 className="text-lg font-black text-foreground">{section.title}</h2>
                    <p className="mt-1 text-sm text-muted-foreground">{section.description}</p>
                  </div>
                  <span className="w-fit rounded-full bg-white px-3 py-1 text-sm font-black text-foreground shadow-sm">
                    {section.orders.length}
                  </span>
                </div>
                {section.orders.length > 0 ? (
                  <div className="divide-y divide-border">
                    {section.orders.map(renderOrderCard)}
                  </div>
                ) : (
                  <p className="px-5 py-7 text-sm text-muted-foreground">
                    Nothing in this section right now.
                  </p>
                )}
              </section>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
