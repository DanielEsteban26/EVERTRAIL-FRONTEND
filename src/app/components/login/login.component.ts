import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) { }

  onSubmit(): void {
    this.authService.login(this.username, this.password).subscribe(
      response => {
        // Manejar la respuesta exitosa, por ejemplo, guardar el token y redirigir al usuario
        console.log('Token:', response);
        // Redirigir al usuario a la página principal o a otra página
        this.router.navigate(['/home']);
      },
      error => {
        // Manejar el error, por ejemplo, mostrar un mensaje de error
        this.errorMessage = error.error;
      }
    );
  }
}