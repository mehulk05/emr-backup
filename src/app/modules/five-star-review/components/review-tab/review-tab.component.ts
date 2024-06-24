import { Component, OnInit, ViewChild } from '@angular/core';
import { FiveStarViewService } from '../../services/five-star-view.service';
import { G99ClinicReviewConfigComponent } from '../g99-clinic-review-config/g99-clinic-review-config.component';

@Component({
  selector: 'app-review-tab',
  templateUrl: './review-tab.component.html',
  styleUrls: ['./review-tab.component.css']
})
export class ReviewTabComponent implements OnInit {
  @ViewChild(G99ClinicReviewConfigComponent)
  clinicReviews: G99ClinicReviewConfigComponent;
  constructor(private clinicService: FiveStarViewService) {}
  sources = ['Configuration', 'Reports', 'Edit_Reviews', 'g99reviewQrcode'];
  selectedSource: any = 'Configuration';
  selectedIndex: any = 0;
  enableReportTabs = false;
  clinicData: any;
  clinicId: any;
  selectedClinic: any;
  clinicList: any = [];
  fetchReviewsAgain: boolean;
  clinicReviewData: any;
  ngOnInit(): void {
    this.clinicService.getDefaultCinic().then((data: any) => {
      console.log('data', data);
      this.clinicData = data;
      this.clinicId = data.id;
      this.handleSources();
      this.fetchReview();
    });

    this.loadAllClinics();
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

  loadAllClinics() {
    this.clinicService.getClinics().then((data) => {
      this.clinicList = data;
    });
  }

  fetchReview() {
    this.clinicService.getClinicReview(this.clinicId).then((response: any) => {
      this.clinicReviewData = response;
    });
  }

  onOptionsSelected(event: any) {
    this.clinicService.getSingleClinic(event.value).then((data: any) => {
      console.log('data', data);
      this.clinicData = data;
      this.clinicId = data.id;
      this.handleSources();
      this.fetchReview();
    });

    this.loadAllClinics();
  }

  scrapReviews() {
    this.clinicReviews.scrapReview();
  }
}
