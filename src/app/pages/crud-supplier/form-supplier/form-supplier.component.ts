import { Component, Inject, Provider } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, FormsModule, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import { SupplierService } from '../../../services/supplier.service';
import { MatError, MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { MatIconModule } from '@angular/material/icon';
import { ErrorStateMatcher } from '@angular/material/core';
import { Supplier } from '../../../interfaces/supplier';


export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    const isSubmitted = form && form.submitted;
    return !!(
      control &&
      control.invalid &&
      (control.dirty || control.touched || isSubmitted)
    );
  }
}

@Component({
  selector: 'app-form-supplier',
  standalone: true,
  imports: [
    ToastrModule,
    MatInputModule,
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    FormsModule,
    MatIconModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    FormsModule,
    MatFormFieldModule,
  MatError,
    ReactiveFormsModule,
  ],
  templateUrl: './form-supplier.component.html',
  styleUrl: './form-supplier.component.css',
})
export class FormSupplierComponent {
  [x: string]: any;
  formGroup!: FormGroup;
  suplier: Supplier[] = []
  
  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);

  constructor(
    private suppleierService: SupplierService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<FormSupplierComponent>,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private toast: ToastrService
  ) {
    this.formGroup = this.fb.group({
      name: ['', Validators.required],
      cuit: [
        '',
        [
          Validators.required,
          Validators.maxLength(12), // La validación de longitud se realiza en el lado del formulario
          Validators.pattern('^[0-9]*$'), // Asegura que solo se ingresen números
        ],
      ],
      phone: ['', Validators.required],
      address: [''],
      contact: [''],
      email: this.emailFormControl,
    });
  }

  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    const isSubmitted = form && form.submitted;
    return !!(
      control &&
      control.invalid &&
      (control.dirty || control.touched || isSubmitted)
    );
  }


  cancel() {
    this.dialogRef.close();
  }
  save() {
    console.log(this.formGroup.value); 
    if (this.formGroup.value) {
      this.suppleierService.createSupplier(this.formGroup.value).subscribe({
        next: (data) => {
          // Manejo en caso de éxito
          this.toast.info('Proveedor guardado correctamente');
          this.dialogRef.close(data);
        },
        error: (err) => {
          // Manejo en caso de error
          this.toast.error(
            'Formulario inválido. Por favor, revisa los campos.'
          );
        },
      });
    } else {
      this.toast.error('Formulario inválido. Por favor, revisa los campos.');
    }

    }
  update() {}



  /* hacer que sea una funcion generica para cada formulario con numeros  */
  onInputChange(event: any,controlName:string) {
    const input = event.target.value.replace(/[^0-9]/g, '');
    this.formGroup.get(controlName)?.setValue(input);
  }
}

