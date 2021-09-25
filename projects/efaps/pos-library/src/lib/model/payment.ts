import { Currency } from "./currency";

export enum PaymentType {
  CASH,
  FREE,
  CARD,
  CHANGE,
  ELECTRONIC,
}

export interface Payment {
  type: PaymentType;
  amount: number;
  currency: Currency;
  exchangeRate: number;
  cardTypeId?: number;
  cardLabel?: string;
  mappingKey?: string;
}
