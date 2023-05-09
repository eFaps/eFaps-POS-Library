import { User } from "./user";

export interface Stocktaking {
  id: string;
  number: string;
  startAt: Date;
  endAt: Date;
  status: "OPEN" | "CLOSED";
  userOid: string;
  warehouseOid: string;
}

export interface AddStocktakingEntry {
  id?: string;
  quantity: number;
  productOid: string;
  comment: string;
}

export interface StocktakingEntry {
  id?: string;
  quantity: number;
  product: {
    oid: string;
    description: string;
    sku: string;
    uoM: string;
  };
  comment: string;
}
