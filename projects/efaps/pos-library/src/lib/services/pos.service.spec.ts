import { HttpClientTestingModule } from "@angular/common/http/testing";
import { Injectable } from "@angular/core";
import { TestBed, inject } from "@angular/core/testing";
import { Observable } from "rxjs";
import { Currency, Item, ProductType, TaxType } from "../model";

import { AuthService } from "./auth.service";
import { ConfigService } from "./config.service";
import { DocumentService } from "./document.service";
import { PosService } from "./pos.service";
import { TaxService } from "./tax.service";
import { WorkspaceService } from "./workspace.service";

class AuthServiceStub {
  currentEvent = new Observable((observer) => {
    observer.next("nothing");
  });
}
class ConfigServiceStub {}
class DocumentServiceStub {}
class WorkspaceServiceStub {
  currentWorkspace = new Observable((observer) => {
    observer.next();
  });
}

@Injectable()
class PosServiceExtended extends PosService {
  calculateTotals(items: Item[]) {
    super.calculateTotals(items);
  }
}

describe("PosService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        PosServiceExtended,
        TaxService,
        { provide: AuthService, useClass: AuthServiceStub },
        { provide: ConfigService, useClass: ConfigServiceStub },
        { provide: DocumentService, useClass: DocumentServiceStub },
        { provide: WorkspaceService, useClass: WorkspaceServiceStub },
      ],
    });
  });

  it("should be created", inject(
    [PosService],
    (service: PosServiceExtended) => {
      expect(service).toBeTruthy();
    }
  ));

  it("should set crosstotal, nettotal and payableamount to 0 as default", inject(
    [PosServiceExtended],
    (service: PosServiceExtended) => {
      const item = [];
      service.currentNetTotal.subscribe((netTotal) => {
        expect(netTotal).toBe(0);
      });
      service.currentCrossTotal.subscribe((crossTotal) =>
        expect(crossTotal).toBe(0)
      );
      service.currentPayableAmount.subscribe((payableAmount) =>
        expect(payableAmount).toBe(0)
      );
      service.calculateTotals(item);
    }
  ));

  it("should use crosstotal as the payableamount if workspace flag is not active", inject(
    [PosServiceExtended],
    (service: PosServiceExtended) => {
      const items = [
        {
          product: {
            oid: "123.12",
            sku: "1651651.651561",
            type: ProductType.STANDART,
            description: "description",
            note: "",
            imageOid: "",
            netPrice: 8.48,
            crossPrice: 10.0,
            currency: Currency.PEN,
            categories: [],
            taxes: [
              {
                oid: "1.1",
                key: "IGV",
                catKey: "CAT",
                type: TaxType.ADVALOREM,
                name: "IGV",
                percent: 18,
              },
            ],
            relations: [],
            indicationSets: [],
            barcodes: [],
          },
          quantity: 1,
          price: 10.01,
          currency: Currency.PEN,
          exchangeRate: 1,
          remark: null,
        },
      ];
      service.calculateTotals(items);
      expect(service["netTotal"]).toBe(8.48);
      expect(service["crossTotal"]).toBe(10.01);
      expect(service["payableAmount"]).toBe(10.01);
    }
  ));

  it("should round crosstotal for payableamount if workspace flag is active", inject(
    [PosServiceExtended],
    (service: PosServiceExtended) => {
      service["workspaceFlags"] = 4
      const items = [
        {
          product: {
            oid: "123.12",
            sku: "1651651.651561",
            type: ProductType.STANDART,
            description: "description",
            note: "",
            imageOid: "",
            netPrice: 8.48,
            crossPrice: 10.0,
            currency: Currency.PEN,
            categories: [],
            taxes: [
              {
                oid: "1.1",
                key: "IGV",
                catKey: "CAT",
                type: TaxType.ADVALOREM,
                name: "IGV",
                percent: 18,
              },
            ],
            relations: [],
            indicationSets: [],
            barcodes: [],
          },
          quantity: 1,
          price: 10.01,
          currency: Currency.PEN,
          exchangeRate: 1,
          remark: null,
        },
      ];
      service.calculateTotals(items);
      expect(service["netTotal"]).toBe(8.48);
      expect(service["crossTotal"]).toBe(10.01);
      expect(service["payableAmount"]).toBe(10.0);
    }
  ));

  it("should round crosstotal for payableamount if workspace flag is active 2", inject(
    [PosServiceExtended],
    (service: PosServiceExtended) => {
      service["workspaceFlags"] = 4
      const items = [
        {
          product: {
            oid: "123.12",
            sku: "1651651.651561",
            type: ProductType.STANDART,
            description: "description",
            note: "",
            imageOid: "",
            netPrice: 15.3659,
            crossPrice: 18.90,
            currency: Currency.PEN,
            categories: [],
            taxes: [
              {
                oid: "1.1",
                key: "IGV",
                catKey: "CAT",
                type: TaxType.ADVALOREM,
                name: "IGV",
                percent: 18,
              },
              {
                oid: "1.2",
                key: "RECARGO",
                catKey: "CAT",
                type: TaxType.ADVALOREM,
                name: "RECARGO",
                percent: 5,
              },
            ],
            relations: [],
            indicationSets: [],
            barcodes: [],
          },
          quantity: 1,
          price: 10.01,
          currency: Currency.PEN,
          exchangeRate: 1,
          remark: null,
        },
      ];
      service.calculateTotals(items);
      expect(service["netTotal"]).toBe(15.37);
      expect(service["crossTotal"]).toBe(18.91);
      expect(service["payableAmount"]).toBe(18.90);
    }
  ));
});
