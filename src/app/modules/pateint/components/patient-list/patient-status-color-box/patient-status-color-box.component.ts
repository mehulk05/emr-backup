import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-patient-status-color-box',
  templateUrl: './patient-status-color-box.component.html',
  styleUrls: ['./patient-status-color-box.component.css']
})
export class PatientStatusColorBoxComponent {
  @Input() field: any;
  leadStatusClass: any = {
    NEW: 'green',
    EXISTING: 'blue'
  };
  @Input() leadStatus: any;
  constructor() {}
}
