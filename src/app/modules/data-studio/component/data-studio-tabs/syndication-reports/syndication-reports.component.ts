import { Component, OnInit } from '@angular/core';
import { BusinessService } from 'src/app/modules/account-and-settings/business/services/business.service';
import { AuthService } from 'src/app/modules/authentication/services/auth.service';

@Component({
  selector: 'app-syndication-reports',
  templateUrl: './syndication-reports.component.html',
  styleUrls: ['./syndication-reports.component.css']
})
export class SyndicationReportsComponent implements OnInit {
  sReportUrl: any;
  loggedInUser: any;
  showError: boolean;
  constructor(
    private businessService: BusinessService,
    private authenticationService: AuthService
  ) {}

  ngOnInit(): void {
    this.authenticationService.currentUser.subscribe((data: any) => {
      this.loggedInUser = data;
      this.loadBusinessData();
    });
  }

  loadBusinessData() {
    this.businessService
      .getBusinessOptimized(this.loggedInUser.businessId)
      .then((response: any) => {
        if (response && response?.syndicationCode) {
          this.sReportUrl = response?.syndicationCode;
        } else {
          this.showError = true;
        }
      })
      .catch(() => {
        this.showError = true;
      });
  }
}
