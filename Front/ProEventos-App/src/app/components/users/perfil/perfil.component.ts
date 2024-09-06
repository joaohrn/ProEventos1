import { ValidatorField } from './../../../helpers/validatorField';
import { Component, OnInit } from '@angular/core';
import {
	AbstractControlOptions,
	FormBuilder,
	Validators,
	FormGroup,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService, Spinner } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { UserUpdate } from 'src/app/model/Identity/UserUpdate';
import { AccountService } from 'src/app/services/Account.service';

@Component({
	selector: 'app-perfil',
	templateUrl: './perfil.component.html',
	styleUrls: ['./perfil.component.scss'],
})
export class PerfilComponent implements OnInit {
	userUpdate = {} as UserUpdate;
	form!: FormGroup;

	constructor(
		private fb: FormBuilder,
		public accountService: AccountService,
		private router: Router,
		private toastr: ToastrService,
		private spinner: NgxSpinnerService
	) {}

	ngOnInit(): void {
		this.validation();
		this.carregarUsuario();
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

	// Conveniente para pegar um FormField apenas com a letra F
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
	private carregarUsuario() {
		this.spinner.show();
		this.accountService
			.getUser()
			.subscribe(
				(userRetorno: UserUpdate) => {
					console.log(userRetorno);
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
}
