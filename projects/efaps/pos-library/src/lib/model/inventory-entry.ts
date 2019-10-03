import { Product } from '@efaps/pos-library';

import { Warehouse } from './warehouse';

export interface InventoryEntry {
  id: string;
  oid: string;
  quantity: number;
  warehouse: Warehouse;
  product: Product;
}
