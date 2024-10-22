import { CarritoDetalle } from "../CarritoDetalleDTO/carritoDetalle.model";

export interface Carrito {
    id?: number;
    usuarioId: number;
    carritoDetalles?: CarritoDetalle[]; 
  }