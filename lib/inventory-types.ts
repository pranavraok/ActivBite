export type InventoryItem = {
  sku: string;
  packLabel: string;
  packCount: number;
  unitsRemaining: number | null;
  lowStockThreshold: number;
  status: 'not_set' | 'in_stock' | 'low_stock' | 'out_of_stock';
  updatedAt: string;
  updatedBy: string;
  notes: string;
};

export const inventoryStatus = (
  unitsRemaining: number | null,
  lowStockThreshold: number
): InventoryItem['status'] => {
  if (unitsRemaining === null) return 'not_set';
  if (unitsRemaining === 0) return 'out_of_stock';
  if (unitsRemaining <= lowStockThreshold) return 'low_stock';
  return 'in_stock';
};

export const isPackAvailable = (item: InventoryItem | undefined, quantity = 1) =>
  !item || item.unitsRemaining === null || item.unitsRemaining >= quantity;
