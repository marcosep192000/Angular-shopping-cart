import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit, TemplateRef } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormCategoryComponent } from '../../../pages/crud-category/form-category/form-category/form-category.component';
import { ThisReceiver } from '@angular/compiler';

@Component({
  selector: 'app-dialog-generic',
  standalone: true,
  imports: [CommonModule, FormsModule,ReactiveFormsModule,MatDialogModule],
  templateUrl: './dialog-generic.component.html',
  styleUrl: './dialog-generic.component.css'
})
export class DialogGenericComponent implements OnInit{

  title : string; 
  formTemplate: TemplateRef<any>;
  formContext: any;
  constructor(public dialogRef: MatDialogRef<DialogGenericComponent>, 
    @Inject(MAT_DIALOG_DATA) public data: any){
    this.title = data.title;
    this.formTemplate = data.formTemplate;
    this.formContext = data.formContext;
  }
  
  ngOnInit() { }
  
  onCancel() {
    this.dialogRef.close();
   }
  
  onSave() {this.dialogRef.close(this.formContext); }
}
   