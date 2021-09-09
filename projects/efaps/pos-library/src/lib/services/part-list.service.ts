import { Injectable } from "@angular/core";
import clone from 'just-clone';
import { BehaviorSubject, Observable } from "rxjs";
import { map } from "rxjs/operators";

import { Item, Product, ProductRelationType, ProductType } from "../model";
import { AdminService } from "./admin.service";
import { AuthService } from "./auth.service";
import { ProductService } from "./product.service";

@Injectable({
  providedIn: "root",
  deps: [AdminService, AuthService, ProductService],
})
export class PartListService {
  private partLists: Product[];
  private partListComb = [];
  private partListSource = new BehaviorSubject<Product>(null);
  detectedPartList = this.partListSource.asObservable();

  constructor(
    adminService: AdminService,
    authService: AuthService,
    private productService: ProductService
  ) {
    this.productService.getProductsByType(ProductType.PARTLIST).subscribe({
      next: (products) => {
        this.partLists = products;
      },
    });
    adminService.reloadEvent.subscribe({
      next: (_) => {
        this.reset();
      },
    });
    authService.currentEvent.subscribe({
      next: (event) => {
        if (event == "logout") {
          this.reset();
        }
      },
    });
  }

  public reset() {
    this.partLists = undefined;
    this.partListComb = [];
  }

  public updateTicket(ticket: Item[]): Observable<Item[]> {
    if (this.partLists == undefined) {
      return this.productService.getProductsByType(ProductType.PARTLIST).pipe(
        map((products) => {
          this.partLists = products;
          return this.updateTicketInternal(ticket);
        })
      );
    } else {
      const items = this.updateTicketInternal(ticket);
      return new Observable((observer) => {
        observer.next(items);
      });
    }
  }

  private updateTicketInternal(ticket: Item[]): Item[] {
    if (ticket.length > 0 && this.partLists.length > 0) {
      this.partLists.forEach((partList) => {
        let tempTicket = clone(ticket);
        let isFound = [];
        let salebomcount = 0;
        partList.relations.forEach((relation) => {
          const toBeRemoved = [];
          if (ProductRelationType.SALESBOM == relation.type) {
            salebomcount++;
            let currentQuantity: number = relation.quantity;
            for (let i = 0; i < tempTicket.length; i++) {
              const item = tempTicket[i]
              if (item.product.oid == relation.productOid) {
                if (item.quantity == currentQuantity) {
                  toBeRemoved.push(i)
                  isFound.push(true)
                  break
                } else if (item.quantity > currentQuantity) {
                  item.quantity = item.quantity - currentQuantity
                  isFound.push(true)
                  break
                } else if (item.quantity < currentQuantity) {
                  toBeRemoved.push(i)
                  currentQuantity = currentQuantity - item.quantity
                }
              }
            }
          }
          tempTicket = this.cleanUpTicket(tempTicket, toBeRemoved)
        })
        if (salebomcount > 0 && salebomcount == isFound.length) {
          tempTicket.push({
            product: partList,
            quantity: 1,
            price: partList.crossPrice,
            remark: "",
          })
          ticket = tempTicket
        }
      })
    }
    return ticket;
  }

  private cleanUpTicket(ticket: Item[], toBeRemoved: number[]): Item[] {
    const cleanedUpTicket = []
    for (let i = 0; i < ticket.length; i++) {
      if (!toBeRemoved.includes(i)) {
        cleanedUpTicket.push(ticket[i])
      }
    }
    return cleanedUpTicket
  }
}
