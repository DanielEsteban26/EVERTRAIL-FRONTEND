import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CuentaService {
  private apiUrl = 'http://localhost:8080/api/cuenta';

  constructor(private http: HttpClient) {}

  getCuenta(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}`);
  }

  updateCuenta(usuario: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}`, usuario);
  }
}