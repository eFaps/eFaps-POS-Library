import { Discount } from "./discount";
import { Payment } from "./payment";
import { Product } from "./product";
import { Spot } from "./spot";
import { TaxEntry } from "./tax";

export interface Document {
  type?: "ORDER" | "RECEIPT" | "INVOICE" | "TICKET";
  id: string;
  oid: string;
  number: string;
  currency: string;
  items: DocItem[];
  status: DocStatus;
  netTotal: number;
  crossTotal: number;
  taxes: TaxEntry[];
  contactOid?: string;
  workspaceOid?: string;
  discount: Discount;
}

export interface Payable extends Document {
  balanceOid: string;
  payments: Payment[];
}

export interface Order extends Document {
  payableOid: string;
  spot?: Spot;
  shoutout?: string;
}
/* tslint:disable-next-line */
export interface Receipt extends Payable {}
/* tslint:disable-next-line */
export interface Invoice extends Payable {}
/* tslint:disable-next-line */
export interface Ticket extends Payable {}

export interface DocItem {
  index: number;
  product: Product;
  quantity: number;
  netPrice: number;
  netUnitPrice: number;
  crossPrice: number;
  crossUnitPrice: number;
  remark?: string;
  taxes: TaxEntry[];
}

export enum DocumentType {
  RECEIPT,
  INVOICE,
  TICKET
}

export enum DocStatus {
  OPEN,
  CLOSED,
  CANCELED
}

export interface DocumentHead {
  type?: "ORDER" | "RECEIPT" | "INVOICE" | "TICKET";
  id: string;
  number: string;
  netTotal: number;
  crossTotal: number;
}

export interface PayableHead extends DocumentHead {
  order?: DocumentHead;
}

export interface OrderWrapper extends Order {
  spotLabel: string;
  multiple: boolean;
}
