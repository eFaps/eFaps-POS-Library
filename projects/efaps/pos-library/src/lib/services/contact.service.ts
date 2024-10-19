import { HttpClient, HttpContext } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { Contact, Page, PageRequest } from "../model";
import { ConfigService } from "./config.service";

@Injectable({
  providedIn: "root",
  deps: [HttpClient, ConfigService],
})
export class ContactService {
  constructor(
    private http: HttpClient,
    private config: ConfigService,
  ) {}

  public getContacts(pageable?: PageRequest): Observable<Page<Contact>> {
    const requestUrl = `${this.config.baseUrl}/contacts`;
    const params: any = pageable || {};
    return this.http.get<Page<Contact>>(requestUrl, { params });
  }

  public getContact(id: string): Observable<Contact> {
    const requestUrl = `${this.config.baseUrl}/contacts/${id}`;
    return this.http.get<Contact>(requestUrl);
  }

  public searchContacts(
    term: string,
    _nameSearch: boolean,
  ): Observable<Contact[]> {
    const requestUrl = `${this.config.baseUrl}/contacts`;
    return this.http.get<Contact[]>(requestUrl, {
      params: { term, nameSearch: _nameSearch.toString() },
    });
  }

  public createContact(
    contact: Contact,
    options?: {
      context?: HttpContext;
    },
  ): Observable<Contact> {
    const requestUrl = `${this.config.baseUrl}/contacts`;
    return this.http.post<Contact>(requestUrl, contact, options);
  }
}
