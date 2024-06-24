import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/shared/services/api.service';
import { HttpHelperService } from 'src/app/shared/services/HttpHelperService';

@Injectable({
  providedIn: 'root'
})
export class LeadSourceurlService {
  constructor(
    private httpHelperService: HttpHelperService,
    private apiService: ApiService
  ) {}

  leadSourceUrlList() {
    const apiUrl = '/api/leadsourceurls/list';
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  deleteById(id: any) {
    const apiUrl = '/api/leadsourceurls/' + id;
    return this.apiService.delete(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  create(formData: any) {
    const apiUrl = '/api/leadsourceurls';
    return this.apiService.post(
      apiUrl,
      formData,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  get(id: any) {
    const apiUrl = '/api/leadsourceurls/' + id;
    return this.apiService.get(
      apiUrl,
      'Unable to load Questionaries',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  update(id: any, formData: any) {
    const apiUrl = '/api/leadsourceurls/' + id;
    return this.apiService.put(
      apiUrl,
      formData,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  list() {
    const apiUrl = '/api/leadsourceurls/list';
    return this.apiService.get(
      apiUrl,
      'Unable to load Questionaries',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }
}
