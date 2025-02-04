import { Component, OnInit, ViewChild } from '@angular/core';
import { CajaService } from '../../../services/caja.service';
import { Caja } from '../../../interfaces/Caja';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { DialogGenericComponent } from '../../../shared/genericsComponents/dialog-generic/dialog-generic.component';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';

@Component({
  selector: 'app-cash-closing',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatPaginatorModule,
    MatDialogModule,
  ],
  templateUrl: './cash-closing.component.html',
  styleUrl: './cash-closing.component.css',
})
export class CashClosingComponent implements OnInit {
  caja?: Caja;
  cajas: Caja[] = []; //
  serch: string = '';
  displayedColumns: string[] = [
    'id',
    'fecha',
    'apertura',
    'ingresos',
    'egresos',
    'cierre',
    'estado',
  ];
  dataSource = new MatTableDataSource<Caja>(this.cajas);
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private cajaService: CajaService, public dialog: MatDialog) {}

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator; // Añadimos el paginador al datasource
  }
  ngOnInit(): void {
    this.getCashOpen();
    this.getAllCash();
  }

  getAllCash(): void {
    this.cajaService.getAllCajas().subscribe((data) => {
      this.cajas = data; // Asignar los datos a la propiedad cajas
      this.dataSource = new MatTableDataSource(this.cajas); // Actualizar el dataSource con los nuevos datos
      this.dataSource.paginator = this.paginator; // Asociar el paginador
    });
  }

  getCashOpen() {
    this.cajaService.getCajas().subscribe((data) => {
      this.caja = data;
    });
  }

  cashClose(id: number) {
    const dialogRef = this.dialog.open(DialogGenericComponent, {
      disableClose: true,
      autoFocus: true,
      hasBackdrop: true,
      closeOnNavigation: false,
      data: {
        data: `¿Estás seguro de Cerrar esta caja? No podra ser modificada.`, // Aquí pasas el mensaje
        state: 'Cerrar',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result == true) {
        this.cajaService.closeCaja(id).subscribe((data) => {
          console.log(data);
          this.getCashOpen();
          this.getAllCash();
        });
      } else {
        console.log('Cancelado');
      }
    });
  }
}


 

