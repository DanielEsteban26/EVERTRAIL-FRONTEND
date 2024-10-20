import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { RevocarTokenService } from '../../servicios/api/revocar-token/revocar-token.service';
import { Router } from '@angular/router';
import { ProductosService } from '../../servicios/api/productos/productos.service';
import { Producto } from '../../compartido/modelos/productoDTO/producto.model';

@Component({
  selector: 'app-cliente-dashboard',
  templateUrl: './cliente-dashboard.component.html',
  styleUrls: ['./cliente-dashboard.component.css']
})
export class ClienteDashboardComponent implements OnInit {
  @ViewChild('sidenav') sidenav!: MatSidenav;
  products: Producto[] = [];

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    if (window.innerWidth > 768 && this.sidenav) {
      this.sidenav.close();
    }
  }

  constructor(
    private productosService: ProductosService
  ) {}

  ngOnInit(): void {
    this.listarProductos();
  }

  listarProductos(): void {
    this.productosService.getProductos().subscribe(
      (response: any) => {
        console.log(response);
        this.products = response.object;
      },
      (error: any) => {
        console.error('Error al obtener los productos', error);
      }
    );
  }

  toggleDrawer() {
    if (this.sidenav) {
      this.sidenav.toggle();
    }
  }
}