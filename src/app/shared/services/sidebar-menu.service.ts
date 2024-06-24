import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ApiService } from './api.service';
import { HttpHelperService } from './HttpHelperService';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  currentUrlSubject = new BehaviorSubject('');
  sideBarInfoSubject = new BehaviorSubject(null);
  public openSidebar = new BehaviorSubject<boolean>(true);
  breadCrumbFromComponent = new BehaviorSubject(null);

  constructor(
    private httpHelperService: HttpHelperService,
    private apiService: ApiService
  ) {}

  getMenus() {
    const apiUrl = '/api/menus';
    return this.apiService.get(apiUrl, '', false, {});
  }

  getUserMenus(userId: any, roleName: string) {
    const apiUrl = '/api/menus/user?roleName=' + roleName + '&userId=' + userId;
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getNewUserMenus(userId: any, roleName: string) {
    const apiUrl =
      '/api/new/menus/user?roleName=' + roleName + '&userId=' + userId;
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getPublicBusinessOptimized(businessId: any) {
    const apiUrl = '/api/public/v1/businesses/' + businessId;
    return this.apiService.get(
      apiUrl,
      '',
      true,
      this.httpHelperService.getTenantHttpOptions(businessId)
    );
  }

  public getEmailSmsCount() {
    const url = '/api/v1/audit/email-sms/count';
    return this.apiService.get(
      url,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  public getAgencyConfiguration(agencyId: any) {
    const apiUrl = '/api/platform-configurations/agency/' + agencyId;
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getSidebarHeaderExtraInfo() {
    const apiUrl = '/api/v1/business/email-sms/quota-count';
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }
}
