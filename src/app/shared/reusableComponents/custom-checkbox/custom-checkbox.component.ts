import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-custom-checkbox',
  templateUrl: './custom-checkbox.component.html',
  styleUrls: ['./custom-checkbox.component.css']
})
export class CustomCheckboxComponent {
  @Input() label: string;
  @Input() control: FormControl;
  @Input() for: string;
  @Output() valueChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor() {}

  onCheckboxChange(event: any): void {
    console.log(event.target.checked, event.target);
    const newValue = event.target.checked;
    this.valueChange.emit(newValue);
  }
}
