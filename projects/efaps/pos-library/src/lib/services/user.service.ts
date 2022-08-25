import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { User } from "../model/index";
import { ConfigService } from "./config.service";

@Injectable({
  providedIn: "root",
  deps: [HttpClient, ConfigService],
})
export class UserService {
  constructor(private http: HttpClient, private config: ConfigService) {}

  public getUsers(): Observable<User[]> {
    const href = this.config.baseUrl + "/users";
    const requestUrl = `${href}`;
    return this.http.get<User[]>(requestUrl);
  }

  public current(): Observable<User> {
    const href = this.config.baseUrl + "/users/current";
    const requestUrl = `${href}`;
    return this.http.get<User>(requestUrl);
  }
}
