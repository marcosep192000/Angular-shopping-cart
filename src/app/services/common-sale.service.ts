import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environments } from '../../environments/environments';
 
import { Observable } from 'rxjs';
import { SaleCommon } from '../interfaces/sale-common';


@Injectable({
  providedIn: 'root',
})
export class CommonSaleService {
  constructor(public httpClient: HttpClient) {}

  baseUrl: string = environments.baseURL;

  saveCommon(saleCommons: SaleCommon): Observable<SaleCommon> {
    return this.httpClient.post<SaleCommon>(
      `${this.baseUrl}ticket/create-ticket`,
      saleCommons
    );
  }
}