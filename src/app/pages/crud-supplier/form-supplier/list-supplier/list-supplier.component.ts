import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Supplier } from '../../../../interfaces/supplier';
import { SupplierService } from '../../../../services/supplier.service';
import { FormSupplierComponent } from '../form-supplier.component';
import { DialogRef } from '@angular/cdk/dialog';

@Component({
  selector: 'app-list-supplier',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    FormsModule,
    MatFormFieldModule,
    MatIconModule,
    MatDialogModule,
    MatFormFieldModule,
    MatButtonModule,
    MatDialogModule,
    MatInputModule,
    MatTooltipModule,
  ],

  templateUrl: './list-supplier.component.html',
  styleUrl: './list-supplier.component.css',
})
export class ListSupplierComponent implements OnInit {
  suppliers: Supplier[] = [];
  displayedColumns: string[] = [
    'id',
    'name',
    'email',
    'phone',
    'contact',
    'Opciones',
  ];
  dataSource = new MatTableDataSource<Supplier>(this.suppliers);

  constructor(
    private supplierService: SupplierService,
    public dialog: MatDialog
  ) { }
  ngOnInit(): void {
    this.getSuppliers();
  }

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  // crear un proveedor
  createSupplier() {
    const dialogRef = this.dialog.open(FormSupplierComponent, {
      disableClose: true,
      autoFocus: true,
      hasBackdrop: true,
      closeOnNavigation: false,
      data: {
        tipo: 'createSupplier',
      },
    });
    dialogRef.afterClosed().subscribe(() => {
      this.getSuppliers();
    });
  }
  // fin nuevo proveedor

  //modificar proveedor 
  updateSupplier(id: number) {
  const dialogRef = this.dialog.open(FormSupplierComponent, {
      disableClose: true,
      autoFocus: true,
      hasBackdrop: true,
      closeOnNavigation: false,
      data: {
        tipo: "updateSupplier",
         updateSupplier: id,
      },
    });
    dialogRef.afterClosed().subscribe(() => {
      this.getSuppliers();
    });
  }


// fin actualizar proveedor 



  deleteSupplier(id: number): void {
    this.supplierService.deleteSupplier(id).subscribe(() => {
      this.getSuppliers();
    });
  }
  getSuppliers(): void {
    this.supplierService.getAllSuppliers().subscribe((suppliers) => {
      this.suppliers = suppliers;
      this.dataSource.data = suppliers;
      console.log(suppliers);
    });
  }
  openDialog(): void {
    const dialogRef = this.dialog.open(FormSupplierComponent, {
      width: '450px',
    });
    dialogRef.afterClosed().subscribe(() => {
      this.getSuppliers();
    });
  }
}
