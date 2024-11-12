import { Component, OnInit, ViewChild } from '@angular/core';
import { ClientService } from '../../../services/client.service';
import { Client } from '../../../interfaces/Client';
import { CommonModule } from '@angular/common';
import { FormGroup, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltip } from '@angular/material/tooltip';
import { FormClientComponent } from '../form-client/form-client.component';

@Component({
  selector: 'app-list-client',
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
    MatTooltip,
  ],
  templateUrl: './list-client.component.html',
  styleUrl: './list-client.component.css',
})
export class ListClientComponent implements OnInit {
  clients: Client[] = [];
  Form!: FormGroup;
  serch: string = '';

  displayedColumns: string[] = [
    'id',
    'dni',
    'name',
    'lastName',
    'address',
    'tel',
    'email',
    'Opciones',
  ];

  dataSource = new MatTableDataSource<Client>(this.clients);

  constructor(public clientService: ClientService, public dialog: MatDialog) {}
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator; // Añadimos el paginador al datasource
  }

  ngOnInit(): void {
    this.getClients();
  }

  getClients(): void {
    this.clientService.getClients().subscribe((client) => {
      const filteredProducts = client.filter(
        (client) => client.status.valueOf() === true
      );
      this.dataSource.data = filteredProducts;
    });
  }
  /* filtros para la busqueda */
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  createClient() {
    const dialogRef = this.dialog.open(FormClientComponent, {
      disableClose: true,
      autoFocus: true,
      hasBackdrop: true,
      closeOnNavigation: false,
      data: {
        tipo: 'createClient',
      },
    });

    dialogRef.afterClosed().subscribe(() => {
      this.getClients();
    });
  }
  updateClient(id: number) {
    const dialogRef = this.dialog.open(FormClientComponent, {
      disableClose: true,
      autoFocus: true,
      hasBackdrop: true,
      closeOnNavigation: false,
      data: {
        tipo: 'updateClient',
        updateClient: id,
      },
    });
   

    dialogRef.afterClosed().subscribe(() => {
      this.getClients();
    });
  }
  deleteClient(id: number) {
    console.log(id);
    this.clientService.delete(id).subscribe(() => {
      this.getClients();
    });
  }
}
