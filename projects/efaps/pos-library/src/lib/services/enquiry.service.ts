import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { District, DNI, Page, PageRequest, RUC } from "../model";
import { ConfigService } from "./config.service";

@Injectable({
  providedIn: "root",
})
export class EnquiryService {
  constructor(
    private http: HttpClient,
    private config: ConfigService,
  ) {}

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

  public getDistrict(lat: number, lon: number): Observable<District> {
    const url = `${this.config.baseUrl}/enquiry/district`;
    let params: HttpParams = new HttpParams();
    params = params.set("lat", lat);
    params = params.set("lon", lon);
    return this.http.get<District>(url, { params });
  }
}
