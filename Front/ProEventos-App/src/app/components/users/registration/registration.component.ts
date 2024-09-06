import { ValidatorField } from './../../../helpers/validatorField';
import {
	AbstractControlOptions,
	FormBuilder,
	FormGroup,
	Validators,
} from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/model/Identity/User';
import { AccountService } from 'src/app/services/Account.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
	selector: 'app-registration',
	templateUrl: './registration.component.html',
	styleUrls: ['./registration.component.scss'],
})
export class RegistrationComponent implements OnInit {
	user = {} as User;
	form!: FormGroup;

	constructor(
		private fb: FormBuilder,
		private accountService: AccountService,
		private router: Router,
		private toastr: ToastrService
	) {}

	get f(): any {
		return this.form.controls;
	}

	ngOnInit(): void {
		this.validation();
	}

	private validation(): void {
		const formOptions: AbstractControlOptions = {
			validators: ValidatorField.MustMatch(
				'Password',
				'confirmePassword'
			),
		};

		this.form = this.fb.group(
			{
				primeiroNome: ['', Validators.required],
				ultimoNome: ['', Validators.required],
				email: ['', [Validators.required, Validators.email]],
				userName: ['', Validators.required],
				password: ['', [Validators.required, Validators.minLength(6)]],
				confirmePassword: ['', Validators.required],
			},
			formOptions
		);
	}
	register(): void {
		this.user = { ...this.form.value };
		this.accountService.register(this.user).subscribe(
			() => this.router.navigateByUrl('/dashboard'),
			(error) => this.toastr.error(error.error)
		);
	}
}
