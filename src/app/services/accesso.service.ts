import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environments } from '../../environments/environments.prod';
import { Observable } from 'rxjs';
 
import { Usuario } from '../interfaces/Usuario';
import { Login } from '../interfaces/Login';
import { ResponseAcceso } from '../interfaces/ResponseAcceso';
@Injectable({
  providedIn: 'root',
})
export class AccessoService {
  private http = inject(HttpClient);
  baseUrl: string = environments.baseURL;
  constructor() {}

  registrarse(objeto: Usuario): Observable<ResponseAcceso> {
    return this.http.post<ResponseAcceso>(`${this.baseUrl}auth/registro`, objeto);
  }

  login(objeto: Login): Observable<ResponseAcceso> {
    return this.http.post<ResponseAcceso>(`${this.baseUrl}auth/login`, objeto);
  }
}
