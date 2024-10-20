import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ProductosService } from '../../../servicios/api/productos/productos.service';
import { Producto } from '../../../compartido/modelos/productoDTO/producto.model';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.css']
})
export class ProductoComponent implements OnInit {
  productos: Producto[] = [];
  displayedColumns: string[] = ['nombre', 'descripcion', 'precio', 'stock', 'categoriaId', 'acciones'];
  dataSource = new MatTableDataSource<Producto>(this.productos);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private productosService: ProductosService, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.listarProductos();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  listarProductos(): void {
    this.productosService.getProductos().subscribe(
      (response: any) => {
        console.log(response);
        this.productos = response.object;
        this.dataSource.data = this.productos; // Actualiza el dataSource con los nuevos datos
      },
      (error: any) => {
        console.error('Error al obtener los productos', error);
      }
    );
  }

  openAddProductDialog(): void {
    const dialogRef = this.dialog.open(AddProductDialog, {
      width: '400px',
      data: { nombre: '', descripcion: '', precio: 0, stock: 0, categoriaId: 0 }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Datos del producto a registrar:', result); // Verifica los datos antes de enviarlos
        this.addProducto(result);
      }
    });
  }

  openEditProductDialog(producto: Producto): void {
    const dialogRef = this.dialog.open(EditProductDialog, {
      width: '400px',
      data: { ...producto } // Pasa una copia del producto al modal
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Datos del producto a editar:', result); // Verifica los datos antes de enviarlos
        this.editProducto(result.id, result);
      }
    });
  }

  addProducto(producto: Producto): void {
    this.productosService.addProducto(producto).subscribe(
      (data: Producto) => {
        console.log('Producto añadido:', data); // Verifica la respuesta del servidor
        this.productos.push(data);
        this.dataSource.data = this.productos; // Actualiza el dataSource con los nuevos datos
        this.listarProductos(); // Actualiza la lista de productos después de agregar uno nuevo
      },
      (error: any) => {
        console.error('Error al añadir el producto', error);
      }
    );
  }

  editProducto(id: number, producto: Producto): void {
    if (id !== undefined) {
      this.productosService.editProducto(id, producto).subscribe(
        (data: Producto) => {
          const index = this.productos.findIndex(p => p.id === id);
          if (index !== -1) {
            this.productos[index] = data;
            this.dataSource.data = this.productos; // Actualiza el dataSource con los nuevos datos
            this.listarProductos();
          }
        },
        (error: any) => {
          console.error('Error al editar el producto', error);
        }
      );
    }
  }

  confirmDeleteProducto(id: number): void {
    const dialogRef = this.dialog.open(ConfirmDeleteDialog);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteProducto(id);
      }
    });
  }

  deleteProducto(id: number): void {
    if (id !== undefined) {
      this.productosService.deleteProducto(id).subscribe(
        () => {
          this.productos = this.productos.filter(p => p.id !== id);
          this.dataSource.data = this.productos; // Actualiza el dataSource con los nuevos datos
        },
        (error: any) => {
          console.error('Error al eliminar el producto', error);
        }
      );
    }
  }
}

//MODAL PARA AGREGAR 

@Component({
  selector: 'add-product-dialog',
  template: `
    <h2 mat-dialog-title>Agregar Nuevo Producto</h2>
    <mat-dialog-content class="add-product-dialog">
      <form (ngSubmit)="onSubmit()">
        <mat-form-field appearance="fill">
          <mat-label>Nombre</mat-label>
          <input matInput [(ngModel)]="data.nombre" name="nombre" required>
        </mat-form-field>
        <mat-form-field appearance="fill">
          <mat-label>Descripción</mat-label>
          <input matInput [(ngModel)]="data.descripcion" name="descripcion" required>
        </mat-form-field>
        <mat-form-field appearance="fill">
          <mat-label>Precio</mat-label>
          <input matInput [(ngModel)]="data.precio" name="precio" type="number" required>
        </mat-form-field>
        <mat-form-field appearance="fill">
          <mat-label>Stock</mat-label>
          <input matInput [(ngModel)]="data.stock" name="stock" type="number" required>
        </mat-form-field>
        <mat-form-field appearance="fill">
          <mat-label>Categoría ID</mat-label>
          <input matInput [(ngModel)]="data.categoriaId" name="categoriaId" type="number" required>
        </mat-form-field>
        <mat-dialog-actions>
          <button mat-button type="button" (click)="onCancel()">Cancelar</button>
          <button mat-raised-button color="primary" type="submit">Agregar Producto</button>
        </mat-dialog-actions>
      </form>
    </mat-dialog-content>
  `
})
export class AddProductDialog {
  constructor(
    public dialogRef: MatDialogRef<AddProductDialog>,
    @Inject(MAT_DIALOG_DATA) public data: Producto
  ) {}

  onSubmit(): void {
    this.dialogRef.close(this.data);
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}

//MODAL EDITAR 
@Component({
  selector: 'edit-product-dialog',
  template: `
    <h2 mat-dialog-title>Editar Producto</h2>
    <mat-dialog-content class="edit-product-dialog">
      <form (ngSubmit)="onSubmit()">
        <mat-form-field appearance="fill">
          <mat-label>Nombre</mat-label>
          <input matInput [(ngModel)]="data.nombre" name="nombre" required>
        </mat-form-field>
        <mat-form-field appearance="fill">
          <mat-label>Descripción</mat-label>
          <input matInput [(ngModel)]="data.descripcion" name="descripcion" required>
        </mat-form-field>
        <mat-form-field appearance="fill">
          <mat-label>Precio</mat-label>
          <input matInput [(ngModel)]="data.precio" name="precio" type="number" required>
        </mat-form-field>
        <mat-form-field appearance="fill">
          <mat-label>Stock</mat-label>
          <input matInput [(ngModel)]="data.stock" name="stock" type="number" required>
        </mat-form-field>
        <mat-form-field appearance="fill">
          <mat-label>Categoría ID</mat-label>
          <input matInput [(ngModel)]="data.categoriaId" name="categoriaId" type="number" required>
        </mat-form-field>
        <mat-dialog-actions>
          <button mat-button type="button" (click)="onCancel()">Cancelar</button>
          <button mat-raised-button color="primary" type="submit">Guardar Cambios</button>
        </mat-dialog-actions>
      </form>
    </mat-dialog-content>
  `
})
export class EditProductDialog {
  constructor(
    public dialogRef: MatDialogRef<EditProductDialog>,
    @Inject(MAT_DIALOG_DATA) public data: Producto
  ) {}

  onSubmit(): void {
    this.dialogRef.close(this.data);
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}

//MODAL PARA CONFIRMACION DE ELIMINACION 
@Component({
  selector: 'confirm-delete-dialog',
  template: `
    <h2 mat-dialog-title>Confirmar Eliminación</h2>
    <mat-dialog-content>
      <p>¿Estás seguro de que deseas eliminar este producto?</p>
    </mat-dialog-content>
    <mat-dialog-actions>
      <button mat-button (click)="onCancel()">No</button>
      <button mat-raised-button color="warn" (click)="onConfirm()">Sí</button>
    </mat-dialog-actions>
  `
})
export class ConfirmDeleteDialog {
  constructor(public dialogRef: MatDialogRef<ConfirmDeleteDialog>) {}

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}