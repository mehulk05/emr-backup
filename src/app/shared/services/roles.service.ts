import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { HttpHelperService } from './HttpHelperService';

@Injectable({
  providedIn: 'root'
})
export class RolesService {
  constructor(
    private httpHelperService: HttpHelperService,
    private apiService: ApiService
  ) {}

  getOptimizedRoles() {
    const apiUrl = '/api/v1/roles';
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getQuickLinks(userId: any) {
    const apiUrl = '/api/v1/user/' + userId + '/public-url';
    return this.apiService.get(
      apiUrl,
      'Unable to load quick links',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getDefaultQuickLinks(bid: any) {
    const apiUrl = '/api/public/business/' + bid + '/urls';
    return this.apiService.get(
      apiUrl,
      'Unable to load quick links',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getPublicUrls(bid: any) {
    const apiUrl = '/api/public/business/' + bid + '/urls';
    return this.apiService.get(
      apiUrl,
      'Unable to load quick links',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getDefaultChatbot(businessId: any) {
    const apiUrl = '/api/public/chatbottemplates/default';
    return this.apiService.get(
      apiUrl,
      'Unable to load quick links',
      true,
      this.httpHelperService.getTenantHttpOptions(businessId)
    );
  }

  getOptimziedUser(userId: number) {
    const apiUrl = '/api/v1/user/' + userId;
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getDefaultCinicOptimized() {
    const apiUrl = '/api/public/clinics/default';
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }
}
