import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/shared/services/api.service';
import { HttpHelperService } from 'src/app/shared/services/HttpHelperService';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PublicAccessibleService {
  constructor(
    private httpHelperService: HttpHelperService,
    private apiService: ApiService,
    private httpClient: HttpClient
  ) {}

  getOptimizedLandingPageList(
    id: any,
    page?: number,
    size?: number,
    search?: string
  ) {
    const apiUrl =
      '/api/public/v1/all/landingPage?businessId=' +
      id +
      '&page=' +
      page +
      '&size=' +
      size +
      '&search=' +
      search;
    return this.apiService.get(
      apiUrl,
      '',
      true,
      this.httpHelperService.getTenantHttpOptions(id)
    );
  }

  getLibraryPages(bid: any, page?: number, size?: number, search?: string) {
    const apiUrl =
      '/api/public/admin/landingpages?page=' +
      page +
      '&size=' +
      size +
      '&search=' +
      search;
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions(bid)
    );
  }

  getBusinessData(bid: string) {
    const apiUrl = '/api/public/v1/businesses/' + bid;
    return this.apiService.get(
      apiUrl,
      '',
      true,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getReportForClinicReviews(key: string) {
    return this.httpClient.get(
      environment.G99_REVIEW_MANAGER_API_URL +
        '/review-mgr/get/report/page/?data=' +
        key
    );
  }

  getFormQuestionnaire(bid: String, fid: string) {
    const apiUrl = '/api/public/questionnaire/' + fid;
    return this.apiService.get(
      apiUrl,
      '',
      true,
      this.httpHelperService.getTenantHttpOptions(bid)
    );
  }

  saveAnswer(bid: String, fid: string, email: string, answer: any) {
    const apiUrl = `/api/public/v2/questionnaire/${bid}/${fid}/${email}`;
    return this.apiService.post(
      apiUrl,
      answer,
      '',
      true,
      this.httpHelperService.getTenantHttpOptions(bid)
    );
  }

  getAnswers(bid: string, fid: string, email: string) {
    const apiUrl = `/api/public/v2/questionnaire/${bid}/${fid}/${email}`;
    return this.apiService.get(
      apiUrl,
      '',
      true,
      this.httpHelperService.getTenantHttpOptions(bid)
    );
  }

  deleteAnswers(bid: string, fid: string, email: string) {
    const apiUrl = `/api/public/v2/questionnaire/${bid}/${fid}/${email}`;
    return this.apiService.delete(
      apiUrl,
      '',
      true,
      this.httpHelperService.getTenantHttpOptions(bid)
    );
  }

  saveFile(
    bid: string,
    formSubmissionId: number,
    questionId: number,
    formData: any
  ) {
    const apiUrl = `/api/public/form-submission/${formSubmissionId}/question/${questionId}/uploadfile`;
    return this.apiService.post(
      apiUrl,
      formData,
      '',
      true,
      this.httpHelperService.getTenantHttpOptions(bid)
    );
  }

  deleteFile(
    bid: string,
    formSubmissionId: number,
    questionId: number,
    keyPart: string
  ) {
    const apiUrl = `/api/public/form-submission/${formSubmissionId}/question/${questionId}/keyPart/${keyPart}`;
    return this.apiService.delete(
      apiUrl,
      '',
      true,
      this.httpHelperService.getTenantHttpOptions(bid)
    );
  }

  submitForm(bid: string, fid: string, formData: any) {
    const apiUrl = `/api/public/questionnaire/${fid}`;
    return this.apiService.post(
      apiUrl,
      formData,
      '',
      true,
      this.httpHelperService.getTenantHttpOptions(bid)
    );
  }

  deleteFormSubmission(bid: string, formSubmissionId: number) {
    const apiUrl = `/api/public/v2/questionnaire/${formSubmissionId}`;
    return this.apiService.delete(
      apiUrl,
      '',
      true,
      this.httpHelperService.getTenantHttpOptions(bid)
    );
  }

  getSpecializations(bid: string) {
    const apiUrl = `/api/public/specializations`;
    return this.apiService.get(
      apiUrl,
      '',
      true,
      this.httpHelperService.getTenantHttpOptions(bid)
    );
  }

  getSpecializationServices(bid: string, specializationId: any) {
    const apiUrl = `/api/public/specialization/${specializationId}`;
    return this.apiService.get(
      apiUrl,
      '',
      true,
      this.httpHelperService.getTenantHttpOptions(bid)
    );
  }
}
