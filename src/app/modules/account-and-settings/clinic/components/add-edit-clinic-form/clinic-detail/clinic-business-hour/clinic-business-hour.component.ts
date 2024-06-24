import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-clinic-business-hour',
  templateUrl: './clinic-business-hour.component.html',
  styleUrls: ['./clinic-business-hour.component.css']
})
export class ClinicBusinessHourComponent {
  @Input() day!: string;
  @Input() _value: any;
  @Output() inputChange = new EventEmitter<any>();

  checked = false;
  openHour: any;
  closeHour: any;
  appointmentOnly = false;
  appointmentOption: any[] = [
    { name: 'Time', value: false },
    { name: 'By Appointment', value: true }
  ];
  constructor() {}

  @Input()
  set value(value: any) {
    const appoinmentOnlyTemp = value?.appointmentOnly ? true : false;
    this.checked = value.checked;
    if (!appoinmentOnlyTemp) {
      this.openHour = value.openHour;
      this.closeHour = value.closeHour;
    }
    this.appointmentOnly = value?.appointmentOnly ? true : false;
  }

  check = (event: any) => {
    this.checked = event.target.checked;
  };

  appointmentOnlyCheck = (event: any) => {
    this.appointmentOnly = event.value;
    this.onChange();
  };

  onChange = () => {
    const data = {
      checked: this.checked,
      day: this.day,
      openHour: this.openHour,
      closeHour: this.closeHour,
      appointmentOnly: this.appointmentOnly
    };

    this.inputChange.emit(data);
  };
}
