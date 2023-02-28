import { Currency } from "./currency";
import { Flagged } from "./flags";
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
  bomGroupConfigs: BOMGroupConfig[];
  configurationBOMs: ConfigurationBOM[];
}

export interface BOMGroupConfig extends Flagged {
  oid: String;
  productOid: string;
  name: string;
  description: string;
  // flagged enum value with BOMGroupConfigFlag
  flags: number;
}

export interface ConfigurationBOM {
  oid: String;
  toProductOid: string;
  bomGroupOid: string;
  position: number;
  quantity: number;
  uoM: string;
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

export enum BOMGroupConfigFlag {
  optional = 1 << 0,
  onlyOne = 1 << 1,
}
