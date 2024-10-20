import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Categoria } from '../../../compartido/modelos/CategoriaDTO/categoria.model';
@Injectable({
  providedIn: 'root'
})
export class CategoriaService {
  private apiUrl = 'http://localhost:8081/api/categorias'; // Base URL de la API

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    if (token) {
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

  getCategorias(): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get<any>(`${this.apiUrl}/listar`, { headers });
  }

  addCategoria(categoria: Categoria): Observable<Categoria> {
    const headers = this.getHeaders();
    return this.http.post<Categoria>(`${this.apiUrl}/registrar`, categoria, { headers });
  }

  editCategoria(id: number, categoria: Categoria): Observable<Categoria> {
    const headers = this.getHeaders();
    return this.http.put<Categoria>(`${this.apiUrl}/actualizar/${id}`, categoria, { headers });
  }

  deleteCategoria(id: number): Observable<void> {
    const headers = this.getHeaders();
    return this.http.delete<void>(`${this.apiUrl}/eliminar/${id}`, { headers });
  }
}