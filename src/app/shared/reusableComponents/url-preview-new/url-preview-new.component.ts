import { Component, Input } from '@angular/core';
import { ToasTMessageService } from '../../services/toast-message.service';

@Component({
  selector: 'app-url-preview-new',
  templateUrl: './url-preview-new.component.html',
  styleUrls: ['./url-preview-new.component.css']
})
export class UrlPreviewNewComponent {
  constructor(private toastService: ToasTMessageService) {}

  @Input() title: string;
  @Input() iframeUrl: string;
  @Input() previewUrl: string;

  copyLink() {
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = this.iframeUrl;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    console.log(selBox);
    document.body.removeChild(selBox);
    this.toastService.success('Copied!');
  }

  openPreview() {
    window.open(this.previewUrl, '_blank');
  }
}
