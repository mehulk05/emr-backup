import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/modules/authentication/services/auth.service';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { BusinessService } from '../../../business/services/business.service';

@Component({
  selector: 'app-notification-center-tab',
  templateUrl: './notification-center-tab.component.html',
  styleUrls: ['./notification-center-tab.component.css']
})
export class NotificationCenterTabComponent implements OnInit {
  subscriptions: Subscription = new Subscription();
  loggedInUser: any;
  businessInfo: any;
  sources = ['Configuration'];
  selectedSource: any = 'Configuration';
  selectedIndex: any = 0;
  constructor(
    private authService: AuthService,
    private localStorageService: LocalStorageService,
    private businessService: BusinessService
  ) {}

  ngOnInit(): void {
    this.authService.currentUserSubject.subscribe((data) => {
      this.loggedInUser = data;
      this.loadBusiness();
    });
  }

  loadBusiness() {
    this.businessService
      .getBusinessOptimized(this.loggedInUser?.businessId)
      .then((response: any) => {
        this.businessInfo = response;
        this.localStorageService.storeItem('businessInfo', this.businessInfo);
      });
  }

  handleSources() {
    this.selectedIndex = this.sources.indexOf(this.selectedSource);
  }

  handleChange(e: any) {
    this.selectedIndex = e.index;
    this.selectedSource = this.sources[this.selectedIndex];
  }
}
