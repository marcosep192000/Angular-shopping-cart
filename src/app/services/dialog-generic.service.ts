import { Inject, Injectable } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { DialogRef } from '@angular/cdk/dialog';
import { DialogGenericComponent } from '../shared/genericsComponents/dialog-generic/dialog-generic.component';

@Injectable({
  providedIn: 'root',
})
export class DialogGenericService {
  constructor(private dialog: MatDialog) {}

  openDialog(component: any, data?: any): Observable<any> {
    const dialogRef = this.dialog.open(DialogGenericComponent, {
      data: { component, data },
      disableClose: true,
      autoFocus: true,
      hasBackdrop: true,
      closeOnNavigation: false,
    });
    return dialogRef.afterClosed();
  }
}
