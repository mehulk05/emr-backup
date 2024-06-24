import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../../../models/user/user';
import { AuthService } from 'src/app/modules/authentication/services/auth.service';
import { currentUserService } from 'src/app/modules/authentication/services/current-user.service';
import { LocalStorageService } from '../../../services/local-storage.service';
import { MenuService } from '../../../services/sidebar-menu.service';
import { Subscription } from 'rxjs';
import { Store } from '@ngxs/store';
import { SetSideBarData } from 'src/app/shared/store-management/store/general-states/general-state.action';
import { cloneDeep, isEqual } from 'lodash';
import { LoggerService } from 'src/app/shared/services/logger.service';
import { distinctUntilChanged, filter } from 'rxjs/operators';
import { BusinessService } from 'src/app/modules/account-and-settings/business/services/business.service';

@Component({
  selector: 'app-new-sidebar3',
  templateUrl: './new-sidebar3.component.html',
  styleUrls: ['./new-sidebar3.component.css']
})
export class NewSidebar3Component implements OnInit, OnDestroy {
  currentUserSubcription: any = new Subscription();
  currentUserInfo!: User;
  menuList: any;
  sortedMenuList: any;
  activeMenu: any;

  // isSupportUser: boolean | string = false;
  businessData: any;
  activeMenuIndex: number = 0;
  currentPagePath = '/';
  isPatientRole: boolean;
  agencyLogoUrl: any;
  showNewSidebar: boolean = false;
  privacyPolicy: any;
  termaAndConditions: any;
  public isSidebarOpened: boolean = true;
  mouseEnterDiv = false;
  prevItem: any;
  @ViewChild('op') op: any;
  @ViewChild('op1') op1: any;

  NoteClassMap: any = NoteClassMap;

  patientMenuList = patientMenuList;
  agencyConfig: any;
  constructor(
    private store: Store,
    private currentUserService: currentUserService,
    private localStorageService: LocalStorageService,
    private menuService: MenuService,
    private router: Router,
    private authService: AuthService,
    private loggerService: LoggerService,
    private activatedRoute: ActivatedRoute,
    private businessService: BusinessService
  ) {}

  hide(op: any, item: any) {
    if (!this.prevItem || this.prevItem.displayName != item.displayName) {
      op.hide();
      this.prevItem = item;
    }
  }

  ngOnInit(): void {
    this.currentUserSubcription.add(
      this.currentUserService.currentUserSubject
        .pipe(distinctUntilChanged(isEqual))
        .subscribe((data: any) => {
          this.currentUserInfo = data;
          console.log('mehul', data);
          if (this.currentUserInfo && this.currentUserInfo.businessId) {
            this.getSidebarData();
            this.loadBusinessData();
            this.loadBusiness();
            // this.loadSentSmsEmailInCurrentMonth();
          } else {
            console.log('no user found');
          }
        })
    );

    this.currentPagePath = window.location.pathname;
    this.currentUserSubcription.add(
      this.menuService.currentUrlSubject.subscribe((data) => {
        this.currentPagePath = data;
      })
    );
    // this.loadPlatformData();
    // this.authService.businessInofChange
    //   .pipe(distinctUntilChanged(isEqual))
    //   .subscribe((data) => {
    //     console.log('===========', data);
    //     if (data) {
    //       this.setUpdatedBuisnessInfo(data);
    //     } else {
    //       this.loadBusinessData();
    //     }
    //   });

    this.activatedRoute.queryParams.subscribe((params: any) => {
      this.showNewSidebar = params?.showNewSidebar;
    });

    this.currentUserSubcription.add(
      this.authService.isSidebarChanged.subscribe((data) => {
        if (data != null) {
          console.log(
            '🚀 ~ file: new-sidebar3.component.ts:84 ~ NewSidebar3Component ~ this.authService.isSidebarChanged.subscribe ~ data:',
            data
          );
          this.getSidebarData();
        }
      })
    );
  }

  toggleSideBar() {
    const ele: any = document.getElementById('collapseNavMenu');
    // $('.main-container').toggleClass('sidebarCollapse');
    this.isSidebarOpened = !this.isSidebarOpened;
    if (ele) {
      ele.style['padding-left'] = this.isSidebarOpened ? '250px' : '80px';
    }
    this.menuService.openSidebar.next(this.isSidebarOpened);
  }

  getSidebarData() {
    if (this.currentUserInfo?.roles === 'Patient') {
      this.isPatientRole = true;
    }

    this.menuList = this.localStorageService.readStorage('sidebarData') ?? [];

    if (this.menuList.length > 0) {
      this.store.dispatch(new SetSideBarData(cloneDeep(this.menuList)));
      this.sortLevl1MenuByOrder();
    } else {
      console.log(
        '🚀 ~ file: new-sidebar3.component.ts:110 ~ NewSidebar3Component ~ getSidebarData ~ ̥:'
      );
      this.menuService
        .getNewUserMenus(this.currentUserInfo.id, this.currentUserInfo.roles)
        .then((res) => {
          this.menuList = res;
          this.store.dispatch(new SetSideBarData(res));
          this.localStorageService.storeItem('sidebarData', res);
          this.sortLevl1MenuByOrder();
        });
    }
  }

  sortLevl1MenuByOrder() {
    this.sortMenuByChildLevels();
  }

  sortMenuByChildLevels() {
    //If both assessments checkboxes are selected from super admin business then enable this group.
    this.hideAssessmentGroupMenu();

    const menuList = cloneDeep(this.menuList);

    menuList.sort(
      (a: any, b: any) =>
        (a.position !== undefined ? a.position : Number.MAX_SAFE_INTEGER) -
        (b.position !== undefined ? b.position : Number.MAX_SAFE_INTEGER)
    );

    this.sortedMenuList = menuList;
    this.sortMenuByItems();
  }

  hideAssessmentGroupMenu() {
    console.log('START hideAssessmentGroupMenu');
    const bdData: any = this.localStorageService.readStorage('businessInfo');
    console.log('dentalSpecializationOnly' + bdData?.dentalSpecializationOnly);
    console.log('otherSpecialization' + bdData?.otherSpecialization);

    if (bdData?.dentalSpecializationOnly && bdData?.otherSpecialization) {
      console.log('IF hideAssessmentGroupMenu');
      this.menuList = this.menuList.filter((menu: any) => {
        return !(menu.name === 'Self Assessment' && menu.menuType === 'Menu');
      });
    } else {
      console.log('Else hideAssessmentGroupMenu');
      this.menuList = this.menuList.filter((menu: any) => {
        return !(menu.name === 'Self Assessment' && menu.menuType === 'Group');
      });
    }
    console.log('END hideAssessmentGroupMenu');
  }

  sortMenuByItems() {
    this.sortedMenuList.forEach((item: any) => {
      item?.groupItems?.forEach((group: any) => {
        group?.items?.sort(
          (a: any, b: any) =>
            (a?.position !== undefined ? a.position : Number.MAX_SAFE_INTEGER) -
            (b?.position !== undefined ? b.position : Number.MAX_SAFE_INTEGER)
        );
      });
    });
    this.sortedMenuList.forEach((item: any) => this.sortMenu(item));
  }

  sortMenu(menu: { menuType: string; groupItems: any[]; items: any[] }) {
    if (menu.menuType === 'Header') {
      menu.groupItems.sort(
        (a: any, b: any) =>
          (a.position !== undefined ? a.position : Number.MAX_SAFE_INTEGER) -
          (b.position !== undefined ? b.position : Number.MAX_SAFE_INTEGER)
      );
    } else if (menu.menuType === 'Group') {
      menu.items.sort(
        (a: any, b: any) =>
          (a.position !== undefined ? a.position : Number.MAX_SAFE_INTEGER) -
          (b.position !== undefined ? b.position : Number.MAX_SAFE_INTEGER)
      );
    }

    if (menu.items != null && menu.items.length > 0) {
      menu.items.forEach((item: any) => this.sortMenu(item));
    }
  }

  // sortMenuByChildLevels() {
  //   const menuList = cloneDeep(this.menuList);
  //   menuList.sort((a: any, b: any) => {
  //     return a.position - b.position;
  //   });

  //   for (let i = 0; i < menuList.length; i++) {
  //     this.sortMenu(menuList[i]);
  //   }
  //   // menuList = menuList.filter((menu: any) => menu.groupMenu == null);

  //   menuList.sort((a: any, b: any) => {
  //     const aOrder =
  //       a.position !== undefined ? a.position : Number.MAX_SAFE_INTEGER;
  //     const bOrder =
  //       b.position !== undefined ? b.position : Number.MAX_SAFE_INTEGER;
  //     return aOrder - bOrder;
  //   });
  //   this.sortedMenuList = menuList;

  //   this.sortMenuByItems();
  // }

  // sortMenuByItems() {
  //   this.sortedMenuList.forEach((item: any) => {
  //     item?.groupItems?.forEach((group: any) => {
  //       group?.items?.sort((a: any, b: any) => a?.position - b?.position);
  //     });
  //   });
  // }

  // sortMenu(menu: any) {
  //   if (menu.menuType == 'Header') {
  //     menu.groupItems.sort((a: any, b: any) => {
  //       return a.position - b.position;
  //     });
  //   } else if (menu.menuType == 'Group') {
  //     menu.items.sort((a: any, b: any) => {
  //       return a.position - b.position;
  //     });
  //   }

  //   if (menu.items != null && menu.items.length > 0) {
  //     for (let i = 0; i < menu.items.length; i++) {
  //       this.sortMenu(menu.items[i]);
  //     }
  //   }
  // }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars

  navSubItem(subItem: any) {
    this.addActiveClass(subItem);
    this.toggleSubMenu(subItem, null);
  }

  toggleSubMenu(item: any, menuItem: any) {
    console.log(menuItem);
    // item.collapsed = !item.collapsed;
    this.activeMenu = item?.displayName;
    // item.collapseTriggered = true;

    if (item.routerLink) {
      const url = this.router.createUrlTree([item.routerLink]);
      const bdData: any = this.localStorageService.readStorage('businessInfo');
      if (
        bdData?.dentalSpecializationOnly &&
        item.menuType === 'Menu' &&
        (item.name === 'Dental Advisor' || item.name === 'Self Assessment')
      ) {
        console.log('If Dental ' + url.toString() + '?dental=true');
        this.router.navigateByUrl(url.toString() + '?dental=true');
      } else {
        console.log('Else Aesthetics ' + url.toString());
        this.router.navigateByUrl(url.toString());
      }
    }
  }

  addActiveClass(item: any) {
    this.activeMenu = item?.displayName;
  }

  loadBusiness() {
    this.businessService
      .getBusinessOptimized(this.currentUserInfo.businessId)
      .then((response: any) => {
        console.log(this.currentUserInfo);
        console.log(response);
        if (this.currentUserInfo.businessId) {
          this.businessData.name = response.name;
          this.businessData.logoUrl = response.logoUrl;
          this.businessData.contactSupportEmail = response.contactSupportEmail;
          this.businessData.contactSupportLink = response.contactSupportLink;
        }
        this.businessData.termsAndConditions = response.termsAndConditions;
        this.termaAndConditions = response.termsAndConditions;
        this.businessData.agencyLogoUrl = response.agency.logoUrl;
        this.agencyLogoUrl = response.agency.logoUrl;
        this.businessData.privacyPolicy = response.privacyPolicy;
        this.privacyPolicy = response.privacyPolicy;

        this.localStorageService.storeItem(
          'businessData',
          this.currentUserInfo
        );
        // this.localStorageService.storeItem(
        //   'businessInfo',
        //   this.currentUserInfo
        // );
      });
  }

  async loadBusinessData() {
    this.authService.currentBusinessSubject
      .pipe(filter((data: any) => data !== null))
      .subscribe((data) => {
        console.log(data);
        this.businessData = data;
        this.loadAgencyConfigData();
      });

    console.log(this.businessData?.logoUrl);

    // Set logo and agencyLogoUrl regardless of the data source.
  }

  loadAgencyConfigData() {
    if (this.businessData?.agency?.id) {
      this.agencyConfig = this.businessData?.agency;
      this.agencyLogoUrl =
        this.businessData?.agency?.logoUrl ||
        'https://g99plus.b-cdn.net/AA%20new%20g99%20app/images/g99%20full%20logo.svg';
    }
  }

  ngOnDestroy(): void {
    this.currentUserSubcription?.unsubscribe();
  }
}

enum NoteType {
  New = 'new',
  None = 'none',
  Beta = 'beta',
  Upcoming = 'upcoming',
  Updated = 'updated'
}

export const NoteClassMap = {
  [NoteType.New]: 'new',
  [NoteType.None]: 'none',
  [NoteType.Beta]: 'beta',
  [NoteType.Upcoming]: 'upcoming',
  [NoteType.Updated]: 'updated'
};

export const patientMenuList = [
  {
    icon: 'fab fa-windows',
    routerLink: '/patient-portal/patient/dashboard',
    displayName: 'Dashboard',
    menuNote: ''
  },
  {
    icon: 'far fa-user',
    routerLink: '/patient-portal/patient/profile',
    displayName: 'Profile',
    menuNote: ''
  },
  {
    icon: 'far fa-check-square',
    routerLink: '/patient-portal/myappointments',
    displayName: 'Appointments',
    menuNote: ''
  },
  {
    icon: 'fa-unlock-alt fas',
    routerLink: '/patient-portal/patient/change-password',
    displayName: 'Change Password',
    menuNote: ''
  }
];
