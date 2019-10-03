import { Balance } from './balance';
import { TaxEntry, PaymentType } from '@efaps/pos-library';

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
