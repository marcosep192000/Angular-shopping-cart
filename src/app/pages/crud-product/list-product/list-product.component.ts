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
import { Pipe } from '@angular/core';
import { CommonModule } from '@angular/common';

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
    'price',
    'salePrice',
    'productUsefulness',
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
      this.dataSource.data = product;
    });
  }

  createProduct() { }
  updateProduct(id: number) { }
  
  deleteProduct(id: number) { }








  /* filtros para la busqueda */

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}










/*   initForm(): void {
    this.form = this.formBuilder.group({
      id: [null],
      category: [null],
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: ['', Validators.required],
      stock: [null],
      stockMin: [null],
      image: ['', Validators.required],
      expiration: [null],
      unitOfMeasure: [null],
    });
  } */