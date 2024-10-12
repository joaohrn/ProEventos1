import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { PaginatedResult, Pagination } from 'src/app/model/Pagination';
import { Palestrante } from 'src/app/model/Palestrante';
import { PalestranteService } from 'src/app/services/palestrante.service';
import { environment } from 'src/environments/environment';

@Component({
	selector: 'app-palestrante-lista',
	templateUrl: './palestrante-lista.component.html',
	styleUrls: ['./palestrante-lista.component.scss'],
})
export class PalestranteListaComponent implements OnInit {
	palestrantes: Palestrante[] = [];
	termoBuscaChanged: Subject<string> = new Subject<string>();
	pagination = {} as Pagination;
	constructor(
		private palestranteService: PalestranteService,
		private modalService: BsModalService,
		private toastr: ToastrService,
		private spinner: NgxSpinnerService,
		private router: Router
	) {}

	public filtrarPalestrantes(evnt: any): void {
		if (this.termoBuscaChanged.observers.length == 0) {
			this.termoBuscaChanged
				.pipe(debounceTime(1000))
				.subscribe((filtrarPor) => {
					this.spinner.show();
					this.palestranteService
						.getPalestrantes(
							this.pagination.currentPage,
							this.pagination.itemsPerPage,
							filtrarPor
						)
						.subscribe(
							(response: PaginatedResult<Palestrante[]>) => {
								this.palestrantes = response.result;
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

	public carregarPalestrantes(): void {
		this.spinner.show();
		this.palestranteService
			.getPalestrantes(
				this.pagination.currentPage,
				this.pagination.itemsPerPage
			)
			.subscribe(
				(response: PaginatedResult<Palestrante[]>) => {
					this.palestrantes = response.result;
					this.pagination = response.pagination;
				},
				(error: any) => {
					this.spinner.hide();
					this.toastr.error('Erro ao Carregar os Eventos', 'Erro!');
					console.error(error.message);
				}
			)
			.add(() => this.spinner.hide());
	}

	public getImagemUrl(imagemName: string): string {
		return imagemName
			? environment.apiURL + `resources/perfil/${imagemName}`
			: `./assets/img/user.png`;
	}

	ngOnInit() {
		this.pagination = {
			currentPage: 1,
			totalItems: 1,
			itemsPerPage: 3,
		} as Pagination;
		this.carregarPalestrantes();
	}
}
