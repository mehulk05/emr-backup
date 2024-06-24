import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'landingFilter'
})
export class LandingFilterPipe implements PipeTransform {
  transform(value: any, args?: any): any {
    //if (!value) return null;
    //if (!args) return null;
    console.log('val', value, 'raf', args);
    args = args.toLowerCase();
    if (args !== '') {
      return value.filter(function (item: any) {
        return JSON.stringify(item.name).toLowerCase().includes(args);
      });
    } else {
      return value;
    }
  }
}
