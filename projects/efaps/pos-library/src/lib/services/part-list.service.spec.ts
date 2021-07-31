import { TestBed } from "@angular/core/testing";

import { PartListService } from "./part-list.service";
import { ProductService } from "./product.service";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { PosConfigToken } from "./pos-config.token";

describe("PartListService", () => {
  let service: PartListService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductService, { provide: PosConfigToken, useValue: {} },]
    });
    service = TestBed.inject(PartListService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
