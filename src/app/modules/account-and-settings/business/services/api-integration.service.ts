import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/shared/services/api.service';
import { HttpHelperService } from 'src/app/shared/services/HttpHelperService';

@Injectable({
  providedIn: 'root'
})
export class ApiIntegrationService {
  constructor(
    private httpHelperService: HttpHelperService,
    private apiService: ApiService
  ) {}

  disableAestheticRecords(id: any, value: any) {
    const apiUrl =
      '/api/api-integrations/pull/enable?id=' + id + '&disable=' + value;
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  saveApiIntegrationRecords(formData: any) {
    const apiUrl = '/api/api-integrations/pull';
    return this.apiService.post(
      apiUrl,
      formData,
      'Unable to update API integration information',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getApiIntegrationRecords(type: any) {
    const apiUrl = '/api/api-integrations/pull?type=' + type;
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getApiIntegrationRecordsActive() {
    const apiUrl = '/api/api-integrations/pull/active';
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getApiIntegrationStatus() {
    const apiUrl = '/api/api-integrations/pull/status';
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getApiIntegrationHistoryCountRecords(type: any) {
    const apiUrl = '/api/api-integrations/pull/histories/count?type=' + type;
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getApiIntegrationHistoryRecords(type: any, page: any, size: any) {
    const apiUrl =
      '/api/api-integrations/pull/histories?type=' +
      type +
      '&page=' +
      page +
      '&size=' +
      size;
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  callAestheticRecords(type: any, formData: any, id: any) {
    const apiUrl =
      '/api/api-integrations/pull/thirdParty?id=' + id + '&type=' + type;
    return this.apiService.post(
      apiUrl,
      formData,
      'Unable to update Api Aesthetic records information',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }
}
