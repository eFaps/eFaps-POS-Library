import { Pipe, PipeTransform, Injectable } from "@angular/core";
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

  transform(_value: number, _currency: string): any {
    return (
      this.utilsService.getCurrencySymbol(_currency) +
      this.utilsService.toString(_value)
    );
  }
}
