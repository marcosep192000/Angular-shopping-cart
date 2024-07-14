import { Component, OnInit } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { CategoryService } from '../../../services/category.service';

@Component({
  selector: 'app-form-prueba-generics',
  standalone: true,
  imports: [MatDialogModule,FormsModule,ReactiveFormsModule],
  templateUrl: './form-prueba-generics.component.html',
  styleUrl: './form-prueba-generics.component.css',
})
export class FormPruebaGenericsComponent implements OnInit {
  formGroup!: FormGroup;
  
 constructor(private categoryService:CategoryService){}
 
  
  ngOnInit(): void {}
  cancel() { };
  save() { };
  update() { };
}
