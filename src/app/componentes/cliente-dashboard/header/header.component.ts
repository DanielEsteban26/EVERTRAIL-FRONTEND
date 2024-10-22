import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { RevocarTokenService } from '../../../servicios/api/revocar-token/revocar-token.service';
import { Router } from '@angular/router';
import { CarritoDetalleService } from '../../../servicios/api/carrito/carritoDetalle.service';
import { CarritoEventService } from '../../../servicios/api/carrito/carrito-event.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  @Output() toggleSidenav = new EventEmitter<void>();
  totalProductos: number = 0;

  constructor(
    private revocarTokenService: RevocarTokenService,
    private router: Router,
    private carritoDetalleService: CarritoDetalleService,
    private carritoEventService: CarritoEventService // Inyecta el servicio compartido
  ) {}

  ngOnInit(): void {
    this.obtenerTotalProductos();
    this.carritoEventService.carritoUpdated$.subscribe(() => {
      this.obtenerTotalProductos();
    });
  }

  obtenerTotalProductos(): void {
    this.carritoDetalleService.obtenerCarrito().subscribe(
      (response: any) => {
        this.totalProductos = response.object.reduce((acc: number, item: any) => acc + item.cantidad, 0);
      },
      (error: any) => {
        console.error('Error al obtener el total de productos:', error);
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