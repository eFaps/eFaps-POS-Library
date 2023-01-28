import { Injectable } from "@angular/core";
import { Decimal } from "decimal.js";

import {
  Currency,
  Discount,
  DiscountType,
  DocItem,
  Document,
  Order,
  Product,
  ProductType,
  TaxType,
  WorkspaceFlag,
} from "../model";
import { DocumentService } from "./document.service";
import { TaxService } from "./tax.service";
import { hasFlag, WorkspaceService } from "./workspace.service";

@Injectable({
  providedIn: "root",
  deps: [TaxService, DocumentService],
})
export class DiscountService {
  private workspaceFlags: number = 0;

  constructor(
    private taxService: TaxService,
    private documentService: DocumentService,
    workspaceService: WorkspaceService
  ) {
    workspaceService.currentWorkspace.subscribe((data) => {
      if (data) {
        this.workspaceFlags = data.flags;
      }
    });
  }

  applyDiscount(order: Order, discount: Discount | null): Document {
    if (order.discount) {
      order.items = order.items.filter(
        (item) => item.product.oid != order.discount.productOid
      );
      order.discount = null;
      this.recalculate(order);
    }

    if (discount && discount.type === DiscountType.PERCENT) {
      order = this.applyPercent(order, discount);
    }
    if (discount && discount.type === DiscountType.AMOUNT) {
      order = this.applyAmount(order, discount);
    }
    this.documentService.updateOrder(this.recalculate(order)).subscribe();
    return order;
  }

  private applyAmount(order: Order, discount: Discount): Order {
    const targetCross = new Decimal(order.crossTotal).minus(
      new Decimal(discount.value)
    );
    const percentage = new Decimal(100).mul(
      new Decimal(1).minus(targetCross.dividedBy(new Decimal(order.crossTotal)))
    );

    order = this.applyPercent(order, {
      ...discount,
      value: percentage.toNumber(),
    });
    order.discount = discount;
    return order;
  }

  private applyPercent(order: Order, discount: Discount): Order {
    const factor = new Decimal(discount.value).div(new Decimal(100));

    const net = new Decimal(order.netTotal)
      .mul(factor)
      .toDecimalPlaces(2, Decimal.ROUND_HALF_UP)
      .neg();
    const adValoremTaxtotal = this.taxService.calcTaxTotal4Document(
      order,
      TaxType.ADVALOREM
    );
    const cross = new Decimal(order.netTotal)
      .add(adValoremTaxtotal)
      .mul(factor)
      .toDecimalPlaces(2, Decimal.ROUND_HALF_UP)
      .neg();
    const item: DocItem = {
      index: order.items.length + 1,
      product: this.getDiscountProduct(discount, order.currency),
      quantity: 1,
      netPrice: net.toNumber(),
      netUnitPrice: net.toNumber(),
      crossPrice: cross.toNumber(),
      crossUnitPrice: cross.toNumber(),
      currency: order.currency,
      exchangeRate: order.exchangeRate,
      taxes: [],
    };

    order.taxes.forEach((taxEntry) => {
      switch (taxEntry.tax.type) {
        case TaxType.PERUNIT:
          break;
        case TaxType.ADVALOREM:
          const base = new Decimal(taxEntry.base)
            .mul(factor)
            .neg()
            .toDecimalPlaces(2, Decimal.ROUND_HALF_UP);
          const amount = new Decimal(taxEntry.amount)
            .mul(factor)
            .neg()
            .toDecimalPlaces(2, Decimal.ROUND_HALF_UP);
          item.taxes.push({
            tax: taxEntry.tax,
            base: base.toNumber(),
            amount: amount.toNumber(),
            currency: taxEntry.currency,
            exchangeRate: taxEntry.exchangeRate,
          });
          break;
      }
    });
    order.items.push(item);
    order.discount = discount;
    return order;
  }

  private recalculate(order: Order): Order {
    let crossTotal = new Decimal(0);
    let netTotal = new Decimal(0);
    order.items.forEach((item) => {
      crossTotal = crossTotal.plus(new Decimal(item.crossPrice));
      netTotal = netTotal.plus(new Decimal(item.netPrice));
    });
    order.taxes = this.taxService.calcTax4Document(order);
    order.crossTotal = netTotal
      .plus(this.taxService.calcTaxTotal4Document(order))
      .toDecimalPlaces(2, Decimal.ROUND_HALF_UP)
      .toNumber();
    order.netTotal = netTotal
      .toDecimalPlaces(2, Decimal.ROUND_HALF_UP)
      .toNumber();

    if (hasFlag(this.workspaceFlags, WorkspaceFlag.roundPayableAmount)) {
      let roundedCross = new Decimal(order.crossTotal).toDecimalPlaces(
        1,
        Decimal.ROUND_FLOOR
      );
      order.payableAmount = roundedCross.toNumber();
    } else {
      order.payableAmount = order.crossTotal;
    }
    return order;
  }

  private getDiscountProduct(discount: Discount, currency: Currency): Product {
    return {
      oid: discount.productOid,
      sku: "",
      type: ProductType.TEXT,
      description: "Descuento",
      note: null,
      imageOid: "",
      netPrice: 0,
      crossPrice: 0,
      currency: currency,
      categories: [],
      taxes: [],
      relations: [],
      indicationSets: [],
      barcodes: [],
    };
  }
}
