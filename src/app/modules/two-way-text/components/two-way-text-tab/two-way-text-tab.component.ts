import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BusinessService } from 'src/app/modules/account-and-settings/business/services/business.service';
import { AuthService } from 'src/app/modules/authentication/services/auth.service';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';

@Component({
  selector: 'app-two-way-text-tab',
  templateUrl: './two-way-text-tab.component.html',
  styleUrls: ['./two-way-text-tab.component.css']
})
export class TwoWayTextTabComponent implements OnInit {
  loggedInUser: any;
  businessInfo: any;
  sources = ['configuration'];
  selectedSource: string = 'configuration';
  selectedIndex: number = 0;
  constructor(
    private authService: AuthService,
    private localStorageService: LocalStorageService,
    private businessService: BusinessService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.currentUserSubject.subscribe((data) => {
      this.loggedInUser = data;
      this.loadBusiness();
    });
    this.activatedRoute.queryParams.subscribe((data: any) => {
      if (data.source) {
        this.selectedSource = data.source;
        this.selectedIndex = this.sources.indexOf(this.selectedSource);
      }
    });
  }

  loadBusiness() {
    this.businessService
      .getBusinessOptimized(this.loggedInUser?.businessId)
      .then((response: any) => {
        this.businessInfo = response;
        console.log(this.businessInfo);
        // this.localStorageService.storeItem('businessInfo', this.businessInfo);
        if (!this.businessInfo.getTwilioNumber) {
          this.router.navigate(['two-way-text', 'subscribe']);
        }
      });
  }

  handleSources() {
    this.selectedIndex = this.sources.indexOf(this.selectedSource);
  }

  handleChange(e: any) {
    this.selectedIndex = e.index;
    this.router.navigate(['two-way-text'], {
      queryParams: {
        source: this.sources[e.index]
      },
      queryParamsHandling: 'merge'
    });
  }
}
