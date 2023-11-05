import { TaxEntry } from "./tax";

export interface CalculatorRequest {
  positions: CalculatorPosRequest[];
}

export interface CalculatorPosRequest {
  quantity: number;
  productOid: string;
}

export interface CalculatorResponse {
  netTotal: number;
  crossTotal: number;
  taxTotal: number;
  taxes: TaxEntry[];
  payableAmount: number;
  positions: CalculatorPosResponse[];
}

export interface CalculatorPosResponse {
  quantity: number;
  productOid: string;
  netUnitPrice: number;
  netPrice: number;
  crossPrice: number;
  taxes: TaxEntry[];
  taxAmount: number;
}
