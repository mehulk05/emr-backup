import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
import { FiveStarViewService } from '../../services/five-star-view.service';

import { Router } from '@angular/router';
import { FormatTimeService } from 'src/app/shared/services/time-utils/formatTime.service';

@Component({
  selector: 'app-g99-clinic-review-report',
  templateUrl: './g99-clinic-review-report.component.html',
  styleUrls: ['./g99-clinic-review-report.component.css']
})
export class G99ClinicReviewReportComponent implements OnInit {
  @Input() clinicData: any;
  @Input() clinicId: any;

  currentFacebookReviewsCount = 0;
  currentFiveStarRatingCount = 0;
  currentGoogleReviewsCount = 0;
  currentYelpReviewsCount = 0;
  totalReviewSize = 0;
  currentReviewFetchedDate: any;
  showReviewStatus = false;
  showReport = false;

  analyticTotalReviewSize = 0;
  previousGoogleReviewsCount = 0;
  previousFacebookReviewCount = 0;
  previousYelpReviewCount = 0;
  previousFiveStarRatingCount = 0;
  previousReviewFetchedDate: any;
  analyticCurrentFiveStarRatingCount = 0;
  analyticCurrentReviewFetchedDate: any;
  analyticCurrentGoogleReviewsCount = 0;
  analyticCurrentFacebookReviewsCount = 0;
  analyticCurrentYelpReviewsCount = 0;
  showAnalytics = false;
  months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
  ];
  currentDate: Date = new Date();
  currentYear = this.currentDate.getFullYear();
  years: number[] = [];
  selectedYear = this.currentYear;
  selectedMonth = this.months[this.currentDate.getMonth()];
  reportUrl: String;
  constructor(
    public formBuilder: FormBuilder,
    private toastMessageService: ToasTMessageService,
    private clinicService: FiveStarViewService,
    private router: Router,
    public formatTimeService: FormatTimeService
  ) {}

  ngOnInit(): void {
    this.loadClinicReviewReport();
    this.loadClinicReviewAnalytics();
    this.createYearsList();
  }

  createYearsList() {
    let year = 2000;
    while (year != this.currentYear) {
      year++;
      this.years.push(year);
    }
    this.years.reverse();
    year = 2000;
  }

  loadClinicReviewAnalytics() {
    this.clinicService
      .getClinicReviewReport(this.clinicId)
      .then((response: any) => {
        console.log(response);
        if (response.data) {
          this.showReport = true;
          this.currentFacebookReviewsCount =
            response.data?.currentFacebookReviewsCount;
          this.currentFiveStarRatingCount =
            response.data?.currentFiveStarRatingCount;
          this.currentGoogleReviewsCount =
            response.data?.currentGoogleReviewsCount;
          this.currentYelpReviewsCount = response.data?.currentYelpReviewsCount;
          this.totalReviewSize = response.data?.totalReviewSize;
          this.currentReviewFetchedDate =
            response.data?.currentReviewFetchedDate;
        }
      })
      .catch(() => {
        this.toastMessageService.error('Unable to load Review Report.');
      });
  }

  loadClinicReviewReport() {
    this.clinicService
      .getClinicReviewAnalytics(this.clinicId)
      .then((response: any) => {
        console.log(response);
        if (response.data) {
          this.showAnalytics = true;
          this.analyticTotalReviewSize = response.data?.totalReviewSize;
          this.previousGoogleReviewsCount =
            response.data?.previousGoogleReviewsCount;
          this.previousFacebookReviewCount =
            response.data?.previousFacebookReviewCount;
          this.previousYelpReviewCount = response.data?.previousYelpReviewCount;
          this.previousFiveStarRatingCount =
            response.data?.previousFiveStarRatingCount;
          this.previousReviewFetchedDate =
            response.data?.previousReviewFetchedDate;
          this.analyticCurrentFiveStarRatingCount =
            response.data?.currentFiveStarRatingCount;
          this.analyticCurrentReviewFetchedDate =
            response.data?.currentReviewFetchedDate;
          this.analyticCurrentGoogleReviewsCount =
            response.data?.currentGoogleReviewsCount;
          this.analyticCurrentFacebookReviewsCount =
            response.data?.currentFacebookReviewsCount;
          this.analyticCurrentYelpReviewsCount =
            response.data?.currentYelpReviewsCount;
        }
      })
      .catch(() => {
        this.toastMessageService.error('Unable to load Review Analytics.');
      });
  }

  createReportLink = () => {
    this.reportUrl =
      '/public/reviews/report/' +
      btoa(
        this.clinicId + '-' + this.selectedYear + '-' + this.selectedMonth
      ).toString();
    window.open(this.reportUrl.toString());
  };
}
