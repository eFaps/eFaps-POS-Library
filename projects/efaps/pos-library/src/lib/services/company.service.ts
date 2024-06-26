import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";

import { Company } from "../model";
import { ConfigService } from "./config.service";

@Injectable({
  providedIn: "root",
  deps: [HttpClient, ConfigService],
})
export class CompanyService {
  public _currentCompany: Company = null;

  private currentSource = new BehaviorSubject<Company>(this.currentCompany);
  company = this.currentSource.asObservable();

  constructor(
    private http: HttpClient,
    private config: ConfigService,
  ) {
    if (config.persistence) {
      this._currentCompany = <any>config.persistence.currentCompany();
    }
  }

  get currentCompany() {
    return this._currentCompany && this._currentCompany.key
      ? this._currentCompany
      : null;
  }

  public getCompanies(): Observable<Company[]> {
    const href = this.config.baseUrl + "/companies";
    const requestUrl = `${href}`;
    return this.http.get<Company[]>(requestUrl);
  }

  setCurrentCompany(company: Company): any {
    this._currentCompany.key = company.key;
    this._currentCompany.label = company.label;
    if (this.config.persistence) {
      (<any>this._currentCompany).save();
    }
    this.currentSource.next(this._currentCompany);
  }

  hasCompany(): boolean {
    return this.currentCompany != null;
  }
}
