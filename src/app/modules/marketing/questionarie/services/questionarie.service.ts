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

  getAllQuestionnaireSubmissionById(questionnaireId: number) {
    const apiUrl =
      '/api/questionnaire/' + questionnaireId + '/questionnaire-submissions';
    return this.apiService.get(
      apiUrl,
      'Unable to load questionaries',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getQuestionAnswers(questionnaireSubmissionId: number) {
    const apiUrl =
      '/api/questionnaire/questionnaire-submissions/' +
      questionnaireSubmissionId;
    return this.apiService.get(
      apiUrl,
      'Unable to load question answers',
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
      this.httpHelperService.getTenantHttpOptions()
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

  getAllQuestionById(questionnaireId: number) {
    const apiUrl = '/api/questionnaire/' + questionnaireId + '/questions';
    return this.apiService.get(
      apiUrl,
      'Unable to load questionaries',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  deleteQuestion(questionnaireId: number, questionId: number) {
    const apiUrl =
      '/api/questionnaire/' + questionnaireId + '/questions/' + questionId;
    return this.apiService.delete(
      apiUrl,
      'Unable to delete questionaries',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  updateQuestionnaireQuestionOrder(
    questionnaireId: number,
    questionnaireForm: any
  ) {
    const apiUrl = '/api/questionnaire/' + questionnaireId + '/questions/order';
    return this.apiService.put(
      apiUrl,
      questionnaireForm,
      'Unable to update questionaries position',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  saveQuestion(questionnaireId: number, questionForm: any) {
    const apiUrl = '/api/questionnaire/' + questionnaireId + '/questions';
    return this.apiService.post(
      apiUrl,
      questionForm,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  uploadBackgroundImage(questionnaireId: any, index: number, formData: any) {
    const apiUrl = `/api/questionnaire/${questionnaireId}/backgroundImage/${index}`;
    return this.apiService.put(
      apiUrl,
      formData,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  deleteBackgroundImage(questionnaireId: any, index: number) {
    const apiUrl = `/api/questionnaire/${questionnaireId}/backgroundImage/${index}`;
    return this.apiService.delete(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  uploadBackgroundImages(questionnaireId: any, formData: any) {
    const apiUrl = `/api/questionnaire/${questionnaireId}/backgroundImage/all`;
    return this.apiService.put(
      apiUrl,
      formData,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  updateBackgroundImageStatus(questionnaireId: any, index: number) {
    const apiUrl = `/api/questionnaire/${questionnaireId}/backgroundImage/${index}/status`;
    return this.apiService.put(
      apiUrl,
      '',
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  saveQuestionWithTncFile(
    questionnaireId: number,
    questionId: any,
    questionForm: any
  ) {
    const apiUrl = `/api/questionnaire/${questionnaireId}/${questionId}/tnc-question-file`;
    return this.apiService.put(
      apiUrl,
      questionForm,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }
}
