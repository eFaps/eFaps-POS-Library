import { Injectable, Pipe, PipeTransform } from "@angular/core";

import { Currency } from "../model";
import { UtilsService } from "../services/utils.service";

@Injectable({
  providedIn: "root",
  deps: [UtilsService],
})
@Pipe({
  name: "posCurrency",
  standalone: false,
})
export class PosCurrencyPipe implements PipeTransform {
  constructor(private utilsService: UtilsService) {}

  transform(value: number | undefined, currency: Currency): any {
    return (
      this.utilsService.getCurrencySymbol(Currency[currency]) +
      this.utilsService.toString(value)
    );
  }
}
