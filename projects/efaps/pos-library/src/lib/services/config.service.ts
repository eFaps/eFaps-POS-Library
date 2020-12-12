import { HttpClient } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { Observable, Subscriber } from "rxjs";

import { Extension, PersistenceService, PosConfig } from "../model";
import { PosConfigToken } from "./pos-config.token";

@Injectable({
  providedIn: "root",
})
export class ConfigService {
  public baseUrl: string;
  public defaultProdImg: string;
  public persistence: PersistenceService;
  private _socketUrl: string;
  private systemConfig: Map<string, string> = new Map();
  private extensions: Extension[];

  constructor(
    @Inject(PosConfigToken) config: PosConfig,
    private http: HttpClient
  ) {
    this.baseUrl = config.baseUrl;
    this._socketUrl = config.socketUrl;
    this.defaultProdImg = config.defaultProdImg;
    this.persistence = config.persistence;
  }

  get socketUrl() {
    //absolute path is given
    if (this._socketUrl.startsWith("ws")) {
      return this._socketUrl;
    } else {
      return `ws:///${window.location.host}${this._socketUrl}`;
    }
  }

  getSystemConfig(key: string): Observable<string> {
    if (this.systemConfig.has(key)) {
      return new Observable((subscriber: Subscriber<string>) => {
        subscriber.next(this.systemConfig.get(key));
      });
    }
    return new Observable((subscriber: Subscriber<string>) => {
      const requestUrl = `${this.baseUrl}/config/system/${key}`;
      this.http.get<string>(requestUrl).subscribe((value) => {
        this.systemConfig.set(key, "" + value);
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
}
