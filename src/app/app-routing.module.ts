import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IniciarSesionComponent } from './componentes/iniciar-sesion/iniciar-sesion.component';
import { ClienteDashboardComponent } from './componentes/cliente-dashboard/cliente-dashboard.component';
import { AdminDashboardComponent } from './componentes/admin-dashboard/admin-dashboard.component';
import { PerfilComponent } from './componentes/perfil/perfil.component';
import { HistorialComprasComponent } from './componentes/historial-compras/historial-compras.component';
import { CarritoComponent } from './componentes/carrito/carrito.component';
import { ResenaComponent } from './componentes/resena/resena.component';

const routes: Routes = [
  { path: 'iniciar-sesion', component: IniciarSesionComponent },
  { path: 'cliente', component: ClienteDashboardComponent },
  { path: 'admin', component: AdminDashboardComponent },
  { path: 'perfil', component: PerfilComponent },
  { path: 'historial-compras', component: HistorialComprasComponent },
  { path: 'carrito', component: CarritoComponent },
  { path: 'resena', component: ResenaComponent },
  { path: '', redirectTo: '/iniciar-sesion', pathMatch: 'full' },
  { path: '**', redirectTo: '/iniciar-sesion' } // Ruta para manejar rutas no encontradas
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }