import { HttpClientTestingModule } from "@angular/common/http/testing";
import { TestBed, inject } from "@angular/core/testing";

import { ConfigService } from "./config.service";
import { InventoryService } from "./inventory.service";

class ConfigServiceStub {}

describe("InventoryService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        InventoryService,
        { provide: ConfigService, useClass: ConfigServiceStub }
      ]
    });
  });

  it("should be created", inject(
    [InventoryService],
    (service: InventoryService) => {
      expect(service).toBeTruthy();
    }
  ));
});
