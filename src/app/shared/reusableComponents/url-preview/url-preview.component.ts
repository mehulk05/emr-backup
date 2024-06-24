import { Component, Input } from '@angular/core';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';

@Component({
  selector: 'app-url-preview',
  templateUrl: './url-preview.component.html',
  styleUrls: ['./url-preview.component.css']
})
export class UrlPreviewComponent {
  @Input() iframeUrl!: string;
  @Input() previewUrl!: string;
  @Input() hideButton: boolean = false;
  constructor(private toastService: ToasTMessageService) {}

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
}
