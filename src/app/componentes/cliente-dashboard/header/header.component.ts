import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { RevocarTokenService } from '../../../servicios/api/revocar-token/revocar-token.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  @Output() toggleSidenav = new EventEmitter<void>();

  constructor(
    private revocarTokenService: RevocarTokenService,
    private router: Router
  ) {}

  logout() {
    const token = localStorage.getItem('token');
    if (token) {
      this.revocarTokenService.revokeToken(token).subscribe(
        () => {
          localStorage.removeItem('token');
          localStorage.removeItem('rol')
          console.log('Token removido correctamente :)');
          this.router.navigate(['/iniciar-sesion']);
        },
        (error: any) => {
          console.error('Error al revocar el token', error);
        }
      );
    }
  }
}