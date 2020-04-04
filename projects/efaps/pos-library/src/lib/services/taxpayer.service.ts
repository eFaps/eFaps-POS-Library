import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { ConfigService } from "./config.service";
import { Observable } from "rxjs";
import { Taxpayer } from "../model";
import { PageRequest, Page } from "../model/pageable";

@Injectable({
  providedIn: "root",
  deps: [HttpClient, ConfigService]
})
export class TaxpayerService {
  constructor(private http: HttpClient, private config: ConfigService) {}

  public getTaxpayer(id: string): Observable<Taxpayer> {
    const url = `${this.config.baseUrl}/taxpayer/query`;
    return this.http.get<Taxpayer>(url, { params: { id } });
  }

  public findTaxpayers(
    term: string,
    pageable?: PageRequest
  ): Observable<Page<Taxpayer>> {
    const url = `${this.config.baseUrl}/taxpayer/query`;
    const params: any = pageable || {};
    params.term = term;
    return this.http.get<Page<Taxpayer>>(url, { params });
  }
}
