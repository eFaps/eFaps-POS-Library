import { Contact } from "./contact";
import { Currency } from "./currency";
import { Discount } from "./discount";
import { EmployeeRelation } from "./employee";
import { Payment } from "./payment";
import { Product } from "./product";
import { Spot } from "./spot";
import { TaxEntry } from "./tax";

export interface Document {
  type?: "ORDER" | "RECEIPT" | "INVOICE" | "TICKET" | "CREDITNOTE";
  id: string | null;
  oid: string | null;
  number: string | null;
  date?: string;
  currency: Currency;
  items: DocItem[];
  status: DocStatus;
  netTotal: number;
  crossTotal: number;
  exchangeRate: number;
  payableAmount: number;
  taxes: TaxEntry[];
  contactOid?: string;
  contact?: Contact;
  workspaceOid?: string;
  discount: Discount | null;
  note?: string;
  employeeRelations?: EmployeeRelation[];
}

export interface Payable extends Document {
  balanceOid: string;
  payments: Payment[];
}

export interface Order extends Document {
  payableOid?: string;
  spot?: Spot;
  shoutout?: string;
  orderOptionKey?: string;
}
/* tslint:disable-next-line */
export interface Receipt extends Payable {}
/* tslint:disable-next-line */
export interface Invoice extends Payable {}
/* tslint:disable-next-line */
export interface Ticket extends Payable {}
/* tslint:disable-next-line */
export interface CreditNote extends Payable {
  sourceDocOid: string;
}

export interface DocItem {
  index: number;
  parentIdx?: number | null;
  product: Product;
  standIn?: Product;
  quantity: number;
  netPrice: number;
  netUnitPrice: number;
  crossPrice: number;
  crossUnitPrice: number;
  currency: Currency;
  exchangeRate: number;
  remark?: string;
  taxes: TaxEntry[];
  bomOid?: string;
}

export enum DocumentType {
  RECEIPT = "RECEIPT",
  INVOICE = "INVOICE",
  TICKET = "TICKET",
  CREDITNOTE = "CREDITNOTE",
}

export enum DocStatus {
  OPEN = "OPEN",
  CLOSED = "CLOSED",
  CANCELED = "CANCELED",
}

export interface DocumentHead {
  type?: "ORDER" | "RECEIPT" | "INVOICE" | "TICKET" | "CREDITNOTE";
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

export interface ValidateForCreditNote {
  payableOid: string;
}

export interface ValidateForCreditNoteResponse {
  valid: boolean;
}
