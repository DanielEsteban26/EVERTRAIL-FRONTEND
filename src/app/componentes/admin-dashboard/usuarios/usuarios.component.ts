import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { Usuario } from '../../../compartido/modelos/usuarioDTO/usuario.model';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { UsuariosService } from '../../../servicios/api/usuarios/usuarios.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css'] // Cambiado a styleUrls
})
export class UsuariosComponent implements OnInit {

  usuarios: Usuario[] = [];
  displayedColumns: string[] = ['id', 'nombreUsuario', 'email', 'rol', 'acciones']; // Asegúrate de que los nombres coincidan con el modelo
  dataSource = new MatTableDataSource<Usuario>(this.usuarios);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort; // Cambiado a MatSort

  constructor(private usuarioService: UsuariosService, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.listarUsuarios();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  listarUsuarios(): void {
    this.usuarioService.getUsuarios().subscribe(
      (response: any) => {
        console.log(response);
        this.usuarios = response.object;
        this.dataSource.data = this.usuarios;
      },
      (error: any) => {
        console.error('Error al obtener los usuarios', error);
      }
    );
  }

  openAddUsuarioDialog(): void {
    const dialogRef = this.dialog.open(AddUsuarioDialog, {
      width: '400px',
      data: { nombreUsuario: '', email: '', rol: '' } // Asegúrate de que los nombres coincidan con el modelo
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Datos del usuario a registrar:', result);
        this.addUsuario(result);
      }
    });
  }

  openEditUsuarioDialog(usuario: Usuario): void {
    const dialogRef = this.dialog.open(EditUsuarioDialog, {
      width: '400px',
      data: { ...usuario }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Datos del usuario a editar:', result);
        this.editUsuario(result.id, result);
      }
    });
  }

  addUsuario(usuario: Usuario): void {
    this.usuarioService.addUsuario(usuario).subscribe(
      (data: Usuario) => {
        console.log('Usuario añadido:', data);
        this.usuarios.push(data);
        this.dataSource.data = this.usuarios;
        this.listarUsuarios();
      },
      (error: any) => {
        console.error('Error al añadir el usuario', error);
      }
    );
  }

  editUsuario(id: number, usuario: Usuario): void {
    if (id !== undefined) {
      this.usuarioService.editUsuario(id, usuario).subscribe(
        (data: Usuario) => {
          const index = this.usuarios.findIndex(u => u.id === id);
          if (index !== -1) {
            this.usuarios[index] = data;
            this.dataSource.data = this.usuarios;
            this.listarUsuarios();
          }
        },
        (error: any) => {
          console.error('Error al editar el usuario', error);
        }
      );
    }
  }

  confirmDeleteUsuario(id: number): void {
    const dialogRef = this.dialog.open(ConfirmUsuDeleteDialog);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteUsuario(id);
      }
    });
  }

  deleteUsuario(id: number): void {
    if (id !== undefined) {
      this.usuarioService.deleteUsuario(id).subscribe(
        () => {
          this.usuarios = this.usuarios.filter(u => u.id !== id);
          this.dataSource.data = this.usuarios;
        },
        (error: any) => {
          console.error('Error al eliminar el usuario', error);
        }
      );
    }
  }
}

// MODAL PARA AGREGAR USUARIO
@Component({
  selector: 'add-usuario-dialog',
  template: `
    <h2 mat-dialog-title>Agregar Nuevo Usuario</h2>
    <mat-dialog-content class="add-usuario-dialog">
      <form (ngSubmit)="onSubmit()">
        <mat-form-field appearance="fill">
          <mat-label>Nombre</mat-label>
          <input matInput [(ngModel)]="data.nombreUsuario" name="nombreUsuario" required> <!-- Cambiado a nombreUsuario -->
        </mat-form-field>
        <mat-form-field appearance="fill">
          <mat-label>Email</mat-label>
          <input matInput [(ngModel)]="data.correo" name="email" required>
        </mat-form-field>
        <mat-form-field appearance="fill">
          <mat-label>Rol</mat-label>
          <input matInput [(ngModel)]="data.rol" name="rol" required>
        </mat-form-field>
        <mat-dialog-actions>
          <button mat-button type="button" (click)="onCancel()">Cancelar</button>
          <button mat-raised-button color="primary" type="submit">Agregar Usuario</button>
        </mat-dialog-actions>
      </form>
    </mat-dialog-content>
  `
})
export class AddUsuarioDialog {
  constructor(
    public dialogRef: MatDialogRef<AddUsuarioDialog>,
    @Inject(MAT_DIALOG_DATA) public data: Usuario
  ) {}

  onSubmit(): void {
    this.dialogRef.close(this.data);
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}

// MODAL PARA EDITAR USUARIO
@Component({
  selector: 'edit-usuario-dialog',
  template: `
    <h2 mat-dialog-title>Editar Usuario</h2>
    <mat-dialog-content class="edit-usuario-dialog">
      <form (ngSubmit)="onSubmit()">
        <mat-form-field appearance="fill">
          <mat-label>Nombre</mat-label>
          <input matInput [(ngModel)]="data.nombreUsuario" name="nombreUsuario" required> <!-- Cambiado a nombreUsuario -->
        </mat-form-field>
        <mat-form-field appearance="fill">
          <mat-label>Email</mat-label>
          <input matInput [(ngModel)]="data.correo" name="email" required>
        </mat-form-field>
        <mat-form-field appearance="fill">
          <mat-label>Rol</mat-label>
          <input matInput [(ngModel)]="data.rol" name="rol" required>
        </mat-form-field>
        <mat-dialog-actions>
          <button mat-button type="button" (click)="onCancel()">Cancelar</button>
          <button mat-raised-button color="primary" type="submit">Guardar Cambios</button>
        </mat-dialog-actions>
      </form>
    </mat-dialog-content>
  `
})
export class EditUsuarioDialog {
  constructor(
    public dialogRef: MatDialogRef<EditUsuarioDialog>,
    @Inject(MAT_DIALOG_DATA) public data: Usuario
  ) {}

  onSubmit(): void {
    this.dialogRef.close(this.data);
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}

// MODAL PARA CONFIRMAR ELIMINACIÓN
@Component({
  selector: 'confirm-usu-delete-dialog',
  template: `
    <h2 mat-dialog-title>Confirmar Eliminación</h2>
    <mat-dialog-content>
      <p>¿Estás seguro de que deseas eliminar este usuario?</p>
    </mat-dialog-content>
    <mat-dialog-actions>
      <button mat-button (click)="onCancel()">No</button>
      <button mat-raised-button color="warn" (click)="onConfirm()">Sí</button>
    </mat-dialog-actions>
  `
})
export class ConfirmUsuDeleteDialog {
  constructor(public dialogRef: MatDialogRef<ConfirmUsuDeleteDialog>) {}

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}