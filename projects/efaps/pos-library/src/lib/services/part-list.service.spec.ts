import { HttpClientTestingModule } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";

import { Observable } from "rxjs";
import { AdminService } from "./admin.service";
import { AuthService } from "./auth.service";
import { PartListService } from "./part-list.service";
import { PosConfigToken } from "./pos-config.token";
import { ProductService } from "./product.service";

class AuthServiceStub {
  currentEvent = new Observable((observer) => {
    observer.next("nothing");
  });
}

describe("PartListService", () => {
  let service: PartListService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: PosConfigToken, useValue: {} },
        { provide: AuthService, useClass: AuthServiceStub },
        ProductService,
        AdminService,
      ],
    });
  });

  it("should be created", () => {
    const service: PartListService = TestBed.get(PartListService);
    expect(service).toBeTruthy();
  });
});
