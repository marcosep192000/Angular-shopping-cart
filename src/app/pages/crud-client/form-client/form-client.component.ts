import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { Client } from '../../../interfaces/Client';
import { ClientService } from '../../../services/client.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ChangeDetectionStrategy } from '@angular/core';
import { MatDatepickerModule } from '@angular/material/datepicker';

@Component({
  selector: 'app-form-client',
  standalone: true,

  imports: [
    // Módulos de Angular

    MatDatepickerModule,
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
    // Módulo para notificaciones Toastr
    ToastrModule,
  ],

  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './form-client.component.html',
  styleUrl: './form-client.component.css',
})
export class FormClientComponent implements OnInit {
  formGroup!: FormGroup;
  dataClient: Client[] = [];
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<FormClientComponent>,
    public dialog: MatDialog,
    private fb: FormBuilder,
    private clientService: ClientService,
    private toastr: ToastrService
  ) {
    this.formGroup = this.fb.group({
      name: ['', Validators.required],
      cuit: ['', [Validators.required, Validators.minLength(8)]],
      lastName: [''],
      address: ['', Validators.required],
      tel: ['', [Validators.required, Validators.minLength(9)]],
      email: ['', [Validators.required, Validators.email]],
    });
  }
  ngOnInit(): void {}

  save(): void {
    console.log(this.formGroup.value);
    if (this.formGroup.valid) {
      this.clientService.addClient(this.formGroup.value).subscribe((data) => {
        this.dialogRef.close(data);
        this.showSuccess();
        console.log(this.formGroup.value);
      });
    } else {
      console.log(this.formGroup.errors);
      console.log(this.data);
      this.toastr.error(
        'Por favor, complete todos los campos requeridos!',
        '',
        {
          timeOut: 5000,
          positionClass: 'toast-bottom-right',
        }
      );
    }
  }
  showSuccess() {
    this.toastr.success('Producto guardado con Exito!', '', {
      timeOut: 10000,
      positionClass: 'toast-bottom-right',
    });
  }

  update() {}
  cancel() {
    this.dialogRef.close();
  }

  onInputChange(event: any, controlName: string) {
    const input = event.target.value.replace(/[^0-9]/g, '');
    this.formGroup.get(controlName)?.setValue(input);
  }
}




