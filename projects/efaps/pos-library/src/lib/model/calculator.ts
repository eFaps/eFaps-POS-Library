import { PromoInfo } from "./promotion";
import { TaxEntry } from "./tax";

export interface CalculatorRequest {
  positions: CalculatorPosRequest[];
  sourceDocIdent?: string;
}

export interface CalculatorPosRequest {
  index?: number;
  parentIdx?: number;
  quantity: number;
  productOid: string;
  bomOid?: string;
}

export interface CalculatorResponse {
  netTotal: number;
  crossTotal: number;
  taxTotal: number;
  taxes: TaxEntry[];
  payableAmount: number;
  positions: CalculatorPosResponse[];
  promotionInfo?: PromoInfo;
}

export interface CalculatorPosResponse {
  index?: number;
  parentIdx?: number;
  quantity: number;
  productOid: string;
  netUnitPrice: number;
  netPrice: number;
  crossUnitPrice: number;
  crossPrice: number;
  taxes: TaxEntry[];
  taxAmount: number;
  bomOid?: string;
}
