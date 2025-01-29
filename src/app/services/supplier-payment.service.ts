import { Injectable } from '@angular/core';
import { environments } from '../../environments/environments.prod';
import { HttpClient } from '@angular/common/http';
import { BuySupplier } from '../interfaces/buy-supplier';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SupplierPaymentService {

  base: string = environments.baseURL; 
  
  constructor( private http :HttpClient) { }

  createPaymentSupplier(buySupplier:BuySupplier): Observable<BuySupplier> {
    return this.http.post<BuySupplier>(`${this.base}invoice-provider/new-invoice-provider`,buySupplier
    );
  }
}
