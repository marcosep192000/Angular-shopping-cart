import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FindSupplierComponent } from '../../find-supplier/find-supplier.component';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import {
  ControlContainer,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { ProductService } from '../../../../services/product.service';

import { ProductItemSale } from '../../../../interfaces/ProductItemSale';
import { Product } from '../../../../interfaces/Product';
import { FormProductComponent } from '../../../crud-product/form-product/form-product.component';
import { PaymentTermsComponent } from '../../payment-terms/payment-terms.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { FormBuilder } from '@angular/forms';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
  MatNativeDateModule,
} from '@angular/material/core';
import { SupplierPaymentService } from '../../../../services/supplier-payment.service';
import { subscribe } from 'node:diagnostics_channel';

// Formato de fechas personalizado
const CUSTOM_DATE_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-register-income-supplier',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    ReactiveFormsModule,
    FormsModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatSlideToggleModule,
    ToastrModule,
    FindSupplierComponent,
    PaymentTermsComponent,
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }, // Configura el idioma de las fechas
    { provide: MAT_DATE_FORMATS, useValue: CUSTOM_DATE_FORMATS }, // Usa el formato personalizado
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './register-income-supplier.component.html',
  styleUrls: ['./register-income-supplier.component.css'],
})
export class RegisterIncomeSupplierComponent implements OnInit {
  // VARIABLES
  products: ProductItemSale[] = [];
  code: string = '';
  product!: ProductItemSale;
  formProduct!: FormGroup;
  formInvoice!: FormGroup;
  showForm?: boolean = false;

  constructor(
    private productService: ProductService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private dialog: MatDialog,
    private supplierPamentService: SupplierPaymentService
  ) {
    this.formProduct = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: ['', Validators.required],
      stock: ['', Validators.required],
      iva: ['', Validators.required],
      salePrice: ['', Validators.required],
      marca: ['', Validators.required],
      quantity: [5, [Validators.required, Validators.min(1)]],
      totalStock: [{ value: 0 }],
    });
    this.formProduct.get('quantity')?.valueChanges.subscribe((quantity) => {
      const stock = this.formProduct.get('stock')?.value || 0;
      this.formProduct.patchValue({
        totalStock: (stock || 0) + (quantity || 0),
      });
    });

    // formulario para realizar la factura
    this.formInvoice = this.fb.group({
      idInvoice: ['', ],
      dateOfEntry: ['',],
      dueDate: ['', ],
      payDay: ['',],
      provider: [1, ],
      paymentStatus: [false, ],
      amount: [0, ],
      invoiceDetailsProviders: [[],],
    });
    this.formInvoice
      .get('invoiceDetailsProviders')
      ?.valueChanges.subscribe((details) => {
        const total = details.reduce(
          (sum: number, item: any) => sum + item.subTotal,
          0
        );
        this.formInvoice.patchValue({ amount: total });
      });
  }

  ngOnInit(): void { }

  selectedPaymentTerm: string = 'CUENTA_CORRIENTE';
  onPaymentTermChange(selected: string): void {
    this.selectedPaymentTerm = selected;
  }

  deleteProduct(barCode: string) {
    const index = this.products.findIndex(
      (product) => product.barCode === barCode
    );
    if (index > -1) {
      this.products.splice(index, 1);
      this.toastr.success('Producto eliminado de la lista.');
    } else {
      this.toastr.error('No se encontró el producto en la lista.');
    }
  }

  onInputChange($event: Event) {
    this.code = ($event.target as HTMLInputElement).value;
    if (this.code) {
      this.productService.search(this.code).subscribe(
        (data) => {
          this.product = data;
          this.loadProduct(this.product);
          this.showForm = true;
        },
        (err) => {
          this.showForm = false;
        }
      );
    } else {
      this.toastr.error('Error al mostrar el Producto!');
      this.showForm = false;
      this.code = '';
      ($event.target as HTMLInputElement).value = '';
    }
  }

  loadProduct(data: ProductItemSale): void {
    if (data) {
      this.product = data;
      this.formProduct.patchValue({
        name: data.name,
        description: data.description,
        stock: data.stock,
        iva: data.iva,
        salePrice: data.salePrice,
        price: data.price,
        quantity: null,
        totalStock: data.stock,
      });

      this.formProduct.get('description')?.disable();
      this.formProduct.get('stock')?.disable();
      this.formProduct.get('iva')?.disable();
    } else {
      console.warn('Producto no encontrado');
    }
  }

  addListProduct() {
    const productData = {
      ...this.formProduct.getRawValue(),
      barCode: this.code,
    };

    const existingProduct = this.products.find(
      (product) => product.name === productData.name
    );

    if (!this.formProduct.valid) {
      if (existingProduct) {
        this.toastr.info('Ya existe el producto en la lista de productos!');
      } else if (productData.quantity <= 0) {
        this.toastr.error('La cantidad de ingreso es menor o igual a 0 (cero)');
      } else {
        const totalPrd =
          Number(productData.quantity) + Number(productData.stock);
        productData.totalStock = totalPrd;

        this.products.push(productData);
        this.code = '';
        this.formProduct.reset();
        this.toastr.success('Se agregó el producto a la lista');
      }
    } else {
      this.toastr.error(
        '¡El formulario no es válido! Por favor, verifique que los datos estén correctos.'
      );
    }
  }

  createProduct(event: Event) {
    event.preventDefault();
    const dialogRef = this.dialog.open(FormProductComponent, {
      disableClose: true,
      autoFocus: true,
      hasBackdrop: true,
      closeOnNavigation: false,
      data: { tipo: 'createProduct' },
    });

    dialogRef.afterClosed().subscribe(() => { });
  }

  //guarda la factura de proveedor
  saveInvoiceSupplier(): void {
    if (this.formInvoice.invalid) {
      this.toastr.error('Por favor, completa todos los campos obligatorios.');
      return;
    }

    const invoiceData = {

      ...this.formInvoice.value,
      invoiceDetailsProviders: this.products.map(product => ({
        barCode: product.barCode,
        quantity: product.quantity,
        price: product.price,
        subTotal: product.quantity * product.price,
      
      })),
    };

    this.supplierPamentService.createPaymentSupplier(invoiceData).subscribe(
      () => {
        this.toastr.success('Factura guardada exitosamente.');
        this.formInvoice.reset();
        this.products = [];
      },
      (error) => {
        this.toastr.error('Ocurrió un error al guardar la factura.');
        console.error(error);
      }
    );
  }
}