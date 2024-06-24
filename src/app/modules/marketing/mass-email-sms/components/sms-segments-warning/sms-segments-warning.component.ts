import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sms-segments-warning',
  templateUrl: './sms-segments-warning.component.html',
  styleUrls: ['./sms-segments-warning.component.css']
})
export class SmsSegmentsWarningComponent {
  @Input() showModal: any;
  @Input() segmentCount: any;
  @Input() smsCount: any;
  @Input() availableSmsQuota: any;
  @Output() modalClosed = new EventEmitter<any>();
  constructor(private router: Router) {}

  hideModal() {
    this.modalClosed.emit({ close: true });
    this.showModal = false;
  }

  buyPack() {
    this.router.navigate(['show-packs']);
  }
}
