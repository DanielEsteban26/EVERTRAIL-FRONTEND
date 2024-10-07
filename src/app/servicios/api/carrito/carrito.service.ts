import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {
  private apiUrl = 'http://localhost:8080/api/carrito';

  constructor(private http: HttpClient) {}

  getCart(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/listar`);
  }

  removeFromCart(itemId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/eliminar/${itemId}`);
  }
}