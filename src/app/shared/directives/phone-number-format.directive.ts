import {
  AfterViewInit,
  Directive,
  ElementRef,
  HostListener,
  Input,
  OnInit
} from '@angular/core';
import { FormControl } from '@angular/forms';

@Directive({
  selector: '[appPhoneNumberFormat]'
})
export class PhoneNumberFormatDirective implements OnInit, AfterViewInit {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('phoneNumberControl') phoneNumberControl: FormControl;

  constructor(private el: ElementRef) {}

  ngAfterViewInit() {
    // Format the phone number when the directive is initialized
    setTimeout(() => {
      this.formatPhoneNumber();
    }, 100);
  }

  ngOnInit() {
    // Subscribe to value changes on the phone number control
    this.phoneNumberControl.valueChanges.subscribe(() => {
      this.formatPhoneNumber();
    });
  }

  @HostListener('input', ['$event'])
  onInput(event: any) {
    // Update the value of the form control with the unformatted phone number
    const phoneNumber = event.target.value.replace(/\D/g, '');
    this.phoneNumberControl.setValue(phoneNumber, { emitEvent: false });

    // Format the phone number
    this.formatPhoneNumber();
  }

  private formatPhoneNumber() {
    // Get the value of the form control
    let phoneNumber = this.phoneNumberControl.value;
    if (phoneNumber && phoneNumber.length > 3) {
      console.log(this.phoneNumberControl, this.phoneNumberControl.value);
      // Remove all non-numeric characters
      phoneNumber = phoneNumber.replace(/\D/g, '');

      // Format the phone number as (999) 999-9999
      if (phoneNumber.length <= 3) {
        phoneNumber = `(${phoneNumber}`;
      } else if (phoneNumber.length <= 6) {
        const areaCode = phoneNumber.slice(0, 3);
        const prefix = phoneNumber.slice(3);
        phoneNumber = `(${areaCode}) ${prefix}`;
      } else {
        const areaCode = phoneNumber.slice(0, 3);
        const prefix = phoneNumber.slice(3, 6);
        const lineNumber = phoneNumber.slice(6, 10);
        phoneNumber = `(${areaCode}) ${prefix}-${lineNumber}`;
      }

      // Set the formatted phone number as the value of the input element
      this.el.nativeElement.value = phoneNumber;
    }
  }
}
