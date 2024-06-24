import { Directive, HostListener } from '@angular/core';
import {
  NG_VALIDATORS,
  Validator,
  AbstractControl,
  ValidationErrors
} from '@angular/forms';

@Directive({
  selector: '[appNoLeadingSpace]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: NoLeadingSpaceDirective,
      multi: true
    }
  ]
})
export class NoLeadingSpaceDirective implements Validator {
  validate(control: AbstractControl): ValidationErrors | null {
    const isValid = control.value && !control.value.startsWith(' ');
    return isValid ? null : { leadingSpace: true };
  }

  @HostListener('input', ['$event'])
  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = input.value;
    if (value.startsWith(' ')) {
      input.value = value.trimStart();
    }
  }
}
