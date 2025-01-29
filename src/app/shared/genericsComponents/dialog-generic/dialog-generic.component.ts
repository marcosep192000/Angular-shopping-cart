import { CommonModule } from '@angular/common';
import { Component, Inject, TemplateRef } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { IconComponent } from "../../dasboard/icon/icon.component";

@Component({
  selector: 'app-dialog-generic',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, IconComponent],
  templateUrl: './dialog-generic.component.html',
  styleUrl: './dialog-generic.component.css',
})
export class DialogGenericComponent {
  constructor(
    public dialogRef: MatDialogRef<DialogGenericComponent>,
    @Inject(MAT_DIALOG_DATA) public data:{component:any,message:any,icon:any, data:any,state:any}) {    
  }
  onCancel(): void {
    this.dialogRef.close(false);
  }
  onSave(): void {

    this.dialogRef.close(true);
  }
}
