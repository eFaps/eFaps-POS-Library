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

export interface StocktakingEntry {
  id?: string;
  productOid: string;
  quantity: number;
}
