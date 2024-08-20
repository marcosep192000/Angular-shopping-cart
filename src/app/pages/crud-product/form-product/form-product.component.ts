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
import { Category } from '../../../interfaces/Category';
import { CategoryService } from '../../../services/category.service';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { error } from 'console';
 


@Component({
  selector: 'app-form-product',
  standalone: true,
  imports: [
    ToastrModule,
    MatInputModule,
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    FormsModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatSlideToggleModule,
  ],
  templateUrl: './form-product.component.html',
  styleUrl: './form-product.component.css',
})
export class FormProductComponent implements OnInit {
  protected readonly value = signal('');
  calculatedSalePrice: number = 0;

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
    private productService: ProductService,
    private toastr: ToastrService
  ) {
    this.formGroup = this.fb.group({
      category: [1],
      barCode: ['', Validators.required],
      description: ['', Validators.required],
      name: ['',  Validators.required],
      price: ['', Validators.required],
      stock: ['', Validators.required],
      stockMin: ['', Validators.required],
      stateIva: [false, Validators.required],
      unitOfMeasure: ['', Validators.required],
      salePrice: [''],
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
            category: datos.category.id,
            barCode: datos.barCode,
            description: datos.description,
            name: datos.name,
            price: datos.price,
            stateIva: datos.stateIva,
            stock: datos.stock,
            stockMin: datos.stockMin,
            unitOfMeasure: datos.unitOfMeasure,
            salePrice: datos.salePrice,
            productUsefulness: datos.productUsefulness,
          });
        });
    }

    this.formGroup.valueChanges.subscribe((values) => {
      this.calculateSalePrice(
        values.price,
        values.productUsefulness,
        values.stateIva
      );
    });
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
    if (this.formGroup.valid) {
      this.productService.save(this.formGroup.value).subscribe((data) => {
        this.dialogRef.close(data);
        this.showSuccess();
      });
    } else {
      this.toastr.error('Por favor, complete todos los campos requeridos!', '', {
        timeOut: 5000,
        positionClass: 'toast-bottom-right'
      });
    }
  
    
  }

  showSuccess() {
    this.toastr.success('Poducto guardado con Exito!', '', {
      timeOut: 10000,
      positionClass: 'toast-bottom-right'
    });
  }

  update(): void {
    this.productService
      .update(this.data.updateProduct, this.formGroup.value)
      .subscribe((data) => {
        console.log(this.formGroup.value);
        this.dialogRef.close(data);
      });
  
  }

  calculateSalePrice(
    price: number,
    productUsefulness: number,
    stateIva: boolean
  ): void {
    let finalPrice;
    if (stateIva == false) {
      finalPrice = price + (price * productUsefulness) / 100;
    } else {
      finalPrice = price * 1.21 + (price * productUsefulness) / 100;
    }
    this.calculatedSalePrice = finalPrice;
    this.formGroup.patchValue({ salePrice: finalPrice }, { emitEvent: false });
  }
}

