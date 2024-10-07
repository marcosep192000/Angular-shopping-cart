import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environments } from '../../environments/environments.prod';
import { Observable } from 'rxjs';
import { Client } from '../interfaces/Client';



@Injectable({
  providedIn: 'root',
})
export class ClientService {
  baseUrl: string = environments.baseURL;

  constructor(private http: HttpClient) {}

  // Get all clients
  getClients(): Observable<Client[]> {
    return this.http.get<Client[]>(`${this.baseUrl}customer`);
  }

  // Add new client
  addClient(client: any) {
    return this.http.post(`${this.baseUrl}client/create`, client);
  }
  // Get client by ID
  getClientById(id: number) {
    return this.http.get(`${this.baseUrl}client/find/${id}`);
  }
  // Update client by ID
  updateClient(id: number, client: any) {
    return this.http.put(`${this.baseUrl}client/update/${id}`, client);
  }
  // Delete client by ID
  delete(id: number) {
    return this.http.delete(`${this.baseUrl}client/${id}`);
  }
}
