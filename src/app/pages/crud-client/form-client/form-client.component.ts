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
  ],

  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './form-client.component.html',
  styleUrl: './form-client.component.css',
})
export class FormClientComponent implements OnInit {
  formGroup!: FormGroup;
  dataClient: Client[] = [];
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
      address: ['', [Validators.required, Validators.maxLength(20)]],
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
    if (this.formGroup.valid) {
      // Obtenemos todos los datos del formulario
      const clientData = this.formGroup.value;
      const clientCuit = this.formGroup.get('cuit')?.value; // Accedemos al Cuit correctamente

      console.log('Datos del cliente:', clientData); // Agregar un log para verificar los datos que estamos enviando

      // Desestructuramos el objeto, excluyendo 'cuentaCorriente' y 'agregarCuentaCorriente'
      const { cuentaCorriente, agregarCuentaCorriente, ...clientInfo } =
        clientData;

      // Si el cliente tiene cuenta corriente y se marca la opción 'agregarCuentaCorriente',
      // entonces lo incluimos en el objeto clientInfo
      if (agregarCuentaCorriente) {
        if (!cuentaCorriente) {
          clientInfo.cuentaCorriente = {
            client: { cuit: clientCuit },
            saldo: 0, // Inicia con saldo 0
          };
        } else {
          clientInfo.cuentaCorriente.client = { cuit: clientCuit }; // Asocia el cliente a la cuenta corriente
        }
      } else {
        clientInfo.cuentaCorriente = null; // Si no se marca la opción, eliminamos cuentaCorriente
      }

      // Guardamos el cliente primero
      this.clientService.addClient(clientInfo).subscribe(
        (data) => {
          console.log('Cliente guardado correctamente:', data); // Agregar un log aquí también
          this.dialogRef.close(data); // Cierra el modal con los datos del cliente guardado
          this.showSuccess(); // Muestra un mensaje de éxito

          // Verificamos si se necesita asociar una cuenta corriente
          if (this.isChecked && cuentaCorriente) {
            console.log('Guardando cuenta corriente:', cuentaCorriente);
            // Buscar el cliente por su cuit para obtener el id
            this.clientService.getClientByDni(clientCuit).subscribe(
              (client) => {
                console.log('Cliente encontrado por cuit:', client); // Verificar que el cliente existe y tiene un id
                if (client && client.id) {
                  // Asignamos el id del cliente encontrado a la cuenta corriente
                  cuentaCorriente.client = client.id ;

                  // Ahora guardamos la cuenta corriente
                  this.ctaCteService.save(cuentaCorriente).subscribe(
                    (ctaCteData) => {
                      console.log('Cuenta corriente guardada:', ctaCteData);
                    },
                    (ctaCteError) => {
                      console.error(
                        'Error al guardar la cuenta corriente:',
                        ctaCteError
                      ); // Verificar error
                      this.toastr.error(
                        'Error al guardar la cuenta corriente.',
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
                console.error('Error al buscar el cliente por cuit:', error);
                this.toastr.error('Error al buscar el cliente.', '', {
                  timeOut: 5000,
                  positionClass: 'toast-bottom-right',
                });
              }
            );
          }
        },
        (error) => {
          console.error('Error al guardar el cliente:', error);
          this.toastr.error('Hubo un error al guardar el cliente.', '', {
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

  showSuccess() {
    this.toastr.success('Cliente guardado con éxito!', '', {
      timeOut: 10000,
      positionClass: 'toast-bottom-right',
    });
  }

  update(): void {
    this.clientService
      .updateClient(this.data.updateClient, this.formGroup.value)

      .subscribe((data) => {
        console.log(this.formGroup.value);
        this.dialogRef.close(data);
        console.log(this.data.id, this.formGroup.value);
      });
  }
  cancel() {
    this.dialogRef.close();
  }

  onInputChange(event: any, controlName: string) {
    const input = event.target.value.replace(/[^0-9]/g, '');
    this.formGroup.get(controlName)?.setValue(input);
  }
}

