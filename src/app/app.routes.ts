import { Routes } from '@angular/router';
import { Component } from '@angular/core';
import { Category } from './interfaces/Category';
import { ListCategoryComponent } from './pages/crud-category/list-category/list-category.component';


export const routes: Routes = [
  { path: 'category-list', component: ListCategoryComponent },
];
