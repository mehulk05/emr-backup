import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-custom-checkbox1',
  templateUrl: './custom-checkbox1.component.html',
  styleUrls: ['./custom-checkbox1.component.css']
})
export class CustomCheckbox1Component {
  @Input() label: string;
  @Input() control: FormControl;
  @Input() for: string;

  constructor() {}

  onCheckboxChange(event: any) {
    this.control.setValue(event.target.checked);
  }
}
