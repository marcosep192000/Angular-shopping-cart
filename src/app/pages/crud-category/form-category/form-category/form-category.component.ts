import { Component } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-form-category',
  standalone: true,
  imports: [MatInputModule , FormsModule],
  templateUrl: './form-category.component.html',
  styleUrl: './form-category.component.css'
})
export class FormCategoryComponent {



  
  categoryName: string = '';
  constructor() { }
}
