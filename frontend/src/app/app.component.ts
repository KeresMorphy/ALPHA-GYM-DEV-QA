import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="flex h-screen bg-slate-900 text-white overflow-hidden">
      <aside class="w-64 bg-slate-950 border-r border-slate-800 p-6 flex flex-col justify-between shrink-0">
        <div>
          <div class="flex flex-col items-center gap-3 p-6 border-b border-slate-800">
            <div class="text-xl font-extrabold tracking-wider">ALPHA GYM</div>
          </div>
          <nav class="flex flex-col gap-1 p-4">
            <a routerLink="/dashboard" routerLinkActive="bg-slate-800 text-white border-l-4 border-emerald-500" class="p-3 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-all border-l-4 border-transparent">Dashboard</a>
            <a routerLink="/clientes" routerLinkActive="bg-slate-800 text-white border-l-4 border-emerald-500" class="p-3 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-all border-l-4 border-transparent">Clientes</a>
            <a routerLink="/torniquete" routerLinkActive="bg-slate-800 text-white border-l-4 border-emerald-500" class="p-3 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-all border-l-4 border-transparent">Control</a>
            <a routerLink="/inventario" routerLinkActive="bg-slate-800 text-white border-l-4 border-emerald-500" class="p-3 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-all border-l-4 border-transparent">Inventario</a>
          </nav>
        </div>
      </aside>
      <main class="flex-1 flex flex-col overflow-hidden">
        <router-outlet></router-outlet>
      </main>
    </div>
  `
})
export class AppComponent {}
