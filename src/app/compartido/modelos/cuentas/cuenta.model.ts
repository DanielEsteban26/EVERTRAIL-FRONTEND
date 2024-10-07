export interface Cuenta {
  nombreUsuario: string;
  nombre: string;
  email: string;
  telefono?: string; // Campo opcional
  direccion?: string; // Campo opcional
  fechaNacimiento?: string; // Campo opcional
  // Otros campos según sea necesario
}