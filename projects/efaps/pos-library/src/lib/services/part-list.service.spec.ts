import { HttpClientTestingModule } from "@angular/common/http/testing";
import { TestBed, tick, fakeAsync } from "@angular/core/testing";
import { Observable, of } from "rxjs";

import { Product, ProductType, ProductRelationType } from "../model";
import { AdminService } from "./admin.service";
import { AuthService } from "./auth.service";
import { PartListService } from "./part-list.service";
import { PosConfigToken } from "./pos-config.token";
import { ProductService } from "./product.service";

const PRODUCTS = [
  {
    oid: "111.1",
    sku: "0815.2564",
    type: ProductType.STANDART,
    description: "Standart Product No 1 description",
    imageOid: null,
    netPrice: 12,
    crossPrice: 14,
    categoryOids: [],
    taxes: [],
    relations: [],
    indicationSets: [],
    barcodes: [],
  },
  {
    oid: "111.2",
    sku: "0815.2564",
    type: ProductType.STANDART,
    description: "Standart Product No 2 description",
    imageOid: null,
    netPrice: 12,
    crossPrice: 14,
    categoryOids: [],
    taxes: [],
    relations: [],
    indicationSets: [],
    barcodes: [],
  },
  {
    oid: "111.3",
    sku: "0815.2564",
    type: ProductType.STANDART,
    description: "Standart Product No 3 description",
    imageOid: null,
    netPrice: 12,
    crossPrice: 14,
    categoryOids: [],
    taxes: [],
    relations: [],
    indicationSets: [],
    barcodes: [],
  },
  {
    oid: "111.4",
    sku: "0815.2564",
    type: ProductType.STANDART,
    description: "Standart Product No 3 description",
    imageOid: null,
    netPrice: 12,
    crossPrice: 14,
    categoryOids: [],
    taxes: [],
    relations: [],
    indicationSets: [],
    barcodes: [],
  }
]



const PARTLISTS = [
  {
    oid: "123.45",
    sku: "0815.2563",
    type: ProductType.PARTLIST,
    description: "Product description",
    imageOid: null,
    netPrice: 12,
    crossPrice: 14,
    categoryOids: [],
    taxes: [],
    relations: [{
      type: ProductRelationType.ALTERNATIVE,
      label: "Ignore thisone",
      productOid: "111.1",
      quantity: 1,
    }],
    indicationSets: [],
    barcodes: [],
  },
  {
    oid: "123.46",
    sku: "0815.2564",
    type: ProductType.PARTLIST,
    description: "Product description",
    imageOid: null,
    netPrice: 12,
    crossPrice: 14,
    categoryOids: [],
    taxes: [],
    relations: [{
      type: ProductRelationType.SALESBOM,
      label: "SalesBOM",
      productOid: "111.NOHIT",
      quantity: 1,
    }],
    indicationSets: [],
    barcodes: [],
  },
  {
    oid: "123.46",
    sku: "0815.2564",
    type: ProductType.PARTLIST,
    description: "Product description",
    imageOid: null,
    netPrice: 12,
    crossPrice: 14,
    categoryOids: [],
    taxes: [],
    relations: [{
      type: ProductRelationType.SALESBOM,
      label: "SalesBOM",
      productOid: "111.1",
      quantity: 2,
    }],
    indicationSets: [],
    barcodes: [],
  },
  {
    oid: "123.46",
    sku: "0815.2564",
    type: ProductType.PARTLIST,
    description: "Product description",
    imageOid: null,
    netPrice: 12,
    crossPrice: 14,
    categoryOids: [],
    taxes: [],
    relations: [{
      type: ProductRelationType.SALESBOM,
      label: "SalesBOM",
      productOid: "111.1",
      quantity: 2,
    },
    {
      type: ProductRelationType.SALESBOM,
      label: "SalesBOM",
      productOid: "111.2",
      quantity: 2,
    }],
    indicationSets: [],
    barcodes: [],
  },
  {
    oid: "123.47",
    sku: "0815.2564",
    type: ProductType.PARTLIST,
    description: "Product description",
    imageOid: null,
    netPrice: 12,
    crossPrice: 14,
    categoryOids: [],
    taxes: [],
    relations: [{
      type: ProductRelationType.SALESBOM,
      label: "SalesBOM",
      productOid: PRODUCTS[1].oid,
      quantity: 1,
    },
    {
      type: ProductRelationType.SALESBOM,
      label: "SalesBOM",
      productOid: PRODUCTS[2].oid,
      quantity: 2,
    },
    {
      type: ProductRelationType.SALESBOM,
      label: "SalesBOM",
      productOid: PRODUCTS[3].oid,
      quantity: 3,
    }],
    indicationSets: [],
    barcodes: [],
  },
  {
    oid: "123.47",
    sku: "0815.2564",
    type: ProductType.PARTLIST,
    description: "stupid partlis",
    imageOid: null,
    netPrice: 12,
    crossPrice: 14,
    categoryOids: [],
    taxes: [],
    relations: [],
    indicationSets: [],
    barcodes: [],
  },
  {
    oid: "123.50",
    sku: "0815.2564",
    type: ProductType.PARTLIST,
    description: "Weired partlist",
    imageOid: null,
    netPrice: 12,
    crossPrice: 14,
    categoryOids: [],
    taxes: [],
    relations: [{
      type: ProductRelationType.SALESBOM,
      label: "SalesBOM",
      productOid: PRODUCTS[1].oid,
      quantity: 1,
    },
    {
      type: ProductRelationType.SALESBOM,
      label: "SalesBOM",
      productOid: PRODUCTS[1].oid,
      quantity: 2,
    },
    {
      type: ProductRelationType.SALESBOM,
      label: "SalesBOM",
      productOid: PRODUCTS[1].oid,
      quantity: 1,
    }],
    indicationSets: [],
    barcodes: [],
  }
]

class AuthServiceStub {
  currentEvent = new Observable((observer) => {
    observer.next("nothing");
  });
}

describe("PartListService", () => {
  let service: PartListService;
  let productService: ProductService;

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
    productService = TestBed.get(ProductService);
  });

  it("should be created", () => {
    const service: PartListService = TestBed.get(PartListService);
    expect(service).toBeTruthy();
  });

  it("updateTicketInternal should ignore an empty ticket", fakeAsync(() => {
    const service: PartListService = TestBed.get(PartListService);
    spyOn(productService, 'getProductsByType').and.returnValue(of(PARTLISTS));
    const ticket = [];
    service.updateTicket(ticket).subscribe({
      next: response => {
        expect(ticket).toEqual(response);
      }
    });
    tick(1);
  }));

  it("should not change if not SALESBOM or not product oid is met", fakeAsync(() => {
    const service: PartListService = TestBed.get(PartListService);
    const partlists: Product[] = [PARTLISTS[0], PARTLISTS[1]];
    spyOn(productService, 'getProductsByType').and.returnValue(of(partlists));
    const ticket = [{
      product: PRODUCTS[0],
      quantity: 1,
      price: 11,
      remark: "text"
    }];
    service.updateTicket(ticket).subscribe({
      next: response => {
        expect(ticket).toEqual(response);
      }
    });
    tick(1);
  }));

  it("should find a partlist if exactly ", fakeAsync(() => {
    const service: PartListService = TestBed.get(PartListService);
    const partlists: Product[] = [PARTLISTS[0], PARTLISTS[2]];
    spyOn(productService, 'getProductsByType').and.returnValue(of(partlists));
    const ticket = [{
      product: PRODUCTS[0],
      quantity: 2,
      price: 11,
      remark: "text"
    }];
    service.updateTicket(ticket).subscribe({
      next: response => {
        expect(PARTLISTS[2]).toEqual(response[0].product);
      }
    });
    tick(1);
  }));

  it("should find a partlist with one relation of two ", fakeAsync(() => {
    const service: PartListService = TestBed.get(PartListService);
    const partlists: Product[] = [PARTLISTS[0], PARTLISTS[2]];
    spyOn(productService, 'getProductsByType').and.returnValue(of(partlists));
    const ticket = [{
      product: PRODUCTS[0],
      quantity: 2,
      price: 11,
      remark: "text"
    }];
    service.updateTicket(ticket).subscribe({
      next: response => {
        expect(partlists[1]).toEqual(response[0].product);
      }
    });
    tick(1);
  }));

  it("should find a partlist with more than one relation of two", fakeAsync(() => {
    const service: PartListService = TestBed.get(PartListService);
    const partlists: Product[] = [PARTLISTS[0], PARTLISTS[3]];
    spyOn(productService, 'getProductsByType').and.returnValue(of(partlists));
    const ticket = [{
      product: PRODUCTS[0],
      quantity: 2,
      price: 11,
      remark: "text"
    },
    {
      product: PRODUCTS[1],
      quantity: 2,
      price: 11,
      remark: "text"
    }];
    service.updateTicket(ticket).subscribe({
      next: response => {
        expect(partlists[1]).toEqual(response[0].product);
        expect(response.length).toEqual(1)
      }
    });
    tick(1);
  }));

  it("should find a partlist with one relation of two and remove from the item", fakeAsync(() => {
    const service: PartListService = TestBed.get(PartListService);
    const partlists: Product[] = [PARTLISTS[0], PARTLISTS[2]];
    spyOn(productService, 'getProductsByType').and.returnValue(of(partlists));
    const ticket = [{
      product: PRODUCTS[0],
      quantity: 3,
      price: 11,
      remark: "text"
    }];
    service.updateTicket(ticket).subscribe({
      next: response => {
        expect(response.length).toEqual(2)
        expect(response[0].product).toEqual(PRODUCTS[0])
        expect(response[0].quantity).toEqual(1)
        expect(response[1].product).toEqual(partlists[1]);
      }
    });
    tick(1);
  }));

  it("should find a partlist with one relation of two and remove multiple item", fakeAsync(() => {
    const service: PartListService = TestBed.get(PartListService);
    const partlists: Product[] = [PARTLISTS[0], PARTLISTS[2]];
    spyOn(productService, 'getProductsByType').and.returnValue(of(partlists));
    const ticket = [{
      product: PRODUCTS[0],
      quantity: 1,
      price: 11,
      remark: "text"
    }, {
      product: PRODUCTS[0],
      quantity: 1,
      price: 11,
      remark: "text"
    }];
    service.updateTicket(ticket).subscribe({
      next: response => {
        expect(response.length).toEqual(1)
        expect(response[0].product).toEqual(partlists[1]);
      }
    });
    tick(1);
  }));

  it("should find a partlist and do not remove other partlists", fakeAsync(() => {
    const service: PartListService = TestBed.get(PartListService);
    const partlists: Product[] = [PARTLISTS[0], PARTLISTS[2], PARTLISTS[4], PARTLISTS[5]];
    spyOn(productService, 'getProductsByType').and.returnValue(of(partlists));
    const ticket = [{
      product: PRODUCTS[0],
      quantity: 1,
      price: 11,
      remark: "text"
    }, {
      product: PRODUCTS[1],
      quantity: 1,
      price: 11,
      remark: "text"
    },
    {
      product: PARTLISTS[2],
      quantity: 1,
      price: 11,
      remark: "text"
    }, {
      product: PRODUCTS[2],
      quantity: 2,
      price: 11,
      remark: "text"
    },
    {
      product: PRODUCTS[3],
      quantity: 1,
      price: 11,
      remark: "text"
    },
    {
      product: PRODUCTS[3],
      quantity: 2,
      price: 11,
      remark: "text"
    }, {
      product: PRODUCTS[1],
      quantity: 1,
      price: 11,
      remark: "text"
    }];
    service.updateTicket(ticket).subscribe({
      next: response => {
        expect(response.length).toEqual(4)
        expect(response[0].product).toEqual(ticket[0].product);
        expect(response[1].product).toEqual(ticket[2].product);
        expect(response[2].product).toEqual(ticket[6].product);
        expect(response[3].product).toEqual(partlists[2]);
      }
    });
    tick(1);
  }));

  it("should find a partlist that has weired configuration", fakeAsync(() => {
    const service: PartListService = TestBed.get(PartListService);
    const partlists: Product[] = [PARTLISTS[6]];
    spyOn(productService, 'getProductsByType').and.returnValue(of(partlists));
    const ticket = [{
      product: PRODUCTS[1],
      quantity: 1,
      price: 11,
      remark: "text"
    }, {
      product: PRODUCTS[1],
      quantity: 2,
      price: 11,
      remark: "text"
    },
    {
      product: PARTLISTS[2],
      quantity: 1,
      price: 11,
      remark: "text"
    }, {
      product: PRODUCTS[2],
      quantity: 2,
      price: 11,
      remark: "text"
    },
    {
      product: PRODUCTS[3],
      quantity: 1,
      price: 11,
      remark: "text"
    },
    {
      product: PRODUCTS[3],
      quantity: 2,
      price: 11,
      remark: "text"
    }, {
      product: PRODUCTS[1],
      quantity: 1,
      price: 11,
      remark: "text"
    },{
      product: PRODUCTS[1],
      quantity: 2,
      price: 11,
      remark: "text"
    },];
    service.updateTicket(ticket).subscribe({
      next: response => {
        expect(response.length).toEqual(6)
        expect(response[0].product).toEqual(PARTLISTS[2]);
        expect(response[1].product).toEqual(ticket[3].product);
        expect(response[2].product).toEqual(ticket[4].product);
        expect(response[3].product).toEqual(ticket[5].product);
        expect(response[4].product).toEqual(ticket[7].product);
        expect(response[4].quantity).toEqual(ticket[7].quantity);
        expect(response[5].product).toEqual(partlists[0]);

      }
    });
    tick(1);
  }));


});
