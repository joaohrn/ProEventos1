import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, map, tap } from 'rxjs/operators';
import { Palestrante } from 'src/app/model/Palestrante';
import { PalestranteService } from 'src/app/services/palestrante.service';

@Component({
	selector: 'app-palestrante-detalhe',
	templateUrl: './palestrante-detalhe.component.html',
	styleUrls: ['./palestrante-detalhe.component.scss'],
})
export class PalestranteDetalheComponent implements OnInit {
	form!: FormGroup;
	situacaoDoForm = '';
	corDaDescricao = '';

	constructor(
		private fb: FormBuilder,
		private spinner: NgxSpinnerService,
		private toastr: ToastrService,
		private palestranteService: PalestranteService
	) {}
	public get f(): any {
		return this.form.controls;
	}

	private Validation(): void {
		this.form = this.fb.group({
			miniCurriculo: [''],
		});
	}
	private verificarCurriculo() {
		this.form.valueChanges
			.pipe(
				map(() => {
					this.situacaoDoForm =
						'Minicurriculo está sendo atualizado.';
					this.corDaDescricao = 'text-warning';
				}),
				debounceTime(1000),
				tap(() => this.spinner.show())
			)
			.subscribe(() => {
				this.palestranteService
					.put({ ...this.form.value })
					.subscribe(
						() => {
							this.situacaoDoForm = 'Minicurriculo atualizado.';
							this.corDaDescricao = 'text-success';
							setTimeout(() => {
								this.situacaoDoForm =
									'Minicurriculo carregado.';
								this.corDaDescricao = 'text-muted';
							}, 2000);
						},
						() => {
							this.toastr.error(
								'Erro ao atualizar minicurriculo.',
								'Erro'
							);
						}
					)
					.add(() => this.spinner.hide());
			});
	}

	private carregarPalestrante() {
		this.palestranteService.getPalestrante().subscribe(
			(palestrante: Palestrante) => {
				this.form.patchValue(palestrante);
			},
			(error: any) => {
				this.toastr.error('Erro ao carregar palestrante', 'Erro');
				console.error(error);
			}
		);
	}

	ngOnInit() {
		this.Validation();
		this.carregarPalestrante();
		this.verificarCurriculo();
	}
}
