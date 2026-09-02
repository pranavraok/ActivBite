export type ManagementDatasetKey =
  | 'products'
  | 'raw_material_inventory'
  | 'purchases'
  | 'sales'
  | 'customers'
  | 'suppliers'
  | 'payments_received'
  | 'payments_made'
  | 'expenses'
  | 'finished_goods_inventory'
  | 'production_batches'
  | 'batch_traceability';

export type ManagementDataset = {
  key: ManagementDatasetKey;
  title: string;
  headers: string[];
  rows: string[][];
  rowNumbers: number[];
  editable: boolean;
};

export type ManagementDataResponse = {
  ok?: boolean;
  datasets?: ManagementDataset[];
  message?: string;
};

export type ManagementWriteResponse = {
  ok?: boolean;
  dataset?: ManagementDatasetKey;
  row?: string[];
  rowNumber?: number;
  message?: string;
};
