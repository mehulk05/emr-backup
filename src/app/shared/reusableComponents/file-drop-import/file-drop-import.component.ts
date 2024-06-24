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
  selector: 'app-file-drop-import',
  templateUrl: './file-drop-import.component.html',
  styleUrls: ['./file-drop-import.component.css']
})
export class FileDropImportComponent implements OnInit {
  acceptedFileTypes: string;

  @Input() file: any;
  @Input() fileTypes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    '.gif',
    '.pdf',
    'application/pdf',
    '.xls',
    '.xlsx',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel'
  ];

  @ViewChild('fileDropRef') inputVariable: ElementRef;
  @Output() fileUpdate = new EventEmitter<any>();
  @Output() fileError = new EventEmitter<string>();
  @Output() fileDelete = new EventEmitter<any>();
  @Input()
  imageURL = '';
  set resetInput(value: boolean) {
    if (value) {
      this.inputVariable.nativeElement.value = '';
      this.file = null;
    }
  }
  constructor() {}

  ngOnInit(): void {
    this.acceptedFileTypes = this.fileTypes.join(',');
    if (this.file) {
      this.imageURL = this.file?.fileUrl;
    }
  }

  showImagePath() {
    if (this.file) {
      this.imageURL = '';
      if (['image/jpeg', 'image/png', 'image/gif'].includes(this.file.type)) {
        const reader = new FileReader();
        reader.onload = () => {
          this.imageURL = reader.result as string;
        };
        reader.readAsDataURL(this.file);
      }
    }
  }

  checkFileIsImage() {
    return ['image/jpeg', 'image/png', 'image/gif'].includes(this.file.type);
  }

  /**
   * on file drop handler
   */
  onFileDropped($event: any) {
    if (!$event) return;

    if ($event.length > 0 && this.fileTypes.includes($event[0].type)) {
      this.prepareFilesList($event);
    } else if (!this.fileTypes.includes($event[0].type)) {
      this.fileError.emit(
        'Invalid File! Only Image, Pdf and Excel files are supported.'
      );
    }
  }

  checkFileIsNotImage() {
    return !['image/jpeg', 'image/png', 'image/gif'].includes(this.file.type);
  }

  /**
   * handle file from browsing
   */
  fileBrowseHandler(files: any) {
    this.onFileDropped(files?.files);
  }

  /**
   * Delete file from files list
   * @param index (File index)
   */
  deleteFile() {
    this.file = null;
    this.fileDelete.emit(true);
  }

  /**
   * Convert Files list to normal array list
   * @param files (Files List)
   */
  prepareFilesList(files: any) {
    this.file = files[0];
    this.showImagePath();
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
