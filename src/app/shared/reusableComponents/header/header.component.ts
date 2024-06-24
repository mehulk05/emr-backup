import { Component, OnDestroy, OnInit } from '@angular/core';
// import * as $ from 'jquery';

import { Subscription } from 'rxjs';
import { MenuService } from '../../services/sidebar-menu.service';
import { distinctUntilChanged } from 'rxjs/operators';
import { isEqual } from 'lodash';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../modules/authentication/services/auth.service';
import { LocalStorageService } from '../../services/local-storage.service';
import { currentUserService } from '../../../modules/authentication/services/current-user.service';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  messages: any[] = [];
  userProfile: any;
  firstName: any;
  subscription: Subscription;
  businessId: any;
  isSidebarOpen: boolean = true;
  currentUser: any;
  businessData: any;
  agencyLogoUrl: any;
  constructor(
    private localStorageService: LocalStorageService,
    private authService: AuthService,
    private readonly menuService: MenuService,
    private currentUserService: currentUserService
  ) {
    this.subscription = this.authService.getMessage().subscribe((message) => {
      if (message) {
        this.userProfile = message.message;
        if (this.userProfile.businessId) {
          this.businessId = this.userProfile?.businessId;
        }
        this.messages.push(message);
      } else {
        this.messages = [];
      }
    });

    this.currentUserService.currentUserSubject
      .pipe(distinctUntilChanged(isEqual))
      .subscribe((data: any) => {
        this.currentUser = data;
        console.log('aheader', data);
        if (data) {
          this.businessId = data.businessId;
          this.getBusinessData();
        }
      });
  }

  toggleSideBar() {
    const ele: any = document.getElementById('collapseNavMenu');
    // $('.main-container').toggleClass('sidebarCollapse');
    this.isSidebarOpen = !this.isSidebarOpen;
    if (ele) {
      ele.style['padding-left'] = this.isSidebarOpen ? '250px' : '80px';
    }
    this.menuService.openSidebar.next(this.isSidebarOpen);
  }
  ngOnInit() {
    this.loadUserData();
    if (!this.userProfile) {
      this.loadUserDataByApi();
    }
  }

  loadUserData() {
    this.userProfile = this.localStorageService.readStorage('currentUser');
  }

  loadUserDataByApi() {
    // this.authService.currentUserSubject.subscribe((data: any) => {
    // });
  }

  gotoOldUI() {
    const dataToSend: any = this.localStorageService.readStorage('currentUser');
    // environment.BOOKING_DOMAIN_URL
    const url: any =
      // 'http://localhost:4201' +
      environment.BOOKING_DOMAIN_URL +
      '/login?token=' +
      dataToSend?.idToken +
      '&bid=' +
      dataToSend?.businessId +
      '&userId=' +
      dataToSend.id +
      '&roles=' +
      dataToSend.roles +
      '&profileImageUrl=' +
      dataToSend?.profileImageUrl +
      '&supportUser=' +
      dataToSend?.supportUser;
    // console.log("url", url);
    window.open(url, '_self');
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  getBusinessData() {
    const bdData: any = this.localStorageService.readStorage('businessData');
    console.log('getBusinessData', bdData);
    this.businessData = bdData;
    if (this.businessData) {
      this.agencyLogoUrl =
        this.businessData?.agency?.logoUrl ??
        'https://g99plus.b-cdn.net/AA%20new%20g99%20app/images/g99%20full%20logo.svg';
    }
  }
}
