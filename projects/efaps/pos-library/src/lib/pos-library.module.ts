import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { StompRService } from '@stomp/ng2-stompjs';

import { AdminGuard } from './guards/admin.guard';
import { AuthGuard } from './guards/auth.guard';
import { JwtInterceptor } from './interceptors/jwt.interceptor';
import { PosConfig } from './model';
import { PosCurrencyPipe } from './pipes/pos-currency.pipe';
import { SecurePipe } from './pipes/secure.pipe';
import { AdminService } from './services/admin.service';
import { AuthService } from './services/auth.service';
import { CollectService } from './services/collect.service';
import { CompanyService } from './services/company.service';
import { ConfigService } from './services/config.service';
import { DocumentService } from './services/document.service';
import { ImageService } from './services/image.service';
import { MsgService } from './services/msg.service';
import { PaymentService } from './services/payment.service';
import { PosConfigToken } from './services/pos-config.token';
import { PosService } from './services/pos.service';
import { ProductService } from './services/product.service';
import { SpotService } from './services/spot.service';
import { TaxService } from './services/tax.service';
import { UserService } from './services/user.service';
import { WorkspaceService } from './services/workspace.service';
import { BalanceService } from './services/balance.service';
import { DiscountService } from './services/discount.service';
import { InventoryService } from './services/inventory.service';
import { PrintService } from './services/print.service';
import { UtilsService } from './services/utils.service';

@NgModule({
  declarations: [
    PosCurrencyPipe,
    SecurePipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    PosCurrencyPipe,
    SecurePipe
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
        BalanceService,
        CollectService,
        CompanyService,
        DiscountService,
        DocumentService,
        ImageService,
        InventoryService,
        MsgService,
        PaymentService,
        PosService,
        PrintService,
        ProductService,
        SpotService,
        StompRService,
        TaxService,
        UserService,
        UtilsService,
        WorkspaceService,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: JwtInterceptor,
          multi: true
        },
      ],
    };
  }
}
