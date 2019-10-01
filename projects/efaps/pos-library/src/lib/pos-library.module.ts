import { ModuleWithProviders, NgModule } from '@angular/core';

import { PosConfig } from './model';
import { ConfigService } from './services/config.service';
import { PosConfigToken } from './services/pos-config.token';

@NgModule({
  declarations: [],
  imports: [],
  exports: []
})
export class PosLibraryModule {

  static forRoot(config: PosConfig): ModuleWithProviders {
    return {
      ngModule: PosLibraryModule,
      providers: [
        ConfigService,
        {
          provide: PosConfigToken,
          useValue: config
        }
      ]
    };
  }
}
