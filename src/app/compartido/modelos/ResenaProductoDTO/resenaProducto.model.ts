export interface ResenaProducto {
    id?: number;
    productoId: number; // Relación con Producto
    usuarioId: number; // Relación con Usuario
    calificacion: number;
    resena: string;
  }