export interface Categoria {
    id: number;
    nombre: string;
  }
  
  export interface ImagenProducto {
    id: number;
    url: string;
  }
  
  export interface DetallePedido {
    id: number;
    cantidad: number;
    precio: number;
  }
  
  export interface ResenaProducto {
    id: number;
    comentario: string;
    calificacion: number;
  }
  
  export interface Producto {
    id: number;
    nombre: string;
    descripcion: string;
    precio: number;
    stock: number;
    categoria: Categoria;
    imagenesProductos: ImagenProducto[];
    detallesPedido: DetallePedido[];
    reseñasProductos: ResenaProducto[];
  }