import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-preview-audit-template',
  templateUrl: './preview-audit-template.component.html',
  styleUrls: ['./preview-audit-template.component.css']
})
export class PreviewAuditTemplateComponent {
  @Input() showModal: any;
  @Input() modalData: any;
  @Output() modalClosed = new EventEmitter<any>();
  constructor() {}

  hideModal() {
    this.modalClosed.emit({ close: true });
    this.showModal = false;
  }
}
