import { Balance } from './balance';
import { PaymentType } from './payment';
import { TaxEntry } from './tax';

export interface BalanceSummary {
  balance: Balance;
  detail: SummaryDetail;
  invoiceDetail: SummaryDetail;
  receiptDetail: SummaryDetail;
  ticketDetail: SummaryDetail;
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
  cardTypeId: number;
  cardLabel: String;
  count: number;
  amount: number;
}
