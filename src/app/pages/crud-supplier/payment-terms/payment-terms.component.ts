import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { Supplier } from '../../../interfaces/supplier';
import { SupplierService } from '../../../services/supplier.service';

@Component({
  selector: 'app-payment-terms',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    ToastrModule,
    MatSelectModule,
    CommonModule,
  ],
  templateUrl: './payment-terms.component.html',
  styleUrl: './payment-terms.component.css',
})
export class PaymentTermsComponent {
  onSelectionChange(event: any): void {
    this.valueChange.emit(event.value);
  }

  startDate = new Date(1990, 0, 1);
  
  @Input() selectedValue: string = '';
  @Output() valueChange = new EventEmitter<string>();
  findSupplier() {}
  paymentTermsList?: string[] = [];
  selectedSupplier?: any;
  constructor(
    private supplierService: SupplierService,
    private toastr: ToastrService
  ) {}
  ngOnInit(): void {
    this.getAllPayments();
  }

  getAllPayments() {
    this.supplierService.getPayMethod().subscribe((data) => {
      this.paymentTermsList = data;
      console.log(
        this.paymentTermsList + 'dddddddddddddddddddddddddddddddddddddddddddddd'
      );
    });
  }
  selectSupplier(supplier: Supplier) {
    this.selectedSupplier = supplier;
    console.log(this.selectedSupplier);
  }
}
