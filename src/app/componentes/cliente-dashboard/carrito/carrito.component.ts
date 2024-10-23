import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MetodoPago } from '../../../compartido/modelos/MetodoPagoDTO/metodoPago.model';
import { MetodoPagoService } from '../../../servicios/api/MetodoPago/metodoPago.service';
import { CarritoService } from '../../../servicios/api/carrito/carrito.service';
import { CarritoDetalle } from '../../../compartido/modelos/CarritoDetalleDTO/carritoDetalle.model';

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css']
})
export class CarritoComponent implements OnInit {
  carrito: CarritoDetalle[] = [];
  displayedColumns: string[] = ['cantidad', 'precio', 'acciones'];
  totalPrecio: number = 0;
  totalProductos: number = 0;

  constructor(
    private carritoService: CarritoService,
    private metodoPagoService: MetodoPagoService,
    public dialog: MatDialog

  ) {}

  ngOnInit(): void {
    this.obtenerCarrito();
  }

  obtenerCarrito(): void {
    this.carritoService.obtenerCarrito().subscribe(
      (response: any) => {
        if (response && response.object) {
          this.carrito = response.object.map((item: any) => ({ ...item }));
          this.calcularTotal();

          // Manejo de idCarrito en localStorage
          if (this.carrito.length > 0) {
            localStorage.getItem('idCarrito');
          } else {
            localStorage.removeItem('idCarrito');
          }

          // Actualizar el contador de productos en el carrito
          this.totalProductos = this.carrito.reduce((total, item) => total + item.cantidad, 0);
        } else {
          console.error('La respuesta no contiene un objeto válido');
        }
      },
      (error: any) => {
        console.error('Error al obtener el carrito:', error);
      }
    );
  }

  calcularTotal(): void {
    this.totalPrecio = this.carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
    this.totalProductos = this.carrito.reduce((acc, item) => acc + item.cantidad, 0);
  }

  agregarAlCarrito(nuevoProducto: CarritoDetalle): void {
    this.carrito.push(nuevoProducto);
    this.calcularTotal();
    // Actualiza el contador de productos
    this.totalProductos += nuevoProducto.cantidad;

    // Manejo de idCarrito en localStorage
    const idCarrito = this.carrito[0].carritoId.toString();
    localStorage.setItem('idCarrito', idCarrito);
  }
  

  eliminarTodosLosProductos(): void {
    this.carrito = [];
    this.totalPrecio = 0;
    this.totalProductos = 0; // Reinicia el contador de productos
    localStorage.removeItem('idCarrito'); // Eliminar idCarrito cuando el carrito está vacío
    console.log('Todos los productos han sido eliminados del carrito');
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

  incrementarCantidad(item: CarritoDetalle): void {
    item.cantidad += 1;
    this.actualizarCarrito(item);
    this.totalProductos += 1; // Aumenta el contador de productos
  }

  decrementarCantidad(item: CarritoDetalle): void {
    if (item.cantidad > 1) {
      item.cantidad -= 1;
      this.actualizarCarrito(item);
      this.totalProductos -= 1; // Disminuye el contador de productos
    } else {
      this.eliminarProducto(item.carritoId);
    }
  }

  eliminarProducto(productoId: number): void {
    this.carritoService.eliminarProductoDelCarrito(productoId).subscribe(
      () => {
        const productoEliminado = this.carrito.find(item => item.carritoId === productoId);
        if (productoEliminado) {
          this.totalProductos -= productoEliminado.cantidad; // Disminuye el contador de productos
        }
        this.carrito = this.carrito.filter(item => item.carritoId !== productoId);
        this.calcularTotal();
        console.log('Producto eliminado del carrito.');
        // Manejar el caso de que el carrito esté vacío después de eliminar un producto
        if (this.carrito.length === 0) {
          localStorage.removeItem('idCarrito'); // Eliminar idCarrito si el carrito está vacío
        }
      },
      (error: any) => {
        console.error('Error al eliminar el producto del carrito:', error);
      }
    );
  }

  actualizarCarrito(item: CarritoDetalle): void {
    const carritoDetalle: CarritoDetalle = {
      carritoId: item.carritoId,
      productoId: item.productoId,
      precio: item.precio,
      cantidad: item.cantidad
    };

    this.carritoService.actualizarCantidad(item.carritoId, carritoDetalle).subscribe(
      () => {
        this.calcularTotal();
      },
      (error: any) => {
        console.error('Error al actualizar la cantidad:', error);
      }
    );
  }
}
// Modal para registrar tarjeta
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

// Modal para seleccionar tarjeta
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
    private carritoService: CarritoService // Inyectar el servicio de carrito
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
          }
        );
      }
    }
  }

  cancelar(): void {
    this.dialogRef.close(false); // Cierra el modal y devuelve false
  }
}
