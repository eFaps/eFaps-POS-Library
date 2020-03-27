import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { ConfigService } from "./config.service";
import { Observable } from "rxjs";
import { Taxpayer } from "../model";

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
}
