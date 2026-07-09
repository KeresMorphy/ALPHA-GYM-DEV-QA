import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { ClientesComponent } from './clientes.component';
import { TorniqueteComponent } from './torniquete.component';
import { InventarioComponent } from './inventario.component';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'clientes', component: ClientesComponent },
  { path: 'torniquete', component: TorniqueteComponent },
  { path: 'inventario', component: InventarioComponent },
  { path: '**', redirectTo: 'dashboard' }
];
