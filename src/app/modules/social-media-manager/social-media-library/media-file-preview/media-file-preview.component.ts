import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { FileTypeService } from 'src/app/modules/file-manager/services/file-type.service';

@Component({
  selector: 'app-media-file-preview',
  templateUrl: './media-file-preview.component.html',
  styleUrls: ['./media-file-preview.component.css']
})
export class MediaFilePreviewComponent implements OnChanges {
  @Output() afterImagePreviewModalClose = new EventEmitter<any>();
  @Input() selectedData: any;
  @Input() showImagePreviewModal: boolean = false;
  renderModalBody: boolean;
  constructor(
    public fileTypeService: FileTypeService,
    private sanitizer: DomSanitizer
  ) {}
  ngOnChanges(): void {
    console.log(this.selectedData);
    if (this.selectedData) {
      this.renderModalBody = true;
    }
  }

  closeModal() {
    this.afterImagePreviewModalClose.emit({ type: 'Close' });
  }

  public santizieUrl(url: string) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
