import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output
} from '@angular/core';
import { FileTypeService } from '../../services/file-type.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-image-preview',
  templateUrl: './image-preview.component.html',
  styleUrls: ['./image-preview.component.css']
})
export class ImagePreviewComponent implements OnChanges {
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
