import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-excel-column-list',
  templateUrl: './excel-column-list.component.html',
  styleUrls: ['./excel-column-list.component.css']
})
export class ExcelColumnListComponent {
  _files: File;
  @Input() set files(file: File) {
    this._files = file;
    this.readExcel(file);
  }
  excelCoumn: FormGroup;
  columnsArray: any = [];
  @Output() modalClosed = new EventEmitter<any>();
  @Output() modalUpload = new EventEmitter<any>();
  @Input() showModal: any;
  @Input() showExportModal: any;
  @Input() columnsNames: any = [];
  @Input() mendatoryColunms: any = [];
  @Input() isLead = false;

  columnsList: any = [];
  error = '';
  recordType = 1;
  @ViewChild('fileInput') fileInput: any;

  constructor(private fb: FormBuilder) {}

  uploadFile() {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: Event) {
    // Handle the file selection here if you want to do something with the selected files
    const fileList: FileList | null = (event.target as HTMLInputElement).files;
    if (fileList && fileList.length > 0) {
      // Process the selected files here
      console.log(fileList);
      this.readExcel(fileList[0]);
      this.error = '';
    }
  }
  readExcel(file: any) {
    console.log(file);
    const fileReader = new FileReader();
    fileReader.readAsArrayBuffer(file);

    fileReader.onload = (e: any) => {
      const bufferArray = e?.target.result;
      const wb = XLSX.read(bufferArray, { type: 'buffer', sheetRows: 1 });
      const wsname = wb.SheetNames[0];
      this.columnsArray = XLSX.utils.sheet_to_json(wb.Sheets[wsname], {
        header: 1
      })[0];
      this.columnsArray = this.columnsArray.filter((a: any) => a);
      this.columnsList = this.columnsArray.map((data: any) => {
        const excelCoumn = new ExcelColumn();
        excelCoumn.name = data.toLowerCase();
        excelCoumn.expectedValue = data.toLowerCase();
        return excelCoumn;
      });
      this.checkErrors();
    };
  }

  hideModal() {
    this.modalClosed.emit({ close: true, isCreate: false });
    this.showModal = false;
  }

  checkErrors() {
    let mendatoryError = '';
    let fieldMessing = '';
    const headres = this.columnsList.map((data: ExcelColumn) => data.name);
    this.mendatoryColunms.forEach((data: string) => {
      if (!headres.includes(data)) {
        mendatoryError = mendatoryError + ',' + data;
      }
    });

    this.columnsList.forEach((data: ExcelColumn) => {
      if (!this.columnsNames.includes(data.name)) {
        fieldMessing = fieldMessing + ',' + data.name;
      }
    });

    if (mendatoryError.length > 1) {
      this.error =
        '\n Missing mendatory fields are <b>' + mendatoryError + '</b>';
    }

    if (fieldMessing.length > 1) {
      this.error = '\n Mapping are wrong for <b>' + fieldMessing + '</b>';
    }
  }

  uploadModal() {
    this.modalUpload.emit({ upload: true, recordType: this.recordType });
    this.showModal = false;
  }
}

export class ExcelColumn {
  name: string;
  expectedValue: string;
}
