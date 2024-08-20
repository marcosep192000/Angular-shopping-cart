import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Dolar } from '../interfaces/dolar';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiDolarService {
  api: string = 'https://dolarapi.com/v1/dolares/oficial';

   dolar!: Dolar; 

  constructor(private httpClient: HttpClient) {
  }


  getDolar(): Observable<Dolar> {
    return this.httpClient.get<Dolar>(this.api); 
  }
}
