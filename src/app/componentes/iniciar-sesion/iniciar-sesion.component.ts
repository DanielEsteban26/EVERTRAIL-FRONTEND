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
          const username = response.username;
          if (username) {
            console.log('Rol del usuario:', username);
            this.redirectUser(username);
          } else {
            console.error('Rol desconocido', response);
          }
        },
        (error: any) => {
          console.error('Error de autenticación', error);
        }
      );
    }
  }

  private redirectUser(username: string) {
    if (username === 'Administrador') {
      this.router.navigate(['/admin']);
    } else if (username === 'Cliente') {
      this.router.navigate(['/cliente']);
    } else {
      console.error('Rol desconocido:', username);
    }
  }
}