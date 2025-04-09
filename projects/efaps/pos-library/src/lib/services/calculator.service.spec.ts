import { provideHttpClientTesting } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { Observable } from "rxjs";

import {
  provideHttpClient,
  withInterceptorsFromDi,
} from "@angular/common/http";
import Decimal from "decimal.js";
import { Currency } from "../model/currency";
import { ProductType } from "../model/product";
import { TaxType } from "../model/tax";
import { CalculatorService } from "./calculator.service";
import { ConfigService } from "./config.service";
import { TaxService } from "./tax.service";
import { WorkspaceService } from "./workspace.service";

class WorkspaceServiceStub {
  currentWorkspace = new Observable((observer) => {
    observer.next(undefined);
  });
}
class ConfigServiceStub {
  getSystemConfig(key: string) {
    return new Observable((observer) => {
      observer.next(undefined);
    });
  }
}

describe("CalculatorService", () => {
  let service: CalculatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        TaxService,
        { provide: WorkspaceService, useClass: WorkspaceServiceStub },
        { provide: ConfigService, useClass: ConfigServiceStub },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(CalculatorService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("should set crosstotal, nettotal and payableamount to 0 as default", () => {
    const item = [];
    const totals = service.calculateTotals(item);
    expect(totals.netTotal).toEqual(new Decimal(0));
    expect(totals.crossTotal).toEqual(new Decimal(0));
    expect(totals.payableAmount).toEqual(new Decimal(0));
    expect(totals.taxes.size).toBe(0);
  });

  it("should use crosstotal as the payableamount if workspace flag is not active", () => {
    const items = [
      {
        index: 0,
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
          bomGroupConfigs: [],
          configurationBOMs: [],
        },
        quantity: 1,
        price: 10.01,
        currency: Currency.PEN,
        exchangeRate: 1,
        remark: null,
      },
    ];
    const totals = service.calculateTotals(items);

    expect(totals.netTotal).toEqual(new Decimal("8.48"));
    expect(totals.crossTotal).toEqual(new Decimal("10.01"));
    expect(totals.payableAmount).toEqual(new Decimal("10.01"));
  });

  it("should round crosstotal for payableamount if workspace flag is active", () => {
    const items = [
      {
        index: 0,
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
          bomGroupConfigs: [],
          configurationBOMs: [],
        },
        quantity: 1,
        price: 10.01,
        currency: Currency.PEN,
        exchangeRate: 1,
        remark: null,
      },
    ];
    service["workspaceFlags"] = 4;
    const totals = service.calculateTotals(items);

    expect(totals.netTotal).toEqual(new Decimal("8.48"));
    expect(totals.crossTotal).toEqual(new Decimal("10.01"));
    expect(totals.payableAmount).toEqual(new Decimal("10.00"));
  });

  it("should round crosstotal for payableamount if workspace flag is active 2", () => {
    service["workspaceFlags"] = 4;
    const items = [
      {
        index: 0,
        product: {
          oid: "123.12",
          sku: "1651651.651561",
          type: ProductType.STANDART,
          description: "description",
          note: "",
          imageOid: "",
          netPrice: 15.37,
          crossPrice: 18.9,
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
          bomGroupConfigs: [],
          configurationBOMs: [],
        },
        quantity: 1,
        price: 10.01,
        currency: Currency.PEN,
        exchangeRate: 1,
        remark: null,
      },
    ];
    const totals = service.calculateTotals(items);
    expect(totals.netTotal).toEqual(new Decimal("15.37"));
    expect(totals.crossTotal).toEqual(new Decimal("18.91"));
    expect(totals.payableAmount).toEqual(new Decimal("18.9"));
  });
});
