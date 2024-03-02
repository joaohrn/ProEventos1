import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Evento } from '../../../model/Evento';
import { EventoService } from 'src/app/services/evento.service';
import { environment } from 'src/environments/environment';

@Component({
	selector: 'app-eventos-lista',
	templateUrl: './eventos-lista.component.html',
	styleUrls: ['./eventos-lista.component.scss'],
})
export class EventosListaComponent implements OnInit {
	modalRef!: BsModalRef;
	public eventos: Evento[] = [];
	public eventosFiltrados: Evento[] = [];

	public larguraImagem = 150;
	public margemImagem = 2;
	public exibirImagem = true;
	private filtroListado = '';
	public eventoId = 0;

	public get filtroLista(): string {
		return this.filtroListado;
	}

	public set filtroLista(value: string) {
		this.filtroListado = value;
		this.eventosFiltrados = this.filtroLista
			? this.filtrarEventos(this.filtroLista)
			: this.eventos;
	}

	public filtrarEventos(filtrarPor: string): Evento[] {
		filtrarPor = filtrarPor.toLocaleLowerCase();
		return this.eventos.filter(
			(evento) =>
				evento.tema.toLocaleLowerCase().indexOf(filtrarPor) !== -1 ||
				evento.local.toLocaleLowerCase().indexOf(filtrarPor) !== -1
		);
	}

	constructor(
		private eventoService: EventoService,
		private modalService: BsModalService,
		private toastr: ToastrService,
		private spinner: NgxSpinnerService,
		private router: Router
	) {}

	public ngOnInit(): void {
		this.spinner.show();
		this.carregarEventos();
	}

	public alterarImagem(): void {
		this.exibirImagem = !this.exibirImagem;
	}

	public carregarEventos(): void {
		this.eventoService.getEventos().subscribe({
			next: (eventos: Evento[]) => {
				this.eventos = eventos;
				this.eventosFiltrados = this.eventos;
			},
			error: (error: any) => {
				this.spinner.hide();
				this.toastr.error('Erro ao Carregar os Eventos', 'Erro!');
			},
			complete: () => this.spinner.hide(),
		});
	}

	openModal(event: any, template: TemplateRef<any>, eventoId: number): void {
		event.stopPropagation();
		this.eventoId = eventoId;
		this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
	}

	confirm(): void {
		this.modalRef.hide();
		this.spinner.show();
		this.eventoService
			.deleteEvento(this.eventoId)
			.subscribe(
				(result: any) => {
					console.log(result);
					this.toastr.success(
						'O Evento foi deletado com Sucesso.',
						'Deletado!'
					);
					this.carregarEventos();
				},
				(erro: any) => {
					this.toastr.error(
						`Erro ao tentar deletar evento ${this.eventoId}`,
						'Erro'
					);
				}
			)
			.add(() => this.spinner.hide());
	}

	decline(): void {
		this.modalRef.hide();
	}

	detalheEvento(id: number): void {
		this.router.navigate([`eventos/detalhe/${id}`]);
	}
	mostrarImagem(url: string): string {
		return url !== ''
			? environment.apiURL + 'resources/images/' + url
			: 'assets/sem_imagem.png';
	}
}
