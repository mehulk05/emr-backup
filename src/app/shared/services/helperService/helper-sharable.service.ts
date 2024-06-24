import { Injectable } from '@angular/core';
import { ApiService } from '../api.service';
import { HttpHelperService } from '../HttpHelperService';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HelperSharableService {
  constructor(
    private apiService: ApiService,
    private httpHelperService: HttpHelperService,
    private httpClient: HttpClient
  ) {}

  getDefaultCinic() {
    const apiUrl = '/api/public/clinics/default';
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getDefaultCinicV1() {
    const apiUrl = '/api/v1/clinics/default';
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getPublicDefaultCinicV1() {
    const apiUrl = '/api/public/v1/clinics/default';
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getClinicDefaultByBid(bid: any) {
    const apiUrl = '/api/public/business/' + bid + '/clinics/default';
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getQuestionnairesByType(type: any) {
    const apiUrl = `/api/v1/questionnaire/by-type?type=${type}`;
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  searchClinicReviews(clinicId: string, searchText: string, pageNo: any) {
    return this.httpClient.post(
      environment.G99_REVIEW_MANAGER_API_URL +
        `/review-mgr/search/reviews/${clinicId}/${pageNo}?searchText=${searchText}`,
      {}
    );
  }

  uploadEditorAsset(formData: any) {
    const apiUrl = `/api/editor/assets`;
    return this.apiService.post(
      apiUrl,
      formData,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getEditorAssets() {
    const apiUrl = `/api/editor/assets`;
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }
}
