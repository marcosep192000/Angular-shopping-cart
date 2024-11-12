import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavigationComponent } from "./shared/dasboard/navigation/navigation.component";
import { HttpClient } from '@angular/common/http';
import { ListCategoryComponent } from './pages/crud-category/list-category/list-category.component';
import { CommonModule } from '@angular/common';

import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [RouterOutlet, NavigationComponent, CommonModule,MatProgressSpinner],
})
export class AppComponent {
  title = 'Inventario Pixels';
}
