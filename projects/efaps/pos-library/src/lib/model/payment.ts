export enum PaymentType {
  CASH,
  FREE,
  CARD,
  CHANGE,
  ELECTRONIC
}

export interface Payment {
  type: PaymentType;
  amount: number;
  cardTypeId?: number;
  cardLabel?: string;
  mappingKey?: string;
}
