import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Cacheable } from "ngx-cacheable";
import { Observable, Subscriber } from "rxjs";

import { ConfigService } from "./config.service";

@Injectable({
  providedIn: "root",
  deps: [HttpClient, ConfigService]
})
export class ImageService {
  constructor(private http: HttpClient, private config: ConfigService) {}

  @Cacheable()
  public loadImage(_oid: string): Observable<any> {
    const url = `${this.config.baseUrl}/images/${_oid}`;
    return new Observable((observer: Subscriber<any>) => {
      let objectUrl: string = null;
      this.http.get(url, { responseType: "blob" }).subscribe(m => {
        objectUrl = URL.createObjectURL(m);
        observer.next(objectUrl);
      });
      return () => {
        if (objectUrl) {
          URL.revokeObjectURL(objectUrl);
          objectUrl = null;
        }
      };
    });
  }

  @Cacheable()
  getBase64Image(oid: string): Observable<String> {
    const url = `${this.config.baseUrl}/images/${oid}`;
    return new Observable<String>((subscriber: Subscriber<String>) => {
      let objectUrl: string = null;
      this.http.get(url, { responseType: "blob" }).subscribe(blob => {
        var reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
          const base64 = reader.result;
          subscriber.next(base64.toString());
        };
      });
      return () => {
        if (objectUrl) {
          URL.revokeObjectURL(objectUrl);
          objectUrl = null;
        }
      };
    });
  }
}
