import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { RevocarTokenService } from '../../../servicios/api/revocar-token/revocar-token.service';
import { Router } from '@angular/router';
import { CarritoService } from '../../../servicios/api/carrito/carrito.service';
import { CarritoEventService } from '../../../servicios/api/carrito/carrito-event.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  totalProductos: number = 0;
  @Output() toggleSidenav = new EventEmitter<void>();


  constructor(
    private revocarTokenService: RevocarTokenService,
    private router: Router,
    private carritoService: CarritoService,
    private carritoEventService: CarritoEventService
  ) {}

  ngOnInit(): void {
    this.obtenerTotalProductos(); // Cargar el total de productos al inicio
    this.carritoEventService.carritoUpdated$.subscribe(() => {
      this.obtenerTotalProductos();
    });
    
  }

  obtenerTotalProductos(): void {
    this.carritoService.obtenerCarrito().subscribe(
      (response: any) => {
        if (Array.isArray(response.object)) {
          this.totalProductos = response.object.reduce(
            (acc: number, item: any) => acc + item.cantidad,
            0
          );
        } else {
          console.error('La respuesta no es un arreglo:', response.object);
        }
      },
      (error: any) => {
        console.error('Error al obtener el total de productos:', error);
        this.totalProductos = 0; // Resetea en caso de error
      }
    );
  }

  logout() {
    const token = localStorage.getItem('token');
    if (token) {
      this.revocarTokenService.revokeToken(token).subscribe(
        () => {
          localStorage.removeItem('token');
          localStorage.removeItem('rol');
          localStorage.removeItem('id');
          localStorage.removeItem('carritoId');
          console.log('Token removido correctamente :)');
          this.router.navigate(['/iniciar-sesion']);
        },
        (error: any) => {
          console.error('Error al revocar el token', error);
        }
      );
    }
  }
}