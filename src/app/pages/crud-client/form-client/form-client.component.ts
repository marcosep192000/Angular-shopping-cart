import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { Client } from '../../../interfaces/Client';
import { ClientService } from '../../../services/client.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleChange, MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ChangeDetectionStrategy } from '@angular/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { subscribe } from 'node:diagnostics_channel';
import { CtaCteService } from '../../../services/cta-cte.service';
import { IconComponent } from "../../../shared/dasboard/icon/icon.component";
import { catchError, map, Observable, of, switchMap, throwError } from 'rxjs';

@Component({
  selector: 'app-form-client',
  standalone: true,

  imports: [
    // Módulos de Angular
    MatDatepickerModule,
    ToastrModule,
    MatInputModule,
    CommonModule,
    MatIconModule,
    MatDialogModule,
    MatButtonModule,
    FormsModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatSlideToggleModule,
    // Módulo para notificaciones Toastr
    ToastrModule,
    IconComponent,
  ],

  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './form-client.component.html',
  styleUrl: './form-client.component.css',
})
export class FormClientComponent implements OnInit {
  formGroup!: FormGroup;
  dataClient: Client[] = [];
  getDataClient: null = null;
  agregarCuentaCorriente = false;
  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<FormClientComponent>,
    public dialog: MatDialog,
    private fb: FormBuilder,
    private clientService: ClientService,
    private toastr: ToastrService,
    private ctaCteService: CtaCteService
  ) {
    this.formGroup = this.fb.group({
      cuit: [
        '',
        [
          Validators.required,
          Validators.maxLength(12),
          Validators.pattern('[0-9]*'),
        ],
      ],
      name: ['', [Validators.required, Validators.maxLength(20)]],
      tel: [
        '',
        [
          Validators.required,
          Validators.maxLength(14),
          Validators.pattern('[0-9]*'),
        ],
      ],
      lastName: ['', [Validators.required, Validators.maxLength(20)]],
      address: ['', [Validators.required, Validators.maxLength(40)]],
      email: this.emailFormControl,
      cuentaCorriente: this.fb.group({
        saldo: [
          null,
          [
            Validators.required,
            Validators.maxLength(10),
            Validators.pattern('[0-9]*'),
          ],
        ],
        deuda: [false],
      }),
      isChecked: new FormControl(false),
    });
  }

  onToggleChange(event: any) {
    this.formGroup.get('isChecked')?.setValue(event.checked);
  }

  get isChecked() {
    return this.formGroup.get('isChecked')?.value;
  }

  ngOnInit(): void {
    if (this.data.updateClient != null) {
      this.clientService
        .getClientById(this.data.updateClient)
        .subscribe((datos: any) => {
          console.log(datos);
          this.formGroup.patchValue({
            name: datos.name,
            lastName: datos.lastName,
            cuit: datos.cuit,
            address: datos.address,
            tel: datos.tel,
            email: datos.email,
            // Si ya tiene cuenta corriente, se pueden llenar los valores correspondientes
            cuentaCorriente: datos.cuentaCorriente || {
              saldo: null,
              deuda: false,
            },
            isChecked: datos.cuentaCorriente != null, // Si tiene cuenta corriente, marcar como verdadero
          });
        });
    }
  }

  save(): void {
    if (this.formGroup.invalid) {
      this.toastr.error(
        'Por favor, complete todos los campos requeridos!',
        '',
        {
          timeOut: 5000,
          positionClass: 'toast-bottom-right',
        }
      );
      return;
    }

    const clientData = this.formGroup.value;
    const clientCuit = this.formGroup.get('cuit')?.value;
    const agregarCuentaCorriente = this.formGroup.get(
      'agregarCuentaCorriente'
    )?.value;

    // Inicializar cuentaCorriente si no está presente en el formulario
    let cuentaCorriente = this.formGroup.get('cuentaCorriente')?.value || null;

    // Verificamos si el cliente existe antes de continuar
    this.existeCliente(clientCuit)
      .pipe(
        switchMap((existe) => {
          if (existe) {
            this.toastr.error('El CUIT ingresado ya existe.');
            return throwError(() => new Error('El CUIT ingresado ya existe.'));
          }

          console.log('Datos del cliente:', clientData);

          // Excluir cuentaCorriente si no se seleccionó "agregarCuentaCorriente"
          let { agregarCuentaCorriente, ...clientInfo } = clientData;

          if (!agregarCuentaCorriente) {
            cuentaCorriente = null; // Asegurar que no se envía cuentaCorriente si no fue marcada
            delete clientInfo.cuentaCorriente;
          } else {
            if (!cuentaCorriente) {
              clientInfo.cuentaCorriente = {
                client: { cuit: clientCuit },
                saldo: 0, // Inicia con saldo 0
              };
            } else {
              clientInfo.cuentaCorriente.client = { cuit: clientCuit };
            }
          }

          // Guardar cliente
          return this.clientService.addClient(clientInfo);
        })
      )
      .subscribe({
        next: (data) => {
          console.log('Cliente guardado correctamente:', data);
          this.dialogRef.close(data);
          this.showSuccess();

          // Solo guarda cuenta corriente si el usuario marcó la opción
          if (agregarCuentaCorriente && cuentaCorriente) {
            this.ctaCteService.save(cuentaCorriente).subscribe({
              next: (ctaCteData) => {
                console.log('Cuenta corriente guardada:', ctaCteData);
              },
              error: (ctaCteError) => {
                console.error(
                  'Error al guardar la cuenta corriente:',
                  ctaCteError
                );
                this.toastr.error('Error al guardar la cuenta corriente.', '', {
                  timeOut: 5000,
                  positionClass: 'toast-bottom-right',
                });
              },
            });
          }
        },
        error: (error) => {
          console.error('Error al guardar el cliente:', error);
          this.toastr.error('Hubo un error al guardar el cliente.', '', {
            timeOut: 5000,
            positionClass: 'toast-bottom-right',
          });
        },
      });
  }

  // Método corregido para verificar si el cliente existe
  existeCliente(cuit: string): Observable<boolean> {
    return this.clientService.getClientByDni(cuit).pipe(
      map((client) => !!client), // Devuelve true si existe, false si no
      catchError((error) => {
        console.error('Error al buscar el cliente por CUIT:', error);

        return of(false);
      })
    );
  }

  showSuccess() {
    this.toastr.success('Cliente guardado con éxito!', '', {
      timeOut: 10000,
      positionClass: 'toast-bottom-right',
    });
  }

  update(): void {
    if (this.formGroup.valid) {
      // Obtenemos los datos del formulario
      const clientData = this.formGroup.value;
      this.getDataClient = clientData;
      console.log(clientData, 'este es el id del cliente');

      // Desestructuramos los datos del formulario
      const { cuentaCorriente, isChecked, ...clientInfo } = clientData;

      // Verificamos si la opción de agregar cuenta corriente está marcada
      if (isChecked) {
        // Si el cliente tiene cuenta corriente en el formulario y está marcada la opción, la asignamos

        if (cuentaCorriente) {
          this.ctaCteService
            .updateCtaCte(this.data.updateClient, cuentaCorriente)
            .subscribe(
              (data) => {
                data.saldo = data.saldo;
              },
              (error) => {}
            );
        } else {
          // Si la opción no está marcada, eliminamos la cuenta corriente
          clientInfo.cuentaCorriente = null;
        }

        // Ahora, actualizamos el cliente
        this.clientService
          .updateClient(this.data.updateClient, clientInfo)
          .subscribe(
            (updatedClient) => {
              // El cliente se actualizó correctamente
              this.dialogRef.close(updatedClient); // Cerramos el modal con los datos del cliente actualizado
              this.showSuccess(); // Mostramos el mensaje de éxito

              // Si el cliente tiene cuenta corriente, actualizarla también
              if (isChecked && cuentaCorriente) {
                console.log('Guardando o actualizando cuenta corriente');
                // Buscamos el cliente por su CUIT para obtener el id
                this.clientService.getClientByDni(clientData.cuit).subscribe(
                  (client) => {
                    if (client && client.id) {
                      // Asignamos el ID del cliente a la cuenta corriente
                      cuentaCorriente.client = client.id;

                      // Ahora guardamos o actualizamos la cuenta corriente
                      this.ctaCteService.save(cuentaCorriente).subscribe(
                        (ctaCteData) => {
                          console.log(
                            'Cuenta corriente guardada o actualizada:',
                            ctaCteData
                          );
                        },
                        (ctaCteError) => {
                          this.toastr.error(
                            'Error al guardar o actualizar la cuenta corriente.',
                            '',
                            {
                              timeOut: 5000,
                              positionClass: 'toast-bottom-right',
                            }
                          );
                        }
                      );
                    } else {
                      this.toastr.error(
                        'No se encontró el cliente con el cuit proporcionado.',
                        '',
                        {
                          timeOut: 5000,
                          positionClass: 'toast-bottom-right',
                        }
                      );
                    }
                  },
                  (error) => {
                    console.error(
                      'Error al buscar el cliente por cuit:',
                      error
                    );
                    this.toastr.error('Error al buscar el cliente.', '', {
                      timeOut: 5000,
                      positionClass: 'toast-bottom-right',
                    });
                  }
                );
              }
            },
            (error) => {
              console.error('Error al actualizar el cliente:', error);
              this.toastr.error('Hubo un error al actualizar el cliente.', '', {
                timeOut: 5000,
                positionClass: 'toast-bottom-right',
              });
            }
          );
      } else {
        this.toastr.error(
          'Por favor, complete todos los campos requeridos!',
          '',
          {
            timeOut: 5000,
            positionClass: 'toast-bottom-right',
          }
        );
      }
    }
  }

  cancel() {
    this.dialogRef.close();
  }

  onInputChange(event: any, controlName: string) {
    const input = event.target.value.replace(/[^0-9]/g, '');
    this.formGroup.get(controlName)?.setValue(input);
  }
}

