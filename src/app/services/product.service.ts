import { Injectable } from '@angular/core';
import { environments } from '../../environments/environments.prod';

@Injectable({
  providedIn: 'root'
})
export class ProductService  {

constructor() { }

  base: String = environments.baseURL; 

  
}
