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
import { environment } from 'src/environments/environment';

@Component({
	selector: 'app-perfil',
	templateUrl: './perfil.component.html',
	styleUrls: ['./perfil.component.scss'],
})
export class PerfilComponent implements OnInit {
	usuario = {} as UserUpdate;
	file: File;
	imagemURL = '';

	public get ehPalestrante(): boolean {
		return this.usuario.funcao === 'Palestrante';
	}
	constructor(
		private spinner: NgxSpinnerService,
		private toastr: ToastrService,
		private accountService: AccountService
	) {}

	ngOnInit(): void {}

	public setFormValue(usuario: UserUpdate): void {
		this.usuario = usuario;
		if (usuario.imagemURL) {
			this.imagemURL =
				environment.apiURL + `resources/perfil/${usuario.imagemURL}`;
		} else {
			this.imagemURL = `./assets/img/user.png`;
		}
		console.log(this.usuario);
	}
	public onFileChange(ev: any): void {
		const reader = new FileReader();
		reader.onload = (evento: any) =>
			(this.imagemURL = evento.target.result);
		this.file = ev.target.files;
		reader.readAsDataURL(this.file[0]);

		this.uploadImage();
	}
	private uploadImage(): void {
		this.spinner.show();
		this.accountService
			.postUpload(this.file)
			.subscribe(
				() =>
					this.toastr.success(
						'Imagem alterada com sucesso',
						'Sucesso'
					),
				(error: any) => {
					this.toastr.error('Erro ao alterar imagem', 'Erro');
					console.error(error);
				}
			)
			.add(() => this.spinner.hide());
	}
}
