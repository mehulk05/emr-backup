import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ApiService } from 'src/app/shared/services/api.service';
import { HttpHelperService } from 'src/app/shared/services/HttpHelperService';

@Injectable({
  providedIn: 'root'
})
export class SmsService {
  unreadSmsCountSubject: BehaviorSubject<number> = new BehaviorSubject(0);
  constructor(
    private httpHelperService: HttpHelperService,
    private apiService: ApiService
  ) {}

  emitUnreadSmsCount(value: number) {
    this.unreadSmsCountSubject.next(value);
  }

  reduceAndEmitUnreadSmsCount(value: number) {
    console.log('current count: ' + this.unreadSmsCountSubject.value);
    const nextValue =
      this.unreadSmsCountSubject.value - value < 0
        ? 0
        : this.unreadSmsCountSubject.value - value;
    this.unreadSmsCountSubject.next(nextValue);
  }

  getAllSmsListOptimized() {
    const apiUrl = '/api/v1/smsTemplates';
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

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
      this.httpHelperService.getTenantHttpOptions(sms.id)
    );
  }

  cloneSMSTemplate(id: number) {
    const apiUrl = '/api/smstemplates/' + id + '/clone';
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  testSMSTemplate(formData: any) {
    const apiUrl = '/api/smstemplates/test/template';
    return this.apiService.post(
      apiUrl,
      formData,
      'Unable to send SMS to given number',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  cloneEmailTemplate(id: number) {
    const apiUrl = '/api/smstemplates/' + id + '/clone';
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  deactivateSmsTemplate(id: number) {
    const apiUrl = '/api/v1/smsTemplates/disabled/' + id;
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  activateSmsTemplate(id: number) {
    const apiUrl = '/api/v1/smsTemplates/enabled/' + id;
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
  getChatSessions() {
    const apiUrl = '/api/chatsessions';
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

  getSmsVariablesData() {
    const apiUrl = '/api/smstemplates/variablesData';
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getReadUnreadSmsCount() {
    const apiUrl = '/api/notifications/sms-audit-logs/read-unread-count';
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }
}
