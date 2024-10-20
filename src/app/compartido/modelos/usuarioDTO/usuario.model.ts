import { Role } from "../RoleDTO/role.model";

export interface Usuario {
id : number;
nombreUsuario: string;
correo: string;
contrasenia: string;
rol: Role; // Relación con Role
}