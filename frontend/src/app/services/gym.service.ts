import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

export interface Socio {
  id: string;
  nombre: string;
  tel: string;
  tipo: string;
  vencimiento: string;
  estado: string;
}

export interface Producto {
  id: string;
  nombre: string;
  precio: number;
  stock: number;
  stockMinimo: number;
}

@Injectable({ providedIn: 'root' })
export class GymService {
  private apiUrl = 'http://localhost:8000/api';

  private socios = new BehaviorSubject<Socio[]>([]);
  socios$ = this.socios.asObservable();

  private productos = new BehaviorSubject<Producto[]>([
    { id: "P01", nombre: "Proteina Whey", precio: 850, stock: 10, stockMinimo: 5 },
    { id: "P02", nombre: "Creatina", precio: 450, stock: 3, stockMinimo: 5 }
  ]);
  productos$ = this.productos.asObservable();

  constructor(private http: HttpClient) {
    this.refreshSocios();
  }

  refreshSocios() {
    this.http.get<Socio[]>(`${this.apiUrl}/socios`).subscribe({
      next: (s) => this.socios.next(s),
      error: () => this.socios.next([])
    });
  }

  getSocios(): Observable<Socio[]> {
    return this.socios$;
  }

  scanSocio(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/torniquete/scan/${id}`);
  }

  agregarSocio(socio: Socio): Observable<Socio> {
    return this.http.post<Socio>(`${this.apiUrl}/socios`, socio).pipe(
      tap(() => this.refreshSocios())
    );
  }

  actualizarSocio(socio: Socio): Observable<Socio> {
    return this.http.put<Socio>(`${this.apiUrl}/socios/${socio.id}`, socio).pipe(
      tap(() => this.refreshSocios())
    );
  }

  borrarSocio(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/socios/${id}`).pipe(
      tap(() => this.refreshSocios())
    );
  }

  // Productos (in-memory por ahora)
  agregarProducto(producto: Producto) {
    const current = this.productos.value;
    this.productos.next([...current, producto]);
  }

  actualizarProducto(producto: Producto) {
    const current = this.productos.value.map(p => p.id === producto.id ? producto : p);
    this.productos.next(current);
  }

  borrarProducto(id: string) {
    this.productos.next(this.productos.value.filter(p => p.id !== id));
  }
}
