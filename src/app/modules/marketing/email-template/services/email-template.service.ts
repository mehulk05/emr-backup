import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/shared/services/api.service';
import { HttpHelperService } from 'src/app/shared/services/HttpHelperService';
import { IEmailTemplate } from '../models/emailTemplate.model';

@Injectable({
  providedIn: 'root'
})
export class EmailTemplateService {
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

  getEmailId(emailId: number) {
    const apiUrl = '/api/emailtemplates/' + emailId;
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  cloneEmailTemplate(id: number) {
    const apiUrl = '/api/emailtemplates/' + id + '/clone';
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  deactivateEmailTemplate(id: number) {
    const apiUrl = '/api/v1/emailTemplates/disabled/' + id;
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  activateEmailTemplate(id: number) {
    const apiUrl = '/api/v1/emailTemplates/enabled/' + id;
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  save(email: IEmailTemplate) {
    const apiUrl = '/api/emailtemplates';
    return this.apiService.post(
      apiUrl,
      email,
      'Unable to add email template',
      false,
      this.httpHelperService.getTenantHttpOptions(email.id)
    );
  }

  update(email: IEmailTemplate) {
    //console.log(email);
    const apiUrl = '/api/emailtemplates/' + email.id;
    return this.apiService.put(
      apiUrl,
      email,
      'Unable to update email template',
      false,
      this.httpHelperService.getTenantHttpOptions(),
      false
    );
  }

  remove(emailId: number) {
    const apiUrl = '/api/emailtemplates' + '/' + emailId;
    return this.apiService.delete(
      apiUrl,
      'Unable to update email template',
      false,
      this.httpHelperService.getTenantHttpOptions(emailId),
      false
    );
  }

  testEmailTemplate(formData: any) {
    const apiUrl = '/api/emailtemplates/test/template';
    return this.apiService.post(
      apiUrl,
      formData,
      'Unable to add email template',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getEmailTemplateNames() {
    const apiUrl = '/api/emailtemplatenames';
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getVariables(emailTemplateName: any) {
    const apiUrl =
      '/api/emailtemplatenames/' + emailTemplateName + '/variables';
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getChatSessions() {
    const apiUrl = '/api/chatsessions';
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }
  getAllQuestionnaireList() {
    const apiUrl = '/api/questionnaire';
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getAllQuestions(questionnaireId: number) {
    const apiUrl = '/api/questionnaire/' + questionnaireId + '/questions';
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }
  getContactQuestionnaireSubmissions() {
    const apiUrl = '/api/questionnaire/contact-submissions';
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }
  uploadImage(formData: any) {
    const apiUrl = '/api/emailtemplate/assets';
    return this.apiService.post(
      apiUrl,
      formData,
      'Unable to add email template',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getNewsLetters(search: any) {
    let apiUrl = '/api/newsletters';
    if (search && search != '') {
      apiUrl = apiUrl + '?search=' + search;
    }
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }
}
