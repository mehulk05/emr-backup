import { Component, Input } from '@angular/core';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';

@Component({
  selector: 'app-integration-right-card',
  templateUrl: './integration-right-card.component.html',
  styleUrls: ['./integration-right-card.component.css']
})
export class IntegrationRightCardComponent {
  @Input() integrationScript: any;
  @Input() integrationPreviewUrl: any;
  @Input() showLayout: any = 1;
  constructor(private toastService: ToasTMessageService) {}

  copyLink() {
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = this.integrationScript;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    console.log(selBox);
    document.body.removeChild(selBox);
    this.toastService.success('Copied!');
  }
}
