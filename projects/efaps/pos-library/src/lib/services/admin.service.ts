import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ReplaySubject } from "rxjs";

import { Versions } from "../model/versions";
import { ConfigService } from "./config.service";
import { ImageService } from "./image.service";

@Injectable({
  providedIn: "root",
  deps: [HttpClient, ConfigService],
})
export class AdminService {
  private reloadSubject = new ReplaySubject<void>();
  reloadEvent = this.reloadSubject.asObservable();

  constructor(
    private http: HttpClient,
    private config: ConfigService,
    private imageService: ImageService
  ) {}

  reload(): Observable<any> {
    this.imageService.clear();
    const url = `${this.config.baseUrl}/admin/sync`;
    return this.http.get(url);
  }

  version(): Observable<Versions> {
    const url = `${this.config.baseUrl}/admin/versions`;
    return this.http.get<Versions>(url);
  }
}
