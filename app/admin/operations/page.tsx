'use client';

import { FormEvent, ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Database,
  ExternalLink,
  IndianRupee,
  Pencil,
  PlusCircle,
  RefreshCw,
  Search,
  ShoppingCart,
  TrendingUp,
  Users,
  X,
} from 'lucide-react';
import type { ManagementDataset, ManagementDatasetKey } from '@/lib/management-types';

type FieldKind = 'text' | 'date' | 'number' | 'select' | 'textarea';
type FieldDefinition = {
  name: string;
  label: string;
  kind?: FieldKind;
  required?: boolean;
  options?: string[];
  optionSource?: { dataset: ManagementDatasetKey; column: string };
  placeholder?: string;
};
type FormDefinition = {
  label: string;
  description: string;
  fields: FieldDefinition[];
};
type ManagementResponse = {
  datasets?: ManagementDataset[];
  sheetUrl?: string | null;
  message?: string;
};

const today = () => new Date().toISOString().slice(0, 10);

const formDefinitions: Partial<Record<ManagementDatasetKey, FormDefinition>> = {
  products: {
    label: 'Product',
    description: 'Add a new product or ingredient to the product master.',
    fields: [
      { name: 'Product Name', label: 'Product name', required: true },
      { name: 'Category', label: 'Category', kind: 'select', required: true, options: ['Food', 'Raw Materials', 'Packaging', 'Finished Goods'] },
      { name: 'Unit', label: 'Unit', placeholder: 'g, unit, box…' },
      { name: 'Cost Price', label: 'Cost price', kind: 'number' },
      { name: 'Selling Price', label: 'Selling price', kind: 'number' },
      { name: 'Reorder Level', label: 'Reorder level', kind: 'number' },
      { name: 'Opening Stock', label: 'Opening stock', kind: 'number' },
    ],
  },
  purchases: {
    label: 'Purchase',
    description: 'Record incoming materials or packaging from a supplier.',
    fields: [
      { name: 'Date', label: 'Purchase date', kind: 'date', required: true },
      { name: 'Supplier', label: 'Supplier ID', kind: 'select', required: true, optionSource: { dataset: 'suppliers', column: 'Supplier ID' } },
      { name: 'Product', label: 'Product', kind: 'select', required: true, optionSource: { dataset: 'products', column: 'Product Name' } },
      { name: 'Quantity', label: 'Quantity', kind: 'number', required: true },
      { name: 'Cost Price', label: 'Cost price per unit', kind: 'number', required: true },
      { name: 'Payment Mode', label: 'Payment mode', kind: 'select', required: true, options: ['Cash', 'Bank Transfer', 'Credit Card', 'Check', 'Bank'] },
      { name: 'Paid (Yes/No)', label: 'Paid?', kind: 'select', required: true, options: ['Yes', 'No'] },
      { name: 'Notes', label: 'Notes', kind: 'textarea' },
    ],
  },
  sales: {
    label: 'Sale',
    description: 'Record a wholesale, retail, campus, or direct sale.',
    fields: [
      { name: 'Date', label: 'Sale date', kind: 'date', required: true },
      { name: 'Customer', label: 'Customer', kind: 'select', required: true, optionSource: { dataset: 'customers', column: 'Customer Name / Location' } },
      { name: 'Product', label: 'Product', kind: 'select', required: true, optionSource: { dataset: 'products', column: 'Product Name' } },
      { name: 'Quantity', label: 'Quantity', kind: 'number', required: true },
      { name: 'Selling Price', label: 'Selling price', kind: 'number' },
      { name: 'Payment Type (Cash/Credit)', label: 'Payment type', kind: 'select', required: true, options: ['Cash', 'Credit'] },
      { name: 'Due Date', label: 'Due date', kind: 'date' },
      { name: 'Notes', label: 'Notes', kind: 'textarea' },
    ],
  },
  customers: {
    label: 'Customer',
    description: 'Add a retailer, campus counter, online buyer, or lead.',
    fields: [
      { name: 'Customer Name / Location', label: 'Customer or outlet name', required: true },
      { name: 'Sales Channel', label: 'Sales channel', kind: 'select', required: true, options: ['Retailer', 'Online', 'Vending Machine'] },
      { name: 'Preferred Pack Size', label: 'Preferred pack', kind: 'select', options: ['5 Pack', '10 Pack', '20 Pack', '30 Pack', 'Bulk'] },
      { name: 'Contact Info', label: 'Phone or email' },
      { name: 'Campus Details', label: 'Campus / area' },
      { name: 'Status', label: 'Status', kind: 'select', required: true, options: ['Active', 'Inactive', 'Lead'] },
      { name: 'Notes', label: 'Notes', kind: 'textarea' },
    ],
  },
  suppliers: {
    label: 'Supplier',
    description: 'Add a supplier and their contact information.',
    fields: [
      { name: 'Supplier Name', label: 'Supplier name', required: true },
      { name: 'product', label: 'Products supplied', required: true },
      { name: 'Phone', label: 'Phone' },
      { name: 'Address', label: 'Address', kind: 'textarea' },
    ],
  },
  payments_received: {
    label: 'Payment received',
    description: 'Record money received against a customer invoice.',
    fields: [
      { name: 'Date', label: 'Payment date', kind: 'date', required: true },
      { name: 'Customer', label: 'Customer', kind: 'select', required: true, optionSource: { dataset: 'customers', column: 'Customer Name / Location' } },
      { name: 'Invoice Number', label: 'Invoice number', kind: 'select', optionSource: { dataset: 'sales', column: 'Invoice Number' } },
      { name: 'Amount Received', label: 'Amount received', kind: 'number', required: true },
      { name: 'Payment Mode', label: 'Payment mode', kind: 'select', required: true, options: ['Cash', 'Bank Transfer', 'Credit Card', 'Check', 'Bank'] },
      { name: 'Remarks', label: 'Remarks', kind: 'textarea' },
    ],
  },
  payments_made: {
    label: 'Payment made',
    description: 'Record money paid to a supplier.',
    fields: [
      { name: 'Date', label: 'Payment date', kind: 'date', required: true },
      { name: 'Supplier', label: 'Supplier', kind: 'select', required: true, optionSource: { dataset: 'suppliers', column: 'Supplier Name' } },
      { name: 'Purchase ID', label: 'Purchase ID', kind: 'select', optionSource: { dataset: 'purchases', column: 'Purchase ID' } },
      { name: 'Amount Paid', label: 'Amount paid', kind: 'number', required: true },
      { name: 'Payment Mode', label: 'Payment mode', kind: 'select', required: true, options: ['Cash', 'Bank Transfer', 'Credit Card', 'Check', 'Bank'] },
      { name: 'Remarks', label: 'Remarks', kind: 'textarea' },
    ],
  },
  expenses: {
    label: 'Expense',
    description: 'Record operating, marketing, transport, or asset spending.',
    fields: [
      { name: 'Date', label: 'Expense date', kind: 'date', required: true },
      { name: 'Category', label: 'Category', kind: 'select', required: true, options: ['Fixed Asset', 'Inventory Asset', 'Operating Expense', 'Marketing', 'Transport'] },
      { name: 'Description', label: 'Description', kind: 'textarea', required: true },
      { name: 'Amount', label: 'Amount', kind: 'number', required: true },
      { name: 'Payment Mode', label: 'Payment mode', kind: 'select', required: true, options: ['Cash', 'Bank Transfer', 'Credit Card', 'Check', 'Bank'] },
    ],
  },
  production_batches: {
    label: 'Production batch',
    description: 'Record output and manufacturing cost for a production run.',
    fields: [
      { name: 'Date', label: 'Production date', kind: 'date', required: true },
      { name: 'Product Name', label: 'Product', kind: 'select', required: true, optionSource: { dataset: 'products', column: 'Product Name' } },
      { name: 'Quantity Produced', label: 'Quantity produced', kind: 'number', required: true },
      { name: 'Manufacturing Cost', label: 'Manufacturing cost', kind: 'number', required: true },
    ],
  },
  batch_traceability: {
    label: 'Batch ingredient usage',
    description: 'Link an ingredient and supplier lot to a production batch.',
    fields: [
      { name: 'Batch Number', label: 'Batch number', kind: 'select', required: true, optionSource: { dataset: 'production_batches', column: 'Batch Number' } },
      { name: 'Ingredient', label: 'Ingredient', kind: 'select', required: true, optionSource: { dataset: 'raw_material_inventory', column: 'Product' } },
      { name: 'Supplier', label: 'Supplier', kind: 'select', required: true, optionSource: { dataset: 'suppliers', column: 'Supplier Name' } },
      { name: 'Supplier Lot Number', label: 'Supplier lot number', required: true },
      { name: 'Quantity Used (g)', label: 'Quantity used (g)', kind: 'number', required: true },
    ],
  },
};

const formKeys = Object.keys(formDefinitions) as ManagementDatasetKey[];

const initialValues = (definition: FormDefinition) =>
  Object.fromEntries(definition.fields.map((field) => [field.name, field.kind === 'date' ? today() : '']));

const money = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });
const numeric = (value: string | undefined) => Number(String(value || '').replace(/[^0-9.-]/g, '')) || 0;
const cell = (dataset: ManagementDataset | undefined, row: string[], header: string) => {
  const index = dataset?.headers.indexOf(header) ?? -1;
  return index >= 0 ? row[index] : '';
};

function MiniBars({ items, emptyLabel }: { items: { label: string; value: number; color?: string }[]; emptyLabel: string }) {
  const maximum = Math.max(...items.map((item) => item.value), 1);
  if (!items.length) return <div className="grid h-44 place-items-center rounded-xl bg-secondary/50 text-sm font-semibold text-muted-foreground">{emptyLabel}</div>;
  return (
    <div className="space-y-4" role="img" aria-label={items.map((item) => `${item.label}: ${item.value}`).join(', ')}>
      {items.map((item) => (
        <div key={item.label}>
          <div className="mb-1.5 flex items-center justify-between gap-3 text-xs font-bold"><span className="truncate text-foreground">{item.label}</span><span className="text-muted-foreground">{money.format(item.value)}</span></div>
          <div className="h-2.5 overflow-hidden rounded-full bg-secondary"><div className="h-full rounded-full transition-[width]" style={{ width: `${Math.max((item.value / maximum) * 100, item.value ? 5 : 0)}%`, backgroundColor: item.color || '#ff5a13' }} /></div>
        </div>
      ))}
    </div>
  );
}

function MetricCard({ label, value, note, icon }: { label: string; value: string; note: string; icon: ReactNode }) {
  return (
    <article className="rounded-2xl border border-border bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3"><div><p className="text-xs font-black uppercase tracking-[0.14em] text-muted-foreground">{label}</p><p className="mt-2 text-2xl font-black text-foreground">{value}</p></div><span className="grid h-10 w-10 place-items-center rounded-xl bg-[#fff2dc] text-primary">{icon}</span></div>
      <p className="mt-2 text-xs font-medium text-muted-foreground">{note}</p>
    </article>
  );
}

function LegacyOperationsPage() {
  const [datasets, setDatasets] = useState<ManagementDataset[]>([]);
  const [sheetUrl, setSheetUrl] = useState<string | null>(null);
  const [selectedForm, setSelectedForm] = useState<ManagementDatasetKey>('purchases');
  const [selectedTable, setSelectedTable] = useState<ManagementDatasetKey>('purchases');
  const [values, setValues] = useState<Record<string, string>>(() => initialValues(formDefinitions.purchases!));
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await fetch('/api/admin/management', { cache: 'no-store' });
      const data = (await response.json()) as ManagementResponse;
      if (response.status === 401) {
        window.location.href = '/admin/login';
        return;
      }
      if (!response.ok || !Array.isArray(data.datasets)) throw new Error(data.message || 'Could not load the workbook.');
      setDatasets(data.datasets);
      setSheetUrl(data.sheetUrl || null);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Could not load the workbook.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { void loadData(); }, [loadData]);

  const definition = formDefinitions[selectedForm]!;
  const activeDataset = datasets.find((dataset) => dataset.key === selectedTable);
  const filteredRows = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!activeDataset || !query) return activeDataset?.rows || [];
    return activeDataset.rows.filter((row) => row.some((cell) => String(cell).toLowerCase().includes(query)));
  }, [activeDataset, search]);

  const sourceOptions = (field: FieldDefinition) => {
    if (field.options) return field.options;
    if (!field.optionSource) return [];
    const dataset = datasets.find((item) => item.key === field.optionSource?.dataset);
    if (!dataset) return [];
    const columnIndex = dataset.headers.indexOf(field.optionSource.column);
    if (columnIndex < 0) return [];
    return Array.from(new Set(dataset.rows.map((row) => row[columnIndex]).filter(Boolean)));
  };

  const changeForm = (key: ManagementDatasetKey) => {
    const next = formDefinitions[key];
    if (!next) return;
    setSelectedForm(key);
    setSelectedTable(key);
    setValues(initialValues(next));
    setSuccess('');
    setError('');
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);
    setError('');
    setSuccess('');
    try {
      const response = await fetch('/api/admin/management', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dataset: selectedForm, values }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.message || 'Could not save this record.');
      setSuccess(`${definition.label} saved and mapped to ${definition.label === 'Sale' ? 'Sales' : definition.label} in Google Sheets.`);
      setValues(initialValues(definition));
      await loadData();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Could not save this record.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 rounded-2xl border border-border bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-primary">Client workbook</p>
          <h2 className="mt-1 text-3xl font-black text-foreground">Business operations</h2>
          <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
            One form for day-to-day entries, with every existing record mapped to its original Google Sheet tab.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {sheetUrl && (
            <a href={sheetUrl} target="_blank" rel="noreferrer" className="inline-flex h-10 items-center gap-2 rounded-lg border border-border bg-white px-4 text-sm font-bold text-foreground hover:bg-secondary">
              Open master sheet <ExternalLink size={16} />
            </a>
          )}
          <button type="button" onClick={() => void loadData()} disabled={isLoading} className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-bold text-white disabled:opacity-60">
            <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} /> Refresh
          </button>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[minmax(22rem,0.78fr)_minmax(0,1.55fr)]">
        <section className="self-start rounded-2xl border border-border bg-white p-5 shadow-sm xl:sticky xl:top-24">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.16em] text-primary">Single entry form</p>
              <h3 className="mt-1 text-2xl font-black text-foreground">Add a record</h3>
            </div>
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-secondary text-primary"><PlusCircle size={22} /></span>
          </div>

          <label className="mt-5 block text-sm font-bold text-foreground">
            What are you recording?
            <select value={selectedForm} onChange={(event) => changeForm(event.target.value as ManagementDatasetKey)} className="mt-2 h-11 w-full rounded-lg border border-border bg-card px-3 text-sm font-semibold outline-none focus:border-primary focus:ring-2 focus:ring-orange-100">
              {formKeys.map((key) => <option key={key} value={key}>{formDefinitions[key]!.label}</option>)}
            </select>
          </label>
          <p className="mt-2 text-xs leading-5 text-muted-foreground">{definition.description}</p>

          <form onSubmit={submit} className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
            {definition.fields.map((field) => {
              const options = sourceOptions(field);
              const wide = field.kind === 'textarea';
              return (
                <label key={field.name} className={`block text-sm font-bold text-foreground ${wide ? 'sm:col-span-2 xl:col-span-1 2xl:col-span-2' : ''}`}>
                  {field.label}{field.required && <span className="text-primary"> *</span>}
                  {field.kind === 'select' ? (
                    <select required={field.required} value={values[field.name] || ''} onChange={(event) => setValues((current) => ({ ...current, [field.name]: event.target.value }))} className="mt-2 h-11 w-full rounded-lg border border-border bg-card px-3 text-sm font-medium outline-none focus:border-primary focus:ring-2 focus:ring-orange-100">
                      <option value="">Select {field.label.toLowerCase()}</option>
                      {options.map((option) => <option key={option} value={option}>{option}</option>)}
                    </select>
                  ) : field.kind === 'textarea' ? (
                    <textarea required={field.required} value={values[field.name] || ''} onChange={(event) => setValues((current) => ({ ...current, [field.name]: event.target.value }))} rows={3} placeholder={field.placeholder} className="mt-2 w-full resize-y rounded-lg border border-border bg-card px-3 py-2.5 text-sm font-medium outline-none focus:border-primary focus:ring-2 focus:ring-orange-100" />
                  ) : (
                    <input required={field.required} type={field.kind || 'text'} min={field.kind === 'number' ? '0' : undefined} step={field.kind === 'number' ? 'any' : undefined} value={values[field.name] || ''} onChange={(event) => setValues((current) => ({ ...current, [field.name]: event.target.value }))} placeholder={field.placeholder} className="mt-2 h-11 w-full rounded-lg border border-border bg-card px-3 text-sm font-medium outline-none focus:border-primary focus:ring-2 focus:ring-orange-100" />
                  )}
                </label>
              );
            })}

            {error && <div className="sm:col-span-2 xl:col-span-1 2xl:col-span-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm font-semibold text-red-700">{error}</div>}
            {success && <div className="sm:col-span-2 xl:col-span-1 2xl:col-span-2 flex items-start gap-2 rounded-lg border border-green-200 bg-green-50 px-3 py-2.5 text-sm font-semibold text-green-800"><CheckCircle2 size={17} className="mt-0.5 shrink-0" />{success}</div>}
            <button type="submit" disabled={isSaving || isLoading} className="sm:col-span-2 xl:col-span-1 2xl:col-span-2 inline-flex h-12 items-center justify-center gap-2 rounded-xl border-2 border-foreground bg-[#ffd51d] font-black text-foreground shadow-[0_4px_0_#ef5b00] transition-transform hover:-translate-y-0.5 disabled:opacity-60">
              <Database size={18} /> {isSaving ? 'Saving to Google Sheets…' : `Save ${definition.label}`}
            </button>
          </form>
        </section>

        <section className="min-w-0 rounded-2xl border border-border bg-white shadow-sm">
          <div className="border-b border-border p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.16em] text-primary">Mapped workbook data</p>
                <h3 className="mt-1 text-2xl font-black text-foreground">Current records</h3>
              </div>
              <label className="relative block sm:w-64">
                <span className="sr-only">Search current records</span>
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search this table" className="h-10 w-full rounded-lg border border-border bg-card pl-9 pr-3 text-sm outline-none focus:border-primary" />
              </label>
            </div>
            <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
              {datasets.map((dataset) => (
                <button key={dataset.key} type="button" onClick={() => { setSelectedTable(dataset.key); setSearch(''); }} className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-bold ${selectedTable === dataset.key ? 'border-foreground bg-foreground text-white' : 'border-border bg-card text-foreground hover:bg-secondary'}`}>
                  {dataset.title} <span className="ml-1 opacity-65">{dataset.rows.length}</span>
                </button>
              ))}
            </div>
          </div>

          {isLoading ? (
            <div className="p-16 text-center text-sm font-semibold text-muted-foreground">Loading the client workbook…</div>
          ) : activeDataset ? (
            <>
              <div className="flex items-center justify-between border-b border-border bg-secondary/40 px-5 py-3">
                <div>
                  <p className="font-black text-foreground">{activeDataset.title}</p>
                  <p className="text-xs text-muted-foreground">{filteredRows.length} of {activeDataset.rows.length} records</p>
                </div>
                {!activeDataset.editable && <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-muted-foreground">Calculated view</span>}
              </div>
              <div className="max-h-[44rem] overflow-auto">
                <table className="min-w-full border-collapse text-left text-sm">
                  <thead className="sticky top-0 z-10 bg-[#2b170b] text-white">
                    <tr>{activeDataset.headers.map((header) => <th key={header} className="whitespace-nowrap px-4 py-3 text-xs font-black uppercase tracking-wide">{header}</th>)}</tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredRows.length ? filteredRows.map((row, rowIndex) => (
                      <tr key={`${activeDataset.key}-${rowIndex}`} className="odd:bg-white even:bg-[#fffaf0] hover:bg-orange-50">
                        {activeDataset.headers.map((header, columnIndex) => <td key={`${header}-${columnIndex}`} className="max-w-64 whitespace-nowrap px-4 py-3 text-foreground"><span className="block max-w-64 truncate" title={row[columnIndex] || ''}>{row[columnIndex] || '—'}</span></td>)}
                      </tr>
                    )) : (
                      <tr><td colSpan={Math.max(activeDataset.headers.length, 1)} className="p-14 text-center text-sm text-muted-foreground">{search ? 'No records match this search.' : 'No records in this sheet yet.'}</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <div className="p-16 text-center text-sm text-muted-foreground">No workbook data available.</div>
          )}
        </section>
      </div>
    </div>
  );
}

void LegacyOperationsPage;

export default function OperationsPage() {
  const [datasets, setDatasets] = useState<ManagementDataset[]>([]);
  const [sheetUrl, setSheetUrl] = useState<string | null>(null);
  const [selectedTable, setSelectedTable] = useState<ManagementDatasetKey>('customers');
  const [selectedForm, setSelectedForm] = useState<ManagementDatasetKey>('purchases');
  const [values, setValues] = useState<Record<string, string>>(() => initialValues(formDefinitions.purchases!));
  const [editingRow, setEditingRow] = useState<number | null>(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await fetch('/api/admin/management', { cache: 'no-store' });
      const data = (await response.json()) as ManagementResponse;
      if (response.status === 401) { window.location.href = '/admin/login'; return; }
      if (!response.ok || !Array.isArray(data.datasets)) throw new Error(data.message || 'Could not load the workbook.');
      setDatasets(data.datasets);
      setSheetUrl(data.sheetUrl || null);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Could not load the workbook.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { void loadData(); }, [loadData]);

  const datasetMap = useMemo(() => new Map(datasets.map((dataset) => [dataset.key, dataset])), [datasets]);
  const sales = datasetMap.get('sales');
  const purchases = datasetMap.get('purchases');
  const expenses = datasetMap.get('expenses');
  const customers = datasetMap.get('customers');
  const stock = datasetMap.get('raw_material_inventory');
  const activeDataset = datasetMap.get(selectedTable);
  const definition = formDefinitions[selectedForm]!;

  const totals = useMemo(() => ({
    sales: sales?.rows.reduce((sum, row) => sum + numeric(cell(sales, row, 'Total Amount')), 0) || 0,
    purchases: purchases?.rows.reduce((sum, row) => sum + numeric(cell(purchases, row, 'Total Cost')), 0) || 0,
    expenses: expenses?.rows.reduce((sum, row) => sum + numeric(cell(expenses, row, 'Amount')), 0) || 0,
  }), [expenses, purchases, sales]);

  const expenseBars = useMemo(() => {
    const grouped = new Map<string, number>();
    expenses?.rows.forEach((row) => {
      const category = cell(expenses, row, 'Category') || 'Other';
      grouped.set(category, (grouped.get(category) || 0) + numeric(cell(expenses, row, 'Amount')));
    });
    return [...grouped.entries()].map(([label, value]) => ({ label, value })).sort((a, b) => b.value - a.value).slice(0, 5);
  }, [expenses]);

  const stockHealth = useMemo(() => {
    const result = { healthy: 0, low: 0, out: 0, unset: 0 };
    stock?.rows.forEach((row) => {
      const status = cell(stock, row, 'Status').toLowerCase();
      if (status.includes('out')) result.out += 1;
      else if (status.includes('low')) result.low += 1;
      else if (status.includes('stock') || status === 'ok') result.healthy += 1;
      else result.unset += 1;
    });
    return result;
  }, [stock]);
  const stockTotal = stockHealth.healthy + stockHealth.low + stockHealth.out + stockHealth.unset;
  const stockAlerts = useMemo(() => stock?.rows.filter((row) => {
    const status = cell(stock, row, 'Status').toLowerCase();
    return status.includes('low') || status.includes('out');
  }) || [], [stock]);

  const filtered = useMemo(() => {
    if (!activeDataset) return [];
    const query = search.trim().toLowerCase();
    return activeDataset.rows.map((row, index) => ({ row, rowNumber: activeDataset.rowNumbers?.[index] }))
      .filter(({ row }) => !query || row.some((value) => String(value).toLowerCase().includes(query)));
  }, [activeDataset, search]);
  const pageSize = 8;
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const visibleRows = filtered.slice((page - 1) * pageSize, page * pageSize);

  const sourceOptions = (field: FieldDefinition) => {
    if (field.options) return field.options;
    if (!field.optionSource) return [];
    const source = datasetMap.get(field.optionSource.dataset);
    if (!source) return [];
    const index = source.headers.indexOf(field.optionSource.column);
    return index < 0 ? [] : Array.from(new Set(source.rows.map((row) => row[index]).filter(Boolean)));
  };

  const openAdd = (key: ManagementDatasetKey = 'purchases') => {
    const next = formDefinitions[key];
    if (!next) return;
    setSelectedForm(key); setValues(initialValues(next)); setEditingRow(null); setError(''); setDialogOpen(true);
  };

  const openEdit = (row: string[], rowNumber: number | undefined) => {
    if (!activeDataset || !rowNumber || !formDefinitions[activeDataset.key]) return;
    const next = formDefinitions[activeDataset.key]!;
    setSelectedForm(activeDataset.key);
    setEditingRow(rowNumber);
    setValues(Object.fromEntries(next.fields.map((field) => {
      const value = cell(activeDataset, row, field.name);
      return [field.name, field.kind === 'date' && value && !/^\d{4}-\d{2}-\d{2}$/.test(value) ? '' : value];
    })));
    setError(''); setDialogOpen(true);
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setIsSaving(true); setError('');
    try {
      const response = await fetch('/api/admin/management', {
        method: editingRow ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dataset: selectedForm, rowNumber: editingRow, values }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.message || `Could not ${editingRow ? 'update' : 'save'} this record.`);
      setSuccess(`${definition.label} ${editingRow ? 'updated' : 'added'} successfully in Google Sheets.`);
      setDialogOpen(false); setEditingRow(null); setSelectedTable(selectedForm); setPage(1);
      await loadData();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Could not save this record.');
    } finally { setIsSaving(false); }
  };

  return (
    <div className="space-y-5">
      <section className="overflow-hidden rounded-2xl bg-[#2b170b] p-6 text-white shadow-sm">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div><p className="text-xs font-black uppercase tracking-[0.18em] text-[#ffd51d]">Live business overview</p><h2 className="mt-1 text-3xl font-black">Business operations</h2><p className="mt-2 max-w-2xl text-sm text-orange-100/80">Sales, spending, stock, customers, and every mapped workbook record—clear at a glance.</p></div>
          <div className="flex flex-wrap gap-2">
            {sheetUrl && <a href={sheetUrl} target="_blank" rel="noreferrer" className="inline-flex h-10 items-center gap-2 rounded-lg border border-white/20 px-4 text-sm font-bold hover:bg-white/10">Master sheet <ExternalLink size={16} /></a>}
            <button type="button" onClick={() => void loadData()} disabled={isLoading} className="inline-flex h-10 items-center gap-2 rounded-lg border border-white/20 px-4 text-sm font-bold hover:bg-white/10 disabled:opacity-60"><RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} /> Refresh</button>
            <button type="button" onClick={() => openAdd()} className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#ffd51d] px-4 text-sm font-black text-[#2b170b]"><PlusCircle size={17} /> Add entry</button>
          </div>
        </div>
      </section>

      {success && <div className="flex items-center justify-between rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-bold text-green-800"><span className="flex items-center gap-2"><CheckCircle2 size={18} />{success}</span><button type="button" aria-label="Dismiss success message" onClick={() => setSuccess('')}><X size={17} /></button></div>}
      {error && !dialogOpen && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">{error}</div>}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Sales value" value={money.format(totals.sales)} note={`${sales?.rows.length || 0} sales records`} icon={<TrendingUp size={20} />} />
        <MetricCard label="Purchases" value={money.format(totals.purchases)} note={`${purchases?.rows.length || 0} purchase records`} icon={<ShoppingCart size={20} />} />
        <MetricCard label="Expenses" value={money.format(totals.expenses)} note={`${expenses?.rows.length || 0} expense records`} icon={<IndianRupee size={20} />} />
        <MetricCard label="Customers" value={String(customers?.rows.length || 0)} note={`${stockAlerts.length} stock items need attention`} icon={<Users size={20} />} />
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.25fr_0.85fr_0.9fr]">
        <article className="rounded-2xl border border-border bg-white p-5 shadow-sm"><p className="text-xs font-black uppercase tracking-[0.14em] text-primary">Money movement</p><h3 className="mt-1 text-xl font-black text-foreground">Sales vs business outflow</h3><div className="mt-6"><MiniBars emptyLabel="No financial records yet" items={[{ label: 'Sales', value: totals.sales, color: '#1f9d64' }, { label: 'Purchases', value: totals.purchases, color: '#ff8a1f' }, { label: 'Expenses', value: totals.expenses, color: '#ef5b00' }]} /></div></article>
        <article className="rounded-2xl border border-border bg-white p-5 shadow-sm"><p className="text-xs font-black uppercase tracking-[0.14em] text-primary">Expense mix</p><h3 className="mt-1 text-xl font-black text-foreground">Where money is going</h3><div className="mt-6"><MiniBars emptyLabel="No expenses recorded yet" items={expenseBars} /></div></article>
        <article className="rounded-2xl border border-border bg-white p-5 shadow-sm"><p className="text-xs font-black uppercase tracking-[0.14em] text-primary">Inventory health</p><h3 className="mt-1 text-xl font-black text-foreground">Raw material status</h3><div className="mt-5 flex items-center gap-5"><div className="relative h-28 w-28 shrink-0 rounded-full" style={{ background: stockTotal ? `conic-gradient(#1f9d64 0 ${(stockHealth.healthy / stockTotal) * 100}%, #f59e0b 0 ${((stockHealth.healthy + stockHealth.low) / stockTotal) * 100}%, #dc2626 0 ${((stockHealth.healthy + stockHealth.low + stockHealth.out) / stockTotal) * 100}%, #d6d3d1 0)` : '#ece7df' }}><div className="absolute inset-4 grid place-items-center rounded-full bg-white text-center"><span><strong className="block text-2xl text-foreground">{stockTotal}</strong><small className="text-[10px] font-bold uppercase text-muted-foreground">items</small></span></div></div><div className="min-w-0 space-y-2 text-sm"><p><span className="mr-2 inline-block h-2.5 w-2.5 rounded-full bg-[#1f9d64]" />{stockHealth.healthy} healthy</p><p><span className="mr-2 inline-block h-2.5 w-2.5 rounded-full bg-amber-500" />{stockHealth.low} low</p><p><span className="mr-2 inline-block h-2.5 w-2.5 rounded-full bg-red-600" />{stockHealth.out} out</p><p><span className="mr-2 inline-block h-2.5 w-2.5 rounded-full bg-stone-300" />{stockHealth.unset} unclassified</p></div></div></article>
      </section>

      {stockAlerts.length > 0 && <section className="rounded-2xl border border-amber-200 bg-amber-50 p-5"><div className="flex items-start gap-3"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-amber-100 text-amber-700"><AlertTriangle size={20} /></span><div><h3 className="font-black text-amber-950">Stock attention needed</h3><p className="mt-1 text-sm text-amber-800">{stockAlerts.slice(0, 4).map((row) => cell(stock, row, 'Product') || row[0]).join(', ')}{stockAlerts.length > 4 ? ` and ${stockAlerts.length - 4} more` : ''}</p></div></div></section>}

      <section className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
        <div className="border-b border-border p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between"><div><p className="text-xs font-black uppercase tracking-[0.14em] text-primary">Detailed records</p><h3 className="mt-1 text-2xl font-black text-foreground">Browse and edit entries</h3></div><label className="relative block w-full lg:w-72"><span className="sr-only">Search current records</span><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" /><input value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} placeholder="Search selected records" className="h-10 w-full rounded-lg border border-border bg-card pl-9 pr-3 text-sm outline-none focus:border-primary" /></label></div>
          <div className="mt-4 flex flex-wrap gap-2">{datasets.map((dataset) => <button key={dataset.key} type="button" onClick={() => { setSelectedTable(dataset.key); setSearch(''); setPage(1); }} className={`rounded-lg border px-3 py-2 text-xs font-bold ${selectedTable === dataset.key ? 'border-[#2b170b] bg-[#2b170b] text-white' : 'border-border bg-card text-foreground hover:border-orange-300 hover:bg-orange-50'}`}>{dataset.title}<span className="ml-1.5 opacity-60">{dataset.rows.length}</span></button>)}</div>
        </div>
        {isLoading ? <div className="p-16 text-center text-sm font-semibold text-muted-foreground">Loading the client workbook…</div> : activeDataset ? <>
          <div className="flex items-center justify-between border-b border-border bg-secondary/40 px-5 py-3"><div><p className="font-black text-foreground">{activeDataset.title}</p><p className="text-xs text-muted-foreground">{filtered.length} record{filtered.length === 1 ? '' : 's'}</p></div>{activeDataset.editable ? <button type="button" onClick={() => openAdd(activeDataset.key)} className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-black text-white"><PlusCircle size={15} /> Add {formDefinitions[activeDataset.key]?.label}</button> : <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-muted-foreground">Formula-driven view</span>}</div>
          <div className="overflow-x-auto"><table className="min-w-full border-collapse text-left text-sm"><thead className="bg-[#2b170b] text-white"><tr>{activeDataset.headers.map((header) => <th key={header} className="whitespace-nowrap px-4 py-3 text-xs font-black uppercase tracking-wide">{header}</th>)}{activeDataset.editable && <th className="sticky right-0 bg-[#2b170b] px-4 py-3 text-right text-xs font-black uppercase">Action</th>}</tr></thead><tbody className="divide-y divide-border">{visibleRows.length ? visibleRows.map(({ row, rowNumber }, rowIndex) => <tr key={`${activeDataset.key}-${rowNumber || rowIndex}`} className="odd:bg-white even:bg-[#fffaf0] hover:bg-orange-50">{activeDataset.headers.map((header, columnIndex) => <td key={`${header}-${columnIndex}`} className="max-w-64 whitespace-nowrap px-4 py-3 text-foreground"><span className="block max-w-64 truncate" title={row[columnIndex] || ''}>{row[columnIndex] || '—'}</span></td>)}{activeDataset.editable && <td className="sticky right-0 bg-inherit px-4 py-2 text-right"><button type="button" disabled={!rowNumber} onClick={() => openEdit(row, rowNumber)} className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-white px-3 py-2 text-xs font-black text-foreground hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"><Pencil size={14} /> Edit</button></td>}</tr>) : <tr><td colSpan={activeDataset.headers.length + (activeDataset.editable ? 1 : 0)} className="p-14 text-center text-sm text-muted-foreground">{search ? 'No records match this search.' : 'No records in this sheet yet.'}</td></tr>}</tbody></table></div>
          <div className="flex items-center justify-between border-t border-border px-5 py-3"><p className="text-xs font-semibold text-muted-foreground">Page {Math.min(page, totalPages)} of {totalPages}</p><div className="flex gap-2"><button type="button" aria-label="Previous page" disabled={page <= 1} onClick={() => setPage((current) => Math.max(1, current - 1))} className="grid h-9 w-9 place-items-center rounded-lg border border-border disabled:opacity-40"><ChevronLeft size={17} /></button><button type="button" aria-label="Next page" disabled={page >= totalPages} onClick={() => setPage((current) => Math.min(totalPages, current + 1))} className="grid h-9 w-9 place-items-center rounded-lg border border-border disabled:opacity-40"><ChevronRight size={17} /></button></div></div>
        </> : <div className="p-16 text-center text-sm text-muted-foreground">No workbook data available.</div>}
      </section>

      {dialogOpen && <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/55 p-0 sm:items-center sm:p-6" onMouseDown={(event) => { if (event.currentTarget === event.target && !isSaving) setDialogOpen(false); }}><section role="dialog" aria-modal="true" aria-labelledby="entry-dialog-title" className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl"><div className="sticky top-0 z-10 flex items-start justify-between border-b border-border bg-white px-6 py-5"><div><p className="text-xs font-black uppercase tracking-[0.14em] text-primary">{editingRow ? 'Edit spreadsheet entry' : 'New spreadsheet entry'}</p><h3 id="entry-dialog-title" className="mt-1 text-2xl font-black text-foreground">{editingRow ? `Edit ${definition.label}` : `Add ${definition.label}`}</h3><p className="mt-1 text-xs text-muted-foreground">{definition.description}</p></div><button type="button" aria-label="Close entry form" disabled={isSaving} onClick={() => setDialogOpen(false)} className="grid h-10 w-10 place-items-center rounded-full bg-secondary"><X size={19} /></button></div>
        <form onSubmit={submit} className="grid gap-4 p-6 sm:grid-cols-2"><label className="sm:col-span-2 block text-sm font-bold text-foreground">Record type<select disabled={Boolean(editingRow)} value={selectedForm} onChange={(event) => { const key = event.target.value as ManagementDatasetKey; const next = formDefinitions[key]; if (next) { setSelectedForm(key); setValues(initialValues(next)); } }} className="mt-2 h-11 w-full rounded-lg border border-border bg-card px-3 text-sm font-semibold outline-none focus:border-primary disabled:opacity-60">{formKeys.map((key) => <option key={key} value={key}>{formDefinitions[key]!.label}</option>)}</select></label>
          {definition.fields.map((field) => { const options = sourceOptions(field); const wide = field.kind === 'textarea'; const inputClass = 'mt-2 w-full rounded-lg border border-border bg-card px-3 text-sm font-medium outline-none focus:border-primary focus:ring-2 focus:ring-orange-100'; return <label key={field.name} className={`block text-sm font-bold text-foreground ${wide ? 'sm:col-span-2' : ''}`}>{field.label}{field.required && <span className="text-primary"> *</span>}{field.kind === 'select' ? <select required={field.required} value={values[field.name] || ''} onChange={(event) => setValues((current) => ({ ...current, [field.name]: event.target.value }))} className={`${inputClass} h-11`}><option value="">Select {field.label.toLowerCase()}</option>{options.map((option) => <option key={option} value={option}>{option}</option>)}</select> : field.kind === 'textarea' ? <textarea required={field.required} value={values[field.name] || ''} onChange={(event) => setValues((current) => ({ ...current, [field.name]: event.target.value }))} rows={3} placeholder={field.placeholder} className={`${inputClass} resize-y py-2.5`} /> : <input required={field.required} type={field.kind || 'text'} min={field.kind === 'number' ? '0' : undefined} step={field.kind === 'number' ? 'any' : undefined} value={values[field.name] || ''} onChange={(event) => setValues((current) => ({ ...current, [field.name]: event.target.value }))} placeholder={field.placeholder} className={`${inputClass} h-11`} />}</label>; })}
          {error && <div className="sm:col-span-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm font-semibold text-red-700">{error}</div>}
          <div className="sm:col-span-2 flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end"><button type="button" disabled={isSaving} onClick={() => setDialogOpen(false)} className="h-11 rounded-xl border border-border px-5 text-sm font-black text-foreground">Cancel</button><button type="submit" disabled={isSaving || isLoading} className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border-2 border-foreground bg-[#ffd51d] px-6 font-black text-foreground shadow-[0_3px_0_#ef5b00] disabled:opacity-60"><Database size={17} />{isSaving ? 'Saving…' : editingRow ? 'Save changes' : `Add ${definition.label}`}</button></div>
        </form></section></div>}
    </div>
  );
}
