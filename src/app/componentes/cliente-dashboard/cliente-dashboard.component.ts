import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { ProductosService } from '../../servicios/api/productos/productos.service';
import { Producto } from '../../compartido/modelos/productoDTO/producto.model';
import { Categoria } from '../../compartido/modelos/CategoriaDTO/categoria.model';
import { CategoriaService } from '../../servicios/api/categoria/categoria.service';
import { CarritoService } from '../../servicios/api/carrito/carrito.service'; // Importa el servicio de carrito
import { CarritoDetalleService } from '../../servicios/api/carrito/carritoDetalle.service';
import { CarritoDetalle } from '../../compartido/modelos/CarritoDetalleDTO/carritoDetalle.model';

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
  
  
  // Objeto para almacenar el estado de selección
  selectedCategories: { [key: number]: boolean } = {};

  constructor(
    private productosService: ProductosService,
    private categoriaService: CategoriaService,
    private carritoService: CarritoService, // Inyecta el servicio de carrito
    private carritoDetalleService: CarritoDetalleService // Inyecta el servicio de carrito-detalle
  ) {}

  ngOnInit(): void {
    this.listarProductos();
    this.listarCategorias();
  }

  listarProductos(): void {
    this.productosService.getProductos().subscribe(
      (response: any) => {
        this.products = response.object;
        this.filteredProducts = this.products; // Inicialmente mostrar todos los productos
      },
      (error: any) => {
        console.error('Error al obtener los productos', error);
      }
    );
  }

  listarCategorias(): void {
    this.categoriaService.getCategorias().subscribe(
      (response: any) => {
        this.categorias = response.object;
        // Inicializa el estado de selección
        this.categorias.forEach(cat => {
          this.selectedCategories[cat.id!] = false; // Asegúrate de que `id` no sea undefined
        });
      },
      (error: any) => {
        console.error('Error al obtener las categorías', error);
      }
    );
  }

  filterProducts(): void {
    const selectedIds = Object.keys(this.selectedCategories)
      .filter(id => this.selectedCategories[Number(id)]) // Filtra las categorías seleccionadas
      .map(Number);

    if (selectedIds.length > 0) {
      this.filteredProducts = this.products.filter(product => 
        selectedIds.includes(product.categoriaId!) // Filtra los productos según las categorías seleccionadas
      );
    } else {
      this.filteredProducts = this.products; // Si no hay categorías seleccionadas, muestra todos los productos
    }
  }

  agregarAlCarrito(producto: Producto): void {
    const id = Number(localStorage.getItem('id')); // Obtén el ID del usuario desde localStorage
    const carritoId = 1; // ID del carrito, puedes cambiarlo según tu lógica

    // Verifica si el carrito existe
    this.carritoService.obtenerCarritoPorId(carritoId).subscribe(
      carrito => {
        // Si el carrito existe, agrega el detalle del carrito
        this.agregarDetalleAlCarrito(carritoId, producto);
      },
      (error: any) => {
        if (error.status === 404) {
          // Si el carrito no existe, crea uno
          this.carritoService.crearCarrito({ usuarioId: id }).subscribe(
            nuevoCarrito => {
              // Agrega el detalle del carrito al nuevo carrito
              this.agregarDetalleAlCarrito(nuevoCarrito.id, producto);
            },
            crearError => {
              console.error('Error al crear el carrito:', crearError);
            }
          );
        } else {
          console.error('Error al verificar el carrito:', error);
        }
      }
    );
  }

  agregarDetalleAlCarrito(carritoId: number, producto: Producto): void {
    const carritoDetalle: CarritoDetalle = {
      carritoId: carritoId,
      productoId: producto.id!,
      cantidad: 1,
      precio: producto.precio,
      productoNombre: producto.nombre,
      productoDescripcion: producto.descripcion!
    };

    this.carritoDetalleService.agregarProducto(carritoDetalle).subscribe(
      (response: any) => {
        console.log('Producto añadido al carrito:', response);
      },
      (error : any) => {
        console.error('Error al añadir el producto al carrito:', error);
      }
    );
  }
}