import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IniciarSesionService } from '../../servicios/api/iniciar-sesion/iniciar-sesion.service';
import { Usuario } from '../../compartido/modelos/usuario/usuario.model';

@Component({
  selector: 'app-iniciar-sesion',
  templateUrl: './iniciar-sesion.component.html',
  styleUrls: ['./iniciar-sesion.component.css'],
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
      nombreUsuario: ['', [Validators.required, Validators.minLength(3)]],
      contrasenia: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  get nombreUsuario() {
    return this.loginForm.get('nombreUsuario');
  }

  get contrasenia() {
    return this.loginForm.get('contrasenia');
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const usuario: Usuario = {
        nombreUsuario: this.nombreUsuario?.value,
        contrasenia: this.contrasenia?.value,
      };

      this.iniciarSesionService.login(usuario).subscribe(
        (response) => {
          localStorage.setItem('token', response.token);
          localStorage.setItem('role', response.role);
          console.log('Inicio de sesión exitoso');
          console.log('Rol recibido:', response.role); // Agrega este log para verificar el rol recibido
          switch (response.role) {
            case 'Administrador':
              this.router.navigate(['/admin']);
              break;
            case 'Cliente':
              this.router.navigate(['/cliente']);
              break;
            case 'Usuario': // Asegúrate de que este sea el nombre exacto del tercer rol
              this.router.navigate(['/']);
              break;
            default:
              console.error('Rol desconocido');
              break;
          }
        },
        (error) => {
          console.error('Error de autenticación', error);
          if (error.status === 400) {
            alert('Credenciales inválidas');
          } else if (error.status === 404) {
            alert('Usuario no encontrado');
          } else {
            alert('Error del servidor. Por favor, inténtelo de nuevo más tarde.');
          }
        }
      );
    } else {
      console.log('Formulario inválido');
    }
  }
}