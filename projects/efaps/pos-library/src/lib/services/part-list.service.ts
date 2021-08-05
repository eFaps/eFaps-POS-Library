import { Injectable } from "@angular/core";
import { ProductService } from "./product.service";
import { Product, ProductType, Item, ProductRelationType } from "../model";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: "root",
  deps: [ProductService]
})
export class PartListService {
  private partLists: Product[];
  private partListComb = [];
  private partListSource = new BehaviorSubject<Product>(null);
  detectedPartList = this.partListSource.asObservable();

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

  public updateTicket(ticket: Item[]): Item[] {
    if (this.partLists == undefined) {
      this.loadPartLists();
    }
    if (this.partLists.length > 0) {
      const ticketComb = [];
      ticket.forEach(item => {
        ticketComb.push(item.quantity + "-" + item.product.oid);
      });
      const plComb = this.getPartListCombinations();

      const plHit = plComb.find(pl => {
        return pl.combinations.every(elem => ticketComb.includes(elem));
      });
      if (plHit) {
        plHit.partList.relations.forEach(relation => {
          if (ProductRelationType.SALESBOM == relation.type) {
            ticket = ticket.filter(item => {
              return (
                item.quantity != relation.quantity ||
                item.product.oid != relation.productOid
              );
            });
          }
        });
        ticket.push({
          product: plHit.partList,
          quantity: 1,
          price: plHit.partListcrossPrice,
          remark: ""
        });
        this.partListSource.next(plHit.partList);
      }
    }
    return ticket;
  }

  public getPartListCombinations() {
    if (this.partLists.length > 0 && this.partListComb.length == 0) {
      this.partLists.forEach(partList => {
        const comp = [];
        partList.relations.forEach(relation => {
          if (ProductRelationType.SALESBOM == relation.type) {
            comp.push(relation.quantity + "-" + relation.productOid);
          }
        });
        this.partListComb.push({
          partList,
          combinations: comp
        });
      });
    }
    return this.partListComb;
  }
}
