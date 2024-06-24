import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { Subscription } from 'rxjs';
import { combineLatest } from 'rxjs';
import { AuthService } from 'src/app/modules/authentication/services/auth.service';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { BusinessService } from '../../services/business.service';
import { distinctUntilChanged } from 'rxjs/operators';
import { isEqual } from 'lodash';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-business-tab',
  templateUrl: './business-tab.component.html',
  styleUrls: ['./business-tab.component.css']
})
export class BusinessTabComponent implements OnInit {
  subscriptions: Subscription = new Subscription();
  loggedInUser: any;
  businessInfo: any;
  selectedIndex: any = 0;
  sources = [
    'profile',
    'personalization',
    'audit',
    'business-account',
    'opt-out-list'
  ];
  source: any = 'profile';

  constructor(
    private store: Store,
    private router: Router,

    private authService: AuthService,
    private businessService: BusinessService,
    private localStorageService: LocalStorageService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.handleParamsInTab();
    this.subscriptions.add(
      combineLatest([
        this.authService.currentUserSubject,
        this.authService.currentBusinessSubject
      ])
        .pipe(
          distinctUntilChanged(isEqual) // Use the isEqual function from lodash
        )
        .subscribe(([data, businessInfo]: [any, any]) => {
          console.log(data, businessInfo);
          this.loggedInUser = data;
          if (this.loggedInUser.businessId == businessInfo.id) {
            this.businessInfo = businessInfo;
          } else {
            this.loadBusiness();
          }
        })
    );

    // this.authService.currentUserSubject.subscribe((data: any) => {
    //   this.loggedInUser = data;
    //   this.loadBusiness();
    // });
  }

  handleParamsInTab() {
    this.source = this.activatedRoute.snapshot.queryParams?.source ?? 'profile';
    if (this.source) {
      this.selectedIndex = this.sources.indexOf(this.source);
    }
    this.activatedRoute.queryParams.subscribe((data: any) => {
      this.source = data.source ?? 'profile';
      if (this.source) {
        this.selectedIndex = this.sources.indexOf(this.source);
      }
    });
  }

  handleChange(e: any) {
    this.selectedIndex = e.index;
    this.router.navigate(['business'], {
      queryParams: {
        source: this.sources[e.index]
      },
      queryParamsHandling: 'merge'
    });
  }

  loadBusiness() {
    this.businessService
      .getBusinessOptimized(this.loggedInUser.businessId)
      .then((response: any) => {
        this.businessInfo = response;
        this.localStorageService.storeItem('businessData', this.businessInfo);
      });
  }
}
