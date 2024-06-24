import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-custom-panel',
  templateUrl: './custom-panel.component.html',
  styleUrls: ['./custom-panel.component.css']
})
export class CustomPanelComponent {
  @Input() title: string;
  @Input() bodyStyleProps = {};
  @Input() addPanelBorder = true; // Default is true
  @Input() addNoOverflow = true; // Default is true
  @Input() addTopPadding = 0; // Default is true
  @Input() infoVisible = false;
  @Input() infoUlr: string;
  @Input() titleStyleProps = {}; // Default is true
  @Input() fontProps = {};
}
