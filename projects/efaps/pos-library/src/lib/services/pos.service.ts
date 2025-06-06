import { HttpClient } from "@angular/common/http";
import { Injectable, signal } from "@angular/core";
import { BehaviorSubject, Observable, map, switchMap } from "rxjs";

import {
  CalculatorRequest,
  CalculatorResponse,
  Currency,
  DocItem,
  DocStatus,
  EmployeeRelation,
  EmployeeRelationType,
  Item,
  Order,
  Pos,
  PromoInfo,
} from "../model";
import { CalculatorService } from "./calculator.service";
import { ConfigService } from "./config.service";
import { DocumentService } from "./document.service";
import { PartListService } from "./part-list.service";
import { TaxService } from "./tax.service";
import { WorkspaceService } from "./workspace.service";

@Injectable({
  providedIn: "root",
  deps: [
    HttpClient,
    ConfigService,
    WorkspaceService,
    DocumentService,
    TaxService,
  ],
})
export class PosService {
  private order: Order = null;
  private orderSource = new BehaviorSubject<Order>(this.order);
  currentOrder = this.orderSource.asObservable();

  private ticket: Item[] = [];
  private ticketSource = new BehaviorSubject<Item[]>(this.ticket);
  currentTicket = this.ticketSource.asObservable();

  private netTotal = 0;
  private netTotalSource = new BehaviorSubject<number>(this.netTotal);
  currentNetTotal = this.netTotalSource.asObservable();

  private taxes: Map<string, number> = new Map();
  private taxesSource = new BehaviorSubject<Map<string, number>>(this.taxes);
  currentTaxes = this.taxesSource.asObservable();

  private crossTotal = 0;
  private crossTotalSource = new BehaviorSubject<number>(this.crossTotal);
  currentCrossTotal = this.crossTotalSource.asObservable();

  private payableAmount = 0;
  private payableAmountSource = new BehaviorSubject<number>(this.payableAmount);
  currentPayableAmount = this.payableAmountSource.asObservable();

  public promotionInfo = signal<PromoInfo | null>(null);

  public currency = Currency.USD;
  private currencySource = new BehaviorSubject<Currency>(this.currency);
  currentCurrency = this.currencySource.asObservable();

  public exchangeRate = 1;
  private exchangeRateSource = new BehaviorSubject<number>(this.exchangeRate);
  currentExchangeRate = this.exchangeRateSource.asObservable();

  private _multiplier: number = 1;
  private multiplierSource = new BehaviorSubject<number>(this._multiplier);
  multiplier = this.multiplierSource.asObservable();

  private currentPos: Pos;

  private _contactOid: string | null;

  private employeeRelations: EmployeeRelation[] | undefined;

  public shoutOut: string | undefined;

  constructor(
    private http: HttpClient,
    private config: ConfigService,
    private workspaceService: WorkspaceService,
    private documentService: DocumentService,
    private partListService: PartListService,
    private calculatorService: CalculatorService,
  ) {
    this.workspaceService.currentWorkspace.subscribe((data) => {
      if (data) {
        if (!(this.currentPos && this.currentPos.oid === data.posOid)) {
          this.getPos(data.posOid).subscribe((_pos) => {
            this.currentPos = _pos;
            this.currencySource.next(_pos.currency);
          });
          this.changeTicket([]);
        }
      }
    });
    this.currentTicket.subscribe((_ticket) => (this.ticket = _ticket));
    this.currentNetTotal.subscribe((netTotal) => (this.netTotal = netTotal));
    this.currentCrossTotal.subscribe(
      (crossTotal) => (this.crossTotal = crossTotal),
    );
    this.currentPayableAmount.subscribe(
      (payableAmount) => (this.payableAmount = payableAmount),
    );
    this.currentCurrency.subscribe((currency) => (this.currency = currency));
    this.currentExchangeRate.subscribe(
      (exchangeRate) => (this.exchangeRate = exchangeRate),
    );
    this.multiplier.subscribe({
      next: (multiplier) => (this._multiplier = multiplier),
    });
  }

  public getPoss(): Observable<Pos[]> {
    const url = `${this.config.baseUrl}/poss`;
    return this.http.get<Pos[]>(url);
  }

  public getPos(_oid: string): Observable<Pos> {
    const url = `${this.config.baseUrl}/poss/${_oid}`;
    return this.http.get<Pos>(url);
  }

  public setOrder(order: Order) {
    if (order.discount) {
      order.items = order.items.filter(
        (item) => item.product.oid != order.discount.productOid,
      );
      order.discount = null;
    }
    this.contactOid = order.contactOid;
    this.shoutOut = order.shoutout;
    this.orderSource.next(order);
    const items: Item[] = [];
    order.items
      .sort((a, b) => (a.index < b.index ? -1 : 1))
      .forEach((docItem) => {
        items.push({
          index: docItem.index,
          parentIdx: docItem.parentIdx,
          product: docItem.product,
          standIn: docItem.standIn,
          quantity: docItem.quantity,
          price: docItem.crossPrice,
          currency: this.currency,
          exchangeRate: this.exchangeRate,
          remark: docItem.remark,
        });
      });
    this.changeTicket(items);
  }

  public setMultiplier(multiplier: number) {
    this.multiplierSource.next(multiplier);
  }

  changeTicket(ticket: Item[]) {
    if (ticket.length == 0) {
      this.netTotalSource.next(0);
      this.crossTotalSource.next(0);
      this.payableAmountSource.next(0);
      this.taxesSource.next(new Map<string, number>());
      this.ticketSource.next(ticket);
    } else {
      this.partListService.updateTicket(ticket).subscribe({
        next: (ticket) => {
          this.calculatorService.calculate(this.calcReq(ticket)).subscribe({
            next: (calcResp) => {
              this.updateTotals(calcResp);
              this.updateTicket(ticket, calcResp);
              this.promotionInfo.set(calcResp.promotionInfo);
            },
          });
        },
      });
    }
  }

  private updateTicket(ticket: Item[], calcResp: CalculatorResponse) {
    for (let index = 0; index < ticket.length; index++) {
      const item = ticket[index];
      const position = calcResp.positions[index];
      item.price = position.crossPrice;
    }
    this.ticketSource.next(ticket);
  }

  private updateTotals(calcResp: CalculatorResponse) {
    this.netTotalSource.next(calcResp.netTotal);
    this.crossTotalSource.next(calcResp.crossTotal);
    this.payableAmountSource.next(calcResp.payableAmount);

    const taxesNum = new Map<string, number>();
    calcResp.taxes.forEach((entry) => {
      taxesNum.set(entry.tax.name, entry.amount);
    });
    this.taxesSource.next(taxesNum);
  }

  public createOrder(): Observable<Order> {
    return this.calculatorService.calculate(this.calcReq()).pipe(
      switchMap((calcResp) => {
        return this.documentService.createOrder({
          id: null,
          oid: null,
          number: null,
          currency: this.currency,
          exchangeRate: this.exchangeRate,
          items: this.toDocItems(calcResp),
          status: DocStatus.OPEN,
          netTotal: calcResp.netTotal,
          crossTotal: calcResp.crossTotal,
          payableAmount: calcResp.payableAmount,
          taxes: calcResp.taxes,
          discount: null,
          payableOid: null,
          contactOid: this.contactOid,
          employeeRelations: this.employeeRelations,
          shoutout: this.shoutOut,
        });
      }),
    );
  }

  private calcReq(items?: Item[]): CalculatorRequest {
    let itemsToMap: Item[];
    if (items == undefined) {
      itemsToMap = this.ticket;
    } else {
      itemsToMap = items;
    }
    return {
      positions: itemsToMap.map((item) => {
        return {
          quantity: item.quantity,
          productOid: item.product.oid,
        };
      }),
    };
  }

  private toDocItems(calcResp: CalculatorResponse): DocItem[] {
    const docItems = new Array<DocItem>();
    for (let index = 0; index < this.ticket.length; index++) {
      const item = this.ticket[index];
      const position = calcResp.positions[index];
      item.price = position.crossPrice;
      docItems.push(<DocItem>{
        index: item.index,
        parentIdx: item.parentIdx,
        product: item.product,
        standIn: item.standIn,
        quantity: item.quantity,
        netUnitPrice: position.netUnitPrice,
        netPrice: position.netPrice,
        crossUnitPrice: position.crossUnitPrice,
        crossPrice: position.crossPrice,
        remark: item.remark,
        taxes: position.taxes,
      });
    }
    return docItems;
  }

  public updateOrder(order: Order): Observable<Order> {
    return this.calculatorService.calculate(this.calcReq()).pipe(
      switchMap((calcResp) => {
        return this.documentService.updateOrder(
          Object.assign(order, {
            items: this.toDocItems(calcResp),
            netTotal: calcResp.netTotal,
            crossTotal: calcResp.crossTotal,
            payableAmount: calcResp.payableAmount,
            taxes: calcResp.taxes,
            employeeRelations: this.employeeRelations,
            shoutout: this.shoutOut,
            contactOid: this.contactOid,
          }),
        );
      }),
    );
  }

  public calculateOrder(order: Order): Observable<Order> {
    return this.calculatorService.calculate(this.calcReq()).pipe(
      map((calcResp) => {
        return Object.assign(order, {
          items: this.toDocItems(calcResp),
          netTotal: calcResp.netTotal,
          crossTotal: calcResp.crossTotal,
          payableAmount: calcResp.payableAmount,
          taxes: calcResp.taxes,
          employeeRelations: this.employeeRelations,
          shoutout: this.shoutOut,
          contactOid: this.contactOid,
        });
      }),
    );
  }

  public reset() {
    this.changeTicket([]);
    this.orderSource.next(null);
  }

  public set contactOid(contactOid: string | null) {
    this._contactOid = contactOid;
  }

  public get contactOid(): string | null {
    return this._contactOid;
  }

  public addEmployeeRelation(relation: EmployeeRelation) {
    if (this.employeeRelations == null) {
      this.employeeRelations = [];
    }
    this.employeeRelations.push(relation);
  }

  public removeEmployeeRelation(relation: EmployeeRelation) {
    if (this.employeeRelations) {
      const index = this.employeeRelations.findIndex((object) => {
        return (
          object.employeeOid === relation.employeeOid &&
          object.type == relation.type
        );
      });
      if (index !== -1) {
        this.employeeRelations.splice(index, 1);
      }
      if (this.employeeRelations.length == 0) {
        this.employeeRelations = undefined;
      }
    }
  }

  public removeEmployeeRelationsByType(relationType: EmployeeRelationType) {
    if (this.employeeRelations) {
      this.employeeRelations = this.employeeRelations.filter(
        (object) => object.type != relationType,
      );
      if (this.employeeRelations.length == 0) {
        this.employeeRelations = undefined;
      }
    }
  }
}
