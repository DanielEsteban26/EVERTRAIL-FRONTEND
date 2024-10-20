import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CategoriaService } from '../../../servicios/api/categoria/categoria.service';
import { Categoria } from '../../../compartido/modelos/CategoriaDTO/categoria.model';

@Component({
  selector: 'app-categorias',
  templateUrl: './categorias.component.html',
  styleUrls: ['./categorias.component.css']
})
export class CategoriasComponent implements OnInit {
  categorias: Categoria[] = [];
  displayedColumns: string[] = ['id', 'nombre', 'descripcion', 'acciones'];
  dataSource = new MatTableDataSource<Categoria>(this.categorias);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(@Inject(CategoriaService) private categoriaService: CategoriaService, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.listarCategorias();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  listarCategorias(): void {
    this.categoriaService.getCategorias().subscribe(
      (response: any) => {
        console.log(response);
        this.categorias = response.object;
        this.dataSource.data = this.categorias;
      },
      (error: any) => {
        console.error('Error al obtener las categorías', error);
      }
    );
  }

  openAddCategoriaDialog(): void {
    const dialogRef = this.dialog.open(AddCategoriaDialog, {
      width: '400px',
      data: { nombre: '', descripcion: '' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Datos de la categoría a registrar:', result); // Verifica los datos antes de enviarlos
        this.addCategoria(result);
      }
    });
  }

  openEditCategoriaDialog(categoria: Categoria): void {
    const dialogRef = this.dialog.open(EditCategoriaDialog, {
      width: '400px',
      data: { ...categoria } // Pasa una copia de la categoría al modal
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Datos de la categoría a editar:', result); // Verifica los datos antes de enviarlos
        this.editCategoria(result.id, result);
      }
    });
  }

  addCategoria(categoria: Categoria): void {
    this.categoriaService.addCategoria(categoria).subscribe(
      (data: Categoria) => {
        console.log('Categoría añadida:', data); // Verifica la respuesta del servidor
        this.categorias.push(data);
        this.dataSource.data = this.categorias;
        this.listarCategorias(); // Actualiza la lista de categorías después de agregar una nueva
      },
      (error: any) => {
        console.error('Error al añadir la categoría', error);
      }
    );
  }

  editCategoria(id: number, categoria: Categoria): void {
    if (id !== undefined) {
      this.categoriaService.editCategoria(id, categoria).subscribe(
        (data: Categoria) => {
          const index = this.categorias.findIndex(c => c.id === id);
          if (index !== -1) {
            this.categorias[index] = data;
            this.dataSource.data = this.categorias;
            this.listarCategorias();
          }
        },
        (error: any) => {
          console.error('Error al editar la categoría', error);
        }
      );
    }
  }

  confirmDeleteCategoria(id: number): void {
    const dialogRef = this.dialog.open(ConfirmCADeleteDialog);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteCategoria(id);
      }
    });
  }

  deleteCategoria(id: number): void {
    if (id !== undefined) {
      this.categoriaService.deleteCategoria(id).subscribe(
        () => {
          this.categorias = this.categorias.filter(c => c.id !== id);
          this.dataSource.data = this.categorias;
        },
        (error: any) => {
          console.error('Error al eliminar la categoría', error);
        }
      );
    }
  }
}

// MODAL PARA AGREGAR CATEGORÍA
@Component({
  selector: 'add-categoria-dialog',
  template: `
    <h2 mat-dialog-title>Agregar Nueva Categoría</h2>
    <mat-dialog-content class="add-categoria-dialog">
      <form (ngSubmit)="onSubmit()">
        <mat-form-field appearance="fill">
          <mat-label>Nombre</mat-label>
          <input matInput [(ngModel)]="data.nombre" name="nombre" required>
        </mat-form-field>
        <mat-form-field appearance="fill">
          <mat-label>Descripción</mat-label>
          <input matInput [(ngModel)]="data.descripcion" name="descripcion" required>
        </mat-form-field>
        <mat-dialog-actions>
          <button mat-button type="button" (click)="onCancel()">Cancelar</button>
          <button mat-raised-button color="primary" type="submit">Agregar Categoría</button>
        </mat-dialog-actions>
      </form>
    </mat-dialog-content>
  `
})
export class AddCategoriaDialog {
  constructor(
    public dialogRef: MatDialogRef<AddCategoriaDialog>,
    @Inject(MAT_DIALOG_DATA) public data: Categoria
  ) {}

  onSubmit(): void {
    this.dialogRef.close(this.data);
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}

// MODAL PARA EDITAR CATEGORÍA
@Component({
  selector: 'edit-categoria-dialog',
  template: `
    <h2 mat-dialog-title>Editar Categoría</h2>
    <mat-dialog-content class="edit-categoria-dialog">
      <form (ngSubmit)="onSubmit()">
        <mat-form-field appearance="fill">
          <mat-label>Nombre</mat-label>
          <input matInput [(ngModel)]="data.nombre" name="nombre" required>
        </mat-form-field>
        <mat-form-field appearance="fill">
          <mat-label>Descripción</mat-label>
          <input matInput [(ngModel)]="data.descripcion" name="descripcion" required>
        </mat-form-field>
        <mat-dialog-actions>
          <button mat-button type="button" (click)="onCancel()">Cancelar</button>
          <button mat-raised-button color="primary" type="submit">Guardar Cambios</button>
        </mat-dialog-actions>
      </form>
    </mat-dialog-content>
  `
})
export class EditCategoriaDialog {
  constructor(
    public dialogRef: MatDialogRef<EditCategoriaDialog>,
    @Inject(MAT_DIALOG_DATA) public data: Categoria
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
  selector: 'confirm-ca-delete-dialog',
  template: `
    <h2 mat-dialog-title>Confirmar Eliminación</h2>
    <mat-dialog-content>
      <p>¿Estás seguro de que deseas eliminar esta categoría?</p>
    </mat-dialog-content>
    <mat-dialog-actions>
      <button mat-button (click)="onCancel()">No</button>
      <button mat-raised-button color="warn" (click)="onConfirm()">Sí</button>
    </mat-dialog-actions>
  `
})
export class ConfirmCADeleteDialog {
  constructor(public dialogRef: MatDialogRef<ConfirmCADeleteDialog>) {}

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}