import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/shared/services/api.service';
import { HttpHelperService } from 'src/app/shared/services/HttpHelperService';

@Injectable({
  providedIn: 'root'
})
export class QuestionariePageService {
  constructor(
    private httpHelperService: HttpHelperService,
    private apiService: ApiService
  ) {}

  getAllQuestionnaireListOptimized() {
    const apiUrl = '/api/v1/questionnaire';
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getAllQuestionnaireListOptimizedOfType(type: any) {
    const apiUrl = '/api/v1/questionnaire/type?type=' + type;
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getAllQuestionnaireList() {
    const apiUrl = '/api/v1/trigger/questionnaire';
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  deleteQuestionarie(id: any) {
    const apiUrl = '/api/questionnaire/' + id;
    return this.apiService.delete(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getAllQuestionnaireListBusinessId(id: any) {
    const apiUrl =
      '/api/questionnaire/questionnaire-submissions/businessId/' + id;
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getSupportCenter(id: any) {
    const apiUrl = '/api/questionnaire/support-center/' + id;
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }
}
