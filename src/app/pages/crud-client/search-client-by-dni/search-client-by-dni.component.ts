import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { ClientService } from '../../../services/client.service';
import { HttpClient } from '@angular/common/http';
import { Client } from '../../../interfaces/Client';

@Component({
  selector: 'app-search-client-by-dni',
  standalone: true,
  imports: [
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
  ],
  templateUrl: './search-client-by-dni.component.html',
  styleUrl: './search-client-by-dni.component.css',
})
export class SearchClientByDniComponent implements OnInit {

  formGroup!: FormGroup;
  clientData: any;
  constructor(
    public dialogRef: MatDialogRef<SearchClientByDniComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private httpClient: HttpClient,
    private clientService: ClientService
  ) {}
  ngOnInit(): void {
    this.formGroup = this.fb.group({
      dni: ['20325586592', Validators.required],
    });
  }

  getClientByDni() {
    if (this.formGroup.valid) {
      this.clientService.getClientByDni(this.formGroup.value.dni).subscribe(
        (data: Client) => {
          console.log(data);
          this.dialogRef.close(data); // Cierra el diálogo y pasa los datos del cliente
          this.toastr.success('Cliente Encontrado...');
        },
        (error) => {
          
          console.error('Error fetching client:', error);
          this.toastr.error(
            'No se pudo encontrar el cliente. Intenta nuevamente.'
          );
        }
      );
    } else {
      this.toastr.warning('Por favor, ingresa un DNI válido.');
    }
  }
  close() {
this.dialogRef.close();
}
}

  
