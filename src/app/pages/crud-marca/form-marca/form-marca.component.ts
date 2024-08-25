import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ToastrModule } from 'ngx-toastr';
import { MarcaService } from '../../../services/marca.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Marca } from '../../../interfaces/marca';
import { FormProductComponent } from '../../crud-product/form-product/form-product.component';

@Component({
  selector: 'app-form-marca',
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
  templateUrl: './form-marca.component.html',
  styleUrl: './form-marca.component.css',
})
export class FormMarcaComponent implements OnInit {
  formGroup!: FormGroup;
  marcas: Marca[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<FormMarcaComponent>,
    public dialog: MatDialog,

    private marcaService: MarcaService,
    private router: Router,
    private HttpClient: HttpClient,
    private fb: FormBuilder
  ) {

    this.formGroup = this.fb.group({
      marca: ['', [Validators.required, Validators.minLength(3)]],
    });
  }

  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }
  cancel() {
    this.dialogRef.close();
  }
  save() {
   /*  this.marcaService.createMarca(this.formGroup.value).subscribe((data) => {
      this.dialogRef.close(data);
    }); */
  }
  update() { }
}
