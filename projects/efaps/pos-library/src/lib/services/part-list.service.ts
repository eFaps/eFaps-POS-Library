import { Injectable } from "@angular/core";
import { ProductService } from "./product.service";
import { Product, ProductType, Workspace, Item } from "../model";
import { Observable } from "rxjs";

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
    console.log("llllllllllll")
  }
}
