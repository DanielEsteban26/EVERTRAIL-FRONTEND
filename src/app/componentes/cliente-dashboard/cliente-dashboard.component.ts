import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { RevocarTokenService } from '../../servicios/api/revocar-token/revocar-token.service'; // Asegúrate de ajustar la ruta según tu estructura de carpetas
import { Router } from '@angular/router';
import { ProductosService } from '../../servicios/api/productos/productos.service'; // Importa el servicio de productos
import { Producto } from '../../compartido/modelos/productos/producto.model'; // Importa el modelo Producto

@Component({
  selector: 'app-cliente-dashboard',
  templateUrl: './cliente-dashboard.component.html',
  styleUrls: ['./cliente-dashboard.component.css']
})
export class ClienteDashboardComponent implements OnInit {
  @ViewChild('sidenav') sidenav!: MatSidenav; // Referencia al sidenav
  products: Producto[] = []; // Define la propiedad products usando el modelo Producto

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    if (window.innerWidth > 768 && this.sidenav) {
      this.sidenav.close();
    }
  }

  constructor(
    private revocarTokenService: RevocarTokenService,
    private router: Router,
    private productosService: ProductosService // Inyecta el servicio de productos
  ) {}

  ngOnInit(): void {
    this.getProductos(); // Llama al método para obtener los productos al inicializar el componente
  }

  getProductos(): void {
    this.productosService.getProductos().subscribe(
      (data: Producto[]) => {
        this.products = data;
      },
      (error) => {
        console.error('Error al obtener los productos', error);
      }
    );
  }

  toggleDrawer() {
    if (this.sidenav) {
      this.sidenav.toggle();
    }
  }

  logout() {
    const token = localStorage.getItem('token');
    if (token) {
      this.revocarTokenService.revokeToken(token).subscribe(
        () => {
          localStorage.removeItem('token');
          console.log('Token removido correctamente :)');
          this.router.navigate(['/iniciar-sesion']);
        },
        error => {
          console.error('Error al revocar el token', error);
        }
      );
    }
  }
}