'use client';

import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react';
import { Calendar, ExternalLink, FileCheck2, FileText, RefreshCw, Trash2, UploadCloud } from 'lucide-react';
import { REPORT_CATEGORIES, type AdminReportRecord } from '@/lib/report-types';

type ReportsResponse = { reports?: AdminReportRecord[]; sheetUrl?: string | null; message?: string };
const formatDate = (value: string) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value || 'Not provided' : new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium' }).format(date);
};

export default function ReportsPage() {
  const fileInput = useRef<HTMLInputElement>(null);
  const [reports, setReports] = useState<AdminReportRecord[]>([]);
  const [sheetUrl, setSheetUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [deletingId, setDeletingId] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const loadReports = useCallback(async () => {
    setIsLoading(true); setError('');
    try {
      const response = await fetch('/api/admin/reports', { cache: 'no-store' });
      const data = (await response.json()) as ReportsResponse;
      if (response.status === 401) { window.location.href = '/admin/login'; return; }
      if (!response.ok || !Array.isArray(data.reports)) throw new Error(data.message || 'Could not load reports.');
      setReports(data.reports); setSheetUrl(data.sheetUrl || null);
    } catch (loadError) { setError(loadError instanceof Error ? loadError.message : 'Could not load reports.'); }
    finally { setIsLoading(false); }
  }, []);
  useEffect(() => { void loadReports(); }, [loadReports]);

  const upload = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setIsUploading(true); setError(''); setNotice('');
    const form = event.currentTarget;
    try {
      const response = await fetch('/api/admin/reports', { method: 'POST', body: new FormData(form) });
      const data = await response.json().catch(() => ({}));
      if (response.status === 401) { window.location.href = '/admin/login'; return; }
      if (!response.ok || !data.report) throw new Error(data.message || 'Could not upload the report.');
      setReports((current) => [data.report, ...current]);
      setNotice(`${data.report.reportName} was uploaded to Google Drive and recorded in Google Sheets.`);
      form.reset();
    } catch (uploadError) { setError(uploadError instanceof Error ? uploadError.message : 'Could not upload the report.'); }
    finally { setIsUploading(false); }
  };

  const remove = async (report: AdminReportRecord) => {
    if (!window.confirm(`Delete “${report.reportName}” from Reports and move its Drive file to trash?`)) return;
    setDeletingId(report.id); setError(''); setNotice('');
    try {
      const response = await fetch('/api/admin/reports', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ reportId: report.id }) });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.message || 'Could not delete the report.');
      setReports((current) => current.filter((item) => item.id !== report.id));
      setNotice(`${report.reportName} was removed.`);
    } catch (deleteError) { setError(deleteError instanceof Error ? deleteError.message : 'Could not delete the report.'); }
    finally { setDeletingId(''); }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div><p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">Document vault</p><h1 className="mt-1 text-3xl font-bold text-foreground">Reports</h1><p className="mt-2 text-muted-foreground">Upload product, lab, nutrition, and safety reports. Files are kept in Google Drive and indexed in Google Sheets.</p></div>
        <div className="flex flex-wrap gap-2">{sheetUrl && <a href={`${sheetUrl.split('#')[0]}#gid=2026090203`} target="_blank" rel="noreferrer" className="inline-flex h-10 items-center gap-2 rounded-lg border border-border bg-white px-4 text-sm font-semibold text-foreground hover:bg-secondary">Open reports sheet <ExternalLink size={16} /></a>}<button type="button" onClick={() => void loadReports()} disabled={isLoading} className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-white disabled:opacity-60"><RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} /> Refresh</button></div>
      </div>

      {notice && <p className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm font-semibold text-green-800">{notice}</p>}
      {error && <p className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-800">{error}</p>}

      <section className="grid gap-6 rounded-xl border border-border bg-white p-5 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <form onSubmit={upload} className="space-y-4">
          <div><h2 className="text-xl font-black text-foreground">Upload a new report</h2><p className="mt-1 text-sm text-muted-foreground">Accepted: PDF, image, Word, or Excel · Maximum 8 MB</p></div>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-bold text-foreground">Report name<input name="reportName" required placeholder="e.g. Final nutrition analysis" className="mt-1.5 h-11 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary/30" /></label>
            <label className="text-sm font-bold text-foreground">Category<select name="category" required defaultValue="Nutrition test" className="mt-1.5 h-11 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary/30">{REPORT_CATEGORIES.map((category) => <option key={category}>{category}</option>)}</select></label>
            <label className="text-sm font-bold text-foreground">Report date<input name="reportDate" type="date" className="mt-1.5 h-11 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary/30" /></label>
            <label className="text-sm font-bold text-foreground">Choose file<input ref={fileInput} name="file" type="file" required accept=".pdf,.png,.jpg,.jpeg,.webp,.docx,.xlsx" className="mt-1.5 block w-full rounded-lg border border-border bg-background p-2 text-sm file:mr-3 file:rounded-md file:border-0 file:bg-secondary file:px-3 file:py-1.5 file:font-bold file:text-foreground" /></label>
          </div>
          <label className="block text-sm font-bold text-foreground">Notes<textarea name="notes" rows={3} placeholder="What this report covers" className="mt-1.5 w-full resize-y rounded-lg border border-border bg-background p-3 text-sm outline-none focus:ring-2 focus:ring-primary/30" /></label>
          <button type="submit" disabled={isUploading} className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-primary px-5 text-sm font-black text-white disabled:opacity-60"><UploadCloud size={18} /> {isUploading ? 'Uploading to Google Drive…' : 'Upload report'}</button>
        </form>
        <div className="grid place-items-center rounded-xl border border-dashed border-primary/40 bg-orange-50 p-6 text-center"><div><div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-primary text-white"><FileCheck2 size={30} /></div><h3 className="mt-4 font-black text-foreground">One clean record</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">The file goes to the ActivBite Reports folder. Its name, date, category, notes, and link go to the Reports sheet.</p></div></div>
      </section>

      <section className="overflow-hidden rounded-xl border border-border bg-white">
        <div className="flex items-center justify-between border-b border-border p-5"><div><h2 className="text-xl font-black text-foreground">Uploaded reports</h2><p className="mt-1 text-sm text-muted-foreground">{reports.length} document{reports.length === 1 ? '' : 's'} recorded</p></div><FileText className="text-primary" /></div>
        {isLoading ? <div className="p-12 text-center text-sm text-muted-foreground">Loading reports from Google Sheets…</div> : reports.length === 0 ? <div className="p-12 text-center"><UploadCloud size={36} className="mx-auto text-primary" /><p className="mt-3 font-bold text-foreground">No reports uploaded yet</p><p className="mt-1 text-sm text-muted-foreground">Use the form above to add the first document.</p></div> : <div className="divide-y divide-border">{reports.map((report) => <article key={report.id} className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"><div className="flex min-w-0 items-start gap-3"><div className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-secondary text-primary"><FileText size={21} /></div><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><h3 className="font-black text-foreground">{report.reportName}</h3><span className="rounded-full bg-orange-100 px-2.5 py-1 text-xs font-bold text-orange-900">{report.category}</span></div><p className="mt-1 truncate text-sm text-muted-foreground">{report.fileName}</p><p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground"><Calendar size={13} /> Report: {formatDate(report.reportDate)} · Uploaded: {formatDate(report.uploadedAt)}</p>{report.notes && <p className="mt-2 text-sm text-foreground">{report.notes}</p>}</div></div><div className="flex shrink-0 gap-2"><a href={report.fileUrl} target="_blank" rel="noreferrer" className="inline-flex h-10 items-center gap-2 rounded-lg border border-border bg-white px-3 text-sm font-bold text-foreground hover:bg-secondary">Open <ExternalLink size={15} /></a><button type="button" onClick={() => void remove(report)} disabled={deletingId === report.id} className="inline-flex h-10 items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 text-sm font-bold text-red-700 disabled:opacity-50"><Trash2 size={15} /> {deletingId === report.id ? 'Deleting…' : 'Delete'}</button></div></article>)}</div>}
      </section>
    </div>
  );
}
