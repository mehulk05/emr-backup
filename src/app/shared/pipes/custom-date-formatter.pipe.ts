import { Pipe, PipeTransform } from '@angular/core';
import moment from 'moment';

@Pipe({
  name: 'customDateFormatter'
})
export class CustomDateFormatterPipe implements PipeTransform {
  transform(value: any) {
    const date = moment(value).toDate();
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (
      date.getFullYear() == today.getFullYear() &&
      date.getMonth() == today.getMonth() &&
      date.getDate() == today.getDate()
    ) {
      return 'Today';
    } else if (
      date.getFullYear() == yesterday.getFullYear() &&
      date.getMonth() == yesterday.getMonth() &&
      date.getDate() == yesterday.getDate()
    ) {
      return 'Yesterday';
    } else {
      return moment(value).format('DD/MM/yyyy');
    }
  }
}
