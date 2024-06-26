import { CommonModule } from "@angular/common";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { ModuleWithProviders, NgModule } from "@angular/core";

import { CompanyInterceptor } from "./interceptors/company.interceptor";
import { JwtInterceptor } from "./interceptors/jwt.interceptor";
import { PosConfig } from "./model";
import { PosCurrencyPipe } from "./pipes/pos-currency.pipe";
import { SecurePipe } from "./pipes/secure.pipe";
import { EnquiryService, LoaderService } from "./services";
import { AdminService } from "./services/admin.service";
import { AuthService } from "./services/auth.service";
import { BalanceService } from "./services/balance.service";
import { CollectService } from "./services/collect.service";
import { CompanyService } from "./services/company.service";
import { ConfigService } from "./services/config.service";
import { ContactService } from "./services/contact.service";
import { DiscountService } from "./services/discount.service";
import { DocumentService } from "./services/document.service";
import { ImageService } from "./services/image.service";
import { InventoryService } from "./services/inventory.service";
import { MsgService } from "./services/msg.service";
import { PaymentService } from "./services/payment.service";
import { PosConfigToken } from "./services/pos-config.token";
import { PosService } from "./services/pos.service";
import { PrintService } from "./services/print.service";
import { ProductService } from "./services/product.service";
import { RxStompService } from "./services/rx-stomp.service";
import { SpotService } from "./services/spot.service";
import { TaxService } from "./services/tax.service";
import { UserService } from "./services/user.service";
import { UtilsService } from "./services/utils.service";
import { WorkspaceService } from "./services/workspace.service";

@NgModule({
  declarations: [PosCurrencyPipe, SecurePipe],
  imports: [CommonModule],
  exports: [PosCurrencyPipe, SecurePipe],
})
export class PosLibraryModule {
  static forRoot(config: PosConfig): ModuleWithProviders<PosLibraryModule> {
    return {
      ngModule: PosLibraryModule,
      providers: [
        {
          provide: PosConfigToken,
          useValue: config,
        },
        ConfigService,
        AdminService,
        AuthService,
        BalanceService,
        ContactService,
        CollectService,
        CompanyService,
        DiscountService,
        DocumentService,
        ImageService,
        EnquiryService,
        InventoryService,
        LoaderService,
        MsgService,
        PaymentService,
        PosService,
        PrintService,
        ProductService,
        SpotService,
        RxStompService,
        TaxService,
        UserService,
        UtilsService,
        WorkspaceService,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: JwtInterceptor,
          multi: true,
        },
        {
          provide: HTTP_INTERCEPTORS,
          useClass: CompanyInterceptor,
          multi: true,
        },
      ],
    };
  }
}
