import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/shared/services/api.service';
import { HttpHelperService } from 'src/app/shared/services/HttpHelperService';
@Injectable({
  providedIn: 'root'
})
export class NotificationCenterService {
  constructor(
    private httpHelperService: HttpHelperService,
    private apiService: ApiService
  ) {}

  updateIntegrationFeature(id: any, formData: any) {
    const apiUrl = '/api/integrations/' + id;
    return this.apiService.put(
      apiUrl,
      formData,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getQuickLinks(userId: any) {
    console.log('userId', userId);
    const apiUrl = '/api/v1/user/' + userId + '/public-url';
    return this.apiService.get(
      apiUrl,
      'Unable to load quick links',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }
}
