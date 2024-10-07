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
import { RouterModule } from '@angular/router';
import { ClienteDashboardComponent } from './componentes/cliente-dashboard/cliente-dashboard.component';
import { AdminDashboardComponent } from './componentes/admin-dashboard/admin-dashboard.component';
import { PerfilComponent } from './componentes/perfil/perfil.component';
import { HistorialComprasComponent } from './componentes/historial-compras/historial-compras.component';
import { CarritoComponent } from './componentes/carrito/carrito.component';
import { ResenaComponent } from './componentes/resena/resena.component';

@NgModule({
  declarations: [
    AppComponent,
    ClienteDashboardComponent,
    AdminDashboardComponent,
    IniciarSesionComponent,
    PerfilComponent,
    HistorialComprasComponent,
    CarritoComponent,
    ResenaComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatSidenavModule,
    MatInputModule,
    MatSnackBarModule,
    MatButtonModule,
    MatFormFieldModule,
    MatCardModule,
    MatIconModule,
    MatMenuModule,
    RouterModule
  ],
  providers: [
    provideHttpClient(withFetch())
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }