export interface Promotion {
  oid: String;
  name: String;
  description: String;
  label: String;
}

export interface PromoInfo {
  totalDiscount: number;
  details: PromoDetail[];
  promotionOids: string[];
}

export interface PromoDetail {
  index: number;
  discount: number;
  promotionOid: string;
}
