export interface Discount {
  type: DiscountType,
  value: number,
  productOid: string,
  label: string
}

export enum DiscountType {
  PERCENT = 'PERCENT',
  AMOUNT = 'AMOUNT'
}
