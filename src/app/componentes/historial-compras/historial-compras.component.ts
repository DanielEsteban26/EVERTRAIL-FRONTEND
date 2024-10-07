import { Component, OnInit } from '@angular/core';
import { PedidoService } from '../../servicios/api/pedido/pedido.service';

@Component({
  selector: 'app-historial-compras',
  templateUrl: './historial-compras.component.html',
  styleUrls: ['./historial-compras.component.css']
})
export class HistorialComprasComponent implements OnInit {
  pedidos: any[] = [];

  constructor(private pedidoService: PedidoService) {}

  ngOnInit(): void {
    this.pedidoService.getAllPedidos().subscribe(pedidos => {
      this.pedidos = pedidos;
    });
  }
}