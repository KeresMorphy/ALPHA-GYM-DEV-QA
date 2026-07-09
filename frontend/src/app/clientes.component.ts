import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GymService, Socio } from './services/gym.service';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="p-8 overflow-y-auto h-full">
      <div class="max-w-6xl mx-auto">
        <h1 class="text-2xl font-bold mb-6">Gestion de Clientes</h1>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div class="bg-slate-800 p-6 rounded-xl border border-slate-700">
            <h3 class="text-lg font-semibold mb-4">{{ modoEdicion ? 'Actualizar Socio' : 'Registrar Nuevo Socio' }}</h3>
            <form (ngSubmit)="guardarSocio()">
              <div class="mb-4">
                <label class="block text-xs text-slate-400 uppercase mb-1">ID / Codigo de Tarjeta</label>
                <input [(ngModel)]="socioForm.id" name="id" [disabled]="modoEdicion" type="text" placeholder="Ej. 6"
                  class="w-full p-3 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-emerald-500 disabled:opacity-50">
              </div>
              <div class="mb-4">
                <label class="block text-xs text-slate-400 uppercase mb-1">Nombre Completo</label>
                <input [(ngModel)]="socioForm.nombre" name="nombre" type="text" placeholder="Nombre del atleta"
                  class="w-full p-3 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-emerald-500">
              </div>
              <div class="mb-4">
                <label class="block text-xs text-slate-400 uppercase mb-1">Telefono</label>
                <input [(ngModel)]="socioForm.tel" name="tel" type="text" placeholder="469..."
                  class="w-full p-3 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-emerald-500">
              </div>
              <div class="mb-4">
                <label class="block text-xs text-slate-400 uppercase mb-1">Tipo de Membresia</label>
                <select [(ngModel)]="socioForm.tipo" name="tipo"
                  class="w-full p-3 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-emerald-500">
                  <option value="MENSUALIDAD">MENSUALIDAD</option>
                  <option value="Mensualidad estudiante">Mensualidad Estudiante</option>
                  <option value="MENSUALIDAD Amigo">MENSUALIDAD Amigo</option>
                </select>
              </div>
              <div class="mb-4">
                <label class="block text-xs text-slate-400 uppercase mb-1">Fecha de Vencimiento</label>
                <input [(ngModel)]="socioForm.vencimiento" name="vencimiento" type="date" required
                  class="w-full p-3 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-emerald-500">
              </div>
              <button type="submit" class="w-full p-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition-colors">
                {{ modoEdicion ? 'Actualizar' : 'Guardar Socio' }}
              </button>
              <button *ngIf="modoEdicion" type="button" (click)="resetForm()"
                class="w-full p-3 mt-2 bg-slate-600 hover:bg-slate-500 text-white rounded-lg transition-colors">
                Cancelar Edicion
              </button>
            </form>
          </div>

          <div class="lg:col-span-2 bg-slate-800 rounded-xl border border-slate-700 overflow-hidden flex flex-col">
            <div class="p-4 border-b border-slate-700">
              <input [(ngModel)]="busqueda" (input)="filtrar()" type="text" placeholder="Buscar cliente por nombre o ID..."
                class="w-full p-3 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-emerald-500">
            </div>
            <div class="overflow-y-auto flex-1">
              <table class="w-full">
                <thead>
                  <tr class="bg-slate-900 text-slate-400 text-xs uppercase">
                    <th class="p-4 text-left">ID</th>
                    <th class="p-4 text-left">Nombre</th>
                    <th class="p-4 text-left">Telefono</th>
                    <th class="p-4 text-left">Membresia</th>
                    <th class="p-4 text-left">Vencimiento</th>
                    <th class="p-4 text-left">Estado</th>
                    <th class="p-4 text-left">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let s of sociosFiltrados" class="border-t border-slate-700 hover:bg-slate-700/50">
                    <td class="p-4 font-mono text-slate-400 font-bold">{{ s.id }}</td>
                    <td class="p-4 font-semibold">{{ s.nombre }}</td>
                    <td class="p-4">{{ s.tel }}</td>
                    <td class="p-4">{{ s.tipo }}</td>
                    <td class="p-4 font-mono">{{ s.vencimiento }}</td>
                    <td class="p-4">
                      <span *ngIf="s.estado === 'VENCIDO'" class="px-3 py-1 rounded-full text-xs font-bold bg-red-500/20 text-red-400">VENCIDO</span>
                      <span *ngIf="s.estado === 'ACTIVO'" class="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400">ACTIVO</span>
                      <span *ngIf="s.estado === 'PROX_VENCER'" class="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-400">PROXIMO</span>
                    </td>
                    <td class="p-4">
                      <div class="flex gap-2">
                        <button (click)="editarSocio(s)" title="Editar"
                          class="p-2 bg-blue-500/20 text-blue-400 rounded hover:bg-blue-500/30 transition-colors">&#9998;</button>
                        <button (click)="borrarSocio(s.id)" title="Borrar"
                          class="p-2 bg-red-500/20 text-red-400 rounded hover:bg-red-500/30 transition-colors">&#128465;</button>
                      </div>
                    </td>
                  </tr>
                  <tr *ngIf="sociosFiltrados.length === 0">
                    <td colspan="7" class="p-8 text-center text-slate-500">Ningun socio encontrado</td>
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
export class ClientesComponent implements OnInit {
  socios: Socio[] = [];
  sociosFiltrados: Socio[] = [];
  busqueda = '';
  modoEdicion = false;
  socioForm: Socio = { id: '', nombre: '', tel: '', tipo: 'MENSUALIDAD', vencimiento: this.getDefaultVencimiento(), estado: 'ACTIVO' };

  constructor(private gymService: GymService) {}

  getDefaultVencimiento(): string {
    const d = new Date();
    d.setMonth(d.getMonth() + 1);
    return d.toISOString().split('T')[0];
  }

  ngOnInit() {
    this.gymService.socios$.subscribe((s: Socio[]) => {
      this.socios = s;
      this.filtrar();
    });
  }

  filtrar() {
    const texto = this.busqueda.toLowerCase();
    this.sociosFiltrados = this.socios.filter(s =>
      s.nombre.toLowerCase().includes(texto) || s.id.toString().includes(texto)
    );
  }

  guardarSocio() {
    if (this.modoEdicion) {
      this.gymService.actualizarSocio(this.socioForm).subscribe(() => this.resetForm());
    } else {
      this.gymService.agregarSocio(this.socioForm).subscribe(() => this.resetForm());
    }
  }

  editarSocio(s: Socio) {
    this.socioForm = { ...s };
    this.modoEdicion = true;
  }

  borrarSocio(id: string) {
    if (confirm('Eliminar socio?')) {
      this.gymService.borrarSocio(id).subscribe();
    }
  }

  resetForm() {
    this.socioForm = { id: '', nombre: '', tel: '', tipo: 'MENSUALIDAD', vencimiento: this.getDefaultVencimiento(), estado: 'ACTIVO' };
    this.modoEdicion = false;
  }
}
