import { Injectable } from '@angular/core';
import {
	HttpRequest,
	HttpHandler,
	HttpEvent,
	HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AccountService } from '../services/Account.service';
import { User } from '../model/Identity/User';
import { take } from 'rxjs/operators';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
	constructor(private accountService: AccountService) {}

	intercept(
		request: HttpRequest<unknown>,
		next: HttpHandler
	): Observable<HttpEvent<unknown>> {
		let currentUser: User;

		this.accountService.currentUser$.pipe(take(1)).subscribe((user) => {
			currentUser = user;

			if (currentUser != null) {
				request = request.clone({
					setHeaders: {
						Authorization: `Bearer ${currentUser.token}`,
					},
				});
			}
		});

		return next.handle(request);
	}
}
