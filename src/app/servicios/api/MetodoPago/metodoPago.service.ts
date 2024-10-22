import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MetodoPago } from '../../../compartido/modelos/MetodoPagoDTO/metodoPago.model';

@Injectable({
  providedIn: 'root'
})
export class MetodoPagoService {
  private apiUrl = 'http://localhost:8081/api/metodos-pago'; // Base URL de la API

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    if (token) {
      return new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': token // Asegúrate de que el token se envíe correctamente
      });
    } else {
      return new HttpHeaders({
        'Content-Type': 'application/json'
      });
    }
  }

  obtenerMetodosPago(): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get<any>(`${this.apiUrl}/listar`, { headers });
  }

  registrarMetodoPago(metodoPago: MetodoPago): Observable<any> {
    const headers = this.getHeaders();
    return this.http.post<any>(`${this.apiUrl}/registrar`, metodoPago, { headers });
  }

  procesarPago(metodoPagoDTO: Partial<MetodoPago>): Observable<any> {
    const headers = this.getHeaders();
    return this.http.post<any>(`${this.apiUrl}/procesar`, metodoPagoDTO, { headers });
  }
}