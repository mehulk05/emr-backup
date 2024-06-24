import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import moment from 'moment';
import { HttpHelperService } from 'src/app/shared/services/HttpHelperService';
import { ApiService } from 'src/app/shared/services/api.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FiveStarViewService {
  constructor(
    private httpHelperService: HttpHelperService,
    private apiService: ApiService,
    private httpClient: HttpClient
  ) {}

  getClinics() {
    const apiUrl = '/api/v1/clinics/allClinics';
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getSingleClinic(clinicId: number) {
    const apiUrl = '/api/clinics/' + clinicId;
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getClinicReview(clinicId: number) {
    const apiUrl = '/api/clinic/' + clinicId + '/clinicreview';
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getClinicReviewReport(clinicId: number) {
    const apiUrl = '/api/clinic/' + clinicId + '/clinicreview/report';
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getClinicReviewAnalytics(clinicId: number) {
    const apiUrl = '/api/clinic/' + clinicId + '/clinicreview/analytics';
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  scrapClinic(clinicId: number) {
    const apiUrl = '/api/clinic/' + clinicId + '/scrap';
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getClinicReviewStatus(clinicId: number) {
    const apiUrl = '/api/clinic/' + clinicId + '/clinicreview/status';
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getDefaultCinic() {
    const apiUrl = '/api/clinics/default';
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getDefaultCinicOptimized() {
    const apiUrl = '/api/v1/clinics/default';
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  saveReportIntervalForClinic(
    days: any,
    date: Date,
    cid: string,
    reportNumber: number,
    reportType: String
  ) {
    var path;
    if (date) {
      path =
        days +
        '?id=' +
        cid +
        '&next_report_date=' +
        moment(date).format('YYYY-MM-DD') +
        '&report_type=' +
        reportType +
        '&report_number=' +
        reportNumber;
    } else {
      path =
        days +
        '?id=' +
        cid +
        '&next_report_date=&report_type=' +
        reportType +
        '&report_number=' +
        reportNumber;
    }
    return this.httpClient.put(
      environment.G99_REVIEW_MANAGER_API_URL +
        '/review-mgr/clinicProperty/update/' +
        path,
      {}
    );
  }

  getClinicProperties(cid: string) {
    return this.httpClient.get(
      environment.G99_REVIEW_MANAGER_API_URL +
        '/review-mgr/clinicProperty/get?id=' +
        cid
    );
  }

  getClinicReviews(cid: string, pageNo: number) {
    return this.httpClient.get(
      environment.G99_REVIEW_MANAGER_API_URL +
        `/review-mgr/fetch/review/${pageNo}?id=${cid}`
    );
  }

  searchClinicReviews(cid: string, searchText: string, pageNo: any) {
    return this.httpClient.post(
      environment.G99_REVIEW_MANAGER_API_URL +
        `/review-mgr/search/reviews/${cid}/${pageNo}?searchText=${searchText}`,
      {}
    );
  }

  toggleHideReview(cid: string, value: any, review: any) {
    return this.httpClient.post(
      environment.G99_REVIEW_MANAGER_API_URL +
        `/review-mgr/hide/reviews/${cid}/${value}`,
      review
    );
  }

  updateReview(cid: string, review: any) {
    return this.httpClient.post(
      environment.G99_REVIEW_MANAGER_API_URL +
        `/review-mgr/edit/reviews/${cid}`,
      review
    );
  }

  addReview(cid: string, review: any) {
    return this.httpClient.post(
      environment.G99_REVIEW_MANAGER_API_URL + `/review-mgr/${cid}/reviews/add`,
      review
    );
  }

  updateClinicG99ReviewSetting(clinicId: any, clinicForm: any) {
    const apiUrl = '/api/clinicreview/' + clinicId;
    if (clinicId) {
      return this.apiService.put(
        apiUrl,
        clinicForm,
        '',
        false,
        this.httpHelperService.getTenantHttpOptions()
      );
    }
    return new Promise<void>((resolve) => {
      resolve(); // Resolving with no value, indicating an empty promise
    });
  }

  updateIframeCss(clinicReviewId: any, formData: any) {
    const apiUrl = '/api/clinic/clinicreview/' + clinicReviewId + '/iframecss';
    return this.apiService.put(
      apiUrl,
      formData,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  updateLandingPageCss(clinicReviewId: any, formData: any) {
    const apiUrl =
      '/api/clinic/clinicreview/' + clinicReviewId + '/landingpagecss';
    return this.apiService.put(
      apiUrl,
      formData,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  updateClinic(clinicId: any, clinicForm: any) {
    if (clinicId) {
      const apiUrl = '/api/clinics/' + clinicId;
      return this.apiService.put(
        apiUrl,
        clinicForm,
        '',
        false,
        this.httpHelperService.getTenantHttpOptions()
      );
    }
    return new Promise<void>((resolve) => {
      resolve(); // Resolving with no value, indicating an empty promise
    });
  }
}
