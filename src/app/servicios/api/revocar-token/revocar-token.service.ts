import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RevocarTokenService {
  private apiUrl = 'http://localhost:8081/user/logout'; // Cambia esto a la URL de tu backend

  constructor(private http: HttpClient) { }

  revokeToken(token: string): Observable<any> {
    return this.http.post<any>(this.apiUrl, { token });
  }
}