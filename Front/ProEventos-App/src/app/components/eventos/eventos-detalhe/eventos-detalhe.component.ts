import { Component, OnInit } from '@angular/core';
import {
	FormBuilder,
	FormControl,
	FormGroup,
	Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { Evento } from 'src/app/model/Evento';
import { EventoService } from 'src/app/services/evento.service';

@Component({
	selector: 'app-evento-detalhe',
	templateUrl: './eventos-detalhe.component.html',
	styleUrls: ['./eventos-detalhe.component.scss'],
})
export class EventosDetalheComponent implements OnInit {
	form!: FormGroup;
	evento = {} as Evento;
	estadoSalvar = 'post' as keyof EventoService;

	get f(): any {
		return this.form.controls;
	}

	get bsConfig(): any {
		return {
			dateInputFormat: 'DD/MM/YYYY hh:mm',
			returnFocusToInput: true,
			containerClass: 'theme-default',
			showWeekNumbers: false,
		};
	}
	constructor(
		private fb: FormBuilder,
		private locale: BsLocaleService,
		private router: ActivatedRoute,
		private eventoService: EventoService,
		private spinner: NgxSpinnerService,
		private toastr: ToastrService
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
			imagemURL: ['', Validators.required],
		});
	}

	public resetForm(): void {
		this.form.reset();
	}
	public cssValidator(campoForm: FormControl): any {
		return { 'is-invalid': campoForm.errors && campoForm.touched };
	}
	public carregarEvento(): void {
		const eventoIdParam = this.router.snapshot.paramMap.get('id');
		if (eventoIdParam !== null) {
			this.spinner.show();
			this.estadoSalvar = 'put';
			this.eventoService.getEventoById(+eventoIdParam).subscribe({
				next: (evento: Evento) => {
					this.evento = { ...evento };
					this.form.patchValue(this.evento);
				},
				error: (error: any) => {
					this.spinner.hide();
					this.toastr.error('Erro ao tentar carregar evento');
					console.error(error);
				},
				complete: () => this.spinner.hide(),
			});
		}
	}
	public salvarAlteracao(): void {
		this.spinner.show();
		if (this.form.valid) {
			this.evento =
				this.estadoSalvar === 'post'
					? { ...this.form.value }
					: { id: this.evento.id, ...this.form.value };

			this.eventoService[this.estadoSalvar](this.evento)
				.subscribe(
					() =>
						this.toastr.success(
							'Evento salvo com Sucesso!',
							'Sucesso'
						),
					(error: any) => {
						console.error(error);
						this.toastr.error('Error ao salvar evento', 'Erro');
					}
				)
				.add(() => this.spinner.hide());
		}
	}
}
