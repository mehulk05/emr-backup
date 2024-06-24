import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appErrorStylingDirective]'
})
export class ErrorStylingDirectiveDirective {
  constructor(private elem: ElementRef) {}

  @HostListener('blur')
  onBlur(e: any) {
    console.log('here');
    // do something here
    if (e.target.className && e.target.className.indexOf('ng-invalid') > 0) {
      e.target.className = e.target.className.replace('has-success', '');
    } else {
      e.target.className = e.target.className + ' has-success';
    }
  }
}
