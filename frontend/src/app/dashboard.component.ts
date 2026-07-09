import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GymService, Socio } from './services/gym.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-8 overflow-y-auto h-full">
      <div class="max-w-6xl mx-auto">
        <h1 class="text-2xl font-bold mb-6">Dashboard</h1>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div class="bg-slate-800 p-6 rounded-xl border border-slate-700">
            <div class="text-slate-400 text-xs uppercase tracking-wide mb-2">Socios Activos</div>
            <div class="text-4xl font-bold text-emerald-400">{{ activos }}</div>
          </div>
          <div class="bg-slate-800 p-6 rounded-xl border border-slate-700">
            <div class="text-slate-400 text-xs uppercase tracking-wide mb-2">Ya Vencidos</div>
            <div class="text-4xl font-bold text-red-400">{{ vencidos }}</div>
          </div>
          <div class="bg-slate-800 p-6 rounded-xl border border-slate-700">
            <div class="text-slate-400 text-xs uppercase tracking-wide mb-2">Proximos a Vencer</div>
            <div class="text-4xl font-bold text-amber-400">{{ proximos }}</div>
          </div>
        </div>

        <div class="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
          <div class="p-4 border-b border-slate-700">
            <h2 class="text-lg font-semibold">Alertas de Membresias</h2>
          </div>
          <table class="w-full">
            <thead>
              <tr class="bg-slate-900 text-slate-400 text-xs uppercase">
                <th class="p-4 text-left">ID</th>
                <th class="p-4 text-left">Nombre</th>
                <th class="p-4 text-left">Membresia</th>
                <th class="p-4 text-left">Vencimiento</th>
                <th class="p-4 text-left">Estado</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let s of alertas" class="border-t border-slate-700 hover:bg-slate-700/50">
                <td class="p-4 font-mono text-slate-400 font-bold">{{ s.id }}</td>
                <td class="p-4 font-semibold">{{ s.nombre }}</td>
                <td class="p-4">{{ s.tipo }}</td>
                <td class="p-4 font-mono">{{ s.vencimiento }}</td>
                <td class="p-4">
                  <span *ngIf="s.estado === 'VENCIDO'" class="px-3 py-1 rounded-full text-xs font-bold bg-red-500/20 text-red-400">VENCIDO</span>
                  <span *ngIf="s.estado === 'PROX_VENCER'" class="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-400">PROXIMO A VENCER</span>
                </td>
              </tr>
              <tr *ngIf="alertas.length === 0">
                <td colspan="5" class="p-8 text-center text-slate-500">No hay alertas en este momento</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  activos = 0;
  vencidos = 0;
  proximos = 0;
  alertas: Socio[] = [];

  constructor(private gymService: GymService) {}

  ngOnInit() {
    this.gymService.socios$.subscribe((socios: Socio[]) => {
      this.activos = socios.filter((s: Socio) => s.estado === 'ACTIVO').length;
      this.vencidos = socios.filter((s: Socio) => s.estado === 'VENCIDO').length;
      this.proximos = socios.filter((s: Socio) => s.estado === 'PROX_VENCER').length;
      this.alertas = socios.filter((s: Socio) => s.estado !== 'ACTIVO');
    });
  }
}
