import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { combineLatest, Subject, Subscription } from 'rxjs';
import { currentUserService } from './modules/authentication/services/current-user.service';
import { User } from './shared/models/user/user';
import { HeaderComponent } from './shared/reusableComponents/header/header.component';
import { LocalStorageService } from './shared/services/local-storage.service';
import { MenuService } from './shared/services/sidebar-menu.service';
import { NavigationEnd, Router } from '@angular/router';
import { distinctUntilChanged, filter, takeUntil } from 'rxjs/operators';
import { isEqual } from 'lodash';
import { AuthService } from './modules/authentication/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private apiCallMade = false;

  @ViewChild(HeaderComponent) child: HeaderComponent;
  title = 'emr-new';
  userData!: User;
  currentUrl: any;
  hideSidebar = false;
  hideHeader = false;
  subcscription = new Subscription();
  isSupportUser: boolean | string;
  businessData: any;
  isDataFetching: boolean = true;
  constructor(
    private currentUserService: currentUserService,
    private authService: AuthService,
    private sidebarService: MenuService,
    private localSotrageService: LocalStorageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.router.events.pipe(takeUntil(this.destroy$)).subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const routeToCheck = event.url;
        const excludeRouteArray = [
          '/ap-booking/business',
          '/ap-booking/clinic',
          '/ap-dashboard/business',
          '/ap-booking'
        ];

        const routeWithoutQueryParams = routeToCheck.split('?')[0];
        console.log(routeToCheck, routeWithoutQueryParams);
        if (!excludeRouteArray.includes(routeWithoutQueryParams)) {
          console.log('I M INSIEDE');
          this.handleNavigationEnd();
        } else {
          this.hideHeader = true;
          this.hideSidebar = true;
        }
      }
    });

    combineLatest([
      this.currentUserService.currentUserSubject,
      this.authService.currentBusinessSubject
    ])
      .pipe(
        takeUntil(this.destroy$),
        distinctUntilChanged(isEqual),
        filter(
          ([data, businessInfo]: [any, any]) =>
            data !== null && businessInfo !== null
        )
      )
      .subscribe(([data, businessInfo]: [any, any]) => {
        this.userData = data;
        console.log('######62', data, businessInfo);
        this.isSupportUser = data?.supportUser;
        this.businessData = businessInfo;
        if (!this.apiCallMade) {
          this.getHeaderSidebarQuotaQuickLink();
        }
      });
  }

  private handleNavigationEnd() {
    this.sidebarService.sideBarInfoSubject
      .pipe(takeUntil(this.destroy$))
      .subscribe((sideBarInfo: any) => {
        if (sideBarInfo?.hideHeader) {
          this.hideHeader = true;
          this.hideSidebar = true;
          console.log('Sidebar Info:', sideBarInfo);
        } else {
          this.hideHeader = false;
          this.hideSidebar = false;
        }
      });
  }

  getHeaderSidebarQuotaQuickLink() {
    this.sidebarService.getSidebarHeaderExtraInfo().then((data: any) => {
      console.log(data);
      this.currentUserService.headerSidebarExtraInfo.next(data);
    });
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  // ngOnInit(): void {
  //   this.router.events.subscribe((event) => {
  //     if (event instanceof NavigationEnd) {
  //       console.log(event);
  //       const routeToCheck = event.url;
  //       // Check if the current route is /ap-booking/business
  //       const excludeRouteArray = [
  //         '/ap-booking/business',
  //         '/ap-booking/clinic',
  //         '/ap-dashboard/business'
  //       ];

  //       const routeWithoutQueryParams = routeToCheck.split('?')[0]; // Remove query parameters

  //       const isRouteInArray = excludeRouteArray.some(
  //         (route) => route === routeWithoutQueryParams
  //       );

  //       if (!isRouteInArray) {
  //         console.log('The route exists in the excludeRouteArray.');
  //         this.subcscription.add(
  //           combineLatest([
  //             this.currentUserService.currentUserSubject,
  //             this.sidebarService.sideBarInfoSubject
  //           ]).subscribe(([data, sideBarInfo]: [any, any]) => {
  //             this.userData = data;
  //             console.log(
  //               '51',
  //               data,
  //               sideBarInfo,
  //               this.userData && this.userData.idToken && !this.hideSidebar
  //             );
  //             if (
  //               sideBarInfo &&
  //               sideBarInfo?.hideHeader &&
  //               sideBarInfo?.hideSideBar
  //             ) {
  //               this.hideHeader = sideBarInfo?.hideHeader;
  //               this.hideSidebar = sideBarInfo?.hideSideBar;
  //             }

  //             if (data) {
  //               this.sidebarService
  //                 .getBusinessOptimized(data.businessId)
  //                 .then((businessData) => {
  //                   this.businessData = businessData;
  //                   this.localSotrageService.storeItem(
  //                     'businessData',
  //                     businessData
  //                   );
  //                 });

  //               if (data?.supportUser) {
  //                 this.isSupportUser =
  //                   data?.supportUser == 'false' ? false : true;
  //               }
  //               if (this.userData) {
  //                 this.localSotrageService.storeItem(
  //                   'currentUser',
  //                   this.userData
  //                 );
  //               }
  //             }
  //           })
  //         );
  //       }
  //     }
  //   });
  // }

  // ngOnDestroy(): void {
  //   this.subcscription.unsubscribe();
  // }
}
