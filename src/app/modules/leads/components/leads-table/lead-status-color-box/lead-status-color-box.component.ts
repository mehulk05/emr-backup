import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-lead-status-color-box',
  templateUrl: './lead-status-color-box.component.html',
  styleUrls: ['./lead-status-color-box.component.css']
})
export class LeadStatusColorBoxComponent {
  @Input() field: any;
  leadStatusClass: any = {
    NEW: 'green',
    HOT: 'red',
    COLD: 'blue',
    DEAD: 'black',
    WARM: 'orange',
    WON: 'purple',
    JUNK: 'grey',
    PENDING: 'yellow'
  };

  leadSourceClass: any = {
    'Self Assessment': 'green',
    ChatBot: 'red',
    'Landing Page': 'blue',
    Form: 'dark-blue',
    Manual: 'pink'
  };
  @Input() leadStatus: any;
  constructor() {}
}
