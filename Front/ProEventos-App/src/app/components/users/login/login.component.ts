import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserLogin } from 'src/app/model/Identity/UserLogin';
import { AccountService } from 'src/app/services/Account.service';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
	model = {} as UserLogin;
	constructor(
		private accountService: AccountService,
		private router: Router,
		private toastr: ToastrService
	) {}

	public login(): void {
		this.accountService.login(this.model).subscribe(
			() => {
				this.router.navigateByUrl('/dashboard');
			},
			(error: any) => {
				if (error['status'] === 401)
					this.toastr.error('usuário ou senha inválido');
				else console.error(error);
			}
		);
	}

	ngOnInit() {}
}
