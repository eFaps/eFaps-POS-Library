import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, forkJoin } from "rxjs";
import { map } from "rxjs/operators";

import {
  Category,
  CategoryNode,
  Page,
  PageRequest,
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

  public getProducts(pageable?: PageRequest): Observable<Page<Product>> {
    const requestUrl = `${this.config.baseUrl}/products`;
    const params: any = pageable || {};
    return this.http.get<Page<Product>>(requestUrl, { params });
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

  

  public getCategoryTree(): Observable<CategoryNode[]> {
    return this.getCategories().pipe(
      map((categories) => {
        const rootCategories = categories
          .filter((cat) => cat.parentOid == null)
          .sort(this.categorySort)
          .map((cat) => {
            return {
              oid: cat.oid,
              name: cat.name,
              imageOid: cat.imageOid,
              weight: cat.weight,
              parentOid: cat.parentOid,
              children: [],
            };
          });
        rootCategories.forEach((rootCategory) =>
          this.addChildNodes(categories, rootCategory)
        );

        return rootCategories;
      })
    );
  }

  private addChildNodes(categories: Category[], node: CategoryNode) {
    const childCategories = categories
      .filter((cat) => cat.parentOid == node.oid)
      .sort(this.categorySort)
      .map((cat) => {
        return {
          oid: cat.oid,
          name: cat.name,
          imageOid: cat.imageOid,
          weight: cat.weight,
          parentOid: cat.parentOid,
          children: [],
        };
      });
    childCategories.forEach((rootCategory) =>
      this.addChildNodes(categories, rootCategory)
    );
    node.children = childCategories;
  }

  private categorySort = (n1: Category, n2: Category) => {
    const w1 = n1.weight ? 0 : n1.weight;
    const w2 = n2.weight ? 0 : n2.weight;
    return w1 - w2;
  };

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
