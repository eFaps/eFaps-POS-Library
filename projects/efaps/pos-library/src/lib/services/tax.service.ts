import { Injectable } from "@angular/core";
import { Decimal } from "decimal.js";

import { Document, Tax, TaxEntry, TaxType } from "../model";

@Injectable({
  providedIn: "root"
})
export class TaxService {
  constructor() {}

  calcTax(net: Decimal, quantity: Decimal, ...taxes: Tax[]): Decimal {
    let amount = new Decimal(0);
    taxes.forEach(tax => {
      switch (tax.type) {
        case TaxType.PERUNIT:
          amount = amount.add(quantity.mul(new Decimal(tax.amount)));
          break;
        case TaxType.ADVALOREM:
          amount = amount.add(
            net.mul(new Decimal(tax.percent).div(new Decimal(100)))
          );
          break;
      }
    });
    return amount;
  }

  calcTax4Document(document: Document): TaxEntry[] {
    const taxEntries: TaxEntry[] = [];
    const taxValues: Map<string, TaxEntry> = new Map();
    document.items.forEach(_item => {
      _item.taxes.forEach(_taxEntry => {
        if (!taxValues.has(_taxEntry.tax.name)) {
          taxValues.set(_taxEntry.tax.name, {
            tax: _taxEntry.tax,
            base: 0,
            amount: 0
          });
        }
        const ce = taxValues.get(_taxEntry.tax.name);
        ce.amount = new Decimal(ce.amount)
          .plus(new Decimal(_taxEntry.amount))
          .toDecimalPlaces(2, Decimal.ROUND_HALF_UP)
          .toNumber();
        ce.base = new Decimal(ce.base)
          .plus(new Decimal(_taxEntry.base))
          .toDecimalPlaces(2, Decimal.ROUND_HALF_UP)
          .toNumber();
        taxValues.set(_taxEntry.tax.name, ce);
      });
    });
    taxValues.forEach((_value, _key) => {
      taxEntries.push(_value);
    });
    return taxEntries;
  }

  calcTaxTotal4Document(document: Document, ...types: TaxType[]): Decimal {
    let total = new Decimal(0);
    document.taxes.forEach(entry => {
      if (types.length == 0 || types.includes(entry.tax.type)) {
        total = total.plus(new Decimal(entry.amount));
      }
    });
    return total.toDecimalPlaces(2, Decimal.ROUND_HALF_UP);
  }
}
