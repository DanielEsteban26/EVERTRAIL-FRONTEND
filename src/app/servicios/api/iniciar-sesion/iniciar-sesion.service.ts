import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IniciarSesionService {
  private apiUrl = 'http://localhost:8081/user/login';

  constructor(private http: HttpClient) {}

  login(nombreUsuario: string, contrasenia: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { nombreUsuario, contrasenia };
    return this.http.post<any>(this.apiUrl, body, { headers });
  }
}