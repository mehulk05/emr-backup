import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BusinessHours } from '../../models/business/BusinessHours';

@Component({
  selector: 'app-business-hours',
  templateUrl: './business-hours.component.html',
  styleUrls: ['./business-hours.component.css']
})
export class BusinessHoursComponent {
  @Output() inputChange = new EventEmitter<any>();

  businessHour: BusinessHours;

  constructor() {}

  @Input()
  set value(value: BusinessHours) {
    this.businessHour = value;
  }

  check(event: any) {
    this.businessHour.checked = event.target.checked;
  }

  onChange() {
    this.inputChange.emit(this.businessHour);
  }
}
