export interface Collector {
  label: string;
  key: string;
}

export interface CollectOrder {
  amount: string;
  collected?: string;
  id?: string;
  state?: "INVALID" | "PENDING" | "SUCCESS" | "CANCELED";
  orderId?: string;
  collectorKey?: string;
  additionalInfo?: any;
}

export interface CollectStart {
  collectOrderId: string;
  details: any;
}
