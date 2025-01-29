import { Component } from '@angular/core';
import { FindSupplierComponent } from "../../find-supplier/find-supplier.component";
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-pay-supplier',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatSelectModule, CommonModule, FindSupplierComponent],
  templateUrl: './pay-supplier.component.html',
  styleUrl: './pay-supplier.component.css',
})
export class PaySupplierComponent {
formGroup: any;
onInputChange($event: Event,arg1: string) {
throw new Error('Method not implemented.');
}
}
