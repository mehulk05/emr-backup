import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/shared/services/api.service';
import { HttpHelperService } from 'src/app/shared/services/HttpHelperService';

@Injectable({
  providedIn: 'root'
})
export class SmsService {
  constructor(
    private httpHelperService: HttpHelperService,
    private apiService: ApiService
  ) {}

  getEmailId(emailId: number) {
    const apiUrl = '/api/smstemplates/' + emailId;
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getVariables(smsTemplateName: any) {
    const apiUrl = '/api/smstemplatenames/' + smsTemplateName + '/variables';
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  update(sms: any) {
    console.log(sms);
    const apiUrl = '/api/smstemplates' + '/' + sms.id;
    return this.apiService.put(
      apiUrl,
      sms,
      'Unable to update sms template',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  save(sms: any) {
    const apiUrl = '/api/smstemplates';
    return this.apiService.post(
      apiUrl,
      sms,
      'Unable to add sms template',
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

  emailTemplate(id: any) {
    const apiUrl = '/api/v1/trigger/getTemplate?id=' + id + '&type=EMAIL';
    return this.apiService.getText(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptionsForHtml()
    );
  }

  smsTemplate(id: any) {
    const apiUrl = '/api/v1/trigger/getTemplate?id=' + id + '&type=SMS';
    return this.apiService.getText(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptionsForHtml()
    );
  }

  getEmailSmsCount() {
    const apiUrl = '/api/v1/audit/email-sms/count';
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getEmailSmsQuota() {
    const apiUrl = '/api/v1/business/email-sms/quota';
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getSmsVariablesData() {
    const apiUrl = '/api/smstemplates/variablesData';
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  retryFailedMessage(id: any, moduleName: string) {
    const apiUrl = `/api/notifications/retry-failed-message?auditId=${id}&moduleName=${moduleName}`;
    return this.apiService.post(
      apiUrl,
      '',
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }
}
