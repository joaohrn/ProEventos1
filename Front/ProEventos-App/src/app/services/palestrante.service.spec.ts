/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { PalestranteService } from './palestrante.service';

describe('Service: PalestranteService', () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [PalestranteService],
		});
	});

	it('should ...', inject(
		[PalestranteService],
		(service: PalestranteService) => {
			expect(service).toBeTruthy();
		}
	));
});
