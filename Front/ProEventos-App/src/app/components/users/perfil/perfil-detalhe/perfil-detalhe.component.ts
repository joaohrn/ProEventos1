import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
	AbstractControlOptions,
	FormBuilder,
	FormGroup,
	Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ValidatorField } from 'src/app/helpers/validatorField';
import { UserUpdate } from 'src/app/model/Identity/UserUpdate';
import { AccountService } from 'src/app/services/Account.service';
import { PalestranteService } from 'src/app/services/palestrante.service';

@Component({
	selector: 'app-perfil-detalhe',
	templateUrl: './perfil-detalhe.component.html',
	styleUrls: ['./perfil-detalhe.component.scss'],
})
export class PerfilDetalheComponent implements OnInit {
	userUpdate = {} as UserUpdate;
	form!: FormGroup;

	@Output() changeFormValue = new EventEmitter();

	constructor(
		private fb: FormBuilder,
		public accountService: AccountService,
		private router: Router,
		private toastr: ToastrService,
		private spinner: NgxSpinnerService,
		private palestranteService: PalestranteService
	) {}

	ngOnInit() {
		this.validation();
		this.carregarUsuario();
		this.VerificaForm();
	}
	private validation(): void {
		const formOptions: AbstractControlOptions = {
			validators: ValidatorField.MustMatch(
				'password',
				'confirmePassword'
			),
		};

		this.form = this.fb.group(
			{
				userName: [''],
				titulo: ['NaoInformado', Validators.required],
				primeiroNome: ['', Validators.required],
				ultimoNome: ['', Validators.required],
				email: ['', [Validators.required, Validators.email]],
				phoneNumber: ['', [Validators.required]],
				imagemURL: [''],
				descricao: ['', Validators.required],
				funcao: ['NaoInformado', Validators.required],
				password: [
					'',
					[Validators.minLength(6), Validators.nullValidator],
				],
				confirmePassword: ['', Validators.nullValidator],
			},
			formOptions
		);
	}
	private carregarUsuario() {
		this.spinner.show();
		this.accountService
			.getUser()
			.subscribe(
				(userRetorno: UserUpdate) => {
					this.userUpdate = userRetorno;
					this.form.patchValue(this.userUpdate);
					this.toastr.success('Usuario carregado.', 'Sucesso');
				},
				(error) => {
					console.error(error);
					this.toastr.error('Erro ao carregar usuario', 'Erro');
					this.router.navigate(['/dashboard']);
				}
			)
			.add(() => this.spinner.hide());
	}
	public atualizarUsuario() {
		this.userUpdate = { ...this.form.value };
		this.spinner.show();

		if (this.f.funcao.value == 'Palestrante') {
			this.palestranteService.post().subscribe(
				() => this.toastr.success('Função de palestrante adicionada'),
				(error) => {
					this.toastr.error('Erro ao adicionar função palestrante');
					console.error(error);
				}
			);
		}
		this.accountService
			.UpdateUser(this.userUpdate)
			.subscribe(
				() => this.toastr.success('Usuario atualizado', 'Sucesso'),
				(error) => {
					this.toastr.error(
						'Ocorreu um erro ao atualizar o usuario',
						'Erro'
					);
					console.error(error);
				}
			)
			.add(() => this.spinner.hide());
	}
	get f(): any {
		return this.form.controls;
	}

	onSubmit(): void {
		// Vai parar aqui se o form estiver inválido
		this.atualizarUsuario();
	}

	public resetForm(event: any): void {
		event.preventDefault();
		this.form.reset();
	}
	private VerificaForm(): void {
		this.form.valueChanges.subscribe(() => {
			this.changeFormValue.emit({ ...this.form.value });
		});
	}
}
