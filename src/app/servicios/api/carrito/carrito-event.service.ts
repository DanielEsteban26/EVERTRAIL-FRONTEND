import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CarritoEventService {
  private carritoUpdatedSource = new Subject<void>();
  carritoUpdated$ = this.carritoUpdatedSource.asObservable();

  notifyCarritoUpdated() {
    this.carritoUpdatedSource.next();
  }
}
