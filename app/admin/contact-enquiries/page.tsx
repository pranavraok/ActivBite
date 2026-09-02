'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ExternalLink,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  RefreshCw,
  Search,
} from 'lucide-react';

type ContactEnquiry = {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  location: string;
  topic: string;
  message: string;
  source: string;
  createdAt: string;
};

type EnquiryResponse = {
  enquiries: ContactEnquiry[];
  storage: 'google-sheets';
  sheetUrl: string | null;
  message?: string;
};

const formatDate = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Date unavailable';

  return new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
};

export default function ContactEnquiriesPage() {
  const [enquiries, setEnquiries] = useState<ContactEnquiry[]>([]);
  const [sheetUrl, setSheetUrl] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const loadEnquiries = useCallback(async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/admin/contact', { cache: 'no-store' });
      const data = (await response.json()) as EnquiryResponse;

      if (response.status === 401) {
        window.location.href = '/admin/login';
        return;
      }

      if (!response.ok) {
        throw new Error(data.message || 'Could not load contact messages.');
      }

      setEnquiries(data.enquiries);
      setSheetUrl(data.sheetUrl);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : 'Could not load contact messages.'
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
        enquiry.fullName,
        enquiry.email,
        enquiry.phone,
        enquiry.location,
        enquiry.topic,
        enquiry.message,
      ].some((value) => value.toLowerCase().includes(query))
    );
  }, [enquiries, search]);

  const newThisMonth = enquiries.filter((enquiry) => {
    const createdAt = new Date(enquiry.createdAt);
    const today = new Date();
    return (
      !Number.isNaN(createdAt.getTime()) &&
      createdAt.getMonth() === today.getMonth() &&
      createdAt.getFullYear() === today.getFullYear()
    );
  }).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">
            Customer messages
          </p>
          <h1 className="mt-1 text-3xl font-bold text-foreground">Contact Enquiries</h1>
          <p className="mt-2 text-muted-foreground">
            Every message submitted through the Contact page appears here.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {sheetUrl && (
            <a
              href={sheetUrl}
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
          <p className="text-sm font-medium text-muted-foreground">Total messages</p>
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
            <span className="sr-only">Search messages</span>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search name, topic, phone, or location"
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
            Loading messages…
          </div>
        ) : filteredEnquiries.length === 0 ? (
          <div className="p-12 text-center">
            <MessageCircle size={34} className="mx-auto text-primary" />
            <p className="mt-3 font-semibold text-foreground">
              {search ? 'No matching messages' : 'No contact messages yet'}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {search
                ? 'Try a different search.'
                : 'The next submitted Contact form will appear here automatically.'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {filteredEnquiries.map((enquiry) => (
              <article key={enquiry.id} className="p-5">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-lg font-bold text-foreground">{enquiry.fullName}</h2>
                      <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                        {enquiry.topic}
                      </span>
                    </div>
                    <p className="mt-1 text-sm font-medium text-muted-foreground">
                      Contact page message
                    </p>
                  </div>
                  <time className="text-xs font-medium text-muted-foreground">
                    {formatDate(enquiry.createdAt)}
                  </time>
                </div>

                <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2 xl:grid-cols-3">
                  <a href={`tel:${enquiry.phone}`} className="flex items-center gap-2 text-foreground">
                    <Phone size={16} className="text-primary" /> {enquiry.phone}
                  </a>
                  <a href={`mailto:${enquiry.email}`} className="flex items-center gap-2 text-foreground">
                    <Mail size={16} className="text-primary" /> {enquiry.email}
                  </a>
                  <p className="flex items-center gap-2 text-foreground">
                    <MapPin size={16} className="text-primary" /> {enquiry.location}
                  </p>
                </div>

                <p className="mt-4 rounded-lg bg-secondary px-4 py-3 text-sm leading-6 text-foreground">
                  {enquiry.message}
                </p>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
