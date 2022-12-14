import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Decimal } from "decimal.js";
import { BehaviorSubject, Observable } from "rxjs";

import {
  Currency,
  DocItem,
  DocStatus,
  Item,
  Order,
  Pos,
  Tax,
  TaxEntry,
  TaxType,
  WorkspaceFlag,
} from "../model";
import { ConfigService } from "./config.service";
import { DocumentService } from "./document.service";
import { PartListService } from "./part-list.service";
import { TaxService } from "./tax.service";
import { hasFlag, WorkspaceService } from "./workspace.service";

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
  private workspaceFlags: number = 0;

  constructor(
    private http: HttpClient,
    private config: ConfigService,
    private workspaceService: WorkspaceService,
    private documentService: DocumentService,
    private taxService: TaxService,
    private partListService: PartListService
  ) {
    this.workspaceService.currentWorkspace.subscribe((data) => {
      if (data) {
        this.workspaceFlags = data.flags;
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
      (crossTotal) => (this.crossTotal = crossTotal)
    );
    this.currentPayableAmount.subscribe(
      (payableAmount) => (this.payableAmount = payableAmount)
    );
    this.currentCurrency.subscribe((currency) => (this.currency = currency));
    this.currentExchangeRate.subscribe(
      (exchangeRate) => (this.exchangeRate = exchangeRate)
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
        (item) => item.product.oid != order.discount.productOid
      );
      order.discount = null;
    }
    this.contactOid = order.contactOid;
    this.orderSource.next(order);
    const items: Item[] = [];
    order.items
      .sort((a, b) => (a.index < b.index ? -1 : 1))
      .forEach((_item) => {
        items.push({
          product: _item.product,
          quantity: _item.quantity,
          price: _item.crossPrice,
          currency: this.currency,
          exchangeRate: this.exchangeRate,
          remark: _item.remark,
        });
      });
    this.changeTicket(items);
  }

  public setMultiplier(multiplier: number) {
    this.multiplierSource.next(multiplier);
  }

  changeTicket(ticket: Item[]) {
    this.partListService.updateTicket(ticket).subscribe({
      next: (ticket) => {
        this.calculateItems(ticket);
        this.calculateTotals(ticket);
        this.ticketSource.next(ticket);
      },
    });
  }

  private calculateItems(ticket: Item[]) {
    ticket.forEach((item: Item) => {
      item.price = this.calculateItemCrossPrice(item).toNumber();
    });
  }

  private calculateItemCrossPrice(item: Item): Decimal {
    //NetPricePlusTax is activated
    if (true) {
      let taxAmount = new Decimal(0);
      const netUnitPrice = new Decimal(item.product.netPrice);
      const quantity = new Decimal(item.quantity);
      const netPrice = netUnitPrice.mul(quantity);
      item.product.taxes.forEach((tax) => {
        taxAmount = taxAmount.add(
          this.taxService
            .calcTax(netPrice, quantity, tax)
            .toDecimalPlaces(2, Decimal.ROUND_HALF_UP)
        );
      });
      return netPrice.add(taxAmount).toDecimalPlaces(2, Decimal.ROUND_HALF_UP);
    } else {
      if (item.product.taxes.some((tax) => tax.type === TaxType.PERUNIT)) {
        const net = new Decimal(item.product.netPrice).mul(
          new Decimal(item.quantity)
        );
        return net
          .add(
            this.taxService.calcTax(
              net,
              new Decimal(item.quantity),
              ...item.product.taxes
            )
          )
          .toDecimalPlaces(2, Decimal.ROUND_HALF_UP);
      }
      return new Decimal(item.product.crossPrice)
        .mul(new Decimal(item.quantity))
        .toDecimalPlaces(2, Decimal.ROUND_HALF_UP);
    }
  }

  protected calculateTotals(items: Item[]) {
    let net = new Decimal(0);
    let cross = new Decimal(0);
    let payable = new Decimal(0);
    const taxes = new Map<string, Decimal>();
    items.forEach((item) => {
      const itemNet = new Decimal(item.product.netPrice).mul(
        new Decimal(item.quantity)
      );
      net = net.plus(itemNet);
      cross = cross.plus(itemNet);
      item.product.taxes.forEach((tax: Tax) => {
        const taxAmount = this.taxService
          .calcTax(itemNet, new Decimal(item.quantity), tax)
          .toDecimalPlaces(2, Decimal.ROUND_HALF_UP);
        if (!taxes.has(tax.name)) {
          taxes.set(tax.name, new Decimal(0));
        }
        taxes.set(tax.name, taxes.get(tax.name).plus(taxAmount));
        cross = cross.plus(taxAmount);
      });
    });
    this.netTotalSource.next(
      net.toDecimalPlaces(2, Decimal.ROUND_HALF_UP).toNumber()
    );
    cross = cross.toDecimalPlaces(2, Decimal.ROUND_HALF_UP)
    this.crossTotalSource.next(
      cross.toNumber()
    );

    if (hasFlag(this.workspaceFlags, WorkspaceFlag.roundPayableAmount)) {
        let roundedCross = cross.toDecimalPlaces(1, Decimal.ROUND_FLOOR)
        this.payableAmountSource.next(
          roundedCross.toNumber()
        );
    } else {
      this.payableAmountSource.next(
        cross.toNumber()
      );
    }

    const taxesNum = new Map<string, number>();
    taxes.forEach((val, key) => {
      taxesNum.set(
        key,
        val.toDecimalPlaces(2, Decimal.ROUND_HALF_UP).toNumber()
      );
    });
    this.taxesSource.next(taxesNum);
  }

  public createOrder(): Observable<Order> {
    return this.documentService.createOrder({
      id: null,
      oid: null,
      number: null,
      currency: this.currency,
      exchangeRate: this.exchangeRate,
      items: this.getDocItems(),
      status: DocStatus.OPEN,
      netTotal: this.netTotal,
      crossTotal: this.crossTotal,
      payableAmount: this.crossTotal,
      taxes: this.getTaxEntries(),
      discount: null,
      payableOid: null,
      contactOid: this.contactOid,
    });
  }

  private getDocItems(): DocItem[] {
    return this.ticket.map(
      (item, index) =>
        <DocItem>{
          index: index + 1,
          product: item.product,
          quantity: item.quantity,
          netUnitPrice: item.product.netPrice,
          netPrice: new Decimal(item.product.netPrice)
            .mul(new Decimal(item.quantity))
            .toDecimalPlaces(2, Decimal.ROUND_HALF_UP)
            .toNumber(),
          crossUnitPrice: item.product.crossPrice,
          crossPrice: item.price,
          remark: item.remark,
          taxes: this.getItemTaxEntries(item),
        }
    );
  }

  private getItemTaxEntries(item: Item): TaxEntry[] {
    const entries: TaxEntry[] = [];
    item.product.taxes.forEach((tax: Tax) => {
      const itemNet = new Decimal(item.product.netPrice).mul(
        new Decimal(item.quantity)
      );
      const taxAmount = this.taxService.calcTax(
        itemNet,
        new Decimal(item.quantity),
        tax
      );
      const base =
        TaxType.PERUNIT === tax.type ? item.quantity : itemNet.toNumber();
      entries.push({
        tax: tax,
        base: base,
        amount: taxAmount.toNumber(),
        currency: item.currency,
        exchangeRate: item.exchangeRate,
      });
    });
    return entries;
  }

  private getTaxEntries(): TaxEntry[] {
    const taxEntries: TaxEntry[] = [];
    const taxValues: Map<string, TaxEntry> = new Map();
    this.getDocItems().forEach((item) => {
      item.taxes.forEach((taxEntry) => {
        if (!taxValues.has(taxEntry.tax.name)) {
          taxValues.set(taxEntry.tax.name, {
            tax: taxEntry.tax,
            base: 0,
            amount: 0,
            currency: item.currency,
            exchangeRate: item.exchangeRate,
          });
        }
        const ce = taxValues.get(taxEntry.tax.name);
        ce.amount = new Decimal(ce.amount)
          .plus(new Decimal(taxEntry.amount))
          .toDecimalPlaces(2, Decimal.ROUND_HALF_UP)
          .toNumber();
        ce.base = new Decimal(ce.base)
          .plus(new Decimal(taxEntry.base))
          .toDecimalPlaces(2, Decimal.ROUND_HALF_UP)
          .toNumber();
        taxValues.set(taxEntry.tax.name, ce);
      });
    });
    taxValues.forEach((_value, _key) => {
      taxEntries.push(_value);
    });
    return taxEntries;
  }

  public updateOrder(_order: Order): Observable<Order> {
    return this.documentService.updateOrder(
      Object.assign(_order, {
        items: this.getDocItems(),
        netTotal: this.netTotal,
        crossTotal: this.crossTotal,
        payableAmount: this.payableAmount,
        taxes: this.getTaxEntries(),
      })
    );
  }

  public calculateOrder(order: Order): Order {
    const docItems = this.ticket.map(
      (item, index) =>
        <DocItem>{
          index: order.items[index].index,
          product: item.product,
          quantity: item.quantity,
          netUnitPrice: item.product.netPrice,
          netPrice: new Decimal(item.product.netPrice)
            .mul(new Decimal(item.quantity))
            .toDecimalPlaces(2, Decimal.ROUND_HALF_UP)
            .toNumber(),
          crossUnitPrice: item.product.crossPrice,
          crossPrice: item.price,
          taxes: this.getItemTaxEntries(item),
        }
    );
    return Object.assign(order, {
      items: docItems,
      netTotal: this.netTotal,
      crossTotal: this.crossTotal,
      payableAmount: this.payableAmount,
      taxes: this.getTaxEntries(),
    });
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
}
