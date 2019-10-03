import { Pipe, PipeTransform } from '@angular/core';

import { UtilsService } from './utils.service';

@Pipe({
  name: 'posCurrency'
})
export class PosCurrencyPipe implements PipeTransform {

  constructor(private utilsService: UtilsService) {
  }

  transform(_value: number, _currency: string): any {
    return this.utilsService.getCurrencySymbol(_currency) + this.utilsService.toString(_value);
  }
}
