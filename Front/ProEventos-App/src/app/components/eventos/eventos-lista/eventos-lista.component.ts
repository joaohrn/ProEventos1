import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Evento } from '../../../model/Evento';
import { EventoService } from 'src/app/services/evento.service';
import { environment } from 'src/environments/environment';
import { PaginatedResult, Pagination } from 'src/app/model/Pagination';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
	selector: 'app-eventos-lista',
	templateUrl: './eventos-lista.component.html',
	styleUrls: ['./eventos-lista.component.scss'],
})
export class EventosListaComponent implements OnInit {
	modalRef!: BsModalRef;
	public eventos: Evento[] = [];
	public eventoId = 0;
	public pagination = {} as Pagination;

	public larguraImagem = 150;
	public margemImagem = 2;
	public exibirImagem = true;

	termoBuscaChanged: Subject<string> = new Subject<string>();

	public filtrarEventos(evnt: any): void {
		if (this.termoBuscaChanged.observers.length == 0) {
			this.termoBuscaChanged
				.pipe(debounceTime(1000))
				.subscribe((filtrarPor) => {
					this.spinner.show();
					this.eventoService
						.getEventos(
							this.pagination.currentPage,
							this.pagination.itemsPerPage,
							filtrarPor
						)
						.subscribe(
							(response: PaginatedResult<Evento[]>) => {
								this.eventos = response.result;
								this.pagination = response.pagination;
							},
							(error: any) => {
								this.spinner.hide();
								this.toastr.error(
									'Erro ao Carregar os Eventos',
									'Erro!'
								);
							}
						)
						.add(() => this.spinner.hide());
				});
		}
		this.termoBuscaChanged.next(evnt.value);
	}

	constructor(
		private eventoService: EventoService,
		private modalService: BsModalService,
		private toastr: ToastrService,
		private spinner: NgxSpinnerService,
		private router: Router
	) {}

	public ngOnInit(): void {
		this.pagination = {
			currentPage: 1,
			itemsPerPage: 3,
			totalItems: 1,
		} as Pagination;
		this.carregarEventos();
	}

	public alterarImagem(): void {
		this.exibirImagem = !this.exibirImagem;
	}

	public carregarEventos(): void {
		this.spinner.show();
		this.eventoService
			.getEventos(
				this.pagination.currentPage,
				this.pagination.itemsPerPage
			)
			.subscribe(
				(response: PaginatedResult<Evento[]>) => {
					this.eventos = response.result;
					this.pagination = response.pagination;
				},
				(error: any) => {
					this.spinner.hide();
					this.toastr.error('Erro ao Carregar os Eventos', 'Erro!');
				}
			)
			.add(() => this.spinner.hide());
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
		return url !== '' && url !== null
			? environment.apiURL + 'resources/images/' + url
			: 'assets/sem_imagem.png';
	}
	pageChanged(event): void {
		this.pagination.currentPage = event.page;
		this.carregarEventos();
	}
}
