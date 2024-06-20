import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { PromoInfo, Promotion } from "../model";
import { ConfigService } from "./config.service";

@Injectable({
  providedIn: "root",
})
export class PromotionService {
  constructor(
    private http: HttpClient,
    private config: ConfigService,
  ) {}

  public getPromotion(oid: string): Observable<Promotion> {
    const requestUrl = `${this.config.baseUrl}/promotions/${oid}`;
    return this.http.get<Promotion>(requestUrl);
  }

  public getPromotionInfoForDocument(
    documentId: string,
  ): Observable<PromoInfo> {
    const requestUrl = `${this.config.baseUrl}/promotions/info`;
    return this.http.get<PromoInfo>(requestUrl, { params: { documentId } });
  }
}
