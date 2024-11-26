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
  individual?: ProductIndividual;
}

export interface BOMGroupConfig extends Flagged {
  oid: string;
  productOid: string;
  name: string;
  description: string;
  weight: number;
  // flagged enum value with BOMGroupConfigFlag
  flags: number;
  minQuantity?: number;
  maxQuantity?: number;
}

export interface ConfigurationBOM extends Flagged {
  oid: string;
  toProductOid: string;
  bomGroupOid: string;
  position: number;
  quantity: number;
  uoM: string;
   // flagged enum value with ConfigurationBOMFlag
  flags: number;
  actions?: BOMAction[];
}

export interface BOMAction {
  type: BOMActionType;
  netAmount?: number;
  crossAmount?: number;
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
  BATCH = "BATCH",
  INDIVIDUAL = "INDIVIDUAL",
}

export enum ProductRelationType {
  ALTERNATIVE = "ALTERNATIVE",
  SALESBOM = "SALESBOM",
  INDIVIDUAL = "INDIVIDUAL",
  BATCH = "BATCH",
  OTHER = "OTHER",
}

export enum BOMGroupConfigFlag {
  optional = 1 << 0,
  onlyOne = 1 << 1,
  chargeable = 1 << 2,  
}

export enum ProductIndividual {
  NONE = "NONE",
  INDIVIDUAL = "INDIVIDUAL",
  BATCH = "BATCH",
}

export enum BOMActionType {
  PRICEADJUSTMENT = "PRICEADJUSTMENT",
}

export enum ConfigurationBOMFlag {
  default  = 1 << 0,
}
