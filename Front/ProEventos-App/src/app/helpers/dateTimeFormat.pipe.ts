import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import { Constantes } from '../util/constantes';

@Pipe({
	name: 'dateTimeFormatPipe',
})
export class DateTimeFormatPipe extends DatePipe implements PipeTransform {
	transform(value: any): any {
		let month = value.substring(0, 2);
		let day = value.substring(3, 5);
		let year = value.substring(6, 10);
		let hour = value.substring(11, 13);
		let minute = value.substring(14, 16);
		value = `${day}/${month}/${year} ${hour}:${minute}`;
		return super.transform(value, Constantes.DATE_TIME_FMT);
	}
}
