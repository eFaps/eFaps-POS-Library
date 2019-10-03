import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { PrintResponse } from '../model/index';
import { ConfigService, Document, Order } from '@efaps/pos-library';

@Injectable({
  providedIn: 'root'
})
export class PrintService {

  constructor(private http: HttpClient,
    private config: ConfigService) { }

  printJobs(_workspaceOid: string, _order: Order): Observable<PrintResponse[]> {
    const requestUrl = `${this.config.baseUrl}/print/jobs`;
    const params = new HttpParams()
      .set('documentId', _order.id)
      .set('workspaceOid', _workspaceOid);
    return this.http.post<PrintResponse[]>(requestUrl, null, { params: params });
  }

  getPreview(_key: string): Observable<any> {
    const requestUrl = `${this.config.baseUrl}/print/preview/${_key}`;
    return this.http.get(requestUrl, { responseType: 'blob' });
  }

  printPreliminary(_workspaceOid: string, _doc: Document): Observable<PrintResponse[]> {
    const requestUrl = `${this.config.baseUrl}/print/preliminary`;
    const params = new HttpParams()
      .set('documentId', _doc.id)
      .set('workspaceOid', _workspaceOid);
    return this.http.post<PrintResponse[]>(requestUrl, null, { params: params });
  }

  printCopy(_workspaceOid: string, _doc: Document): Observable<PrintResponse[]> {
    const requestUrl = `${this.config.baseUrl}/print/copy`;
    const params = new HttpParams()
      .set('documentId', _doc.id)
      .set('workspaceOid', _workspaceOid);
    return this.http.post<PrintResponse[]>(requestUrl, null, { params: params });
  }

  printTicket(_workspaceOid: string, _doc: Document): Observable<PrintResponse[]> {
    const requestUrl = `${this.config.baseUrl}/print/ticket`;
    const params = new HttpParams()
      .set('documentId', _doc.id)
      .set('workspaceOid', _workspaceOid);
    return this.http.post<PrintResponse[]>(requestUrl, null, { params: params });
  }

  printBalance(workspaceOid: string, balanceId: string): Observable<PrintResponse[]> {
    const requestUrl = `${this.config.baseUrl}/print/balance`;
    const params = new HttpParams()
      .set('balanceId', balanceId)
      .set('workspaceOid', workspaceOid);
    return this.http.post<PrintResponse[]>(requestUrl, null, { params: params });
  }
}
