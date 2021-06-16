import { Tax } from "./tax";

export interface Product {
  oid: string;
  sku: string;
  type: ProductType;
  description: string;
  imageOid: string;
  netPrice: number;
  crossPrice: number;
  categoryOids: string[];
  taxes: Tax[];
  relations: ProductRelation[];
  indicationSets: IndicationSet[];
  barcodes: Barcode[];
}

export interface Barcode {
  type: string;
  code: string;
}

export interface ProductRelation {
  label: string;
  productOid: string;
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
}
