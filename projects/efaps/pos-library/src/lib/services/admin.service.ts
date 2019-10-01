import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Versions } from '../model/versions';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private http: HttpClient, private config: ConfigService) { }


  reload(): Observable<any> {
    const url = `${this.config.baseUrl}/admin/sync`;
    return this.http.get(url);
  }

  version(): Observable<Versions> {
    const url = `${this.config.baseUrl}/admin/versions`;
    return this.http.get<Versions>(url);
  }
}
