import {
  Component,
  ElementRef,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
  Input
} from '@angular/core';

@Component({
  selector: 'app-file-drag-import',
  templateUrl: './file-drag-import.component.html',
  styleUrls: ['./file-drag-import.component.css']
})
export class FileDragImportComponent implements OnInit {
  fileType = [
    '.xls',
    '.xlsx',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel'
  ];

  @ViewChild('fileDropRef') inputVariable: ElementRef;

  @Output() fileUpdate = new EventEmitter<any>();

  @Input()
  set resetInput(value: boolean) {
    if (value) {
      if (this.inputVariable?.nativeElement) {
        this.inputVariable.nativeElement.value = '';
      }
      this.file = null;
    }
  }

  @Input() sampleFileLink: any;

  constructor() {}

  ngOnInit(): void {
    console.log('');
  }

  file: any;

  /**
   * on file drop handler
   */
  onFileDropped($event: any) {
    if ($event.length > 0 && this.fileType.includes($event[0].type)) {
      this.prepareFilesList($event);
    } else {
      this.file = null;
    }
  }

  /**
   * handle file from browsing
   */
  fileBrowseHandler(files: any) {
    this.prepareFilesList(files?.files);
  }

  /**
   * Delete file from files list
   * @param index (File index)
   */
  deleteFile() {
    this.file = null;
  }

  /**
   * Convert Files list to normal array list
   * @param files (Files List)
   */
  prepareFilesList(files: any) {
    this.file = files[0];
    this.fileUpdate.emit(files[0]);
  }

  /**
   * format bytes
   * @param bytes (File size in bytes)
   * @param decimals (Decimals point)
   */
  formatBytes(bytes: number, decimals?: number) {
    if (bytes === 0) {
      return '0 Bytes';
    }
    const k = 1024;
    const dm = decimals <= 0 ? 0 : decimals || 2;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }
}
