import { Currency } from "./currency";
import { User } from "./user";

export interface Balance {
  id: string;
  oid: string;
  number: string;
  startAt: Date;
  endAt: Date;
  status: "OPEN" | "CLOSED";
  user?: User;
}

export interface CashEntry {
  id?: string;
  balanceOid: string;
  entryType: CashEntryType
  amount: number;
  currency: Currency
}

export enum CashEntryType {
  OPENING = "OPENING"
}
