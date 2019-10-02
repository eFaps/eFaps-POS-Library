import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ModuleWithProviders, NgModule } from '@angular/core';

import { PosConfig } from './model';
import { AdminGuard } from './services/admin.guard';
import { AdminService } from './services/admin.service';
import { AuthGuard } from './services/auth.guard';
import { AuthService } from './services/auth.service';
import { CollectService } from './services/collect.service';
import { ConfigService } from './services/config.service';
import { JwtInterceptor } from './services/jwt.interceptor';
import { PosConfigToken } from './services/pos-config.token';
import { UserService } from './services/user.service';

@NgModule({
  imports: [
    CommonModule
  ]
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
        },
        AdminGuard,
        AdminService,
        AuthGuard,
        AuthService,
        CollectService,
        UserService,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: JwtInterceptor,
          multi: true
        },
      ],
    };
  }
}
