import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import {
  AddStocktakingEntry,
  Page,
  PageRequest,
  Stocktaking,
  StocktakingEntry,
} from "../model";
import { ConfigService } from "./config.service";

@Injectable({
  providedIn: "root",
})
export class StocktakingService {
  constructor(
    private http: HttpClient,
    private config: ConfigService,
  ) {}

  getCurrent(warehouseOid: string): Observable<Stocktaking> {
    const requestUrl = `${this.config.baseUrl}/stocktakings/current`;
    const params: any = { warehouseOid };
    return this.http.get<Stocktaking>(requestUrl, { params });
  }

  createStocktaking(warehouseOid: string): Observable<Stocktaking> {
    const requestUrl = `${this.config.baseUrl}/stocktakings`;
    return this.http.post<Stocktaking>(requestUrl, warehouseOid);
  }

  closeStocktaking(stocktakingId: string): Observable<Stocktaking> {
    const requestUrl = `${this.config.baseUrl}/stocktakings/${stocktakingId}`;
    return this.http.put<Stocktaking>(requestUrl, {});
  }

  getOpenStocktakings(): Observable<Stocktaking[]> {
    const requestUrl = `${this.config.baseUrl}/stocktakings`;
    const params: any = { status: "OPEN" };
    return this.http.get<Stocktaking[]>(requestUrl, { params });
  }

  getStocktakings(
    expand?: boolean,
    pageable?: PageRequest,
  ): Observable<Page<Stocktaking>> {
    const requestUrl = `${this.config.baseUrl}/stocktakings`;
    const params: any = pageable || {};
    params.expand = expand;
    return this.http.get<Page<Stocktaking>>(requestUrl, { params });
  }

  addEntry(
    stocktakingId: string,
    entry: AddStocktakingEntry,
  ): Observable<String> {
    const requestUrl = `${this.config.baseUrl}/stocktakings/${stocktakingId}/entries`;
    return this.http.post(requestUrl, entry, { responseType: "text" });
  }

  deleteEntry(stocktakingId: string, entryId: string): Observable<Object> {
    const requestUrl = `${this.config.baseUrl}/stocktakings/${stocktakingId}/entries/${entryId}`;
    return this.http.delete(requestUrl);
  }

  getEntries(
    stocktakingId: string,
    pageable?: PageRequest,
  ): Observable<Page<StocktakingEntry>> {
    const requestUrl = `${this.config.baseUrl}/stocktakings/${stocktakingId}/entries`;
    const params: any = pageable || {};
    return this.http.get<Page<StocktakingEntry>>(requestUrl, { params });
  }
}
