import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environments } from '../../environments/environments.prod';
import { Observable } from 'rxjs';
import { Supplier } from '../interfaces/supplier';

@Injectable({
  providedIn: 'root',
})
export class SupplierService {
  suppliers: any[] = [];
  selectedSupplier: any;
  loading: boolean = false;
  base: String = environments.baseURL;

  constructor(private http: HttpClient) { }
  
  getAllSuppliers(): Observable<Supplier[]> { 
    return this.http.get<Supplier[]>(`${this.base}provider`)
  }
   
  getSupplierById(id: number): Observable<Supplier> {
    return this.http.get<Supplier>(`${this.base}provider/${id}`)
  } 

  createSupplier(supplier: Supplier): Observable<Supplier> {
    return this.http.post<Supplier>(`${this.base}provider/create`, supplier)
  }
}
