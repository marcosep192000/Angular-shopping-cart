import { Injectable } from '@angular/core';
import { CtaCte } from '../interfaces/CtaCte';
import { HttpClient } from '@angular/common/http';
import { environments } from '../../environments/environments.prod';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CtaCteService {
  constructor(private httpClient: HttpClient) {}

  baseUrl: string = environments.baseURL;
  save(ctaCte: CtaCte) {
    return this.httpClient.post<CtaCte>(`${this.baseUrl}CtaCte/save`, ctaCte);
  }
  updateCtaCte(id: number, ctaCte: CtaCte) {
    console.log(id + ' updated');
    return this.httpClient.put<CtaCte>(`${this.baseUrl}CtaCte/update/${id}`, ctaCte);
  }
}
   

