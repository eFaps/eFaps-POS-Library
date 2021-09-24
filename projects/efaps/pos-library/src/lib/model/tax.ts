import { Currency } from "./currency";
export interface Tax {
  oid: string;
  key: string;
  catKey: string;
  type: TaxType;
  name: string;
  percent?: number;
  amount?: number;
}

export interface TaxEntry {
  tax: Tax;
  base: number;
  amount: number;
  currency: Currency;
  exchangeRate: number;
}

export enum TaxType {
  ADVALOREM = "ADVALOREM",
  PERUNIT = "PERUNIT",
}
