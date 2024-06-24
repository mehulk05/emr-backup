import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-export-file',
  templateUrl: './export-file.component.html',
  styleUrls: ['./export-file.component.css']
})
export class ExportFileComponent {
  @Input() showExportModal: boolean = false;
  @Input() modalExportData: any;
  @Input() modalExportMessage: any;
  @Input() modalTitle = 'Export File';
  @Input() modalDescription: string;
  @Output() modalExportClosed = new EventEmitter<any>();
  file: any = null;

  selectedButton: any = null;
  buttons = [
    {
      label: 'Excel File',
      icon: 'https://g99plus.b-cdn.net/AA%20new%20g99%20app/icons/excel%201.svg'
    },
    {
      label: 'PDF File',
      icon: 'https://g99plus.b-cdn.net/AA%20new%20g99%20app/icons/image%201.svg'
    }
  ];
  constructor() {}

  hideModal() {
    this.modalExportClosed.emit({ close: true, isImport: this.file });
    this.showExportModal = false;
  }

  selectedButtonIndex: number = -1;

  selectButton(index: number, selectedButton: any) {
    this.selectedButtonIndex = index;
    this.selectedButton = selectedButton;
  }

  onFileChange(event: any) {
    this.file = event.target.files[0];
  }

  export() {
    if (this.selectedButton.label === 'Excel File') {
      this.exportExcel();
    } else {
      this.exportPdf();
    }
  }

  exportExcel() {
    this.modalExportClosed.emit({ close: true, isExcel: true });
    this.showExportModal = false;
  }

  exportPdf() {
    this.modalExportClosed.emit({ close: true, isPdf: true });
    this.showExportModal = false;
  }
}
