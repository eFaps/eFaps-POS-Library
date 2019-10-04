import { Inject, Injectable } from '@angular/core';

import { PosConfig } from '../model';
import { PosConfigToken } from './pos-config.token';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  public baseUrl: string;
  public defaultProdImg: string;
  private _socketUrl: string;
  
  constructor(@Inject(PosConfigToken) config: PosConfig) {
    this.baseUrl = config.baseUrl;
    this._socketUrl = config.socketUrl;
    this.defaultProdImg = config.defaultProdImg;
  }

  get socketUrl() {
    //absolute path is given
    if (this._socketUrl.startsWith('ws')) {
      return this._socketUrl;
    } else {
      return `ws:///${window.location.host}${this._socketUrl}`;
    }
  }
}
