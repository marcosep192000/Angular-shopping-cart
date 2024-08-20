import { CommonModule } from '@angular/common';
import { Component, Inject, TemplateRef } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-generic',
  standalone: true,
  imports: [CommonModule,MatDialogModule,MatButtonModule],
  templateUrl: './dialog-generic.component.html',
  styleUrl: './dialog-generic.component.css',
})
export class DialogGenericComponent {
 

  constructor(
    public dialogRef: MatDialogRef<DialogGenericComponent>,
    @Inject(MAT_DIALOG_DATA) public data:{component:any, data:any}) {
    
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    // Implementar lógica de guardado según sea necesario
 
  }
}
