import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-email-segments-warning',
  templateUrl: './email-segments-warning.component.html',
  styleUrls: ['./email-segments-warning.component.css']
})
export class EmailSegmentsWarningComponent {
  @Input() showModal: any;
  @Input() emailCount: any;
  @Input() availableEmailQuota: any;
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
