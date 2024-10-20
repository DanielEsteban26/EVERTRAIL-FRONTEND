export interface Pedido {
  id?: number;
  usuarioId: number;
  precioTotal: number;
  estado?: string; // Valor predeterminado
}