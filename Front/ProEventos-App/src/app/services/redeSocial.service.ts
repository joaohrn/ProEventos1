import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { RedeSocial } from '../model/RedeSocial';
import { take } from 'rxjs/operators';

@Injectable({
	providedIn: 'root',
})
export class RedeSocialService {
	baseUrl = environment.apiURL + 'api/redesSociais';

	constructor(private http: HttpClient) {}

	public getRedesSociais(
		origem: string,
		id: number
	): Observable<RedeSocial[]> {
		let url =
			id === 0
				? `${this.baseUrl}/${origem} `
				: `${this.baseUrl}/${origem}/${id}`;
		return this.http.get<RedeSocial[]>(url).pipe(take(1));
	}

	public saveRedeSocial(
		origem: string,
		id: number,
		redesSociais: RedeSocial[]
	): Observable<RedeSocial[]> {
		let url =
			id === 0
				? `${this.baseUrl}/${origem} `
				: `${this.baseUrl}/${origem}/${id}`;
		return this.http.put<RedeSocial[]>(url, redesSociais).pipe(take(1));
	}

	public deleteRedeSocial(
		origem: string,
		id: number,
		redeSocialId: number
	): Observable<any> {
		let url =
			id === 0
				? `${this.baseUrl}/${origem}/${redeSocialId} `
				: `${this.baseUrl}/${origem}/${id}/${redeSocialId}`;
		return this.http.delete(url).pipe(take(1));
	}
}
