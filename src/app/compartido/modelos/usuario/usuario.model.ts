// src/app/compartido/modelos/usuario/usuario.model.ts
export class Usuario {
  id!: number;
  nombreUsuario!: string;
  correo!: string;
  contrasenia!: string;
  rol!: string; // Asegúrate de que el tipo y el nombre coincidan con el backend
}