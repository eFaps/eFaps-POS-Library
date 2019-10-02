export enum PaymentType {
  CASH,
  FREE,
  CARD,
  CHANGE,
  AUTO
}

export interface Payment {
  type: PaymentType;
  amount: number;
  cardTypeId?: number;
  cardLabel?: string;
}
