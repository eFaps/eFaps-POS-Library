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
  promotionInfo?: PromoInfo;
}

export interface CalculatorPosResponse {
  quantity: number;
  productOid: string;
  netUnitPrice: number;
  netPrice: number;
  crossUnitPrice: number;
  crossPrice: number;
  taxes: TaxEntry[];
  taxAmount: number;
}

export interface PromoInfo {
  totalDiscount: number;
  details: PromoDetail[];
  promotionOids: string[];
}

export interface PromoDetail {
  index: number;
  discount: number;
  promotionOid: number;
}
