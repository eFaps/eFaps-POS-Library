import { Currency } from "./currency";
import { Tax } from "./tax";

export interface Product {
  oid: string;
  sku: string;
  type: ProductType;
  description: string;
  note: string;
  imageOid: string;
  netPrice: number;
  crossPrice: number;
  currency: Currency;
  categories: Product2Category[];
  taxes: Tax[];
  relations: ProductRelation[];
  indicationSets: IndicationSet[];
  barcodes: Barcode[];
}

export interface Product2Category {
  categoryOid: string;
  weight: number;
}

export interface Barcode {
  type: string;
  code: string;
}

export interface ProductRelation {
  type: ProductRelationType;
  label: string;
  productOid: string;
  quantity: number;
}

export interface RelationEntry {
  label: string;
  product: Product;
}

export interface IndicationSet {
  oid: string;
  name: string;
  description?: string;
  required: boolean;
  multiple: boolean;
  imageOid?: string;
  indications: Indication[];
}

export interface Indication {
  oid: string;
  value: string;
  description?: string;
  imageOid?: string;
}

export enum ProductType {
  STANDART = "STANDART",
  SERVICE = "SERVICE",
  TEXT = "TEXT",
  OTHER = "OTHER",
  PARTLIST = "PARTLIST",
}

export enum ProductRelationType {
  ALTERNATIVE = "ALTERNATIVE",
  SALESBOM = "SALESBOM",
  OTHER = "OTHER",
}
