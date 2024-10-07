import { Component, OnInit } from '@angular/core';
import { CarritoService } from '../../servicios/api/carrito/carrito.service';

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css']
})
export class CarritoComponent implements OnInit {
  carrito: any[] = [];

  constructor(private carritoService: CarritoService) {}

  ngOnInit(): void {
    this.carritoService.getCart().subscribe(carrito => {
      this.carrito = carrito;
    });
  }

  removeFromCart(itemId: number): void {
    this.carritoService.removeFromCart(itemId).subscribe(response => {
      this.carrito = this.carrito.filter(item => item.id !== itemId);
    });
  }
}