import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'commaSeparator'
})
export class CommaSeparatorPipe implements PipeTransform {
  transform(value: any): any {
    console.log(value);
    // return value.join(',');
    if (value) {
      return value.map(({ name }: any) => name).join(',');
    }
  }
}
