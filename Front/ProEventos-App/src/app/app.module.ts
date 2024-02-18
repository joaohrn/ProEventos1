import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CollapseModule } from 'ngx-bootstrap/collapse';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { ptBrLocale } from 'ngx-bootstrap/locale';

import { ToastrModule } from 'ngx-toastr';
import { NgxCurrencyModule } from 'ngx-currency';
import { NgxSpinnerModule } from 'ngx-spinner';

import { PalestrantesComponent } from './components/palestrantes/palestrantes.component';
import { NavComponent } from './shared/nav/nav.component';
import { EventosComponent } from './components/eventos/eventos.component';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { EventoService } from './services/evento.service';
import { DateTimeFormatPipe } from './helpers/dateTimeFormat.pipe';
import { TituloComponent } from './shared/titulo/titulo.component';
import { ContatosComponent } from './components/contatos/contatos.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { PerfilComponent } from './components/users/perfil/perfil.component';
import { EventosDetalheComponent } from './components/eventos/eventos-detalhe/eventos-detalhe.component';
import { EventosListaComponent } from './components/eventos/eventos-lista/eventos-lista.component';
import { UserComponent } from './components/users/user.component';
import { LoginComponent } from './components/users/login/login.component';
import { RegistrationComponent } from './components/users/registration/registration.component';
import { LoteService } from './services/lote.service';

defineLocale('pt-br', ptBrLocale);
@NgModule({
	declarations: [
		AppComponent,
		EventosComponent,
		EventosDetalheComponent,
		EventosListaComponent,
		PalestrantesComponent,
		NavComponent,
		DateTimeFormatPipe,
		UserComponent,
		LoginComponent,
		RegistrationComponent,
		TituloComponent,
		ContatosComponent,
		DashboardComponent,
		PerfilComponent,
	],
	imports: [
		CommonModule,
		BrowserModule,
		AppRoutingModule,
		HttpClientModule,
		BrowserAnimationsModule,
		CollapseModule,
		FormsModule,
		ReactiveFormsModule,
		TooltipModule.forRoot(),
		BsDropdownModule.forRoot(),
		ModalModule.forRoot(),
		ToastrModule.forRoot({
			timeOut: 3000,
			positionClass: 'toast-bottom-right',
			preventDuplicates: true,
			progressBar: true,
		}),
		NgxCurrencyModule,
		NgxSpinnerModule,
		BsDatepickerModule.forRoot(),
	],
	providers: [EventoService, LoteService],
	bootstrap: [AppComponent],
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
