import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class RevocarTokenService {
  private apiUrl = 'http://localhost:8081/user/logout'; // Cambia esto a la URL de tu backend

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: Object) { }

  revokeToken(token: string): Observable<any> {
    if (isPlatformBrowser(this.platformId)) {
      return this.http.post<any>(this.apiUrl, { token }).pipe(
        catchError(this.handleError)
      );
    } else {
      return throwError('Cannot revoke token on the server side');
    }
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(errorMessage);
  }
}