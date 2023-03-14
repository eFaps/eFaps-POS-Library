import { Balance, CashEntry } from "./balance";
import { PaymentType } from "./payment";
import { TaxEntry } from "./tax";

export interface BalanceSummary {
  balance: Balance;
  cashEntries: CashEntry[];
  detail: SummaryDetail;
  invoiceDetail: SummaryDetail;
  receiptDetail: SummaryDetail;
  ticketDetail: SummaryDetail;
  creditNoteDetail: SummaryDetail;
}

export interface SummaryDetail {
  documentCount: number;
  paymentCount: number;
  netTotal: number;
  crossTotal: number;
  paymentInfos: PaymentInfo[];
  taxEntries: TaxEntry[];
}

export interface PaymentInfo {
  type: PaymentType;
  label: String;
  count: number;
  amount: number;
}
