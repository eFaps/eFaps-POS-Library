import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, merge } from 'rxjs';
import { map } from 'rxjs/operators';

import { Balance, Invoice, Order, Payable, PayableHead, Receipt, Ticket } from '../model';
import { ConfigService } from './config.service';
import { WorkspaceService } from './workspace.service';

@Injectable({
  providedIn: 'root',
  deps: [
    HttpClient,
    ConfigService,
    WorkspaceService
  ]
})
export class DocumentService {
  private wsoid: string;

  constructor(private http: HttpClient, private config: ConfigService,
    workspaceService: WorkspaceService) {
    workspaceService.currentWorkspace.subscribe(_ws => {
      if (_ws) {
        this.wsoid = _ws.oid;
      }
    });
  }

  public createReceipt(orderId: string, receipt: Receipt): Observable<Receipt> {
    const url = `${this.config.baseUrl}/workspaces/${this.wsoid}/documents/receipts`;
    return this.http.post<Receipt>(url, receipt, { params: { orderId } });
  }

  public createInvoice(orderId: string, invoice: Invoice): Observable<Receipt> {
    const url = `${this.config.baseUrl}/workspaces/${this.wsoid}/documents/invoices`;
    return this.http.post<Invoice>(url, invoice, { params: { orderId } });
  }

  public createTicket(orderId: string, ticket: Ticket): Observable<Ticket> {
    const url = `${this.config.baseUrl}/workspaces/${this.wsoid}/documents/tickets`;
    return this.http.post<Ticket>(url, ticket, { params: { orderId } });
  }

  public createOrder(_order: Order): Observable<Order> {
    const url = `${this.config.baseUrl}/documents/orders`;
    return this.http.post<Order>(url, _order);
  }

  public updateOrder(_order: Order): Observable<Order> {
    const url = `${this.config.baseUrl}/documents/orders/${_order.id}`;
    return this.http.put<Order>(url, _order);
  }

  public deleteOrder(_order: Order): Observable<void> {
    const url = `${this.config.baseUrl}/documents/orders/${_order.id}`;
    return this.http.delete<void>(url);
  }

  public getOrders(): Observable<Order[]> {
    const url = `${this.config.baseUrl}/documents/orders`;
    return this.http.get<Order[]>(url);
  }

  public getOpenOrders(): Observable<Order[]> {
    const url = `${this.config.baseUrl}/documents/orders`;
    return this.http.get<Order[]>(url, { params: { 'status': 'OPEN' } });
  }

  public findOrders(_term: string): Observable<Order[]> {
    const url = `${this.config.baseUrl}/documents/orders`;
    return this.http.get<Order[]>(url, { params: { 'term': _term } });
  }

  public getOrders4Spots(): Observable<Order[]> {
    const url = `${this.config.baseUrl}/documents/orders`;
    return this.http.get<Order[]>(url, { params: { 'spot': 'true' } });
  }

  public getReceipt(id: string): Observable<Receipt> {
    const url = `${this.config.baseUrl}/documents/receipts/${id}`;
    return this.http.get<Receipt>(url)
      .pipe(
        map(doc => {
          doc.type = 'RECEIPT';
          return doc;
        })
      )
  }

  public getInvoice(id: string): Observable<Invoice> {
    const url = `${this.config.baseUrl}/documents/invoices/${id}`;
    return this.http.get<Invoice>(url)
      .pipe(
        map(doc => {
          doc.type = 'INVOICE';
          return doc;
        })
      )
  }

  public getTicket(id: string): Observable<Ticket> {
    const url = `${this.config.baseUrl}/documents/tickets/${id}`;
    return this.http.get<Ticket>(url)
      .pipe(
        map(doc => {
          doc.type = 'TICKET';
          return doc;
        })
      )
  }

  public getDocuments4Balance(_balance: Balance): Observable<Payable[]> {
    return merge(
      this.getReceipts4Balance(_balance),
      this.getInvoices4Balance(_balance),
      this.getTickets4Balance(_balance)
    );
  }

  private getReceipts4Balance(_balance: Balance): Observable<Payable[]> {
    const url = `${this.config.baseUrl}/documents/receipts`;
    const balanceOid = _balance.oid ? _balance.oid : _balance.id;
    return this.http.get<Receipt[]>(url, { params: { balanceOid } })
      .pipe(map(docs => {
        docs.map(doc => {
          doc.type = 'RECEIPT';
        })
        return [...docs]
      }))
  }

  private getInvoices4Balance(_balance: Balance): Observable<Payable[]> {
    const url = `${this.config.baseUrl}/documents/invoices`;
    const balanceOid = _balance.oid ? _balance.oid : _balance.id;
    return this.http.get<Invoice[]>(url, { params: { balanceOid } })
      .pipe(map(docs => {
        docs.map(doc => {
          doc.type = 'INVOICE';
        })
        return [...docs]
      }));
  }

  private getTickets4Balance(_balance: Balance): Observable<Payable[]> {
    const url = `${this.config.baseUrl}/documents/tickets`;
    const balanceOid = _balance.oid ? _balance.oid : _balance.id;
    return this.http.get<Ticket[]>(url, { params: { balanceOid } })
      .pipe(map(docs => {
        docs.map(doc => {
          doc.type = 'TICKET';
        })
        return [...docs]
      }))
  }

  public findPayables(_term: string): Observable<PayableHead[]> {
    return merge(
      this.findReceipts(_term),
      this.findInvoices(_term),
      this.findTickets(_term)
    );
  }

  private findReceipts(_term: string): Observable<PayableHead[]> {
    const url = `${this.config.baseUrl}/documents/receipts`;
    return this.http.get<PayableHead[]>(url, { params: { 'term': _term } })
      .pipe(map(docs => {
        docs.map(doc => {
          doc.type = 'RECEIPT';
        })
        return [...docs]
      }))
  }

  private findInvoices(_term: string): Observable<PayableHead[]> {
    const url = `${this.config.baseUrl}/documents/invoices`;
    return this.http.get<PayableHead[]>(url, { params: { 'term': _term } })
      .pipe(map(docs => {
        docs.map(doc => {
          doc.type = 'INVOICE';
        })
        return [...docs]
      }));
  }

  private findTickets(_term: string): Observable<PayableHead[]> {
    const url = `${this.config.baseUrl}/documents/tickets`;
    return this.http.get<PayableHead[]>(url, { params: { 'term': _term } })
      .pipe(map(docs => {
        docs.map(doc => {
          doc.type = 'TICKET';
        })
        return [...docs]
      }))
  }

}
