import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/shared/services/api.service';
import { HttpHelperService } from 'src/app/shared/services/HttpHelperService';

@Injectable({
  providedIn: 'root'
})
export class QuestionarieService {
  constructor(
    private httpHelperService: HttpHelperService,
    private apiService: ApiService
  ) {}

  getAllEmailListOptimized() {
    const apiUrl = '/api/v1/emailTemplates';
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getEmailByQuestionnaire(questionnaireId: any) {
    const apiUrl = '/api/emailtemplates/questionnaire/' + questionnaireId;
    return this.apiService.get(
      apiUrl,
      'Unable to load Questionaries',
      false,
      this.httpHelperService.getTenantHttpOptions(questionnaireId)
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

  getAllQuestionnaireListOptimized() {
    const apiUrl = '/api/v1/questionnaire';
    return this.apiService.get(
      apiUrl,
      'Unable to load Questionaries',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  updateCss(questionnaireId: any, formData: any) {
    const apiUrl = '/api/questionnaire/' + questionnaireId + '/css';
    return this.apiService.put(
      apiUrl,
      formData,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  updateTrackingCode(questionnaireId: any, formData: any) {
    const apiUrl = '/api/questionnaire/' + questionnaireId + '/trackingCode';
    return this.apiService.put(
      apiUrl,
      formData,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  sendQuestionnaireToPatient(patientId: any, questionnaireIds: any) {
    const apiUrl =
      '/api/patient/' +
      patientId +
      '/questionnaire/assign?questionnaireIds=' +
      questionnaireIds;
    return this.apiService.post(
      apiUrl,
      {},
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  createQuestionnaireNotification(questionnaireId: any, notificationForm: any) {
    const apiUrl = '/api/questionnaire/' + questionnaireId + '/notifications';
    return this.apiService.post(
      apiUrl,
      notificationForm,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  fetchQuestionnaireAllNotification(questionnaireId: any) {
    const apiUrl = '/api/questionnaire/' + questionnaireId + '/notifications';
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  deleteQuestionnaireNotification(
    questionnaireId: any,
    notificationId: number
  ) {
    const apiUrl =
      '/api/questionnaire/' +
      questionnaireId +
      '/notifications/' +
      notificationId;
    return this.apiService.delete(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getQuestionnaireNotificationOverId(
    questionnaireId: any,
    notificationId: number
  ) {
    const apiUrl =
      '/api/questionnaire/' +
      questionnaireId +
      '/notifications/' +
      notificationId;
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  updateQuestionnaireNotification(
    questionnaireId: any,
    notificationId: number,
    notificationForm: any
  ) {
    const apiUrl =
      '/api/questionnaire/' +
      questionnaireId +
      '/notifications/' +
      notificationId;
    return this.apiService.put(
      apiUrl,
      notificationForm,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  updateQuestionnaire(questionnaireId: any, questionnaireForm: any) {
    const apiUrl = '/api/questionnaire/' + questionnaireId;
    return this.apiService.put(
      apiUrl,
      questionnaireForm,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  createQuestionnaire(questionnaireForm: any) {
    const apiUrl = '/api/questionnaire';
    return this.apiService.post(
      apiUrl,
      questionnaireForm,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getQuestionnaire(questionnaireId: any) {
    const apiUrl = '/api/questionnaire/' + questionnaireId;
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getQuestions(patientId: number, questionnaireId: number) {
    const apiUrl =
      '/api/patient/' +
      patientId +
      '/questionnaire/' +
      questionnaireId +
      '/questions';
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  createPatientQuestionnaire(patientQuestionnaireForm: any) {
    const apiUrl = '/api/patient/questionnaire';
    return this.apiService.post(
      apiUrl,
      patientQuestionnaireForm,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  updatePatientQuestionnaire(patientQuestionnaireForm: any) {
    const apiUrl = '/api/patient/questionnaire';
    return this.apiService.put(
      apiUrl,
      patientQuestionnaireForm,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }
}
