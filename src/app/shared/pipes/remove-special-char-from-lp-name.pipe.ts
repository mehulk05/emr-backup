import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'removeSpecialCharFromLpName'
})
export class RemoveSpecialCharFromLpNamePipe implements PipeTransform {
  transform(value: any): any {
    if (value) {
      value = value.split('?')[0];
    }

    return value;
  }
}
