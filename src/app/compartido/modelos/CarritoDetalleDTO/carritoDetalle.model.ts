import { Producto } from "../productoDTO/producto.model";

export interface CarritoDetalle {
    carritoId: number;
    productoId: number;
    cantidad: number;
    precio: number;
    productoNombre: string;
    productoDescripcion: string;
  }