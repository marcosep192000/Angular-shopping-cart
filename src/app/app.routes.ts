import { Routes } from '@angular/router';
import { Component } from '@angular/core';
import { Category } from './interfaces/Category';
import { ListCategoryComponent } from './pages/crud-category/list-category/list-category.component';
import { ListProductComponent } from './pages/crud-product/list-product/list-product.component';
import { ListClientComponent } from './pages/crud-client/list-client/list-client.component';



export const routes: Routes = [
  { path: 'category-list', component: ListCategoryComponent },
  { path: 'product-list', component: ListProductComponent },
  { path: 'client-list', component: ListClientComponent },
];
