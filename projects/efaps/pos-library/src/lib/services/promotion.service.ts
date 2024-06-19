import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { PromoInfo, Promotion } from "../model";
import { ConfigService } from "./config.service";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class PromotionService {
  constructor(private http: HttpClient, private config: ConfigService) {}

  public getPromotion(oid: string): Observable<Promotion> {
    const requestUrl = `${this.config.baseUrl}/promotions/${oid}`;
    return this.http.get<Promotion>(requestUrl);
  }

  public getPromotionInfoForDocument(documentOid: string): Observable<PromoInfo> {
    const requestUrl = `${this.config.baseUrl}/promotions/info`;
    return this.http.get<PromoInfo>(requestUrl, {params: {documentOid}});
  }

}
