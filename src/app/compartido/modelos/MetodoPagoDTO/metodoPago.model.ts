export interface MetodoPago {
    id?: number;
    usuarioId: number;
    numeroTarjeta: string;
    nombreTitular: string;
    fechaExpiracion: string;
    cvv: string;
  }