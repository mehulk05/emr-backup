import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/shared/services/api.service';
import { HttpHelperService } from 'src/app/shared/services/HttpHelperService';

@Injectable({
  providedIn: 'root'
})
export class DeletedLeadService {
  constructor(
    private httpHelperService: HttpHelperService,
    private apiService: ApiService
  ) {}

  getLeadsWithFilterParams(page: any, size: any) {
    const apiUrl =
      '/api/questionnaire-submission/history/pagination?page=' +
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

  convertToLeads(leadIds: any) {
    const apiUrl = '/api/questionnaire-submissions/history/mass-convert';
    return this.apiService.put(
      apiUrl,
      leadIds,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getLeadsWithSearchParam(page: any, size: any, search?: string) {
    const apiUrl =
      '/api/questionnaire-submission/history/search?page=' +
      page +
      '&size=' +
      size +
      '&search=' +
      search;
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }
}
