import { Injectable } from "@angular/core";
import Decimal from "decimal.js";
import {
  CalculatorConfig,
  CalculatorRequest,
  CalculatorResponse,
  Document,
  Item,
  Product,
  Tax,
  TaxEntry,
  TaxType,
  WorkspaceFlag,
} from "../model";
import { ConfigService } from "./config.service";
import { TaxService } from "./tax.service";
import { isChildItem, hasFlag } from "./utils.service";
import { WorkspaceService } from "./workspace.service";
import { HttpClient } from "@angular/common/http";
import { Observable, map } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class CalculatorService {
  calculatorConfig: CalculatorConfig = {
    netPriceScale: 4,
    itemTaxScale: 4,
    crossPriceScale: 4,
  };
  private workspaceFlags: number = 0;
  private workspaceOid: string;
  constructor(
    private http: HttpClient,
    private config: ConfigService,
    private workspaceService: WorkspaceService,
    private taxService: TaxService
  ) {
    this.workspaceService.currentWorkspace.subscribe((data) => {
      if (data) {
        this.workspaceFlags = data.flags;
        this.workspaceOid = data.oid;
      }
    });
    this.config
      .getSystemConfig<any>("org.efaps.pos.Calculator.Config")
      .subscribe({
        next: (value: any) => {
          if (value) {
            if (value.NetPriceScale) {
              this.calculatorConfig.netPriceScale = parseInt(
                value.NetPriceScale
              );
            }
            if (value.ItemTaxScale) {
              this.calculatorConfig.itemTaxScale = parseInt(value.ItemTaxScale);
            }
            if (value.CrossPriceScale) {
              this.calculatorConfig.crossPriceScale = parseInt(
                value.CrossPriceScale
              );
            }
          }
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  public calculate(calcReq: CalculatorRequest): Observable<CalculatorResponse> {
    const url = `${this.config.baseUrl}/workspaces/${this.workspaceOid}/calculator`;
    return this.http.post<CalculatorResponse>(url, calcReq);
  }

  public calculateDoc(document: Document): Observable<Document> {
    const positions = document.items.map((item) => {
      return {
        quantity: item.quantity,
        productOid: item.product.oid,
      };
    });
    return this.calculate({ positions: positions }).pipe(
      map((response) => {
        document.crossTotal = response.crossTotal;
        document.netTotal = response.netTotal;
        document.payableAmount = response.payableAmount;
        document.taxes = response.taxes;
        document.items.forEach((item, index) => {
          if (response.positions.length > index) {
            item.crossPrice = response.positions[index].crossPrice;
            item.crossUnitPrice = response.positions[index].crossUnitPrice;
            item.netPrice = response.positions[index].netPrice;
            item.netUnitPrice = response.positions[index].netUnitPrice;
            item.quantity = response.positions[index].quantity;
            item.taxes = response.positions[index].taxes;
          }
        });
        return document;
      })
    );
  }

  calculateItemNetPrice(item: Item): Decimal {
    return isChildItem(item)
      ? new Decimal(0)
      : this.evalNetPrice(
          new Decimal(item.quantity),
          new Decimal(item.product.netPrice)
        );
  }

  calculateItemCrossPrice(item: Item): Decimal {
    return isChildItem(item)
      ? new Decimal(0)
      : this.calculateCrossPrice(item.quantity, item.product);
  }

  calculateCrossPrice(qty: Decimal | number, product: Product): Decimal {
    let quantity: Decimal;
    if (qty instanceof Decimal) {
      quantity = qty;
    } else {
      quantity = new Decimal(qty);
    }
    const netUnitPrice = new Decimal(product.netPrice);
    const netPrice = this.evalNetPrice(quantity, netUnitPrice);
    const taxAmount = this.roundTaxAmount(
      this.taxService.calcTax(netPrice, quantity, ...product.taxes)
    );
    return this.evalCrossPrice(netPrice, taxAmount);
  }

  evalNetPrice(quantity: Decimal, netUnitPrice: Decimal): Decimal {
    return this.roundNetPrice(netUnitPrice.mul(quantity));
  }

  roundNetPrice(netPrice: Decimal) {
    return netPrice.toDecimalPlaces(
      this.calculatorConfig.netPriceScale,
      Decimal.ROUND_HALF_UP
    );
  }

  roundTaxAmount(taxAmount: Decimal) {
    return taxAmount.toDecimalPlaces(
      this.calculatorConfig.itemTaxScale,
      Decimal.ROUND_HALF_UP
    );
  }

  evalCrossPrice(netPrice: Decimal, taxAmount: Decimal) {
    return this.roundCrossPrice(netPrice.add(taxAmount));
  }

  roundCrossPrice(crossPrice: Decimal) {
    return crossPrice.toDecimalPlaces(
      this.calculatorConfig.crossPriceScale,
      Decimal.ROUND_HALF_UP
    );
  }

  calculateTotals(items: Item[]) {
    let netTotal = new Decimal(0);
    let crossTotal = new Decimal(0);
    let payableAmount = new Decimal(0);
    const taxes = new Map<string, Decimal>();

    items.forEach((item) => {
      const quantity = new Decimal(item.quantity);
      const netUnitPrice = isChildItem(item)
        ? new Decimal(0)
        : new Decimal(item.product.netPrice);
      const netPrice = isChildItem(item)
        ? new Decimal(0)
        : this.evalNetPrice(quantity, netUnitPrice);

      let itemTaxAmount = new Decimal(0);
      if (!isChildItem(item)) {
        item.product.taxes.forEach((tax: Tax) => {
          const taxAmount = this.taxService.calcTax(
            netPrice,
            new Decimal(item.quantity),
            tax
          );
          if (!taxes.has(tax.name)) {
            taxes.set(tax.name, new Decimal(0));
          }
          taxes.set(tax.name, taxes.get(tax.name).plus(taxAmount));
          itemTaxAmount = itemTaxAmount.plus(taxAmount);
        });
      }
      const taxAmount = this.roundTaxAmount(itemTaxAmount);
      const crossPrice = isChildItem(item)
        ? new Decimal(0)
        : this.evalCrossPrice(netPrice, taxAmount);

      netTotal = netTotal.plus(netPrice);
      crossTotal = crossTotal.plus(crossPrice);
    });

    netTotal = netTotal.toDecimalPlaces(2, Decimal.ROUND_HALF_UP);
    taxes.forEach((val, key) => {
      taxes.set(key, val.toDecimalPlaces(2, Decimal.ROUND_HALF_UP));
    });

    crossTotal = crossTotal.toDecimalPlaces(2, Decimal.ROUND_HALF_UP);

    if (hasFlag(this.workspaceFlags, WorkspaceFlag.roundPayableAmount)) {
      payableAmount = crossTotal.toDecimalPlaces(1, Decimal.ROUND_FLOOR);
    } else {
      payableAmount = crossTotal;
    }
    return {
      netTotal,
      taxes,
      crossTotal,
      payableAmount,
    };
  }

  getItemTaxEntries(item: Item): TaxEntry[] {
    if (isChildItem(item)) {
      return [];
    }
    const entries: TaxEntry[] = [];
    item.product.taxes.forEach((tax: Tax) => {
      const quantity = new Decimal(item.quantity);
      const netUnitPrice = new Decimal(item.product.netPrice);
      const netPrice = this.evalNetPrice(quantity, netUnitPrice);
      const taxAmount = this.taxService.calcTax(
        netPrice,
        new Decimal(item.quantity),
        tax
      );
      const base =
        TaxType.PERUNIT === tax.type ? item.quantity : netPrice.toNumber();
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

  getTotalTaxEntries(items: Item[]): TaxEntry[] {
    const taxValues: Map<string, TaxEntry> = new Map();
    items.forEach((item) => {
      this.getItemTaxEntries(item).forEach((taxEntry) => {
        if (!taxValues.has(taxEntry.tax.name)) {
          taxValues.set(taxEntry.tax.name, {
            tax: taxEntry.tax,
            base: 0,
            amount: 0,
            currency: item.currency,
            exchangeRate: item.exchangeRate,
          });
        }
        const currentEntry = taxValues.get(taxEntry.tax.name);
        currentEntry.amount = new Decimal(currentEntry.amount)
          .plus(new Decimal(taxEntry.amount))
          .toNumber();
        currentEntry.base = new Decimal(currentEntry.base)
          .plus(new Decimal(taxEntry.base))
          .toNumber();
        taxValues.set(taxEntry.tax.name, currentEntry);
      });
    });
    const taxEntries: TaxEntry[] = [];
    taxValues.forEach((entry, _key) => {
      entry.amount = new Decimal(entry.amount)
        .toDecimalPlaces(2, Decimal.ROUND_HALF_UP)
        .toNumber();
      entry.base = new Decimal(entry.base)
        .toDecimalPlaces(2, Decimal.ROUND_HALF_UP)
        .toNumber();
      taxEntries.push(entry);
    });
    return taxEntries;
  }
}
