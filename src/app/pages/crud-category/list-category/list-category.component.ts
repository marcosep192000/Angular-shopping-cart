import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { CategoryService } from '../../../services/category.service';
import { Category } from '../../../interfaces/Category';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-list-category',
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule,MatButtonModule],
  templateUrl: './list-category.component.html',
  styleUrl: './list-category.component.css',
})
export class ListCategoryComponent implements AfterViewInit, OnInit {
 
  categories: Category[] = [];
  displayedColumns: string[] = ['id', 'descriptionCategory','Opciones'];
  dataSource = new MatTableDataSource<Category>(this.categories);
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  constructor(
    private CategoryService: CategoryService,
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
}

