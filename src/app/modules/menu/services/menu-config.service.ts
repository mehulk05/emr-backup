import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/shared/services/api.service';
import { HttpHelperService } from 'src/app/shared/services/HttpHelperService';

@Injectable({
  providedIn: 'root'
})
export class MenuConfigService {
  constructor(
    private httpHelperService: HttpHelperService,
    private apiService: ApiService
  ) {}

  getDefaultMenus() {
    const apiUrl = '/api/menus/default';
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getDefaultAgencyMenu(agencyId: string) {
    const apiUrl = '/api/admin/menus/default/agency/' + agencyId;
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getBusinessMenus(businessId: any) {
    const apiUrl = '/api/business/new/menu/' + businessId;
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getMenus() {
    const apiUrl = '/api/menus';
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  delete(menuId: number) {
    const apiUrl = '/api/menus/' + menuId;
    return this.apiService.delete(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }
  orderMenu(menuOrder: any) {
    const apiUrl = '/api/menus/order';
    return this.apiService.post(
      apiUrl,
      menuOrder,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  createMenu(menuForm: any) {
    const apiUrl = '/api/menus';
    return this.apiService.post(
      apiUrl,
      menuForm,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  updateMenu(menuId: any, menuForm: any) {
    const apiUrl = '/api/menus/' + menuId;
    return this.apiService.put(
      apiUrl,
      menuForm,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  public updateBusinessMenuV1(businessId: any, menuIds: any) {
    const apiUrl = '/api/v1/business/menu/' + businessId;
    return this.apiService.put(
      apiUrl,
      menuIds,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getMenusForUserOrRole(menuFor: string, userId: string, roleId: string) {
    let url = '/api/menus/for-user-role';
    url = url + '?menuFor=' + menuFor;
    if (menuFor == 'Role') {
      url = url + '&roleId=' + roleId;
    } else if (menuFor == 'User') {
      url = url + '&userId=' + userId;
    }
    return this.apiService.get(
      url,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getdefaultMenuConfiguration(
    menuFor: string,
    userId: string,
    roleId: string,
    businessId: string
  ) {
    let url = '/api/menus/group/defaultconfiguration';
    url = url + '?menuFor=' + menuFor;
    if (menuFor == 'Role') {
      url = url + '&roleId=' + roleId;
    } else if (menuFor == 'User') {
      url = url + '&userId=' + userId;
    }
    url = url + '&businessId=' + businessId;
    return this.apiService.get(
      url,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getGroupMenusForUserOrRole(menuFor: string, userId: string, roleId: string) {
    let url = '/api/menus/group';
    url = url + '?menuFor=' + menuFor;
    if (menuFor == 'Role') {
      url = url + '&roleId=' + roleId;
    } else if (menuFor == 'User') {
      url = url + '&userId=' + userId;
    }
    return this.apiService.get(
      url,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }
}
