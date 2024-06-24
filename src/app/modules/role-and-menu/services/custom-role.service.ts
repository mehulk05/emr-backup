import { Injectable } from '@angular/core';
import { HttpHelperService } from 'src/app/shared/services/HttpHelperService';
import { ApiService } from 'src/app/shared/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class CustomRoleService {
  constructor(
    private httpHelperService: HttpHelperService,
    private apiService: ApiService
  ) {}

  getAllRoles() {
    return this.apiService.get(
      '/api/roles',
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  createRole(payload: any) {
    return this.apiService.post(
      '/api/roles',
      payload,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getUserMenuByRoleandUserId(userId: any, roleName: string) {
    const apiUrl =
      '/api/new/menus/user?roleName=' + roleName + '&userId=' + userId;
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }
}
