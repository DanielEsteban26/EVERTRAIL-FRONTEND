import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CuentaService } from '../../servicios/api/cuenta/cuenta.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {
  profileForm!: FormGroup;

  constructor(private fb: FormBuilder, private cuentaService: CuentaService) {}

  ngOnInit(): void {
    this.profileForm = this.fb.group({
      nombreUsuario: ['', Validators.required],
      nombre: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      // Otros campos según sea necesario
    });

    // Suponiendo que el nombre de usuario está almacenado en localStorage
    const nombreUsuario = localStorage.getItem('nombreUsuario');
    if (nombreUsuario) {
      this.cuentaService.getCuenta().subscribe(user => {
        this.profileForm.patchValue(user);
      });
    }
  }

  onSubmit(): void {
    if (this.profileForm.valid) {
      this.cuentaService.updateCuenta(this.profileForm.value).subscribe(response => {
        alert('Perfil actualizado');
      });
    }
  }
}