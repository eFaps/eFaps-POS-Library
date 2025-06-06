import { registerLocaleData } from "@angular/common";
import localeEsPE from "@angular/common/locales/es-PE";
import { Injectable } from "@angular/core";
import {
  BOMGroupConfigFlag,
  ConfigurationBOMFlag,
  Flagged,
  Item,
  WorkspaceFlag,
} from "../model";

@Injectable({
  providedIn: "root",
})
export class UtilsService {
  private numberParser: NumberParser;
  constructor() {
    registerLocaleData(localeEsPE);
    this.numberParser = new NumberParser("es-PE");
  }

  parse(numberStr: string): number {
    return this.numberParser.parse(numberStr);
  }

  toString(number: number | undefined): string {
    if (number || number === 0) {
      return number.toLocaleString("es-PE", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    }
    return "";
  }

  getCurrencySymbol(isoCode: string) {
    return Intl.NumberFormat("es-PE", { style: "currency", currency: isoCode })
      .formatToParts()
      .find((part) => part.type === "currency").value;
  }
}

class NumberParser {
  private _group: RegExp;
  private _decimal: RegExp;
  private _numeral: RegExp;
  private _index: (d: any) => number;

  constructor(locale) {
    const parts = new Intl.NumberFormat(locale).formatToParts(12345.6);
    const numerals = [
      ...new Intl.NumberFormat(locale, { useGrouping: false }).format(
        9876543210,
      ),
    ].reverse();
    const index = new Map(numerals.map((d, i) => [d, i]));
    this._group = new RegExp(
      `[${parts.find((d) => d.type === "group").value}]`,
      "g",
    );
    this._decimal = new RegExp(
      `[${parts.find((d) => d.type === "decimal").value}]`,
    );
    this._numeral = new RegExp(`[${numerals.join("")}]`, "g");
    this._index = (d) => index.get(d);
  }

  parse(string): number {
    return (string = string
      .trim()
      .replace(this._group, "")
      .replace(this._decimal, ".")
      .replace(this._numeral, this._index))
      ? +string
      : NaN;
  }
}

export type Flags = WorkspaceFlag | BOMGroupConfigFlag | ConfigurationBOMFlag;

export function hasFlag(value: number | Flagged, flag: Flags) {
  let flags: number;
  if ("number" != typeof value) {
    flags = (value as Flagged).flags;
  } else {
    flags = value;
  }
  return flag === (flags & flag);
}

export function isChildItem(item: Item): boolean {
  return item.parentIdx != null;
}
