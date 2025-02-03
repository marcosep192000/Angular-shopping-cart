import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { FormProductComponent } from '../../crud-product/form-product/form-product.component';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatError, MatFormFieldModule } from '@angular/material/form-field';
import { MatTabsModule } from '@angular/material/tabs';
import { IconComponent } from "../../../shared/dasboard/icon/icon.component";
@Component({
  selector: 'app-total-sale',
  standalone: true,
  imports: [
    MatTabsModule,
    ToastrModule,
    MatInputModule,
    CommonModule,
    MatIconModule,
    MatDialogModule,
    MatButtonModule,
    FormsModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatSlideToggleModule,
    FormsModule,
    MatFormFieldModule,
    MatError,
    ReactiveFormsModule,
    IconComponent
],
  templateUrl: './total-sale.component.html',
  styleUrl: './total-sale.component.css',
})
export class TotalSaleComponent implements OnInit {
  formGroup!: FormGroup;
  amountPaid: number = 0; // El monto que el cliente paga (se actualizará en el formulario)
  change: number = 0; // El vuelto
  difference: number = 0; // La diferencia que el cliente tiene que abonar

  ngOnInit(): void {}
  // CONSTRUCTOR -------------------
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<FormProductComponent>,
    public dialog: MatDialog,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) {
    this.formGroup = this.fb.group({
      price: [
        '',
        [
          Validators.required,
          Validators.pattern('^\\d*\\.?\\d*$'), // Acepta números decimales
        ],
      ],
      // Add your form controls here
    });
  }
  //---------------------------------
  cancel() {
    this.dialogRef.close();
  }
  save() {
    if (this.difference > 0) {
      this.toastr.error('Aún hay un saldo pendiente por abonar.');
      return;
    }
    
    const saleData = {
      amountPaid: this.amountPaid,
      change: this.change,
      difference: this.difference,
      totalPrice: this.data.totalPrice,
    };

    // Emitir los datos de la venta al componente principal (NewSaleComponent)
    this.dialogRef.close(saleData);
  }

  onInputChange(event: Event, controlName: string): void {
    const input = event.target as HTMLInputElement;
    // Filtra todos los caracteres no numéricos, excepto el punto decimal
    const filteredValue = input.value.replace(/[^0-9.]/g, '');
    // Limita la longitud a 12 caracteres
    const finalValue = filteredValue.slice(0, 12);
    const control = this.formGroup.get(controlName);
    if (control) {
      control.setValue(finalValue, { emitEvent: false });
      // Actualiza el monto pagado (esto es lo que se va a utilizar para calcular el vuelto)
      this.amountPaid = parseFloat(finalValue) || 0; // Si el valor no es válido, se toma 0
      this.calculateDifference();
      // Recalcula la diferencia y el vuelto
    }
  }

  calculateChange() {
    this.change = -this.data.totalSale;
    this.difference = Math.abs(this.change); // Se toma el valor absoluto para mostrar el vuelto en positivo
  }

  calculateDifference() {
    // Si el monto pagado es mayor o igual al total, calculamos el vuelto
    if (this.amountPaid >= this.data.totalPrice) {
      this.change = this.amountPaid - this.data.totalPrice;
      this.difference = 0;
    } else {
      // Si el monto pagado es menor, calculamos la diferencia que falta por pagar
      this.difference = this.data.totalPrice - this.amountPaid;
      this.change = 0;
    }
  }
}
