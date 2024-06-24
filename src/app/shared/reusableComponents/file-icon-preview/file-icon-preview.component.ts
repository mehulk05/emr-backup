import { Component, Input } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { FileTypeService } from 'src/app/modules/file-manager/services/file-type.service';

@Component({
  selector: 'app-file-icon-preview',
  templateUrl: './file-icon-preview.component.html',
  styleUrls: ['./file-icon-preview.component.css']
})
export class FileIconPreviewComponent {
  @Input() data: any;
  @Input() integrated: string[] = [];

  constructor(
    public fileTypeService: FileTypeService,
    private sanitizer: DomSanitizer
  ) {}

  isIntegrated(type: string): boolean {
    return this.integrated.includes(type);
  }

  getFileExtension(url: string): string {
    return url?.split('.')?.pop();
  }

  isValidVideoFormat(url: string): boolean {
    const validVideoFormats = ['mp4', 'webm', 'ogg'];
    return validVideoFormats.includes(this.getFileExtension(url));
  }

  isValidImageFormat(url: string): boolean {
    const validImageFormats = ['jpg', 'jpeg', 'png', 'gif', 'bmp'];
    return validImageFormats.includes(this.getFileExtension(url));
  }

  sanitizeUrl(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
