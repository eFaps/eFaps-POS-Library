import { DocumentType } from './document';
import { SpotConfig, Floor } from './spot';
import { Discount } from './discount';

export interface Workspace {
  oid: string;
  name: string;
  posOid: string;
  docTypes: DocumentType[];
  spotConfig: SpotConfig;
  spotCount: number;
  warehouseOid: string;
  printCmds: PrintCmd[];
  posLayout: PosLayout;
  discounts: Discount[];
  cards: Card[];
  gridSize: PosGridSize;
  gridShowPrice: boolean;
  floors: Floor[];
}

export interface PrintCmd {
  printerOid: string;
  target: 'JOB' | 'PRELIMINARY' | 'TICKET' | 'COPY' | 'BALANCE';
  targetOid: string;
}

export interface Card {
  label: string;
  cardTypeId: number;
}

export enum PosLayout {
  GRID = 'GRID',
  LIST = 'LIST',
  BOTH = 'BOTH',
}

export enum PosGridSize {
  SMALL = 'SMALL',
  MEDIUM = 'MEDIUM',
  LARGE = 'LARGE',
}
