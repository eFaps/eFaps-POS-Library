import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ConfigService } from "./config.service";
import { Observable } from "rxjs";
import { DNI, Page, PageRequest, RUC } from "../model";

@Injectable({
  providedIn: "root",
})
export class EnquiryService {
  constructor(private http: HttpClient, private config: ConfigService) {}

  public findRUCs(term: string, pageable?: PageRequest): Observable<Page<RUC>> {
    const url = `${this.config.baseUrl}/enquiry/ruc`;
    const params: any = pageable || {};
    params.term = term;
    return this.http.get<Page<RUC>>(url, { params });
  }

  public getDNI(number: string): Observable<DNI> {
    const url = `${this.config.baseUrl}/enquiry/dni/${number}`;
    return this.http.get<DNI>(url);
  }

  public getRUC(number: string): Observable<RUC> {
    const url = `${this.config.baseUrl}/enquiry/ruc/${number}`;
    return this.http.get<RUC>(url);
  }
}
