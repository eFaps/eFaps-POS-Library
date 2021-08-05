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
      comp.push(item.quantity + "-" + item.product.oid);
    });
    console.log("combinations: " + comp);
    const comp3 = [];
    this.partLists.forEach((partList) => {
      const comp2 = [];
      partList.relations.forEach((relation) => {
        if (ProductRelationType.SALESBOM == relation.type) {
          comp2.push(relation.quantity + "-" + relation.productOid);
        }
      })
      console.log("comp2: " + comp2);
      comp3.push({
        partList,
        combinations: comp2
      })
    });
    console.log("comp3: " + comp3);

    comp3.forEach(pl => {
      const hit = pl.combinations.every(elem => comp.includes(elem))
      console.log("hit: " + hit);
    });

    const plHit = comp3.find(pl => {
      return pl.combinations.every(elem => comp.includes(elem));
    })
    plHit.partList.relations.forEach((relation) => {
      if (ProductRelationType.SALESBOM == relation.type) {
        ticket = ticket.filter(item => {
          return item.quantity != relation.quantity || item.product.oid != relation.productOid
        });
      }
    })
    //arr1.every(elem => arr2.includes(elem)
  }
}
