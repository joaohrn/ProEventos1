import { Component } from '@angular/core';
import { AccountService } from './services/Account.service';
import { User } from './model/Identity/User';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
})
export class AppComponent {
	constructor(private accountService: AccountService) {}

	ngOnInit(): void {
		this.setCurrentUser();
	}

	setCurrentUser() {
		let user: User;

		if (localStorage.getItem('user')) {
			user = JSON.parse(localStorage.getItem('user') ?? '{}');
		} else {
			user = null;
		}
		if (user) this.accountService.setCurrentUser(user);
	}
}
