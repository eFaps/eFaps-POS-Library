import { provideHttpClientTesting } from "@angular/common/http/testing";
import { TestBed, inject } from "@angular/core/testing";

import {
  provideHttpClient,
  withInterceptorsFromDi,
} from "@angular/common/http";
import { ConfigService } from "./config.service";
import { InventoryService } from "./inventory.service";

class ConfigServiceStub {}

describe("InventoryService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        InventoryService,
        { provide: ConfigService, useClass: ConfigServiceStub },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    });
  });

  it("should be created", inject(
    [InventoryService],
    (service: InventoryService) => {
      expect(service).toBeTruthy();
    },
  ));
});
