import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CarritoDetalle } from '../../../compartido/modelos/CarritoDetalleDTO/carritoDetalle.model';
import { tap } from 'rxjs/operators';
import { CarritoEventService } from './carrito-event.service';


@Injectable({
  providedIn: 'root'
})
export class CarritoDetalleService {
  private apiUrl = 'http://localhost:8081/api/carrito-detalles'; // Base URL de la API

  constructor(private http: HttpClient, private carritoEventService: CarritoEventService) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    if (token) {
      return new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': token 
      });
    } else {
      return new HttpHeaders({
        'Content-Type': 'application/json'
      });
    }
  }

  agregarProducto(carritoDetalle: CarritoDetalle): Observable<any> {
    const headers = this.getHeaders();
    return this.http.post<any>(`${this.apiUrl}/registrar`, carritoDetalle, { headers }).pipe(
      tap(() => this.carritoEventService.notifyCarritoUpdated()) // Notifica al servicio compartido
    );
  }

  obtenerCarrito(): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get<any>(`${this.apiUrl}/listar`, { headers });
  }

  actualizarProducto(carritoDetalle: CarritoDetalle): Observable<any> {
    const headers = this.getHeaders();
    return this.http.put<any>(`${this.apiUrl}/actualizar/${carritoDetalle.carritoId}`, carritoDetalle, { headers }).pipe(
      tap(() => this.carritoEventService.notifyCarritoUpdated()) // Notifica al servicio compartido
    );
  }

  eliminarTodosLosProductos(carritoId: number): Observable<any> {
    const headers = this.getHeaders();
    return this.http.delete<any>(`${this.apiUrl}/eliminar-todos/${carritoId}`, { headers });
  }

  eliminarProducto(id: number): Observable<void> {
    const headers = this.getHeaders();
    return this.http.delete<void>(`${this.apiUrl}/eliminar/${id}`, { headers }).pipe(
      tap(() => this.carritoEventService.notifyCarritoUpdated()) // Notifica al servicio compartido
    );
  }
}