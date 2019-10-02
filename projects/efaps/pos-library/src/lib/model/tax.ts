export interface Tax {
  type: TaxType;
  name: string;
  percent: number;
  amount: number;
}

export interface TaxEntry {
  tax: Tax;
  base: number;
  amount: number;
}

export enum TaxType {
  ADVALOREM = "ADVALOREM",
  PERUNIT = "PERUNIT"
}
