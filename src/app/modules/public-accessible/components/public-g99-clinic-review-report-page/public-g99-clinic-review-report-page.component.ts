import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PublicAccessibleService } from '../../services/public-accessible.service';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';

@Component({
  selector: 'app-public-g99-clinic-review-report-page',
  templateUrl: './public-g99-clinic-review-report-page.component.html',
  styleUrls: ['./public-g99-clinic-review-report-page.component.css']
})
export class PublicG99ClinicReviewReportPageComponent implements OnInit {
  key: any;
  reviewList: any;
  totalReviewsSize: number;
  newReviewsSize: number;
  reportFetched: boolean;
  platforms: any[] = [];
  reviewCount: any;
  clinicName: String;
  averageRating: any;
  prevAvgRating: any;
  date: any;
  error: any;
  agencyName = 'Growth99';
  agencyLogoUrl: 'https://growth99.com/wp-content/uploads/2023/02/growth99-logo.svg';
  businessData: any;
  constructor(
    private activatedRoute: ActivatedRoute,
    private PublicAccessibleService: PublicAccessibleService,
    private localStorageService: LocalStorageService
  ) {}

  ngOnInit(): void {
    this.key = this.activatedRoute.snapshot.params.key;
    const bdData: any = this.localStorageService.readStorage('businessInfo');
    this.businessData = bdData;
    if (this.businessData) {
      this.agencyName = this.businessData?.agency?.name ?? 'Growth99';
      this.agencyLogoUrl =
        this.businessData?.agency?.logoUrl ??
        'https://g99plus.b-cdn.net/AA%20new%20g99%20app/images/g99%20full%20logo.svg';
    }
    this.fetchReport();
  }
  fetchReport() {
    this.PublicAccessibleService.getReportForClinicReviews(this.key).subscribe(
      (response: any) => {
        const reportData = response.data;
        if (reportData) {
          this.reportFetched = true;
          this.reviewList = reportData?.reviewList;
          this.totalReviewsSize = reportData?.totalReviewSize;
          this.newReviewsSize = reportData?.newReviewSize;
          this.reviewCount = reportData?.reviewCount;
          this.clinicName = reportData?.clinicName;
          this.averageRating = reportData?.averageRating;
          this.date = reportData?.date;
        } else {
          this.error = true;
        }
      },
      (e) => {
        console.log(e);
        this.error = true;
      }
    );
  }
}
