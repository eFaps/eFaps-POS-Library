import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Page, PageRequest, Stocktaking } from "../model";
import { HttpClient } from "@angular/common/http";
import { ConfigService } from "./config.service";

@Injectable({
  providedIn: "root",
})
export class StocktakingService {
  constructor(private http: HttpClient, private config: ConfigService) {}

  getCurrent(): Observable<Stocktaking> {
    const requestUrl = `${this.config.baseUrl}/stocktaking/current`;
    return this.http.get<Stocktaking>(requestUrl);
  }

  createStocktaking(warehouseOid: string): Observable<Stocktaking> {
    const requestUrl = `${this.config.baseUrl}/stocktaking`;
    return this.http.post<Stocktaking>(requestUrl, warehouseOid);
  }

  public getStocktakings(
    pageable?: PageRequest
  ): Observable<Page<Stocktaking>> {
    const requestUrl = `${this.config.baseUrl}/contacts`;
    const params: any = pageable || {};
    return this.http.get<Page<Stocktaking>>(requestUrl, { params });
  }
}
