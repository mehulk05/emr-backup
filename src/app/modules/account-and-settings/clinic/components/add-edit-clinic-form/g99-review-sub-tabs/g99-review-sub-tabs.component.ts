import { Component, Input, OnInit } from '@angular/core';
import { ClinicService } from '../../../services/clinic.service';

@Component({
  selector: 'app-g99-review-sub-tabs',
  templateUrl: './g99-review-sub-tabs.component.html',
  styleUrls: ['./g99-review-sub-tabs.component.css']
})
export class G99ReviewSubTabsComponent implements OnInit {
  @Input() clinicData: any;
  @Input() clinicId: any;

  constructor(private clinicService: ClinicService) {}
  sources = ['Configuration', 'Reports', 'Edit_Reviews', 'g99reviewQrcode'];
  selectedSource: any = 'Configuration';
  selectedIndex: any = 0;
  enableReportTabs = false;

  ngOnInit(): void {
    this.handleSources();
  }

  handleSources() {
    this.clinicService.getClinicReview(this.clinicId).then((response: any) => {
      if (response.enableReviewManager) {
        this.enableReportTabs = true;
      } else {
        this.enableReportTabs = false;
      }
    });
    this.selectedIndex = this.sources.indexOf(this.selectedSource);
  }

  handleChange(e: any) {
    this.selectedIndex = e.index;
    this.selectedSource = this.sources[this.selectedIndex];
  }
}
