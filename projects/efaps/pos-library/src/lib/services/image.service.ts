import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map, Observable, Subscriber } from "rxjs";

import { ConfigService } from "./config.service";

@Injectable({
  providedIn: "root",
  deps: [HttpClient, ConfigService],
})
export class ImageService {
  private cache: Map<string, string> = new Map<string, string>();

  constructor(
    private http: HttpClient,
    private config: ConfigService,
  ) {}

  public loadImage(oid: string): Observable<string> {
    if (this.cache.has(oid)) {
      return this.getFromCache(oid);
    }
    const url = `${this.config.baseUrl}/images/${oid}`;
    return this.http.get(url, { responseType: "blob" }).pipe(
      map((imageBlob) => {
        const objectUrl = URL.createObjectURL(imageBlob);
        this.cache.set(oid, objectUrl);
        return objectUrl;
      }),
    );
  }

  private getFromCache(oid: string): Observable<string> {
    return new Observable((subscriber) => {
      subscriber.next(this.cache.get(oid));
      subscriber.complete();
    });
  }

  getBase64Image(oid: string): Observable<String> {
    if (this.cache.has(oid)) {
      return this.getFromCache(oid);
    }
    const url = `${this.config.baseUrl}/images/${oid}`;
    return new Observable<String>((subscriber: Subscriber<String>) => {
      this.http.get(url, { responseType: "blob" }).subscribe((blob) => {
        var reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
          const base64 = reader.result;
          subscriber.next(base64.toString());
        };
      });
    });
  }

  clear() {
    this.cache.forEach((value: string, _key: string) => {
      URL.revokeObjectURL(value);
    });
    this.cache.clear();
  }
}
