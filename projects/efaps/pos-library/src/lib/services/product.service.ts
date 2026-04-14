import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

import {
  Category,
  CategoryNode,
  Page,
  PageRequest,
  Product,
  ProductStatus,
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
    workspaceService: WorkspaceService,
  ) {
    workspaceService.currentWorkspace.subscribe({
      next: (workspace) => {
        this.workspace = workspace;
      },
    });
  }

  public getProducts(
    pageable?: PageRequest,
    stati?: ProductStatus[],
  ): Observable<Page<Product>> {
    const requestUrl = `${this.config.baseUrl}/products`;
    const params: any = pageable || {};
    if (stati) {
      params.status = stati;
    }
    return this.http.get<Page<Product>>(requestUrl, { params });
  }

  public findProducts(
    term: string,
    textsearch?: boolean,
    stati?: ProductStatus[],
  ): Observable<Product[]> {
    const requestUrl = `${this.config.baseUrl}/products`;
    let params: HttpParams = new HttpParams();
    params = params.set("term", term);
    if (typeof textsearch !== "undefined") {
      params = params.set("textsearch", textsearch);
    }
    if (stati) {
      stati.forEach((status) => {
        params = params.append("status", status);
      });
    }
    return this.http.get<Product[]>(requestUrl, { params });
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
          this.addChildNodes(categories, rootCategory),
        );

        return rootCategories;
      }),
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
      this.addChildNodes(categories, rootCategory),
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
                (oid) => oid === category.oid,
              ) > -1
            );
          }
          return true;
        });
      }),
    );
  }

  public getProduct(oid: string): Observable<Product> {
    const requestUrl = `${this.config.baseUrl}/products/${oid}`;
    return this.http.get<Product>(requestUrl);
  }

  public getCategory(oid: string): Observable<Category> {
    const requestUrl = `${this.config.baseUrl}/categories/${oid}`;
    return this.http.get<Category>(requestUrl);
  }

  public getProductsByCategory(
    oid: string,
    stati?: ProductStatus[],
  ): Observable<Product[]> {
    const requestUrl = `${this.config.baseUrl}/products`;
    let params: HttpParams = new HttpParams();
    params = params.set("category", oid);
    if (stati) {
      stati.forEach((status) => {
        params = params.append("status", status);
      });
    }
    return this.http.get<Product[]>(requestUrl, { params });
  }

  public getProductsByBarcode(
    barcode: string,
    stati?: ProductStatus[],
  ): Observable<Product[]> {
    const requestUrl = `${this.config.baseUrl}/products`;
    let params: HttpParams = new HttpParams();
    params = params.set("barcode", barcode);
    if (stati) {
      stati.forEach((status) => {
        params = params.append("status", status);
      });
    }
    return this.http.get<Product[]>(requestUrl, { params });
  }

  public getProductsByType(
    type: ProductType,
    stati?: ProductStatus[],
  ): Observable<Product[]> {
    const requestUrl = `${this.config.baseUrl}/products`;
    let params: HttpParams = new HttpParams();
    params = params.set("type", type);
    if (stati) {
      stati.forEach((status) => {
        params = params.append("status", status);
      });
    }
    return this.http.get<Product[]>(requestUrl, { params });
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
