import { DatePipe, formatDate } from '@angular/common';
import { NgModule, Pipe, PipeTransform } from '@angular/core';
import { Constantes } from '../util/constantes';

@Pipe({
	name: 'dateTimeFormatPipe',
})
export class DateTimeFormatPipe extends DatePipe implements PipeTransform {
	transform(value: any, args?: any): any {
		const parts = `${value}`.split(/[\s/:]/);
		// parts[0] -> day, parts[1] -> month, parts[2] -> year
		// parts[3] -> hour, parts[4] -> minute, parts[5] -> second

		const formattedDate = new Date(
			parseInt(parts[2]),
			parseInt(parts[1]) - 1, // Months are zero-based in JavaScript
			parseInt(parts[0]),
			parseInt(parts[3]),
			parseInt(parts[4]),
			parseInt(parts[5])
		);

		return super.transform(formattedDate, 'dd/MM/yyyy HH:mm');
	}
}
