import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-sidebar-footer',
  templateUrl: './sidebar-footer.component.html',
  styleUrls: ['./sidebar-footer.component.css']
})
export class SidebarFooterComponent {
  @Input() businessData: any;
  @Input() agencyLogoUrl: any;
  constructor() {}
}
