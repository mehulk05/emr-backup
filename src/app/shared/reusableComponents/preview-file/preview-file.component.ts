import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FileManagerService } from 'src/app/modules/file-manager/services/file-manager.service';
import { ToasTMessageService } from '../../services/toast-message.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-preview-file',
  templateUrl: './preview-file.component.html',
  styleUrls: ['./preview-file.component.css']
})
export class PreviewFileComponent implements OnInit {
  @Input() showModal: boolean = false;
  @Input() modalData: any;
  @Input() modalMessage: any;
  @Output() modalClosed = new EventEmitter<any>();
  @Input() id: any;
  @Input() type: any;
  filePath: any;
  constructor(
    private fileManager: FileManagerService,
    private alertService: ToasTMessageService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.downloadImage(this.id);
  }

  downloadImage(id: any) {
    this.fileManager
      .getPrivateUrl(id)
      .then((data: any) => {
        console.log(data);
        this.filePath = data.url;
      })
      .catch(() => {
        this.alertService.error('Unable to download trigger xlsx.');
      });
  }

  hideModal() {
    this.modalClosed.emit({ close: true, isDelete: false });
    this.showModal = false;
  }

  delete() {
    this.modalClosed.emit({ close: true, isDelete: true });
    this.showModal = false;
  }

  isImage(data: any) {
    return data && data.split('/')[0] === 'image';
  }

  isPDF(data: any) {
    return data && data === 'application/pdf';
  }

  isZip(data: any) {
    return data && data === 'application/zip';
  }

  isExcel(data: any) {
    return (
      data &&
      data ===
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
  }

  isVideo(data: any) {
    return (
      data &&
      ['video/x-msvideo', 'text/csv', 'video/mp4', 'video/mpeg'].includes(data)
    );
  }

  isDoc(data: any) {
    return (
      data &&
      data ===
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    );
  }

  sanitizeVideoUrl(url: any) {
    return this.sanitizer.bypassSecurityTrustHtml(url);
  }
}
