import { Inject, Injectable } from '@angular/core';

import { PosConfig } from '../model';
import { PosConfigToken } from './pos-config.token';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  public baseUrl: string;
  public socketUrl: string;

  constructor(@Inject(PosConfigToken) private config: PosConfig) {
    this.baseUrl = config.baseUrl;
    this.socketUrl = config.socketUrl;
  }
}
