import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IniciarSesionComponent } from './componentes/iniciar-sesion/iniciar-sesion.component';
import { ClienteDashboardComponent } from './componentes/cliente-dashboard/cliente-dashboard.component';
import { AdminDashboardComponent } from './componentes/admin-dashboard/admin-dashboard.component';
import { HistorialComprasComponent } from './componentes/historial-compras/historial-compras.component';
import { CarritoComponent } from './componentes/carrito/carrito.component';
import { ResenaComponent } from './componentes/resena/resena.component';
import { ProductoComponent } from './componentes/admin-dashboard/producto/producto.component';
import { MarcasComponent } from './componentes/admin-dashboard/marcas/marcas.component';
import { CategoriasComponent } from './componentes/admin-dashboard/categorias/categorias.component';
import { UsuariosComponent }  from './componentes/admin-dashboard/usuarios/usuarios.component';

const routes: Routes = [
  { path: 'iniciar-sesion', component: IniciarSesionComponent },
  { path: 'cliente', component: ClienteDashboardComponent },
  { path: 'admin', component: AdminDashboardComponent, children: [
    { path: 'productos', component: ProductoComponent },
    { path: 'marcas', component: MarcasComponent },
    { path: 'categorias', component: CategoriasComponent },
    { path: 'usuarios', component: UsuariosComponent },
    { path: '', redirectTo: 'productos', pathMatch: 'full' } // Ruta por defecto
  ]},
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