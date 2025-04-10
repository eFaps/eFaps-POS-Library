import { Currency } from "./currency";

export enum PaymentType {
  CASH = "CASH",
  FREE = "FREE",
  CARD = "CARD",
  CHANGE = "CHANGE",
  ELECTRONIC = "ELECTRONIC",
  LOYALTY_POINTS = "LOYALTY_POINTS",
}

export interface Payment {
  type: PaymentType;
  amount: number;
  currency: Currency;
  exchangeRate: number;
  cardTypeId?: number;
  cardLabel?: string;
  mappingKey?: string;
  collectOrderId?: string;
}
