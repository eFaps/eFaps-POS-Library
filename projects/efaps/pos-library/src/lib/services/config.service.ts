import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  public baseUrl: string;
  public socketUrl: string;
  
  constructor() { }
}
