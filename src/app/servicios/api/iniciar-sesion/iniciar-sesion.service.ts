import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario } from '../../../compartido/modelos/usuario/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class IniciarSesionService {
  private apiUrl = 'http://localhost:8081/user/login';

  constructor(private http: HttpClient) { }

  login(usuario: Usuario): Observable<{ token: string, role: string }> {
    return this.http.post<{ token: string, role: string }>(this.apiUrl, usuario);
  }
}