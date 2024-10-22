import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Producto } from '../../../compartido/modelos/productoDTO/producto.model';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {
  private apiUrl = 'http://localhost:8081/api/productos'; // Base URL de la API
 

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

  getProductos(): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get<any>(`${this.apiUrl}/listar`, { headers });
  }

  addProducto(producto: Producto): Observable<Producto> {
    const headers = this.getHeaders();
    return this.http.post<Producto>(`${this.apiUrl}/registrar`, producto, { headers });
  }

  editProducto(id: number, producto: Producto): Observable<Producto> {
    const headers = this.getHeaders();
    return this.http.put<Producto>(`${this.apiUrl}/actualizar/${id}`, producto, { headers });
  }

  deleteProducto(id: number): Observable<void> {
    const headers = this.getHeaders();
    return this.http.delete<void>(`${this.apiUrl}/eliminar/${id}`, { headers });
  }
}