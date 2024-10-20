import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Usuario } from '../../../compartido/modelos/usuarioDTO/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
  private apiUrl = 'http://localhost:8081/api/usuarios'; // Base URL de la API

  constructor(private http: HttpClient) { 
  }

  private getHeaders():HttpHeaders{
    const token = localStorage.getItem('token'); // Obtiene el token del localStorage
    if(token){
      return new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': token // El token ya tiene el prefijo "Bearer"
      });
    } else {
      return new HttpHeaders({
        'Content-Type': 'application/json'
      });
    }
  }

  getUsuarios(): Observable<any>{
    const headers = this.getHeaders();
    return this.http.get<any>(`${this.apiUrl}/listar`, { headers });

  }

  addUsuario(usuario: Usuario): Observable<Usuario>{
    const headers = this.getHeaders();
    return this.http.post<Usuario>(`${this.apiUrl}/registrar`, usuario, { headers });
  }

  editUsuario(id: number, usuario: Usuario): Observable<Usuario>{
    const headers = this.getHeaders();
    return this.http.put<Usuario>(`${this.apiUrl}/actualizar/${id}`, usuario, { headers });
  }
  deleteUsuario(id:number): Observable<void>{
    const headers = this.getHeaders();
    return this.http.delete<void>(`${this.apiUrl}/eliminar/${id}`, { headers });
  }


}
