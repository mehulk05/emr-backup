import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-preview-email-sms-template',
  templateUrl: './preview-email-sms-template.component.html',
  styleUrls: ['./preview-email-sms-template.component.css']
})
export class PreviewEmailSmsTemplateComponent {
  @Input() showModal: any;
  @Input() modalData: any;
  @Output() modalClosed = new EventEmitter<any>();
  constructor() {}

  hideModal() {
    this.modalClosed.emit({ close: true });
    this.showModal = false;
  }
}
