import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { NavigationComponent } from "./shared/dasboard/navigation/navigation.component";

 
import { CommonModule } from '@angular/common';

import { MatProgressSpinner, MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [
    RouterModule,
    CommonModule,
    MatProgressSpinnerModule,
  ],
})
export class AppComponent {
  title = 'Inventario Pixels';
}
