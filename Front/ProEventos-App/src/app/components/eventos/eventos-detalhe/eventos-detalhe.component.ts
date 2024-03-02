import { DatePipe } from '@angular/common';
import { Component, NgModule, OnInit, TemplateRef } from '@angular/core';
import {
	AbstractControl,
	FormArray,
	FormBuilder,
	FormControl,
	FormGroup,
	Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Evento } from 'src/app/model/Evento';
import { Lote } from 'src/app/model/Lote';
import { EventoService } from 'src/app/services/evento.service';
import { LoteService } from 'src/app/services/lote.service';
import { environment } from 'src/environments/environment';

@Component({
	selector: 'app-evento-detalhe',
	templateUrl: './eventos-detalhe.component.html',
	styleUrls: ['./eventos-detalhe.component.scss'],
})
export class EventosDetalheComponent implements OnInit {
	loteAtual = { id: 0, nome: '', indice: 0 };
	modalRef: BsModalRef;
	eventoId: number;
	form!: FormGroup;
	evento = {} as Evento;
	estadoSalvar = 'post' as keyof EventoService;
	imagemURL = 'assets/upload_cloud.png';
	file: File;

	get modoEditar(): boolean {
		return this.estadoSalvar === 'put';
	}
	get f(): any {
		return this.form.controls;
	}

	get bsConfig(): any {
		return {
			dateInputFormat: 'DD/MM/YYYY HH:mm',
			returnFocusToInput: true,
			containerClass: 'theme-default',
			showWeekNumbers: false,
			initCurrentTime: false,
			withTimepicker: true,
		};
	}
	get dataEventoValue() {
		return this.f.dataEvento.value;
	}
	get bsConfigLote(): any {
		return {
			dateInputFormat: 'DD/MM/YYYY',
			returnFocusToInput: true,
			containerClass: 'theme-default',
			showWeekNumbers: false,
			adaptivePosition: true,
		};
	}
	get lotes(): FormArray {
		return this.form.get('lotes') as FormArray;
	}
	constructor(
		private fb: FormBuilder,
		private locale: BsLocaleService,
		private activeRoute: ActivatedRoute,
		private modalService: BsModalService,
		private eventoService: EventoService,
		private spinner: NgxSpinnerService,
		private toastr: ToastrService,
		private router: Router,
		private loteService: LoteService
	) {
		this.locale.use('pt-br');
	}

	ngOnInit(): void {
		this.validation();
		this.carregarEvento();
	}

	public validation(): void {
		this.form = this.fb.group({
			tema: [
				'',
				[
					Validators.required,
					Validators.minLength(4),
					Validators.maxLength(50),
				],
			],
			local: ['', Validators.required],
			dataEvento: ['', Validators.required],
			qtdPessoas: ['', [Validators.required, Validators.max(120000)]],
			telefone: ['', Validators.required],
			email: ['', [Validators.required, Validators.email]],
			imagemURL: [''],
			lotes: this.fb.array([]),
		});
	}

	public adicionarLote(): void {
		this.lotes.push(this.criarLote({ id: 0 } as Lote));
	}

	public criarLote(lote: Lote) {
		return this.fb.group({
			id: [lote.id],
			nome: [lote.nome, Validators.required],
			preco: [lote.preco, Validators.required],
			quantidade: [lote.quantidade, Validators.required],
			dataInicio: [lote.dataInicio, Validators.required],
			dataFim: [lote.dataFim, Validators.required],
		});
	}

	public resetForm(): void {
		this.form.reset();
	}
	public cssValidator(campoForm: FormControl | AbstractControl | null): any {
		return { 'is-invalid': campoForm?.errors && campoForm?.touched };
	}
	public carregarEvento(): void {
		this.eventoId = +this.activeRoute.snapshot.paramMap.get('id');
		if (this.eventoId !== null && this.eventoId !== 0) {
			this.spinner.show();
			this.estadoSalvar = 'put';
			this.eventoService
				.getEventoById(+this.eventoId)
				.subscribe(
					(evento: Evento) => {
						this.evento = { ...evento };
						this.form.patchValue(this.evento);
						if (this.evento.imagemURL !== '') {
							this.imagemURL =
								environment.apiURL +
								'resources/images/' +
								this.evento.imagemURL;
						}
						this.carregarLotes();
					},
					(error: any) => {
						this.toastr.error('Erro ao tentar carregar evento');
						console.error(error);
					}
				)
				.add(() => this.spinner.hide());
		}
	}
	public carregarLotes(): void {
		if (this.lotes.length === 0) {
			this.loteService
				.getLotesByEventoId(this.eventoId)
				.subscribe(
					(lotesRetorno: Lote[]) => {
						lotesRetorno.forEach((lote) => {
							this.lotes.push(this.criarLote(lote));
						});
					},
					(error: any) => {
						this.toastr.error(
							'Erro ao tentar carregar lotes',
							'Erro'
						);
						console.error(error);
					}
				)
				.add(() => this.spinner.hide());
		}
	}
	public salvarEvento(): void {
		this.spinner.show();
		if (this.form.valid) {
			this.evento =
				this.estadoSalvar === 'post'
					? { ...this.form.value }
					: { id: this.evento.id, ...this.form.value };

			this.eventoService[this.estadoSalvar](this.evento)
				.subscribe(
					(eventoRetorno: Evento) => {
						this.toastr.success(
							'Evento salvo com Sucesso!',
							'Sucesso'
						);
						this.router.navigate([
							`eventos/detalhe/${eventoRetorno.id}`,
						]);
					},
					(error: any) => {
						console.error(error);
						this.toastr.error('Error ao salvar evento', 'Erro');
					}
				)
				.add(() => this.spinner.hide());
		}
	}
	public salvarLotes(): void {
		if (this.form.controls.lotes.valid) {
			this.spinner.show();
			this.loteService
				.saveLote(this.eventoId, this.form.value.lotes)
				.subscribe(
					() => {
						this.toastr.success(
							'Lotes salvos com sucesso!',
							'Sucesso!'
						);
					},
					(error: any) => {
						this.toastr.error('Erro ao salvar lote.', 'Erro!');
					}
				)
				.add(() => this.spinner.hide());
		}
	}
	public removerLote(template: TemplateRef<any>, indice: number) {
		this.loteAtual.id = this.lotes.get(indice + '.id').value;
		this.loteAtual.nome = this.lotes.get(indice + '.nome').value;
		this.loteAtual.indice = indice;
		this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
	}
	public confirmDeleteLote(): void {
		this.modalRef.hide();
		this.spinner.show();
		this.loteService
			.deleteLote(this.eventoId, this.loteAtual.id)
			.subscribe(
				() => {
					this.toastr.success(
						'Lote deletado com sucesso!',
						'Sucesso!'
					);
					this.lotes.removeAt(this.loteAtual.indice);
				},
				(error: any) => {
					this.toastr.error(
						`Erro ao deletar lote ${this.loteAtual.nome}`,
						'Erro!'
					);
					console.error(error);
				}
			)
			.add(() => this.spinner.hide());
	}
	public declineDeleteLote(): void {
		this.modalRef.hide();
	}
	public onFileChange(ev: any): void {
		const reader = new FileReader();
		reader.onload = (evento: any) =>
			(this.imagemURL = evento.target.result);
		this.file = ev.target.files;
		reader.readAsDataURL(this.file[0]);

		this.uploadImage();
	}
	public uploadImage(): void {
		this.spinner.show();
		this.eventoService
			.postUpload(this.eventoId, this.file)
			.subscribe(
				() => {
					this.carregarEvento();
					this.toastr.success(
						'Arquivo enviado com sucesso',
						'Sucesso!'
					);
					console.log(this.f.imagemURL.value);
				},
				(error: any) => {
					console.log(error);
					this.toastr.error('Erro ao enviar arquivo', 'Erro!');
				}
			)
			.add(() => this.spinner.hide());
	}
}
