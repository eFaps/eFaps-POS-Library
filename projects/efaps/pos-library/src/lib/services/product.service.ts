import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, forkJoin } from "rxjs";
import { map } from "rxjs/operators";

import {
  Category,
  PosCategory,
  Product,
  ProductType,
  Workspace,
} from "../model";
import { ConfigService } from "./config.service";
import { WorkspaceService } from "./workspace.service";

@Injectable({
  providedIn: "root",
  deps: [HttpClient, ConfigService],
})
export class ProductService {
  workspace: Workspace;
  constructor(
    private http: HttpClient,
    private config: ConfigService,
    workspaceService: WorkspaceService
  ) {
    workspaceService.currentWorkspace.subscribe({
      next: (workspace) => {
        this.workspace = workspace;
      },
    });
  }

  public getProducts(): Observable<Product[]> {
    const requestUrl = `${this.config.baseUrl}/products`;
    return this.http.get<Product[]>(requestUrl);
  }

  public findProducts(_term: string): Observable<Product[]> {
    const requestUrl = `${this.config.baseUrl}/products?term=${_term}`;
    return this.http.get<Product[]>(requestUrl);
  }

  public getPosCategories(): Observable<PosCategory[]> {
    return forkJoin([this.getCategories(), this.getProducts()]).pipe(
      map((data: any[]) => {
        const categories: Category[] = data[0];
        const products: Product[] = data[1];
        const posCategories: PosCategory[] = [];
        categories.forEach((_category) => {
          posCategories.push({
            oid: _category.oid,
            name: _category.name,
            products: products.filter((_product) =>
              _product.categoryOids.includes(_category.oid)
            ),
          });
        });
        return posCategories;
      })
    );
  }

  public getCategories(): Observable<Category[]> {
    const href = this.config.baseUrl + "/categories";
    const requestUrl = `${href}`;
    return this.http.get<Category[]>(requestUrl).pipe(
      map((categories) => {
        return categories.filter((category) => {
          if (
            this.workspace &&
            this.workspace.categoryOids &&
            this.workspace.categoryOids.length > 0
          ) {
            return (
              this.workspace.categoryOids.findIndex(
                (oid) => oid === category.oid
              ) > -1
            );
          }
          return true;
        });
      })
    );
  }

  public getProduct(_oid: string): Observable<Product> {
    const requestUrl = `${this.config.baseUrl}/products/${_oid}`;
    return this.http.get<Product>(requestUrl);
  }

  public getCategory(_oid: string): Observable<Category> {
    const requestUrl = `${this.config.baseUrl}/categories/${_oid}`;
    return this.http.get<Category>(requestUrl);
  }

  public getProductsByCategory(_oid: string): Observable<Product[]> {
    const requestUrl = `${this.config.baseUrl}/products?category=${_oid}`;
    return this.http.get<Product[]>(requestUrl);
  }

  public getProductsByBarcode(_barcode: string): Observable<Product[]> {
    const requestUrl = `${this.config.baseUrl}/products?barcode=${_barcode}`;
    return this.http.get<Product[]>(requestUrl);
  }

  static isStockable(product: Product): boolean {
    switch (product.type) {
      case ProductType.STANDART:
        return true;
      default:
        return false;
    }
  }
}
