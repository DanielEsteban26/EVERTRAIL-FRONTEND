export interface DireccionEnvio {
    id?: number;
    usuarioId: number;
    lineaDireccion1: string;
    lineaDireccion2?: string;
    ciudad: string;
    estado: string;
    codigoPostal: string;
    pais: string;
  }