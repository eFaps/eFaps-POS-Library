import { Product } from "./product";
import { Warehouse } from "./warehouse";

export interface InventoryEntry {
  id: string;
  oid: string;
  quantity: number;
  warehouse: Warehouse;
  product: Product;
}

export interface ValidateStock {
  warehouseOid: string;
  entries: ValidateStockEntry[];
}

export interface ValidateStockEntry {
  productOid: string;
  quantity: number;
}

export interface ValidateStockResponse {
  stock: boolean;
  entries: ValidateStockEntry[];
}
