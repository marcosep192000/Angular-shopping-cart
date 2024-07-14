import { Injectable } from '@angular/core';
import { environments } from '../../environments/environments.prod';
import { HttpClient } from '@angular/common/http';
import { Product } from '../interfaces/Product';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService  {
  form: any;

constructor(private http : HttpClient ) { }

  base: String = environments.baseURL; 


  getProducts():Observable<Product[]> {
    return this.http.get<Product[]>(`${this.base}supermarket`);
  }
  

  /* return this.http.get<Product[]>(`${this.base}/supermarket/create-supermarket`); */
}
