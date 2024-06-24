import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/shared/services/api.service';
import { HttpHelperService } from 'src/app/shared/services/HttpHelperService';

@Injectable({
  providedIn: 'root'
})
export class IntegrationService {
  constructor(
    private httpHelperService: HttpHelperService,
    private apiService: ApiService
  ) {}

  getIntegrationFeature() {
    const apiUrl = '/api/public/integrations';
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  createIntegrationFeature(formData: any) {
    const apiUrl = '/api/integrations';
    return this.apiService.post(
      apiUrl,
      formData,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

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

  getDefaultChatbot(businessId: any) {
    const apiUrl = '/api/public/chatbottemplates/default';
    return this.apiService.get(
      apiUrl,
      'Unable to load quick links',
      true,
      this.httpHelperService.getTenantHttpOptions(businessId)
    );
  }

  getDefaultQuickLink(bid: any) {
    const apiUrl = '/api/business/quicklinks';
    return this.apiService.get(
      apiUrl,
      'Unable to load quick links',
      false,
      this.httpHelperService.getTenantHttpOptions(bid)
    );
  }

  getLeadCaptureForm() {
    const apiUrl = '/api/questionnaire/lead-capture-form';
    return this.apiService.get(
      apiUrl,
      'Unable to load Questionaries',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }
}
