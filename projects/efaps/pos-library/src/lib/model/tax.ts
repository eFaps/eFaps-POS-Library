export interface Tax {
  oid: string;
  key: string;
  catKey: string;
  type: TaxType;
  name: string;
  percent: number;
}

export interface TaxEntry {
  tax: Tax;
  base: number;
  amount: number;
}

export enum TaxType {
  ADVALOREM = "ADVALOREM",
  PERUNIT = "PERUNIT",
}
