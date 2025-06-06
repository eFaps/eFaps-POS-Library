import { Discount } from "./discount";
import { DocumentType } from "./document";
import { Flagged } from "./flags";
import { Floor, SpotConfig } from "./spot";

export interface Workspace extends Flagged {
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
  floors: Floor[];
  categoryOids?: String[];
  // flagged enum value with WorkspaceFlag
  flags: number;
}

export interface PrintCmd {
  printerOid: string;
  target:
    | "JOB"
    | "PRELIMINARY"
    | "TICKET"
    | "COPY"
    | "BALANCE"
    | "BALANCE_DETAILED"
    | "SALESREPORT";
  targetOid: string;
}

export interface Card {
  label: string;
  cardTypeId: number;
}

export enum PosLayout {
  GRID = "GRID",
  LIST = "LIST",
  BOTH = "BOTH",
}

export enum PosGridSize {
  SMALL = "SMALL",
  MEDIUM = "MEDIUM",
  LARGE = "LARGE",
}

export enum WorkspaceFlag {
  gridShowPrice = 1 << 0,
  orderRequiresContact = 1 << 1,
  roundPayableAmount = 1 << 2,
  assignSeller = 1 << 3,
  jobOnPayment = 1 << 4,
  remote = 1 << 5,
  assignShoutOut = 1 << 6,
}
