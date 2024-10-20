import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IniciarSesionService } from '../../servicios/api/iniciar-sesion/iniciar-sesion.service'; // Ajustar la ruta según la estructura de tu proyecto

@Component({
  selector: 'app-iniciar-sesion',
  templateUrl: './iniciar-sesion.component.html',
  styleUrls: ['./iniciar-sesion.component.css']
})
export class IniciarSesionComponent implements OnInit {
  loginForm!: FormGroup;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private iniciarSesionService: IniciarSesionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      nombreUsuario: ['', Validators.required],
      contrasenia: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { nombreUsuario, contrasenia } = this.loginForm.value;
      this.iniciarSesionService.login(nombreUsuario, contrasenia).subscribe(
        (response: any) => {
          console.log('Login successful', response);
          const loginResponse = response.object;
          console.log('Login response object:', loginResponse); // Log the entire response object
          if (loginResponse && loginResponse.token && loginResponse.rol) {
            // Guardar token y rol en localStorage
            localStorage.setItem('token', loginResponse.token);
            localStorage.setItem('rol', loginResponse.rol);
            console.log('Token y rol guardados en localStorage');
            this.redirectUser(loginResponse.rol);
          } else {
            console.error('Respuesta de login inválida', response);
            this.errorMessage = 'Respuesta de login inválida';
          }
        },
        (error: any) => {
          console.error('Error de autenticación', error);
          this.errorMessage = 'Nombre de usuario o contraseña incorrectos';
        }
      );
    }
  }

  private redirectUser(rol: string) {
    if (rol === 'Administrador') {
      this.router.navigate(['/admin']);
    } else if (rol === 'Cliente') {
      this.router.navigate(['/cliente']);
    } else {
      console.error('Rol desconocido:', rol);
    }
  }
}