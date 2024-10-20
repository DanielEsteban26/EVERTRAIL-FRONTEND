import { Component } from '@angular/core';
import { RevocarTokenService } from '../../servicios/api/revocar-token/revocar-token.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent {
  isSidenavHidden = false;

  constructor(
    private revocarTokenService: RevocarTokenService,
    private router: Router
  ){}

  toggleSidenav() {
    this.isSidenavHidden = !this.isSidenavHidden;
    }

  logout(){
    const token = localStorage.getItem('token');
    if(token){
      this.revocarTokenService.revokeToken(token).subscribe(
       ()=> {
        localStorage.removeItem('token');
        localStorage.removeItem('rol');
        console.log('Token removido correctamente :)');
        this.router.navigate(['/iniciar-sesion']);
       },
       (error:any) =>{
        console.error('Error al revocar el token', error);	
       }

      );

    }
  }
}

