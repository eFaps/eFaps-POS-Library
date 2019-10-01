import { InjectionToken } from '@angular/core';
import { PosConfig } from '../model';

export const PosConfigToken = new InjectionToken<PosConfig>(
  'PosConfigToken'
);
