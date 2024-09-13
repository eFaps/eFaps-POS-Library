import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { PosFile } from "../model";
import { ConfigService } from "./config.service";

@Injectable({
  providedIn: "root",
})
export class PosFileService {
  constructor(
    private http: HttpClient,
    private config: ConfigService,
  ) {}

  public getFile(oid: string): Observable<PosFile> {
    const requestUrl = `${this.config.baseUrl}/pos-files/${oid}`;
    return this.http.get<PosFile>(requestUrl);
  }

  public findByTag(tag: string, valueRegex: String): Observable<PosFile[]> {
    const requestUrl = `${this.config.baseUrl}/pos-files`;
    const params: any = { tag: tag, value: valueRegex };
    return this.http.get<PosFile[]>(requestUrl, { params });
  }
}
