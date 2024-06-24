import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'numberToArray'
})
export class NumberToArrayPipe implements PipeTransform {
  transform(num: any): any[] {
    let arr = [];
    try {
      arr = num && !isNaN(num) && Array(parseInt(num));
    } catch (e) {}

    return arr;
  }
}
