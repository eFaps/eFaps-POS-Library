import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Cacheable } from 'ngx-cacheable';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { ConfigService } from './config.service';
import { Category, PosCategory, Product } from '../model/index';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient, private config: ConfigService) { }

  @Cacheable()
  public getProducts(): Observable<Product[]> {
    const requestUrl = `${this.config.baseUrl}/products`;
    return this.http.get<Product[]>(requestUrl);
  }

  public findProducts(_term: string): Observable<Product[]> {
    const requestUrl = `${this.config.baseUrl}/products?term=${_term}`;
    return this.http.get<Product[]>(requestUrl);
  }

  public getPosCategories(): Observable<PosCategory[]> {
    return forkJoin([
      this.getCategories(),
      this.getProducts()
    ]).pipe(
      map((data: any[]) => {
        const categories: Category[] = data[0];
        const products: Product[] = data[1];
        const posCategories: PosCategory[] = [];
        categories.forEach(_category => {
          posCategories.push({
            oid: _category.oid,
            name: _category.name,
            products: products.filter(_product => _product.categoryOids.includes(_category.oid))
          });
        });
        return posCategories;
      }));
  }

  @Cacheable()
  public getCategories(): Observable<Category[]> {
    const href = this.config.baseUrl + '/categories';
    const requestUrl = `${href}`;
    return this.http.get<Category[]>(requestUrl);
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
}
