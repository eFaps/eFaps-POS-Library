import { HttpClient } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { Observable, Subscriber } from "rxjs";

import { Extension, PersistenceService, PersistenceServiceProvider, PosConfig } from "../model";
import { PosConfigToken } from "./pos-config.token";

@Injectable({
  providedIn: "root",
})
export class ConfigService {
  public baseUrl: string;
  public defaultProdImg: string;
  private _persistence: PersistenceService | PersistenceServiceProvider;
  private _socketUrl: string;
  private systemConfig: Map<string, any> = new Map();
  private extensions: Extension[];

  constructor(
    @Inject(PosConfigToken) config: PosConfig,
    private http: HttpClient,
  ) {
    this.baseUrl = config.baseUrl;
    this._socketUrl = config.socketUrl;
    this.defaultProdImg = config.defaultProdImg;
    this._persistence = config.persistence;
  }

  get socketUrl() {
    //absolute path is given
    if (this._socketUrl.startsWith("ws")) {
      return this._socketUrl;
    } else {
      return `ws:///${window.location.host}${this._socketUrl}`;
    }
  }

  getSystemConfig<T>(key: string): Observable<T> {
    if (this.systemConfig.has(key)) {
      return new Observable((subscriber: Subscriber<T>) => {
        subscriber.next(this.systemConfig.get(key));
      });
    }
    return new Observable((subscriber: Subscriber<T>) => {
      const requestUrl = `${this.baseUrl}/config/system/${key}`;
      this.http.get<T>(requestUrl).subscribe((value) => {
        this.systemConfig.set(key, value);
        subscriber.next(value);
      });
    });
  }

  getExtensions(): Observable<Extension[]> {
    if (this.extensions) {
      return new Observable((subscriber: Subscriber<Extension[]>) => {
        subscriber.next(this.extensions);
      });
    }
    return new Observable((subscriber: Subscriber<Extension[]>) => {
      const requestUrl = `${this.baseUrl}/config/extensions`;
      this.http.get<Extension[]>(requestUrl).subscribe((value) => {
        this.extensions = value;
        subscriber.next(value);
      });
    });
  }

  get persistence(): PersistenceService | undefined{
      if (this._persistence) {
        if (typeof this._persistence["get"] == 'function') {
            this._persistence = (this._persistence as PersistenceServiceProvider).get()
        }
          return this._persistence as PersistenceService
        } else {
        return undefined
      }
  }
}
