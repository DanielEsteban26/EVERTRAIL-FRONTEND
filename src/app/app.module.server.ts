import { NgModule } from '@angular/core';
import { ServerModule } from '@angular/platform-server';
import { AppModule } from './app.module'; // Asegúrate de que AppModule esté importado
import { AppComponent } from './app.component';

@NgModule({
  imports: [
    ServerModule,
    AppModule // Asegúrate de que AppModule esté incluido en los imports
  ],
  bootstrap: [AppComponent],
})
export class AppServerModule { }