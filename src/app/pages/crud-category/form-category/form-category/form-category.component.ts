import { Component, Inject, inject, OnInit } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { ListCategoryComponent } from '../../list-category/list-category.component';
import { CategoryService } from '../../../../services/category.service';
import { Category } from '../../../../interfaces/Category';
import { trigger } from '@angular/animations';
@Component({
  selector: 'app-form-category',
  standalone: true,
  imports: [
    MatInputModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './form-category.component.html',
  styleUrl: './form-category.component.css',
})
export class FormCategoryComponent implements OnInit {
  formGroup!: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<FormCategoryComponent>,
    private fb: FormBuilder,
    private categoryService: CategoryService
  ) {}
  ngOnInit(): void {
    this.initForm();
  }
  cancel(): void {
    this.dialogRef.close();
  }
  save(): void {
    this.categoryService
      .createCategory(this.formGroup.value)
      .subscribe((data) => {
        console.log(data + 'cready saved');
        this.dialogRef.close();
      });
  }

  update(id: number): void {
    if (this.data.idCategory != null) {
      this.categoryService.finById(this.data.idCategory).subscribe((data) => {
        console.log(data.id);
        this.fb.group({
          nameCategory: data.nameCategory,
          descriptionCategory: data.descriptionCategory,
        });
        this.dialogRef.close(data);
      });
    }
  }

  initForm() {
    if (this.data.idCategory != null) {
     
      this.categoryService.finById(this.data.idCategory).subscribe((datos) => {
      


        
   
      this.formGroup = this.fb.group({
        nameCategory: [
          { value: datos.nameCategory, disabled: false },
          [Validators.required, Validators.minLength(6)],
        ],
        descriptionCategory: [
          { value: datos.descriptionCategory, disabled: false },
          [Validators.required, Validators.minLength(6)],
        ],
      });

 })

    }



  }
}
