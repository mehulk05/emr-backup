import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';

@Component({
  selector: 'app-import-file',
  templateUrl: './import-file.component.html',
  styleUrls: ['./import-file.component.css']
})
export class ImportFileComponent {
  @Input() showImportModal: boolean = false;
  @Input() modalImportData: any;
  @Input() modalImportMessage: any;
  @Input() isLead = false;
  @Input() isPatient = false;
  @Output() modalImportClosed = new EventEmitter<any>();
  file: any = null;
  fileName: any;
  recordType = 1;
  constructor(private alertService: ToasTMessageService) {}

  hideModal(close?: any) {
    if (close === 'upload') {
      this.modalImportClosed.emit({
        close: true,
        isImport: this.file,
        recordType: this.recordType
      });
    } else {
      this.file = null;
      this.modalImportClosed.emit({
        close: true,
        isImport: this.file,
        recordType: this.recordType
      });
    }
    this.showImportModal = false;
  }

  onFileChange(event: any) {
    this.file = event.target.files[0];
    const ext = this.file.name.split('.').pop();
    console.log('file', ext);
    if (ext === 'xlsx') {
      this.fileName = this.file.name;
    } else {
      this.alertService.error('Please Upload Excel Files only');
    }
  }
}
