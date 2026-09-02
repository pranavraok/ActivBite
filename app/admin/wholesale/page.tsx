'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Building2,
  ExternalLink,
  Mail,
  MapPin,
  Phone,
  RefreshCw,
  Search,
} from 'lucide-react';

type WholesaleEnquiry = {
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

type EnquiryResponse = {
  enquiries: WholesaleEnquiry[];
  storage: 'google-sheets';
  sheetUrl: string | null;
  message?: string;
};

const formatDate = (value: string) =>
  new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));

export default function WholesaleEnquiriesPage() {
  const [enquiries, setEnquiries] = useState<WholesaleEnquiry[]>([]);
  const [sheetUrl, setSheetUrl] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const loadEnquiries = useCallback(async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/admin/wholesale', { cache: 'no-store' });
      const data = (await response.json()) as EnquiryResponse;

      if (response.status === 401) {
        window.location.href = '/admin/login';
        return;
      }

      if (!response.ok) {
        throw new Error(data.message || 'Could not load wholesale enquiries.');
      }

      setEnquiries(data.enquiries);
      setSheetUrl(data.sheetUrl);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : 'Could not load wholesale enquiries.'
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadEnquiries();
  }, [loadEnquiries]);

  const filteredEnquiries = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return enquiries;

    return enquiries.filter((enquiry) =>
      [
        enquiry.shopName,
        enquiry.contactName,
        enquiry.email,
        enquiry.phone,
        enquiry.location,
        enquiry.shopType,
      ].some((value) => value.toLowerCase().includes(query))
    );
  }, [enquiries, search]);

  const newThisMonth = enquiries.filter((enquiry) => {
    const createdAt = new Date(enquiry.createdAt);
    const today = new Date();
    return (
      createdAt.getMonth() === today.getMonth() &&
      createdAt.getFullYear() === today.getFullYear()
    );
  }).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">
            Partner requests
          </p>
          <h1 className="mt-1 text-3xl font-bold text-foreground">
            Wholesale Enquiries
          </h1>
          <p className="mt-2 text-muted-foreground">
            Every request submitted through the Wholesale page appears here.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {sheetUrl && (
            <a
              href={`${sheetUrl.split('#')[0]}#gid=1618239644`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-border bg-white px-4 text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
            >
              Open Google Sheet <ExternalLink size={16} />
            </a>
          )}
          <button
            type="button"
            onClick={() => void loadEnquiries()}
            disabled={isLoading}
            className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-white transition-opacity disabled:opacity-60"
          >
            <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-border bg-white p-5">
          <p className="text-sm font-medium text-muted-foreground">Total enquiries</p>
          <p className="mt-2 text-3xl font-bold text-foreground">{enquiries.length}</p>
        </div>
        <div className="rounded-xl border border-border bg-white p-5">
          <p className="text-sm font-medium text-muted-foreground">Received this month</p>
          <p className="mt-2 text-3xl font-bold text-foreground">{newThisMonth}</p>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-white">
        <div className="border-b border-border p-4">
          <label className="relative block max-w-md">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <span className="sr-only">Search enquiries</span>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search shop, contact, phone, or location"
              className="h-10 w-full rounded-lg border border-border bg-background pl-10 pr-3 text-sm outline-none focus:ring-2 focus:ring-primary/30"
            />
          </label>
        </div>

        {error ? (
          <div className="p-10 text-center">
            <p className="font-semibold text-destructive">{error}</p>
            <button
              type="button"
              onClick={() => void loadEnquiries()}
              className="mt-4 text-sm font-semibold text-primary"
            >
              Try again
            </button>
          </div>
        ) : isLoading ? (
          <div className="p-12 text-center text-sm text-muted-foreground">
            Loading enquiries…
          </div>
        ) : filteredEnquiries.length === 0 ? (
          <div className="p-12 text-center">
            <Mail size={34} className="mx-auto text-primary" />
            <p className="mt-3 font-semibold text-foreground">
              {search ? 'No matching enquiries' : 'No wholesale enquiries yet'}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {search
                ? 'Try a different search.'
                : 'The next submitted Wholesale form will appear here automatically.'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {filteredEnquiries.map((enquiry) => (
              <article key={enquiry.id} className="p-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <Building2 size={19} className="text-primary" />
                      <h2 className="text-lg font-bold text-foreground">
                        {enquiry.shopName}
                      </h2>
                    </div>
                    <p className="mt-1 text-sm font-medium text-muted-foreground">
                      {enquiry.contactName} · {enquiry.shopType}
                    </p>
                  </div>
                  <time className="text-xs font-medium text-muted-foreground">
                    {formatDate(enquiry.createdAt)}
                  </time>
                </div>

                <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2 xl:grid-cols-4">
                  <a href={`tel:${enquiry.phone}`} className="flex items-center gap-2 text-foreground">
                    <Phone size={16} className="text-primary" /> {enquiry.phone}
                  </a>
                  <a href={`mailto:${enquiry.email}`} className="flex items-center gap-2 text-foreground">
                    <Mail size={16} className="text-primary" /> {enquiry.email}
                  </a>
                  <p className="flex items-center gap-2 text-foreground">
                    <MapPin size={16} className="text-primary" /> {enquiry.location}
                  </p>
                  <p className="font-semibold text-foreground">
                    {enquiry.monthlyRequirement} · {enquiry.preferredPack}
                  </p>
                </div>

                {enquiry.message && (
                  <p className="mt-4 rounded-lg bg-secondary px-4 py-3 text-sm leading-6 text-foreground">
                    {enquiry.message}
                  </p>
                )}
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
