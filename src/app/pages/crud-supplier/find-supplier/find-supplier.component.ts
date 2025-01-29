import { Component, OnInit } from '@angular/core';
import { Supplier } from '../../../interfaces/supplier';
import { SupplierService } from '../../../services/supplier.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Console } from 'console';
import { CommonModule } from '@angular/common';
import { ToastrModule, ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-find-supplier',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, ToastrModule,MatSelectModule,CommonModule],
  templateUrl: './find-supplier.component.html',
  styleUrl: './find-supplier.component.css',
})
export class FindSupplierComponent implements OnInit {
 
  findSupplier() {}
  suppliers?: Supplier[] = [];
  selectedSupplier?: any;
  constructor(private supplierService: SupplierService, private toastr: ToastrService) {}
  ngOnInit(): void {
    this.getAllSuppliers();
  }

  getAllSuppliers() {
    this.supplierService.getAllSuppliers().subscribe((data) => {
      this.suppliers = data;
      console.log(this.suppliers+"dddddddddddddddddddddddddddddddddddddddddddddd");
    });
  }
  selectSupplier(supplier: Supplier) {
    this.selectedSupplier = supplier;
    console.log(this.selectedSupplier);
  }
}
