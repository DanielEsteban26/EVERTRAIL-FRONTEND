import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { IniciarSesionComponent } from './componentes/iniciar-sesion/iniciar-sesion.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, provideHttpClient, withFetch } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterModule } from '@angular/router'; // Asegúrate de importar RouterModule aquí
import { ClienteDashboardComponent } from './componentes/cliente-dashboard/cliente-dashboard.component';
import { AdminDashboardComponent } from './componentes/admin-dashboard/admin-dashboard.component';
import { HistorialComprasComponent } from './componentes/historial-compras/historial-compras.component';
import { ResenaComponent } from './componentes/resena/resena.component';
import { MatTableModule } from '@angular/material/table';
import { HeaderComponent } from './componentes/cliente-dashboard/header/header.component';
import { SidenavComponent } from './componentes/cliente-dashboard/sidenav/sidenav.component';
import { FooterComponent } from './componentes/cliente-dashboard/footer/footer.component';
import { SidebarComponent } from './componentes/admin-dashboard/sidebar/sidebar.component';
import { MatListModule } from '@angular/material/list';
import {MatToolbarModule } from '@angular/material/toolbar';
import { MatExpansionModule } from '@angular/material/expansion';
import { AddProductDialog, ConfirmDeleteDialog, EditProductDialog, ProductoComponent } from './componentes/admin-dashboard/producto/producto.component';
import { AddCategoriaDialog, ConfirmCADeleteDialog, CategoriasComponent, EditCategoriaDialog } from './componentes/admin-dashboard/categorias/categorias.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { AddUsuarioDialog, ConfirmUsuDeleteDialog, EditUsuarioDialog , UsuariosComponent } from './componentes/admin-dashboard/usuarios/usuarios.component';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CarritoComponent, RegistrarTarjetaModalComponent, SeleccionarTarjetaModalComponent } from './componentes/cliente-dashboard/carrito/carrito.component';



@NgModule({
  declarations: [
    AppComponent,
    ClienteDashboardComponent,
    AdminDashboardComponent,
    IniciarSesionComponent,
    HistorialComprasComponent,
    CarritoComponent,
    ResenaComponent,
    HeaderComponent,
    SidenavComponent,
    FooterComponent,
    SidebarComponent,
    ProductoComponent,
    CategoriasComponent,
    AddProductDialog,
    EditProductDialog,
    ConfirmDeleteDialog,
    AddCategoriaDialog,
    EditCategoriaDialog,
    ConfirmCADeleteDialog,
    UsuariosComponent,
    AddUsuarioDialog,
    EditUsuarioDialog,
    ConfirmUsuDeleteDialog,
    RegistrarTarjetaModalComponent,
    SeleccionarTarjetaModalComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatTableModule,
    MatSidenavModule,
    MatInputModule,
    MatSnackBarModule,
    MatButtonModule,
    MatFormFieldModule,
    MatCardModule,
    MatIconModule,
    MatMenuModule,
    RouterModule, // Asegúrate de importar RouterModule aquí
    MatMenuModule,
    MatListModule,
    MatToolbarModule,
    MatExpansionModule,
    MatDialogModule,
    MatPaginatorModule,
    MatSortModule,
    MatSelectModule,
    MatCheckboxModule,
    MatToolbarModule
  ],
  providers: [
    provideHttpClient(withFetch())
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }