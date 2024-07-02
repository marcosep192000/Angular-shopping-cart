import { Injectable, OnInit } from '@angular/core';
import { environments } from '../../environments/environments.prod';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Category } from '../interfaces/Category';


@Injectable({
  providedIn: 'root',
})
export class CategoryService implements OnInit {
  baseUrl = environments.baseURL;

  constructor(private http: HttpClient) {}


  ngOnInit(): void {

  }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.baseUrl}category`);
  }
}
