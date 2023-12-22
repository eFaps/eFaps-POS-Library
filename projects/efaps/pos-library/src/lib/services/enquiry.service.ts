import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ConfigService } from "./config.service";
import { Observable } from "rxjs";
import { DNI, Page, PageRequest, Taxpayer } from "../model";

@Injectable({
  providedIn: "root",
})
export class EnquiryService {
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

  public getDNI(number: string): Observable<DNI> {
    const url = `${this.config.baseUrl}/enquiry/dni/${number}`;
    return this.http.get<DNI>(url);
  }
}
