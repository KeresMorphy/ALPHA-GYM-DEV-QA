import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GymService, Producto } from './services/gym.service';

@Component({
  selector: 'app-inventario',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="p-8 overflow-y-auto h-full">
      <div class="max-w-6xl mx-auto">
        <h1 class="text-2xl font-bold mb-6">Inventario de Productos</h1>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div class="bg-slate-800 p-6 rounded-xl border border-slate-700">
            <h3 class="text-lg font-semibold mb-4">{{ modoEdicion ? 'Actualizar Producto' : 'Nuevo Producto' }}</h3>
            <form (ngSubmit)="guardarProducto()">
              <div class="mb-4">
                <label class="block text-xs text-slate-400 uppercase mb-1">Codigo de Barras / ID</label>
                <input [(ngModel)]="prodForm.id" name="id" [disabled]="modoEdicion" type="text" placeholder="Ej. P03"
                  class="w-full p-3 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-emerald-500 disabled:opacity-50">
              </div>
              <div class="mb-4">
                <label class="block text-xs text-slate-400 uppercase mb-1">Nombre del Producto</label>
                <input [(ngModel)]="prodForm.nombre" name="nombre" type="text" placeholder="Ej. Proteina Whey"
                  class="w-full p-3 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-emerald-500">
              </div>
              <div class="mb-4">
                <label class="block text-xs text-slate-400 uppercase mb-1">Precio de Venta</label>
                <input [(ngModel)]="prodForm.precio" name="precio" type="number" placeholder="0.00"
                  class="w-full p-3 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-emerald-500">
              </div>
              <div class="mb-4">
                <label class="block text-xs text-slate-400 uppercase mb-1">Stock Actual</label>
                <input [(ngModel)]="prodForm.stock" name="stock" type="number" placeholder="0"
                  class="w-full p-3 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-emerald-500">
              </div>
              <div class="mb-4">
                <label class="block text-xs text-slate-400 uppercase mb-1">Alerta Stock Minimo</label>
                <input [(ngModel)]="prodForm.stockMinimo" name="stockMinimo" type="number" placeholder="0"
                  class="w-full p-3 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-emerald-500">
              </div>
              <button type="submit" class="w-full p-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition-colors">
                {{ modoEdicion ? 'Actualizar' : 'Guardar Producto' }}
              </button>
              <button *ngIf="modoEdicion" type="button" (click)="resetForm()"
                class="w-full p-3 mt-2 bg-slate-600 hover:bg-slate-500 text-white rounded-lg transition-colors">
                Cancelar Edicion
              </button>
            </form>
          </div>

          <div class="lg:col-span-2 bg-slate-800 rounded-xl border border-slate-700 overflow-hidden flex flex-col">
            <div class="p-4 border-b border-slate-700">
              <input [(ngModel)]="busqueda" (input)="filtrar()" type="text" placeholder="Buscar producto por nombre o codigo..."
                class="w-full p-3 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-emerald-500">
            </div>
            <div class="overflow-y-auto flex-1">
              <table class="w-full">
                <thead>
                  <tr class="bg-slate-900 text-slate-400 text-xs uppercase">
                    <th class="p-4 text-left">Codigo</th>
                    <th class="p-4 text-left">Producto</th>
                    <th class="p-4 text-left">Precio</th>
                    <th class="p-4 text-left">Stock</th>
                    <th class="p-4 text-left">Estado</th>
                    <th class="p-4 text-left">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let p of productosFiltrados" class="border-t border-slate-700 hover:bg-slate-700/50"
                      [ngClass]="{'bg-red-900/30': p.stock <= p.stockMinimo}">
                    <td class="p-4 font-mono text-slate-400 font-bold">{{ p.id }}</td>
                    <td class="p-4 font-semibold">{{ p.nombre }}</td>
                    <td class="p-4">\${{ p.precio }}</td>
                    <td class="p-4">{{ p.stock }}</td>
                    <td class="p-4">
                      <span *ngIf="p.stock <= p.stockMinimo" class="px-3 py-1 rounded-full text-xs font-bold bg-red-500/20 text-red-400">STOCK BAJO</span>
                      <span *ngIf="p.stock > p.stockMinimo" class="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400">OK</span>
                    </td>
                    <td class="p-4">
                      <div class="flex gap-2">
                        <button (click)="editarProducto(p)" title="Editar"
                          class="p-2 bg-blue-500/20 text-blue-400 rounded hover:bg-blue-500/30 transition-colors">&#9998;</button>
                        <button (click)="borrarProducto(p.id)" title="Borrar"
                          class="p-2 bg-red-500/20 text-red-400 rounded hover:bg-red-500/30 transition-colors">&#128465;</button>
                      </div>
                    </td>
                  </tr>
                  <tr *ngIf="productosFiltrados.length === 0">
                    <td colspan="6" class="p-8 text-center text-slate-500">Ningun producto encontrado</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class InventarioComponent implements OnInit {
  productos: Producto[] = [];
  productosFiltrados: Producto[] = [];
  busqueda = '';
  modoEdicion = false;
  prodForm: Producto = { id: '', nombre: '', precio: 0, stock: 0, stockMinimo: 0 };

  constructor(private gymService: GymService) {}

  ngOnInit() {
    this.gymService.productos$.subscribe((p: Producto[]) => {
      this.productos = p;
      this.filtrar();
    });
  }

  filtrar() {
    const texto = this.busqueda.toLowerCase();
    this.productosFiltrados = this.productos.filter(p =>
      p.nombre.toLowerCase().includes(texto) || p.id.toLowerCase().includes(texto)
    );
  }

  guardarProducto() {
    if (this.modoEdicion) {
      this.gymService.actualizarProducto(this.prodForm);
    } else {
      this.gymService.agregarProducto(this.prodForm);
    }
    this.resetForm();
  }

  editarProducto(p: Producto) {
    this.prodForm = { ...p };
    this.modoEdicion = true;
  }

  borrarProducto(id: string) {
    if (confirm('Eliminar producto?')) {
      this.gymService.borrarProducto(id);
    }
  }

  resetForm() {
    this.prodForm = { id: '', nombre: '', precio: 0, stock: 0, stockMinimo: 0 };
    this.modoEdicion = false;
  }
}
