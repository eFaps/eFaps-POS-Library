import { getCurrencySymbol, registerLocaleData } from "@angular/common";
import localeEsPE from "@angular/common/locales/es-PE";
import { Injectable } from "@angular/core";
import parseDecimalNumber from "parse-decimal-number";

@Injectable({
  providedIn: "root"
})
export class UtilsService {
  constructor() {
    registerLocaleData(localeEsPE);
  }

  parse(numberStr: string): number {
    const customSeparators = { thousands: ",", decimal: "." };
    return parseDecimalNumber(numberStr, customSeparators);
  }

  toString(number: number): string {
    if (number || number === 0) {
      return number.toLocaleString("es-PE", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
    }
    return "";
  }

  getCurrencySymbol(isoCode: string) {
    return getCurrencySymbol(isoCode, "narrow", "es-PE");
  }
}
