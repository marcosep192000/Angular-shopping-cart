import { AfterViewInit, ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { CategoryService } from '../../../services/category.service';
import { Category } from '../../../interfaces/Category';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { FormCategoryComponent } from '../form-category/form-category/form-category.component';
import { MatInputModule } from '@angular/material/input';
import { MatTooltip } from '@angular/material/tooltip';
import { response } from 'express';

@Component({
  selector: 'app-list-category',
  standalone: true,
  imports: [
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
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './list-category.component.html',
  styleUrl: './list-category.component.css',
})
export class ListCategoryComponent implements AfterViewInit, OnInit {
  categories: Category[] = [];
  search: string = '';

  displayedColumns: string[] = ['id', 'descriptionCategory', 'Opciones'];
  dataSource = new MatTableDataSource<Category>(this.categories);
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  constructor(
    private CategoryService: CategoryService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getCategories();
  }

  getCategories(): void {
    this.CategoryService.getCategories().subscribe((categories) => {
      this.dataSource.data = categories;
      console.log();
    });
  }

  createCategory() {
    this.dialog.open(FormCategoryComponent);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  deleteCategory(id: number): void {
    this.CategoryService.deleteCategory(id).subscribe(() => {
      this.getCategories(); // Recarga la lista de categorías después de eliminar
    });
  }
}


