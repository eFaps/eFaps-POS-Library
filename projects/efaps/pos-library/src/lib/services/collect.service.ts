import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Decimal } from "decimal.js";
import { Observable } from "rxjs";

import { CollectOrder, CollectStart, Collector, Currency } from "../model";
import { ConfigService } from "./config.service";

@Injectable({
  providedIn: "root",
  deps: [HttpClient, ConfigService],
})
export class CollectService {
  constructor(private http: HttpClient, private config: ConfigService) {}

  getCollectors() {
    const requestUrl = `${this.config.baseUrl}/collectors`;
    return this.http.get<Collector[]>(requestUrl);
  }

  startCollect(
    key: string,
    amount: number,
    currency: Currency,
    details: any,
    orderId?: string
  ): Observable<CollectStart> {
    const amountStr = new Decimal(amount)
      .toDecimalPlaces(2, Decimal.ROUND_HALF_UP)
      .toString();
    const collectOrder = {
      amount: amountStr,
      currency: currency,
      details: details,
      orderId: orderId,
    };
    const url = `${this.config.baseUrl}/collectors/${key}/start`;
    return this.http.post<CollectStart>(url, collectOrder);
  }

  getCollectOrder(collectOrderId: string): Observable<CollectOrder> {
    const url = `${this.config.baseUrl}/collectors/orders/${collectOrderId}`;
    return this.http.get<CollectOrder>(url);
  }

  cancelCollectOrder(collectOrderId: string): Observable<CollectOrder> {
    const url = `${this.config.baseUrl}/collectors/orders/${collectOrderId}/cancel`;
    return this.http.post<CollectOrder>(url, null);
  }
}
