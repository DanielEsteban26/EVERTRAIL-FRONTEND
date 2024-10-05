import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Producto } from '../../../compartido/modelos/productos/producto.model'; // Importa el modelo Producto

@Injectable({
  providedIn: 'root'
})
export class ProductosService {
  private apiUrl = 'http://localhost:8081/api/productos/listar'; // Reemplaza con la URL de tu API

  constructor(private http: HttpClient) { }

  getProductos(): Observable<Producto[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.get<Producto[]>(this.apiUrl, { headers });
  }
}