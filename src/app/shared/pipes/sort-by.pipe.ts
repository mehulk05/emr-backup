import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sortBy'
})
export class SortByPipe implements PipeTransform {
  transform(items: any[], key: string): any[] {
    if (!items) {
      return [];
    }
    return items.sort((a, b) => (a[key] > b[key] ? 1 : -1));
  }
}
