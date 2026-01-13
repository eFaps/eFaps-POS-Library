import { PersistenceService, PersistenceServiceProvider } from "./persistence";

export interface PosConfig {
  baseUrl: string;
  socketUrl: string;
  defaultProdImg?: string;
  persistence?: PersistenceService | PersistenceServiceProvider;
}

export interface Extension {
  key: string;
  tag: string;
  url: string;
}

export interface CalculatorConfig {
  netPriceScale: number;
  itemTaxScale: number;
  crossPriceScale: number;
}
