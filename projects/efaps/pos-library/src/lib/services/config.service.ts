import { HttpClient } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { Observable, Subscriber } from "rxjs";

import { PosConfig } from "../model";
import { PosConfigToken } from "./pos-config.token";

@Injectable({
  providedIn: "root"
})
export class ConfigService {
  public baseUrl: string;
  public defaultProdImg: string;
  private _socketUrl: string;
  private systemConfig: Map<string, string> = new Map();

  constructor(
    @Inject(PosConfigToken) config: PosConfig,
    private http: HttpClient
  ) {
    this.baseUrl = config.baseUrl;
    this._socketUrl = config.socketUrl;
    this.defaultProdImg = config.defaultProdImg;
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
      this.http.get<string>(requestUrl).subscribe(value => {
        this.systemConfig.set(key, "" + value);
        subscriber.next(value);
      });
    });
  }
}
