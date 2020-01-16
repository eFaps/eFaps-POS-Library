import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { InventoryEntry, Warehouse } from '../model/index';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root',
  deps: [
    HttpClient,
    ConfigService
  ]
})
export class InventoryService {

  constructor(private config: ConfigService,
    private http: HttpClient) { }

  public getWarehouses(): Observable<Warehouse[]> {
    const requestUrl = `${this.config.baseUrl}/inventory/warehouses`;
    return this.http.get<Warehouse[]>(requestUrl);
  }

  public getInventory(warehouseOid: string): Observable<InventoryEntry[]> {
    const requestUrl = `${this.config.baseUrl}/inventory`;
    return this.http.get<InventoryEntry[]>(requestUrl, { params: { warehouseOid } });
  }

  public getInventory4Product(productOid: string): Observable<InventoryEntry[]> {
    const requestUrl = `${this.config.baseUrl}/inventory`;
    return this.http.get<InventoryEntry[]>(requestUrl, { params: { productOid } });
  }
}
