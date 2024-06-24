import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ucs2ToUtf8'
})
export class Ucs2ToUtf8Pipe implements PipeTransform {
  transform(value: string): unknown {
    let utfString = value;
    try {
      utfString = value ? decodeURIComponent(escape(value)) : '';
    } catch (error) {}
    return utfString;
  }
}
