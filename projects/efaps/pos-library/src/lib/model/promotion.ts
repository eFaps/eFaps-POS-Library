export interface Promotion {
  oid: String;
  name: String;
  description: String;
  label: String;
}

export interface PromoInfo {
  netTotalDiscount: number;
  crossTotalDiscount: number;
  details: PromoDetail[];
  promotionOids: string[];
}

export interface PromoDetail {
  index: number;
  netUnitDiscount: number;
  netDiscount: number;
  crossUnitDiscount: number;
  crossDiscount: number;
  promotionOid: string;
}
