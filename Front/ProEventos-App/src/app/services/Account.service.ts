import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../model/Identity/User';
import { map, take } from 'rxjs/operators';
import { UserUpdate } from '../model/Identity/UserUpdate';

@Injectable({
	providedIn: 'root',
})
export class AccountService {
	private currentUserSource = new ReplaySubject<User>(1);
	public currentUser$ = this.currentUserSource.asObservable();
	constructor(private http: HttpClient) {}
	baseUrl = environment.apiURL + 'api/account/';

	public login(model: any): Observable<void> {
		return this.http.post<User>(this.baseUrl + 'login', model).pipe(
			take(1),
			map((response: User) => {
				const user = response;
				if (user) {
					this.setCurrentUser(user);
				}
			})
		);
	}
	public logout(): void {
		localStorage.removeItem('user');
		this.currentUserSource.next(null);
		//this.currentUserSource.complete();
	}
	public setCurrentUser(user: User): void {
		localStorage.setItem('user', JSON.stringify(user));
		this.currentUserSource.next(user);
	}
	public register(model: any): Observable<void> {
		return this.http.post<User>(this.baseUrl + 'register', model).pipe(
			take(1),
			map((response: User) => {
				const user = response;
				if (user) {
					this.setCurrentUser(user);
				}
			})
		);
	}

	getUser(): Observable<UserUpdate> {
		return this.http
			.get<UserUpdate>(this.baseUrl + 'getUser')
			.pipe(take(1));
	}
	UpdateUser(model: UserUpdate): Observable<void> {
		return this.http
			.put<UserUpdate>(this.baseUrl + 'updateUser', model)
			.pipe(
				take(1),
				map((user) => {
					this.setCurrentUser(user);
				})
			);
	}

	postUpload(file: File): Observable<UserUpdate> {
		const fileToUpload = file[0] as File;
		const formData = new FormData();
		formData.append('file', fileToUpload);

		return this.http
			.post<UserUpdate>(`${this.baseUrl}upload-image`, formData)
			.pipe(take(1));
	}
}
