import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-error-success-panel',
  templateUrl: './error-success-panel.component.html',
  styleUrls: ['./error-success-panel.component.css']
})
export class ErrorSuccessPanelComponent {
  @Input() error: any = '';
  @Input() success: any = '';
}
