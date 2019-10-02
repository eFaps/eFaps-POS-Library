import { Order } from './document';

export enum SpotConfig {
  NONE = 'NONE',
  BASIC = 'BASIC',
  EXTENDED = 'EXTENDED',
}

export interface Spot {
  id: string;
  oid?: string;
  label: string;
  orders?: Order[];
  position?: Position;
}

export interface SpotsLayout {
  floors: Floor[];
}

export interface Floor {
  oid: string;
  name: string;
  imageOid: string;
  spots: Spot[];
}

export interface Position {
  x: number;
  y: number;
}
