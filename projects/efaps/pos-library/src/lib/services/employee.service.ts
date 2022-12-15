import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Employee } from "../model";
import { ConfigService } from "./config.service";

@Injectable({
  providedIn: "root",
})
export class EmployeeService {
  constructor(private http: HttpClient, private config: ConfigService) {}

  public getEmployees(): Observable<Employee[]> {
    const requestUrl = `${this.config.baseUrl}/employees`;
    return this.http.get<Employee[]>(requestUrl);
  }
}
