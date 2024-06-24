import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-delete-warning',
  templateUrl: './delete-warning.component.html',
  styleUrls: ['./delete-warning.component.css']
})
export class DeleteWarningComponent {
  @Input() showModal: boolean = false;
  @Input() modalData: any;
  @Input() modalMessage: any;
  @Output() modalClosed = new EventEmitter<any>();
  constructor() {}

  hideModal() {
    this.modalClosed.emit({ close: true, isDelete: false });
    this.showModal = false;
  }

  delete() {
    this.modalClosed.emit({ close: true, isDelete: true });
    this.showModal = false;
  }
}
