import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltip } from '@angular/material/tooltip';
import { ProductService } from '../../../services/product.service';
import { Product } from '../../../interfaces/Product';
import { CommonModule } from '@angular/common';
import { FormProductComponent } from '../form-product/form-product.component';
import { DialogGenericComponent } from '../../../shared/genericsComponents/dialog-generic/dialog-generic.component';

@Component({
  selector: 'app-list-product',
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
  templateUrl: './list-product.component.html',
  styleUrl: './list-product.component.css',
})
export class ListProductComponent implements OnInit {
  products: Product[] = [];
  form!: FormGroup;
  search: string = '';

  displayedColumns: string[] = [
    'barCode',
    'name',
    'description',
    'salePrice',
    'stock',
    'Opciones',
  ];
  dataSource = new MatTableDataSource<Product>(this.products);
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private productService: ProductService,
    public dialog: MatDialog
  ) {}

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void {
    this.getProducts();
  }
  getProducts(): void {
    this.productService.getProducts().subscribe((product) => {
      const filteredProducts = product.filter(
        (product) => product.status.valueOf() === true
      );
      this.dataSource.data = filteredProducts;
    });
  }

  createProduct() {
    const dialogRef = this.dialog.open(FormProductComponent, {
      disableClose: true,
      autoFocus: true,
      hasBackdrop: true,
      closeOnNavigation: false,
      data: {
        tipo: 'createProduct',
      },
    });

    dialogRef.afterClosed().subscribe(() => {
      this.getProducts();
    });
  }
  updateProduct(id: number) {
    const dialogRef = this.dialog.open(FormProductComponent, {
      disableClose: true,
      autoFocus: true,
      hasBackdrop: true,
      closeOnNavigation: false,
      data: {
        tipo: 'updateProduct',
        updateProduct: id,
      },
    });
    dialogRef.afterClosed().subscribe(() => {
      this.getProducts();
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

  deleteProduct(id: number) {
    const dialogRef = this.dialog.open(DialogGenericComponent, {
      disableClose: true,
      autoFocus: true,
      hasBackdrop: true,
      closeOnNavigation: false,
      data: {
        component: 'createProduct', // O cualquier otro componente relevante
        data: `¿Estás seguro de eliminar el Producto con ID ${id}?`, // Aquí pasas el mensaje
        state: 'Eliminar',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(result);
      if (result == true) {
        this.delete_Product(id);
      } else {
        console.log('Cancelado');
      }    
    });
  }

  delete_Product(id: number) {
    console.log(id);
    this.productService.delete(id).subscribe(() => {
        this.getProducts();
    });
  }
}
