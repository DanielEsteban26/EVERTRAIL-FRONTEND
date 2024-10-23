import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';
import { Carrito } from '../../../compartido/modelos/CarritoDTO/carrito.model';
import { CarritoDetalle } from '../../../compartido/modelos/CarritoDetalleDTO/carritoDetalle.model';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {
  private apiUrl = 'http://localhost:8081/api/carritos';
  private itemCountSource = new BehaviorSubject<number>(0);
  currentItemCount = this.itemCountSource.asObservable();

  constructor(private http: HttpClient) {
    this.cargarTotalProductos(); // Cargar el total de productos al inicio
  }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}` // Asegúrate de que el token tenga el prefijo "Bearer"
    });
  }

  updateItemCount(count: number) {
    this.itemCountSource.next(count);
  }

  actualizarCantidad(id: number, carritoDetalle: CarritoDetalle): Observable<any> {
    const headers = this.getHeaders();
    return this.http.put<any>(`${this.apiUrl}/detalles/actualizar/${id}`, carritoDetalle, { headers }).pipe(
      tap(() => this.cargarTotalProductos()) // Actualizar el contador de ítems después de actualizar un producto
    );
  }

  agregarProducto(carritoId: number, carritoDetalle: CarritoDetalle): Observable<any> {
    const headers = this.getHeaders();
    return this.http.post<any>(`${this.apiUrl}/${carritoId}/detalles`, carritoDetalle, { headers }).pipe(
      tap(() => this.cargarTotalProductos()), // Actualizar el contador de ítems después de agregar un producto
      catchError(error => {
        console.error('Error al agregar producto al carrito', error);
        return throwError(error);
      })
    );
  }

  crearCarrito(carrito: Carrito): Observable<any> {
    const headers = this.getHeaders();
    return this.http.post<any>(`${this.apiUrl}/registrar`, carrito, { headers });
  }

  obtenerCarritos(): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get<any>(`${this.apiUrl}/listar`, { headers }).pipe(
      tap(response => {
        console.log('Respuesta de obtenerCarritos:', response);
      })
    );
  }

  obtenerCarrito(): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get<any>(`${this.apiUrl}/listarDetalles`, { headers });
  }

  obtenerCarritoPorId(id: number): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get<any>(`${this.apiUrl}/${id}`, { headers });
  }

  actualizarCarrito(id: number, carrito: Carrito): Observable<any> {
    const headers = this.getHeaders();
    return this.http.put<any>(`${this.apiUrl}/actualizar/${id}`, carrito, { headers });
  }

  eliminarCarrito(id: number): Observable<void> {
    const headers = this.getHeaders();
    return this.http.delete<void>(`${this.apiUrl}/eliminar/${id}`, { headers });
  }

  eliminarProductoDelCarrito(id: number): Observable<void> {
    const headers = this.getHeaders();
    return this.http.delete<void>(`${this.apiUrl}/detalles/eliminar/${id}`, { headers }).pipe(
      tap(() => this.cargarTotalProductos()), // Actualizar el contador de ítems después de eliminar un producto
      catchError(error => {
        console.error('Error al eliminar producto del carrito', error);
        return throwError(error); // Lanza el error para que lo maneje el componente
      })
    );
  }

  private cargarTotalProductos(): void {
    this.obtenerCarritos().subscribe(
      (response: any) => {
        if (Array.isArray(response.object)) {
          const total = response.object.reduce((acc: number, item: any) => acc + item.cantidad, 0);
          this.updateItemCount(total); // Emitir el nuevo total de productos
        } else {
          console.error('La respuesta no es un arreglo:', response.object);
          this.updateItemCount(0); // Resetea en caso de error
        }
      },
      (error: any) => {
        console.error('Error al obtener el total de productos:', error);
        this.updateItemCount(0); // Resetea en caso de error
      }
    );
  }
}