import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { HttpHelperService } from './HttpHelperService';

@Injectable({
  providedIn: 'root'
})
export class PersonalizationService {
  constructor(
    private httpHelperService: HttpHelperService,
    private apiService: ApiService
  ) {}

  getQuestionnaireOptimized(questionnaireId: number) {
    const apiUrl = '/api/v1/questionnaire/' + questionnaireId;
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getLeadCaptureFormId() {
    const apiUrl = '/api/v1/questionnaire/lead-capture-form-id';
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  public createQuestionnaire(questionnaireForm: any) {
    const apiUrl = '/api/questionnaire';
    return this.apiService.post(
      apiUrl,
      questionnaireForm,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }
  public updateQuestionnairePersonalization(
    questionnaireId: number,
    questionnaireForm: any
  ) {
    const apiUrl = '/api/questionnaire/' + questionnaireId + '/personalization';
    return this.apiService.put(
      apiUrl,
      questionnaireForm,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }
}
