import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AccountService } from 'src/app/services/Account.service';

@Component({
	selector: 'app-nav',
	templateUrl: './nav.component.html',
	styleUrls: ['./nav.component.scss'],
})
export class NavComponent implements OnInit {
	isCollapsed = true;

	constructor(
		private router: Router,
		public accountService: AccountService
	) {}

	logout() {
		this.accountService.logout();
		this.router.navigateByUrl('/user/login');
	}
	ngOnInit() {}
	showMenu(): boolean {
		return this.router.url !== '/user/login';
	}
}
