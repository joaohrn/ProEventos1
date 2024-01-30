import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EventosComponent } from './components/eventos/eventos.component';
import { PalestrantesComponent } from './components/palestrantes/palestrantes.component';
import { ContatosComponent } from './components/contatos/contatos.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { PerfilComponent } from './components/users/perfil/perfil.component';
import { EventosDetalheComponent } from './components/eventos/eventos-detalhe/eventos-detalhe.component';
import { EventosListaComponent } from './components/eventos/eventos-lista/eventos-lista.component';
import { LoginComponent } from './components/users/login/login.component';
import { UserComponent } from './components/users/user.component';
import { RegistrationComponent } from './components/users/registration/registration.component';

const routes: Routes = [
	{
		path: 'user',
		component: UserComponent,
		children: [
			{ path: 'login', component: LoginComponent },
			{ path: 'registration', component: RegistrationComponent },
		],
	},
	{
		path: 'user/perfil',
		component: PerfilComponent,
	},
	{ path: 'eventos', redirectTo: 'eventos/lista' },
	{
		path: 'eventos',
		component: EventosComponent,
		children: [
			{ path: 'detalhe/:id', component: EventosDetalheComponent },
			{ path: 'detalhe', component: EventosDetalheComponent },
			{ path: 'lista', component: EventosListaComponent },
		],
	},
	{ path: 'palestrantes', component: PalestrantesComponent },
	{ path: 'contatos', component: ContatosComponent },
	{ path: 'dashboard', component: DashboardComponent },
	{ path: 'perfil', component: PerfilComponent },
	{ path: '', redirectTo: 'dashboard', pathMatch: 'full' },
	{ path: '**', redirectTo: 'dashboard', pathMatch: 'full' },
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule],
})
export class AppRoutingModule {}
