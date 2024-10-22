import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CarritoDetalleService } from '../../../servicios/api/carrito/carritoDetalle.service';
import { MetodoPago } from '../../../compartido/modelos/MetodoPagoDTO/metodoPago.model';
import { MetodoPagoService } from '../../../servicios/api/MetodoPago/metodoPago.service';

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css']
})
export class CarritoComponent implements OnInit {
  carrito: any[] = [];
  displayedColumns: string[] = ['nombre', 'descripcion', 'cantidad', 'precio', 'acciones'];
  totalPrecio: number = 0;
  totalProductos: number = 0;

  constructor(
    private carritoDetalleService: CarritoDetalleService,
    private metodoPagoService: MetodoPagoService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.obtenerCarrito();
  }

  obtenerCarrito(): void {
    this.carritoDetalleService.obtenerCarrito().subscribe(
      (response: any) => {
        console.log('Carrito:', response.object);
        this.carrito = response.object.map((item: any) => ({
          ...item,
          productoNombre: item.productoNombre,
          productoDescripcion: item.productoDescripcion
        }));
        this.calcularTotal();
        if (response.object.length > 0) {
          localStorage.setItem('carritoId', response.object[0].carritoId); // Guarda el ID del carrito en localStorage
        }
      },
      (error: any) => {
        console.error('Error al obtener el carrito:', error);
      }
    );
  }

  incrementarCantidad(item: any): void {
    item.cantidad++;
    this.actualizarCantidad(item);
  }

  decrementarCantidad(item: any): void {
    if (item.cantidad > 1) {
      item.cantidad--;
      this.actualizarCantidad(item);
    }
  }

  actualizarCantidad(item: any): void {
    this.carritoDetalleService.actualizarProducto(item).subscribe(
      (response: any) => {
        console.log('Cantidad actualizada:', response);
        this.calcularTotal();
      },
      (error: any) => {
        console.error('Error al actualizar la cantidad:', error);
      }
    );
  }

  eliminarProducto(id: number): void {
    this.carritoDetalleService.eliminarProducto(id).subscribe(
      () => {
        this.carrito = this.carrito.filter(item => item.id !== id);
        this.calcularTotal();
      },
      (error: any) => {
        console.error('Error al eliminar el producto del carrito:', error);
      }
    );
  }

  eliminarTodosLosProductos(): void {
    const carritoId = Number(localStorage.getItem('carritoId'));
    this.carritoDetalleService.eliminarTodosLosProductos(carritoId).subscribe(
      () => {
        this.carrito = [];
        this.calcularTotal();
      },
      (error: any) => {
        console.error('Error al eliminar todos los productos del carrito:', error);
      }
    );
  }

  calcularTotal(): void {
    this.totalPrecio = this.carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
    this.totalProductos = this.carrito.reduce((acc, item) => acc + item.cantidad, 0);
  }

  abrirModalRegistrarTarjeta(): void {
    const dialogRef = this.dialog.open(RegistrarTarjetaModalComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Método de pago registrado exitosamente');
        this.abrirModalSeleccionarTarjeta(); // Abre el modal para seleccionar tarjeta después de registrar una
      } else {
        console.log('Registro de método de pago cancelado o fallido');
      }
    });
  }

  abrirModalSeleccionarTarjeta(): void {
    const dialogRef = this.dialog.open(SeleccionarTarjetaModalComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Pago procesado exitosamente');
        this.eliminarTodosLosProductos(); // Elimina todos los productos del carrito después de un pago exitoso
      } else {
        console.log('Pago cancelado o fallido');
      }
    });
  }
}

@Component({
  selector: 'app-registrar-tarjeta-modal',
  template: `
    <h2 mat-dialog-title>Registrar Método de Pago</h2>
    <mat-dialog-content>
      <form [formGroup]="metodoPagoForm" (ngSubmit)="registrarMetodoPago()">
        <mat-form-field>
          <mat-label>Número de Tarjeta</mat-label>
          <input matInput formControlName="numeroTarjeta" type="text" maxlength="16">
        </mat-form-field>
        <mat-form-field>
          <mat-label>Nombre del Titular</mat-label>
          <input matInput formControlName="nombreTitular" type="text">
        </mat-form-field>
        <mat-form-field>
          <mat-label>Fecha de Expiración</mat-label>
          <input matInput formControlName="fechaExpiracion" type="month">
        </mat-form-field>
        <mat-form-field>
          <mat-label>CVV</mat-label>
          <input matInput formControlName="cvv" type="text" maxlength="4">
        </mat-form-field>
        <mat-dialog-actions>
          <button mat-button (click)="cancelar()">Cancelar</button>
          <button mat-raised-button color="primary" type="submit" [disabled]="metodoPagoForm.invalid">Registrar</button>
        </mat-dialog-actions>
      </form>
    </mat-dialog-content>
  `,
  styles: []
})
export class RegistrarTarjetaModalComponent implements OnInit {
  metodoPagoForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<RegistrarTarjetaModalComponent>,
    private fb: FormBuilder,
    private metodoPagoService: MetodoPagoService
  ) {
    this.metodoPagoForm = this.fb.group({
      numeroTarjeta: ['', [Validators.required, Validators.pattern('^[0-9]{16}$')]],
      nombreTitular: ['', Validators.required],
      fechaExpiracion: ['', Validators.required],
      cvv: ['', [Validators.required, Validators.pattern('^[0-9]{3,4}$')]]
    });
  }

  ngOnInit(): void {
    const usuarioId = Number(localStorage.getItem('id')); // Obtén el ID del usuario desde localStorage
    this.metodoPagoForm.addControl('usuarioId', this.fb.control(usuarioId, Validators.required));
  }

  registrarMetodoPago(): void {
    if (this.metodoPagoForm.valid) {
      const metodoPago: MetodoPago = this.metodoPagoForm.value;
      this.metodoPagoService.registrarMetodoPago(metodoPago).subscribe(
        response => {
          console.log('Método de pago registrado:', response);
          this.dialogRef.close(true); // Cierra el modal y devuelve true
        },
        error => {
          console.error('Error al registrar el método de pago:', error);
        }
      );
    }
  }

  cancelar(): void {
    this.dialogRef.close(false); // Cierra el modal y devuelve false
  }
}

@Component({
  selector: 'app-seleccionar-tarjeta-modal',
  template: `
    <h2 mat-dialog-title>Seleccionar Método de Pago</h2>
    <mat-dialog-content>
      <mat-form-field>
        <mat-label>Método de Pago</mat-label>
        <mat-select [(value)]="metodoPagoSeleccionado">
          <mat-option *ngFor="let metodo of metodosPago" [value]="metodo.id">
            {{metodo.numeroTarjeta}}
          </mat-option>
        </mat-select>
      </mat-form-field>
    </mat-dialog-content>
    <mat-dialog-actions>
      <button mat-button (click)="cancelar()">Cancelar</button>
      <button mat-raised-button color="primary" (click)="procesarPago()">Pagar</button>
    </mat-dialog-actions>
  `,
  styles: []
})
export class SeleccionarTarjetaModalComponent implements OnInit {
  metodosPago: MetodoPago[] = [];
  metodoPagoSeleccionado: number | null = null;

  constructor(
    public dialogRef: MatDialogRef<SeleccionarTarjetaModalComponent>,
    private metodoPagoService: MetodoPagoService,
    private carritoDetalleService: CarritoDetalleService // Inyectar el servicio de carrito
  ) {}

  ngOnInit(): void {
    this.obtenerMetodosPago();
  }

  obtenerMetodosPago(): void {
    this.metodoPagoService.obtenerMetodosPago().subscribe(
      (response: any) => {
        if (Array.isArray(response)) {
          this.metodosPago = response;
        } else if (response && response.object) {
          this.metodosPago = response.object;
        } else {
          this.metodosPago = [];
        }
      },
      (error: any) => {
        console.error('Error al obtener los métodos de pago:', error);
      }
    );
  }

  procesarPago(): void {
    if (this.metodoPagoSeleccionado !== null) {
      const metodoPagoDTO = this.metodosPago.find(metodo => metodo.id === this.metodoPagoSeleccionado);
      if (metodoPagoDTO !== undefined) {
        const { numeroTarjeta, nombreTitular, fechaExpiracion, cvv } = metodoPagoDTO;
        const pagoData = { numeroTarjeta, nombreTitular, fechaExpiracion, cvv };
        this.metodoPagoService.procesarPago(pagoData).subscribe(
          (response: any) => {
            console.log('Pago procesado:', response);
            this.dialogRef.close(true); // Cierra el modal y devuelve true

          },
          (error: any) => {
            console.error('Error al procesar el pago:', error);
            this.dialogRef.close(false); // Cierra el modal y devuelve false
          }
        );
      } else {
        console.error('Método de pago no encontrado');
      }
    } else {
      console.error('Seleccione un método de pago');
    }
  }

  cancelar(): void {
    this.dialogRef.close(false); // Cierra el modal y devuelve false
  }
}