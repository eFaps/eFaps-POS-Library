import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Health } from "../model";
import { Observable, BehaviorSubject } from "rxjs";
import { ConfigService } from "./config.service";

@Injectable({
  providedIn: "root",
  deps: [HttpClient, ConfigService],
})
export class HealthService {
  private healthSource = new BehaviorSubject<Health>(null);
  currentHealth = this.healthSource.asObservable();
  constructor(private http: HttpClient, private config: ConfigService) {}

  public getHealth(): Observable<Health> {
    const requestUrl = `${this.config.baseUrl}/health`;
    return this.http.get<Health>(requestUrl);
  }

  public monitor(interval: number): Observable<Health> {
    setInterval(() => {
      this.getHealth().subscribe({
        next: health => this.healthSource.next(health),
        error: err => this.healthSource.next(null)
      });
    }, interval * 1000);
    return this.currentHealth;
  }
}
