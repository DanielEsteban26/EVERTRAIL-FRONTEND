import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { ProductosService } from '../../servicios/api/productos/productos.service';
import { Producto } from '../../compartido/modelos/productoDTO/producto.model';
import { Categoria } from '../../compartido/modelos/CategoriaDTO/categoria.model';
import { CategoriaService } from '../../servicios/api/categoria/categoria.service';
import { CarritoService } from '../../servicios/api/carrito/carrito.service';

@Component({
  selector: 'app-cliente-dashboard',
  templateUrl: './cliente-dashboard.component.html',
  styleUrls: ['./cliente-dashboard.component.css']
})
export class ClienteDashboardComponent implements OnInit {
  @ViewChild('sidenav') sidenav!: MatSidenav;
  products: Producto[] = [];
  categorias: Categoria[] = [];
  filteredProducts: Producto[] = [];
  
  selectedCategories: { [key: number]: boolean } = {};
  totalItems: number = 0; // Contador de items en el carrito

  private readonly ERROR_PRODUCTOS = 'Error al obtener los productos';
  private readonly ERROR_CATEGORIAS = 'Error al obtener las categorías';
  private readonly ERROR_CREAR_CARRITO = 'Error al crear el carrito';
  private readonly ERROR_AÑADIR_PRODUCTO = 'Error al añadir el producto al carrito';

  constructor(
    private productosService: ProductosService,
    private categoriaService: CategoriaService,
    private carritoService: CarritoService,
  ) {}

  ngOnInit(): void {
    this.listarProductos();
    this.listarCategorias();
    this.carritoService.currentItemCount.subscribe(count => {
      this.totalItems = count; // Suscribirse al contador del carrito
    });
  }

  listarProductos(): void {
    this.productosService.getProductos().subscribe(
      (response: any) => {
        if (response.object) {
          this.products = response.object;
          this.filteredProducts = this.products;
        } else {
          console.error('No se encontraron productos en la respuesta');
        }
      },
      (error: any) => {
        console.error(this.ERROR_PRODUCTOS, error);
      }
    );
  }

  listarCategorias(): void {
    this.categoriaService.getCategorias().subscribe(
      (response: any) => {
        if (response.object) {
          this.categorias = response.object;
          this.categorias.forEach(cat => {
            this.selectedCategories[cat.id!] = false;
          });
        } else {
          console.error('No se encontraron categorías en la respuesta');
        }
      },
      (error: any) => {
        console.error(this.ERROR_CATEGORIAS, error);
      }
    );
  }

  filterProducts(): void {
    const selectedIds = Object.keys(this.selectedCategories)
      .filter(id => this.selectedCategories[Number(id)])
      .map(Number);

    this.filteredProducts = selectedIds.length > 0 
      ? this.products.filter(product => selectedIds.includes(product.categoriaId!))
      : this.products;
  }

  agregarAlCarrito(producto: Producto): void {
    const id = Number(localStorage.getItem('id')); // ID del usuario
    let carritoId = this.obtenerCarritoId(); // Lógica para obtener el ID del carrito


    // Si no hay un ID de carrito, crea uno
    if (!carritoId) {
      console.error("No se pudo obtener el ID del carrito.");
      this.carritoService.crearCarrito({ usuarioId: id }).subscribe(
        nuevoCarrito => {
          console.log('Nuevo carrito creado:', nuevoCarrito);
          
          if (nuevoCarrito?.object?.id) {
            carritoId = nuevoCarrito.object.id; // Asigna el ID del nuevo carrito a la variable
            localStorage.setItem('carritoId', carritoId!.toString()); // Guarda el nuevo ID en localStorage
            console.log('Carrito ID guardado en localStorage:', carritoId);
            this.agregarDetalleAlCarrito(carritoId!, producto);
          } else {
            console.error("Error: ID del carrito no se pudo obtener.");
          }
        },
        crearError => {
          console.error(this.ERROR_CREAR_CARRITO, crearError);
        }
      );
      return; // Salimos aquí porque no hay un carrito existente
    }
    console.log('ID del usuario:', id);
    console.log('Carrito ID recuperado:', carritoId);

    // Verifica si el carrito existe
    this.carritoService.obtenerCarritoPorId(carritoId).subscribe(
      carrito => {
        console.log('Carrito existente encontrado:', carrito);
        this.agregarDetalleAlCarrito(carrito.id, producto);
      },
      (error: any) => {
        console.error('Error al verificar el carrito:', error);
        if (error.status === 404) {
          this.carritoService.crearCarrito({ usuarioId: id }).subscribe(
            nuevoCarrito => {
              console.log('Nuevo carrito creado:', nuevoCarrito);
              if (nuevoCarrito?.object?.id) {
                carritoId = nuevoCarrito.object.id;
                localStorage.setItem('carritoId', carritoId!.toString());
                console.log('Carrito ID guardado en localStorage:', carritoId);
                this.agregarDetalleAlCarrito(carritoId!, producto);
              } else {
                console.error("Error: ID del carrito no se pudo obtener.");
              }
            },
            crearError => {
              console.error(this.ERROR_CREAR_CARRITO, crearError);
            }
          );
        }
      }

     
    );
  }

  agregarDetalleAlCarrito(carritoId: number, producto: Producto): void {
    if (!producto.id) {
      console.error('ID del producto no encontrado.');
      return;
    }

    const carritoDetalle = {
      carritoId: carritoId,
      productoId: producto.id,
      cantidad: 1,
      precio: producto.precio,
    };

    console.log('Agregando producto al carrito:', carritoDetalle);

    this.carritoService.agregarProducto(carritoId, carritoDetalle).subscribe(
      (response: any) => {
        console.log('Producto añadido al carrito:', response);
        
        this.carritoService.obtenerCarritoPorId(carritoId).subscribe(carrito => {
          const totalCantidad = carrito.carritoDetalles.reduce((acc: number, item: any) => acc + item.cantidad, 0);
          this.carritoService.updateItemCount(totalCantidad);

          if (totalCantidad.isNaN) {
            localStorage.removeItem('carritoId');
            console.log('Carrito vacío, eliminando idCarrito del localStorage.');
          }
        });
      },
      (error: any) => {
        console.error(this.ERROR_AÑADIR_PRODUCTO, error);
      }
    );
  }

  obtenerCarritoId(): number | null {
    const carritoId = localStorage.getItem('carritoId');
    console.log('Carrito ID recuperado:', carritoId);
    return carritoId ? Number(carritoId) : null; // Retorna null si no hay ID
  }
}
