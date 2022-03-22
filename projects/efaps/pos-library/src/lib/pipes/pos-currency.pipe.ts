import { Injectable, Pipe, PipeTransform } from "@angular/core";

import { Currency } from "../model";
import { UtilsService } from "../services/utils.service";

@Injectable({
  providedIn: "root",
  deps: [UtilsService],
})
@Pipe({
  name: "posCurrency",
})
export class PosCurrencyPipe implements PipeTransform {
  constructor(private utilsService: UtilsService) {}

  transform(_value: number, currency: Currency): any {
    return (
      this.utilsService.getCurrencySymbol(Currency[currency]) +
      this.utilsService.toString(_value)
    );
  }
}
