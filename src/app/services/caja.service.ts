import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environments } from '../../environments/environments.prod';
import { Caja } from '../interfaces/Caja';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CajaService {
  baseUrl = environments.baseURL;
  constructor(private httpClient: HttpClient) { }

  // Get all cajas
  getAllCajas(): Observable<Caja[]>{
   return this.httpClient.get<Caja[]>(`${this.baseUrl}cajas/todas`);
}



  getCajas(): Observable<Caja> {
    return this.httpClient.get<Caja>(`${this.baseUrl}cajas/abierta`);
  }
  closeCaja(id:number) :Observable<Caja> {
    return this.httpClient.put<Caja>(`${this.baseUrl}cajas/${id}/cierre`, null);
  }


}