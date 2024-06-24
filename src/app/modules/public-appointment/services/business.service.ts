import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/shared/services/api.service';
import { HttpHelperService } from 'src/app/shared/services/HttpHelperService';

@Injectable({
  providedIn: 'root'
})
export class BusinessService {
  constructor(
    private httpHelperService: HttpHelperService,
    private apiService: ApiService
  ) {}

  getPublicBusinessOptimized(businessId: any) {
    const apiUrl = '/api/public/v1/businesses/' + businessId;
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions(businessId)
    );
  }

  getPublicQuestionnaireFromLandingPageId(bid: any, lpid: any) {
    const apiUrl = '/api/public/landingpage/' + lpid;
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions(bid)
    );
  }

  getPublicQuestionnaireOptimized(businessId: number) {
    const apiUrl = '/api/public/v1/questionnaire';
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions(businessId)
    );
  }

  getSyndicationReport() {
    const apiUrl = '/api/syndicationReports';
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }
}
