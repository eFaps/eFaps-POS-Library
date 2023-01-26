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

  public findProducts(
    term: string,
    textsearch?: boolean
  ): Observable<Product[]> {
    let requestUrl;
    if (typeof textsearch !== "undefined") {
      requestUrl = `${this.config.baseUrl}/products?term=${term}&textsearch=${textsearch}`;
    } else {
      requestUrl = `${this.config.baseUrl}/products?term=${term}`;
    }
    return this.http.get<Product[]>(requestUrl);
  }

  public getPosCategories(): Observable<PosCategory[]> {
    return forkJoin([this.getCategories(), this.getProducts()]).pipe(
      map((data: any[]) => {
        const categoryList: Category[] = data[0];
        const productList: Product[] = data[1];
        const rootCategories = categoryList.filter(
          (category) => category.parentOid == null
        );
        const posCategories: PosCategory[] = [];
        rootCategories.forEach((_category) => {
          posCategories.push(
            this.getPosCategory(_category, categoryList, productList)
          );
        });
        return posCategories.sort((n1, n2) => {
          const w1 = n1.weight ? 0 : n1.weight;
          const w2 = n2.weight ? 0 : n2.weight;
          return w1 - w2;
        });
      })
    );
  }

  private getPosCategory(
    category: Category,
    categoryList: Category[],
    productList: Product[]
  ): PosCategory {
    const childCategories = categoryList.filter(
      (cat) => cat.parentOid == category.oid
    );
    const childPosCategories: PosCategory[] = [];
    childCategories.forEach((childCategory) => {
      childPosCategories.push(
        this.getPosCategory(childCategory, categoryList, productList)
      );
    });
    return {
      oid: category.oid,
      name: category.name,
      products: productList
        .filter((_product) => {
          return _product.categories.some((prod2cat) => {
            return prod2cat.categoryOid == category.oid;
          });
        })
        .sort((n1, n2) => {
          const w1 = n1.categories.filter(
            (prod2cat) => prod2cat.categoryOid == category.oid
          )[0].weight;
          const w2 = n2.categories.filter(
            (prod2cat) => prod2cat.categoryOid == category.oid
          )[0].weight;
          return w1 - w2;
        }),
      categories: childPosCategories.sort((n1, n2) => {
        const w1 = n1.weight ? 0 : n1.weight;
        const w2 = n2.weight ? 0 : n2.weight;
        return w1 - w2;
      }),
    };
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

  public getProductsByType(type: ProductType): Observable<Product[]> {
    const requestUrl = `${this.config.baseUrl}/products?type=${type}`;
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
