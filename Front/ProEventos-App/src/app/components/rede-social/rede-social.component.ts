import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import {
	AbstractControl,
	FormArray,
	FormBuilder,
	FormControl,
	FormGroup,
	Validators,
} from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { RedeSocial } from 'src/app/model/RedeSocial';
import { RedeSocialService } from 'src/app/services/redeSocial.service';

@Component({
	selector: 'app-rede-social',
	templateUrl: './rede-social.component.html',
	styleUrls: ['./rede-social.component.scss'],
})
export class RedeSocialComponent implements OnInit {
	public formRS!: FormGroup;
	@Input() eventoId = 0;
	public redeSocialAtual = { id: 0, nome: '', indice: 0 };
	modalRef: BsModalRef;

	constructor(
		private fb: FormBuilder,
		private spinner: NgxSpinnerService,
		private toastr: ToastrService,
		private redeSocialService: RedeSocialService,
		private modalService: BsModalService
	) {}

	public retornaTitulo(nome: string) {
		return nome === null || nome === '' ? 'Rede Social' : nome;
	}

	private Validation() {
		this.formRS = this.fb.group({
			redesSociais: this.fb.array([]),
		});
	}
	ngOnInit() {
		this.Validation();
		this.carregarRedesSociais(this.eventoId);
	}

	public get redesSociais() {
		return this.formRS.get('redesSociais') as FormArray;
	}
	public cssValidator(campoForm: FormControl | AbstractControl | null): any {
		return { 'is-invalid': campoForm?.errors && campoForm?.touched };
	}
	public adicionarRedeSocial(): void {
		this.redesSociais.push(this.criarRedeSocial({ id: 0 } as RedeSocial));
	}

	public criarRedeSocial(redeSocial: RedeSocial): FormGroup {
		return this.fb.group({
			id: [redeSocial.id],
			nome: [redeSocial.nome, Validators.required],
			url: [redeSocial.url, Validators.required],
		});
	}
	public carregarRedesSociais(id = 0): void {
		let origem = 'palestrante';
		if (id !== 0) origem = 'evento';
		this.spinner.show();
		if (this.redesSociais.length === 0) {
			this.redeSocialService
				.getRedesSociais(origem, id)
				.subscribe(
					(redeSocialRetorno: RedeSocial[]) => {
						redeSocialRetorno.forEach((redeSocial) => {
							this.redesSociais.push(
								this.criarRedeSocial(redeSocial)
							);
						});
					},
					(error: any) => {
						this.toastr.error(
							'Erro ao tentar carregar redeSocials',
							'Erro'
						);
						console.error(error);
					}
				)
				.add(() => this.spinner.hide());
		}
	}
	public salvarRedesSociais(): void {
		let origem = 'palestrante';
		if (this.eventoId !== 0) {
			origem = 'evento';
		}
		if (this.formRS.controls.redesSociais.valid) {
			this.spinner.show();
			this.redeSocialService
				.saveRedeSocial(
					origem,
					this.eventoId,
					this.formRS.value.redesSociais
				)
				.subscribe(
					() => {
						this.toastr.success(
							'redeSocials salvos com sucesso!',
							'Sucesso!'
						);
					},
					(error: any) => {
						this.toastr.error(
							'Erro ao salvar redeSocial.',
							'Erro!'
						);
					}
				)
				.add(() => this.spinner.hide());
		}
	}
	public removerRedeSocial(template: TemplateRef<any>, indice: number) {
		this.redeSocialAtual.id = this.redesSociais.get(indice + '.id').value;
		this.redeSocialAtual.nome = this.redesSociais.get(
			indice + '.nome'
		).value;
		this.redeSocialAtual.indice = indice;
		this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
	}
	public confirmDeleteRedeSocial(): void {
		let origem = 'palestrante';
		if (this.eventoId !== 0) {
			origem = 'evento';
		}
		this.modalRef.hide();
		this.spinner.show();
		this.redeSocialService
			.deleteRedeSocial(origem, this.eventoId, this.redeSocialAtual.id)
			.subscribe(
				() => {
					this.toastr.success(
						'redeSocial deletado com sucesso!',
						'Sucesso!'
					);
					this.redesSociais.removeAt(this.redeSocialAtual.indice);
				},
				(error: any) => {
					this.toastr.error(
						`Erro ao deletar redeSocial ${this.redeSocialAtual.nome}`,
						'Erro!'
					);
					console.error(error);
				}
			)
			.add(() => this.spinner.hide());
	}
	public declineDeleteRedeSocial(): void {
		this.modalRef.hide();
	}
}
