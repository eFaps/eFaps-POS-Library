import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, merge } from "rxjs";
import { map, catchError } from "rxjs/operators";

import {
  Balance,
  CreditNote,
  Invoice,
  Order,
  Payable,
  PayableHead,
  Receipt,
  Ticket,
} from "../model";
import { ConfigService } from "./config.service";
import { WorkspaceService } from "./workspace.service";

@Injectable({
  providedIn: "root",
  deps: [HttpClient, ConfigService, WorkspaceService],
})
export class DocumentService {
  private wsoid: string;

  constructor(
    private http: HttpClient,
    private config: ConfigService,
    workspaceService: WorkspaceService
  ) {
    workspaceService.currentWorkspace.subscribe((_ws) => {
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

  public createCreditNote(creditNote: CreditNote): Observable<CreditNote> {
    const url = `${this.config.baseUrl}/workspaces/${this.wsoid}/documents/creditnotes`;
    return this.http.post<CreditNote>(url, creditNote);
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
    return this.http.get<Order[]>(url, { params: { status: "OPEN" } });
  }

  public findOrders(_term: string): Observable<Order[]> {
    const url = `${this.config.baseUrl}/documents/orders`;
    return this.http.get<Order[]>(url, { params: { term: _term } });
  }

  public getOrders4Spots(): Observable<Order[]> {
    const url = `${this.config.baseUrl}/documents/orders`;
    return this.http.get<Order[]>(url, { params: { spot: "true" } });
  }

  public getReceipt(id: string): Observable<Receipt> {
    const url = `${this.config.baseUrl}/documents/receipts/${id}`;
    return this.http.get<Receipt>(url).pipe(
      map((doc) => {
        doc.type = "RECEIPT";
        return doc;
      })
    );
  }

  public getInvoice(id: string): Observable<Invoice> {
    const url = `${this.config.baseUrl}/documents/invoices/${id}`;
    return this.http.get<Invoice>(url).pipe(
      map((doc) => {
        doc.type = "INVOICE";
        return doc;
      })
    );
  }

  public getTicket(id: string): Observable<Ticket> {
    const url = `${this.config.baseUrl}/documents/tickets/${id}`;
    return this.http.get<Ticket>(url).pipe(
      map((doc) => {
        doc.type = "TICKET";
        return doc;
      })
    );
  }

  public getCreditNote(id: string): Observable<CreditNote> {
    const url = `${this.config.baseUrl}/documents/creditnotes/${id}`;
    return this.http.get<CreditNote>(url).pipe(
      map((doc) => {
        doc.type = "CREDITNOTE";
        return doc;
      })
    );
  }

  public getCreditNotes4SourceDocument(
    sourceDocOid: string
  ): Observable<CreditNote[]> {
    const url = `${this.config.baseUrl}/documents/creditnotes`;
    return this.http
      .get<CreditNote[]>(url, { params: { sourceDocOid: sourceDocOid } })
      .pipe(
        map((docs) => {
          docs.map((doc) => {
            doc.type = "CREDITNOTE";
          });
          return [...docs];
        })
      );
  }

  public getPayableByIdent(ident: string): Observable<Payable> {
    return merge(this.getReceiptsByIdent(ident), this.getInvoiceByIdent(ident));
  }

  private getReceiptsByIdent(ident: string): Observable<Receipt> {
    const url = `${this.config.baseUrl}/documents/receipts`;
    return this.http.get<Receipt>(url, { params: { ident } }).pipe(
      map((doc) => {
        doc.type = "RECEIPT";
        return doc;
      }),
      catchError((error) => {
        return new Observable<Receipt>((observer) => {
          observer.error;
        });
      })
    );
  }

  private getInvoiceByIdent(ident: string): Observable<Invoice> {
    const url = `${this.config.baseUrl}/documents/invoices`;
    return this.http.get<Invoice>(url, { params: { ident } }).pipe(
      map((doc) => {
        doc.type = "INVOICE";
        return doc;
      }),
      catchError((error) => {
        return new Observable<Invoice>((observer) => {
          observer.error;
        });
      })
    );
  }

  public getDocuments4Balance(_balance: Balance): Observable<PayableHead[]> {
    return merge(
      this.getReceipts4Balance(_balance),
      this.getInvoices4Balance(_balance),
      this.getTickets4Balance(_balance),
      this.getCreditNotes4Balance(_balance)
    );
  }

  private getReceipts4Balance(_balance: Balance): Observable<PayableHead[]> {
    const url = `${this.config.baseUrl}/documents/receipts`;
    const balanceOid = _balance.oid ? _balance.oid : _balance.id;
    return this.http.get<Receipt[]>(url, { params: { balanceOid } }).pipe(
      map((docs) => {
        docs.map((doc) => {
          doc.type = "RECEIPT";
        });
        return [...docs];
      })
    );
  }

  private getInvoices4Balance(_balance: Balance): Observable<PayableHead[]> {
    const url = `${this.config.baseUrl}/documents/invoices`;
    const balanceOid = _balance.oid ? _balance.oid : _balance.id;
    return this.http.get<Invoice[]>(url, { params: { balanceOid } }).pipe(
      map((docs) => {
        docs.map((doc) => {
          doc.type = "INVOICE";
        });
        return [...docs];
      })
    );
  }

  private getTickets4Balance(_balance: Balance): Observable<PayableHead[]> {
    const url = `${this.config.baseUrl}/documents/tickets`;
    const balanceOid = _balance.oid ? _balance.oid : _balance.id;
    return this.http.get<Ticket[]>(url, { params: { balanceOid } }).pipe(
      map((docs) => {
        docs.map((doc) => {
          doc.type = "TICKET";
        });
        return [...docs];
      })
    );
  }

  private getCreditNotes4Balance(_balance: Balance): Observable<PayableHead[]> {
    const url = `${this.config.baseUrl}/documents/creditnotes`;
    const balanceOid = _balance.oid ? _balance.oid : _balance.id;
    return this.http.get<CreditNote[]>(url, { params: { balanceOid } }).pipe(
      map((docs) => {
        docs.map((doc) => {
          doc.type = "CREDITNOTE";
        });
        return [...docs];
      })
    );
  }

  public findPayables(_term: string): Observable<PayableHead[]> {
    return merge(
      this.findReceipts(_term),
      this.findInvoices(_term),
      this.findTickets(_term),
      this.findCreditNotes(_term)
    );
  }

  private findReceipts(_term: string): Observable<PayableHead[]> {
    const url = `${this.config.baseUrl}/documents/receipts`;
    return this.http.get<PayableHead[]>(url, { params: { term: _term } }).pipe(
      map((docs) => {
        docs.map((doc) => {
          doc.type = "RECEIPT";
        });
        return [...docs];
      })
    );
  }

  private findInvoices(_term: string): Observable<PayableHead[]> {
    const url = `${this.config.baseUrl}/documents/invoices`;
    return this.http.get<PayableHead[]>(url, { params: { term: _term } }).pipe(
      map((docs) => {
        docs.map((doc) => {
          doc.type = "INVOICE";
        });
        return [...docs];
      })
    );
  }

  private findTickets(_term: string): Observable<PayableHead[]> {
    const url = `${this.config.baseUrl}/documents/tickets`;
    return this.http.get<PayableHead[]>(url, { params: { term: _term } }).pipe(
      map((docs) => {
        docs.map((doc) => {
          doc.type = "TICKET";
        });
        return [...docs];
      })
    );
  }

  private findCreditNotes(_term: string): Observable<PayableHead[]> {
    const url = `${this.config.baseUrl}/documents/creditnotes`;
    return this.http.get<PayableHead[]>(url, { params: { term: _term } }).pipe(
      map((docs) => {
        docs.map((doc) => {
          doc.type = "CREDITNOTE";
        });
        return [...docs];
      })
    );
  }
}
