import { Component, Inject, OnInit, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { ProductService } from '../../../services/product.service';
import { Product } from '../../../interfaces/Product';
import { Category } from '../../../interfaces/Category';
import { CategoryService } from '../../../services/category.service';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';


@Component({
  selector: 'app-form-product',
  standalone: true,
  imports: [
    MatInputModule,
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    FormsModule,
MatSelectModule,
    ReactiveFormsModule,
  ],
  templateUrl: './form-product.component.html',
  styleUrl: './form-product.component.css',
})
export class FormProductComponent implements OnInit {
  protected readonly value = signal('');

  protected onInput(event: Event) {
    this.value.set((event.target as HTMLInputElement).value);
  }

  formGroup!: FormGroup;
  dataCategories: Category[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<FormProductComponent>,
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private productService: ProductService
  ) {
    this.formGroup = this.fb.group({
      category: [1],
      barCode: ['', Validators.required],
      description: ['', Validators.required],
      name: ['', Validators.required],
      price: ['', Validators.required],
      stock: ['', Validators.required],
      stockMin: ['', Validators.required],
      unitOfMeasure: ['', Validators.required],
      salePrice: ['', Validators.required],
      productUsefulness: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadCategories();
    if (this.data.updateProduct != null) {
      this.productService
        .findById(this.data.updateProduct)
        .subscribe((datos) => {
          this.formGroup.patchValue({
            category:  datos.category.id ,
            barCode: datos.barCode,
            description: datos.description,
            name: datos.name,
            price: datos.price,
            stock: datos.stock,
            stockMin: datos.stockMin,
            unitOfMeasure: datos.unitOfMeasure,
            salePrice: datos.salePrice,
            productUsefulness: datos.productUsefulness,
          });
        });
    }
  }

  loadCategories() {
    this.categoryService.getCategories().subscribe((categories) => {
      this.dataCategories = categories;
    });
  }

  cancel() {
    this.dialogRef.close();
  }

  save(): void {
    this.productService.save(this.formGroup.value).subscribe((data) => {
      this.dialogRef.close(data);
    });
  }

  update(): void {
    /*   this.productService
      .update(this.data.updateProduct, this.formGroup.value)
      .subscribe((data) => {
        console.log(this.formGroup.value);
        this.dialogRef.close(data);
      }); */
  }
}

