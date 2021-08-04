import { Injectable } from "@angular/core";
import { ProductService } from "./product.service";
import { Product, ProductType, Item, ProductRelationType } from "../model";

@Injectable({
  providedIn: "root",
  deps: [ProductService],
})
export class PartListService {
  partLists: Product[];

  constructor(private productService: ProductService) {
    this.loadPartLists();
  }

  public loadPartLists() {
    this.productService.getProductsByType(ProductType.PARTLIST).subscribe({
      next: products => {
        this.partLists = products;
      }
    });
  }

  public updateTicket(ticket: Item[]) {
    const comp = [];

    ticket.forEach((item) => {
      comp.push(item.quantity + item.product.oid);
    });
    console.log("combinations: " + comp);
    this.partLists.forEach((partList) => {
      const comp2 = [];
      partList.relations.forEach((relation) => {
        if (ProductRelationType.SALESBOM == relation.type) {
          comp2.push(relation.quantity + relation.productOid);
        }
      })
      console.log("comp2: " + comp2);
    });

    //arr1.every(elem => arr2.includes(elem)
  }
}
