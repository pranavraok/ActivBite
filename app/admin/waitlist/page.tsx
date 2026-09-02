'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { ExternalLink, Mail, RefreshCw, Search, Users } from 'lucide-react';

type WaitlistEntry = {
  id: string;
  email: string;
  source: string;
  createdAt: string;
};

type WaitlistResponse = {
  entries: WaitlistEntry[];
  storage: 'google-sheets';
  sheetUrl: string | null;
  message?: string;
};

const formatDate = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value || 'Date unavailable';

  return new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
};

export default function WaitlistPage() {
  const [entries, setEntries] = useState<WaitlistEntry[]>([]);
  const [sheetUrl, setSheetUrl] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const loadEntries = useCallback(async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/admin/waitlist', { cache: 'no-store' });
      const data = (await response.json()) as WaitlistResponse;

      if (response.status === 401) {
        window.location.href = '/admin/login';
        return;
      }

      if (!response.ok) throw new Error(data.message || 'Could not load waitlist emails.');

      setEntries(data.entries);
      setSheetUrl(data.sheetUrl);
    } catch (loadError) {
      setError(
        loadError instanceof Error ? loadError.message : 'Could not load waitlist emails.'
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadEntries();
  }, [loadEntries]);

  const filteredEntries = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return entries;

    return entries.filter((entry) =>
      [entry.email, entry.source].some((value) => value.toLowerCase().includes(query))
    );
  }, [entries, search]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">
            Launch audience
          </p>
          <h1 className="mt-1 text-3xl font-bold text-foreground">Waitlist Emails</h1>
          <p className="mt-2 text-muted-foreground">
            Every email from the ActivBite waitlist appears here directly from Sheet 1.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {sheetUrl && (
            <a
              href={`${sheetUrl.split('#')[0]}#gid=0`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-border bg-white px-4 text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
            >
              Open Google Sheet <ExternalLink size={16} />
            </a>
          )}
          <button
            type="button"
            onClick={() => void loadEntries()}
            disabled={isLoading}
            className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-white transition-opacity disabled:opacity-60"
          >
            <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-white p-5">
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-lg bg-primary/10 text-primary">
            <Users size={22} />
          </span>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Total waitlist emails</p>
            <p className="text-3xl font-bold text-foreground">{entries.length}</p>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-white">
        <div className="border-b border-border p-4">
          <label className="relative block max-w-md">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <span className="sr-only">Search waitlist emails</span>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search email"
              className="h-10 w-full rounded-lg border border-border bg-background pl-10 pr-3 text-sm outline-none focus:ring-2 focus:ring-primary/30"
            />
          </label>
        </div>

        {error ? (
          <div className="p-10 text-center">
            <p className="font-semibold text-destructive">{error}</p>
            <button
              type="button"
              onClick={() => void loadEntries()}
              className="mt-4 text-sm font-semibold text-primary"
            >
              Try again
            </button>
          </div>
        ) : isLoading ? (
          <div className="p-12 text-center text-sm text-muted-foreground">
            Loading waitlist emails…
          </div>
        ) : filteredEntries.length === 0 ? (
          <div className="p-12 text-center">
            <Mail size={34} className="mx-auto text-primary" />
            <p className="mt-3 font-semibold text-foreground">
              {search ? 'No matching email' : 'No waitlist emails yet'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {filteredEntries.map((entry) => (
              <article
                key={`${entry.id}-${entry.email}-${entry.createdAt}`}
                className="flex flex-col gap-2 p-5 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <a
                    href={`mailto:${entry.email}`}
                    className="inline-flex items-center gap-2 font-bold text-foreground hover:text-primary"
                  >
                    <Mail size={17} className="text-primary" />
                    {entry.email}
                  </a>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {entry.source || 'ActivBite waitlist'}
                  </p>
                </div>
                <time className="text-xs font-medium text-muted-foreground">
                  {formatDate(entry.createdAt)}
                </time>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
