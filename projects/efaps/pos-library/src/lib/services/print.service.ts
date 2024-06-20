import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { Document, Order, PrintResponse } from "../model";
import { ConfigService } from "./config.service";

@Injectable({
  providedIn: "root",
  deps: [HttpClient, ConfigService],
})
export class PrintService {
  constructor(
    private http: HttpClient,
    private config: ConfigService,
  ) {}

  printJobs(workspaceOid: string, order: Order): Observable<PrintResponse[]> {
    const requestUrl = `${this.config.baseUrl}/print/jobs`;
    return this.http.post<PrintResponse[]>(requestUrl, null, {
      params: {
        documentId: order.id,
        workspaceOid,
      },
    });
  }

  getPreview(_key: string): Observable<any> {
    const requestUrl = `${this.config.baseUrl}/print/preview/${_key}`;
    return this.http.get(requestUrl, { responseType: "blob" });
  }

  printPreliminary(
    workspaceOid: string,
    doc: Document,
  ): Observable<PrintResponse[]> {
    const requestUrl = `${this.config.baseUrl}/print/preliminary`;
    return this.http.post<PrintResponse[]>(requestUrl, null, {
      params: {
        documentId: doc.id,
        workspaceOid,
      },
    });
  }

  printCopy(workspaceOid: string, doc: Document): Observable<PrintResponse[]> {
    const requestUrl = `${this.config.baseUrl}/print/copy`;
    return this.http.post<PrintResponse[]>(requestUrl, null, {
      params: {
        documentId: doc.id,
        workspaceOid,
      },
    });
  }

  printTicket(
    workspaceOid: string,
    doc: Document,
  ): Observable<PrintResponse[]> {
    const requestUrl = `${this.config.baseUrl}/print/ticket`;
    return this.http.post<PrintResponse[]>(requestUrl, null, {
      params: {
        documentId: doc.id,
        workspaceOid,
      },
    });
  }

  printBalance(
    workspaceOid: string,
    balanceId: string,
  ): Observable<PrintResponse[]> {
    const requestUrl = `${this.config.baseUrl}/print/balance`;
    return this.http.post<PrintResponse[]>(requestUrl, null, {
      params: {
        balanceId,
        workspaceOid,
      },
    });
  }
}
