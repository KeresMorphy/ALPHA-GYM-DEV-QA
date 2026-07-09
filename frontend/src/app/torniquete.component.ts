import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GymService, Socio } from './services/gym.service';

@Component({
  selector: 'app-torniquete',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="p-8 overflow-y-auto h-full">
      <div class="max-w-6xl mx-auto">
        <h1 class="text-2xl font-bold mb-6">Control de Acceso</h1>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div class="bg-slate-800 p-6 rounded-xl border border-slate-700">
            <form (ngSubmit)="procesarEscaneo()">
              <div class="mb-4">
                <label class="block text-xs text-slate-400 uppercase mb-1">Escanear ID o UID de Tarjeta</label>
                <input #scanInput [(ngModel)]="inputScan" name="scan" type="text" placeholder="Ej. 1 o 4" autocomplete="off"
                  class="w-full p-3 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-emerald-500">
              </div>
              <button type="submit" class="w-full p-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition-colors">
                Simular Escaneo
              </button>
            </form>

            <div class="mt-6 pt-4 border-t border-slate-700">
              <label class="block text-xs text-slate-400 uppercase mb-2">Pruebas Rapidas</label>
              <div class="flex flex-wrap gap-2">
                <button *ngFor="let s of sociosRapidos" (click)="probarSocio(s.id)"
                  class="px-3 py-1.5 bg-slate-900 border border-slate-600 text-white text-xs rounded hover:bg-slate-700 transition-colors">
                  {{ s.nombre.split(' ')[0] }}
                  <span *ngIf="s.estado === 'VENCIDO'" class="text-red-400 ml-1">(Vencido)</span>
                  <span *ngIf="s.estado !== 'VENCIDO'" class="text-emerald-400 ml-1">(ID {{ s.id }})</span>
                </button>
                <button (click)="probarSocio('99')"
                  class="px-3 py-1.5 bg-slate-900 border border-slate-600 text-white text-xs rounded hover:bg-slate-700 transition-colors">
                  No Existe
                </button>
              </div>
            </div>
          </div>

          <div class="lg:col-span-2 rounded-xl border border-slate-700 flex flex-col justify-center items-center min-h-[400px] p-10 text-center transition-all duration-300"
               [ngClass]="{
                 'bg-slate-800': screenStatus === 'idle',
                 'bg-emerald-900': screenStatus === 'success',
                 'bg-red-900': screenStatus === 'error'
               }">

            <div *ngIf="screenStatus === 'idle'" class="text-slate-400 text-lg">
              Esperando lectura de tarjeta...
            </div>

            <div *ngIf="screenStatus === 'success'" class="text-white">
              <div class="text-4xl font-extrabold mb-4">ACCESO PERMITIDO</div>
              <div class="text-xl mb-2">{{ socioScan?.nombre }}</div>
              <div class="text-sm opacity-80">
                Membresia: {{ socioScan?.tipo }} | Vence: {{ socioScan?.vencimiento }}
              </div>
              <div *ngIf="socioScan?.estado === 'PROX_VENCER'" class="text-amber-400 font-bold mt-3">
                ¡Recordar pagar pronto!
              </div>
              <div class="text-lg font-bold tracking-widest mt-6 opacity-70">TORNIQUETE ABIERTO</div>
            </div>

            <div *ngIf="screenStatus === 'error'" class="text-white">
              <div class="text-4xl font-extrabold mb-4">{{ scanNoExiste ? 'ERROR DE LECTURA' : 'ACCESO DENEGADO' }}</div>
              <div *ngIf="scanNoExiste" class="text-slate-400 text-lg">Codigo o Socio No Registrado</div>
              <div *ngIf="!scanNoExiste">
                <div class="text-xl mb-2">{{ socioScan?.nombre }}</div>
                <div class="text-sm font-bold">
                  MOTIVO: MEMBRESIA VENCIDA ({{ socioScan?.vencimiento }})
                </div>
                <div class="mt-6 underline">POR FAVOR REVISE SU PAGO EN RECEPCION</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class TorniqueteComponent implements OnInit, OnDestroy {
  @ViewChild('scanInput') scanInput!: ElementRef;

  inputScan = '';
  screenStatus: 'idle' | 'success' | 'error' = 'idle';
  socioScan: Socio | null = null;
  scanNoExiste = false;
  sociosRapidos: Socio[] = [];
  timeoutId: any;

  constructor(private gymService: GymService) {}

  ngOnInit() {
    this.gymService.getSocios().subscribe(socios => {
      const rapidos = socios.slice(-3);
      socios.slice(0, 2).forEach(s => {
        if (!rapidos.find(r => r.id === s.id)) rapidos.unshift(s);
      });
      this.sociosRapidos = rapidos;
    });
  }

  ngOnDestroy() {
    if (this.timeoutId) clearTimeout(this.timeoutId);
  }

  procesarEscaneo() {
    const id = this.inputScan.trim();
    if (!id) return;

    if (this.timeoutId) clearTimeout(this.timeoutId);

    this.gymService.scanSocio(id).subscribe((res: any) => {
      if (res.acceso === 'PERMITIDO') {
        this.screenStatus = 'success';
        this.socioScan = res.socio;
        this.scanNoExiste = false;
      } else {
        this.screenStatus = 'error';
        if (res.socio) {
          this.socioScan = res.socio;
          this.scanNoExiste = false;
        } else {
          this.socioScan = null;
          this.scanNoExiste = true;
        }
      }

      this.inputScan = '';

      this.timeoutId = setTimeout(() => {
        this.screenStatus = 'idle';
      }, 4000);
    });
  }

  probarSocio(id: string) {
    this.inputScan = id;
    this.procesarEscaneo();
  }
}
