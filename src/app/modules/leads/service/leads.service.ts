import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/shared/services/api.service';
import { HttpHelperService } from 'src/app/shared/services/HttpHelperService';

@Injectable({
  providedIn: 'root'
})
export class LeadsService {
  constructor(
    private httpHelperService: HttpHelperService,
    private apiService: ApiService
  ) {}

  leadTagList() {
    const apiUrl = '/api/tag/list';
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getLeadsWithFilterParams(
    page: any,
    size: any,
    statusFilter: any,
    sourceFilter: any,
    search: any,
    leadTagFilter: any,
    startDate: any,
    endDate: any
  ) {
    const apiUrl =
      '/api/questionnaire/contact-submissions/filter/pagination?page=' +
      page +
      '&size=' +
      size +
      '&statusFilter=' +
      statusFilter +
      '&sourceFilter=' +
      sourceFilter +
      '&search=' +
      search +
      '&leadTagFilter=' +
      leadTagFilter +
      '&startDate=' +
      startDate +
      '&endDate=' +
      endDate;
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getLeadDashboardStats() {
    const apiUrl = '/api/questionnaire/contact-submissions/dashboard';
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }
  deleteLeadById(id: any) {
    const apiUrl = '/api/questionnaire-submissions/' + id;
    return this.apiService.delete(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getLeadTask(id: any) {
    const apiUrl = '/api/workflowtasks/lead/' + id;
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getHistoryCountRecords(type: any) {
    const apiUrl = '/api/excel/histories/upload/count?type=' + type;
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getHistoryRecords(type: any, page: any, size: any) {
    const apiUrl =
      '/api/excel/histories/upload?type=' +
      type +
      '&page=' +
      page +
      '&size=' +
      size;
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getLeadList(leadIds: any) {
    // const apiUrl = '/api/questionnaire-submission/pdf/list/'+;
    // return this.apiService.get(
    //   apiUrl,
    //   '',
    //   false,
    //   this.httpHelperService.getTenantHttpOptions()
    // );

    const apiUrl = '/api/questionnaire-submission/pdf/list';
    return this.apiService.post(
      apiUrl,
      leadIds,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  deleteTask(id: any) {
    const apiUrl = '/api/workflowtasks/' + id;
    return this.apiService.delete(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getOptmizedAllUsers() {
    const apiUrl = '/api/v1/users/all';
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getLeadTimeline(id: any) {
    const apiUrl = '/api/v1/audit/lead?leadId=' + id;
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getLeadAllTimeline(email: string, id: string) {
    const apiUrl =
      '/api/v1/audit/lead/all?leadEmail=' + email + '&leadId=' + id;
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  createTask(taskForm: any) {
    const apiUrl = '/api/workflowtasks';
    return this.apiService.post(
      apiUrl,
      taskForm,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getQuestionnaireSubmission(questionnaireSubmissionId: number) {
    const apiUrl =
      '/api/questionnaire-submissions/' + questionnaireSubmissionId;
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getLeadCreationBox(id: number) {
    const apiUrl = '/api/questionnaire-submissions/' + id + '/lead-creation';
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getTestContactQuestionnaireSubmissions() {
    const apiUrl = '/api/test/questionnaire/contact-submissions';
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getDuplicateLeadDetail(emailId: string) {
    const apiUrl = '/api/questionnaire/contact-submissions/email/' + emailId;
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getDuplicateLeadDetailAndQuestionId(emailId: string, questionId: any) {
    const apiUrl =
      '/api/questionnaire/contact-submissions/email/' +
      emailId +
      '?questionId=' +
      questionId;
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  editAmountForLead(amount: number, id: any) {
    const apiUrl =
      '/api/questionnaire-submission/lead/' + id + '/amount?amount=' + amount;
    return this.apiService.put(
      apiUrl,
      {},
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  editInlineLead(leadObj: any, id: any) {
    const apiUrl = '/api/questionnaire-submission/lead/' + id;
    return this.apiService.patch(
      apiUrl,
      leadObj,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  updateLead(leadId: number, questionId: any, value: any) {
    const apiUrl =
      '/api/questionnaire-submission/lead/' +
      leadId +
      '/question/' +
      questionId +
      '/' +
      value;
    return this.apiService.put(
      apiUrl,
      {},
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  updateLeadStatus(leadId: number, status: any) {
    const apiUrl =
      '/api/questionnaire-submission/lead/' + leadId + '/status/' + status;
    return this.apiService.put(
      apiUrl,
      {},
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  public getLeadEmailPDF(id: any) {
    console.log('id', id);
    const apiUrl = '/api/questionnaire-submissions/' + id + '/lead/email';
    return this.apiService.savePdf(
      apiUrl,
      id,
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getLeadDetailPDF(id: any) {
    console.log('id', id);
    const apiUrl = '/api/leads/pdf/' + id;
    return this.apiService.savePdf(
      apiUrl,
      id,
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  sendSMS(leadId: number, templateId: number) {
    const apiUrl =
      '/api/questionnaire-submission/lead/' +
      leadId +
      '/sms-template/' +
      templateId;
    return this.apiService.post(
      apiUrl,
      {},
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  addLeadComment(formData: any) {
    const apiUrl = '/api/questionnaire-submission-comment';
    return this.apiService.post(
      apiUrl,
      formData,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  sendLeadCommentEmail(formData: any) {
    console.log(formData);
    const apiUrl = '/api/questionnaire-submission/notes/email';
    return this.apiService.post(
      apiUrl,
      formData,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  saveLeadNotesFile(Id: number, formData: any) {
    const apiUrl =
      '/api/questionnaire-submission-comment/' + Id + '/lead-notes-file';
    return this.apiService.put(
      apiUrl,
      formData,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  updateLeadTags(leadId: number, tagIds: any) {
    const apiUrl = '/api/questionnaire-submission/lead/' + leadId + '/tags';
    return this.apiService.put(
      apiUrl,
      tagIds,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  updateUser(leadId: number, userId: any) {
    const apiUrl =
      '/api/questionnaire-submission/lead/' +
      leadId +
      '/userId?userId=' +
      userId;
    return this.apiService.put(
      apiUrl,
      {},
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  sendLeadUserEmail(formData: any) {
    console.log(formData);
    const apiUrl = '/api/questionnaire-submission/user/userEmail';
    return this.apiService.post(
      apiUrl,
      formData,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  leadToPatient(leadId: number) {
    const apiUrl = '/api/questionnaire-submission/' + leadId + '/patient';
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  leadToOnboard(leadId: number) {
    const apiUrl = '/api/questionnaire-submission/' + leadId + '/onboard';
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  list(leadId: number) {
    const apiUrl = '/api/questionnaire-submission-comment/' + leadId + '/list';
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getSMSTemplateList(templateFor: string) {
    const apiUrl = '/api/smstemplates/templateFor/' + templateFor + '';
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getEmailTemplateList(templateFor: string) {
    const apiUrl = '/api/emailTemplates/templateFor/' + templateFor + '';
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getQuestionnaire(businessId: number, questionnaireId: number) {
    const apiUrl = '/api/public/questionnaire/' + questionnaireId;
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions(businessId)
    );
  }

  // it is contact form questionnaire
  getPublicQuestionnaire(businessId: number) {
    const apiUrl = '/api/public/questionnaire';
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions(businessId)
    );
  }

  submitQuestionnaire(
    businessId: number,
    questionnaireId: number,
    questionnaireForm: any
  ) {
    const apiUrl = '/api/public/manual/questionnaire/' + questionnaireId;
    return this.apiService.post(
      apiUrl,
      questionnaireForm,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  emailTemplate(id: any) {
    const apiUrl = '/api/v1/audit/lead/content?id=' + id;
    return this.apiService.getText(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptionsForHtml()
    );
  }

  deleteMassLeads(leadIds: any) {
    const apiUrl = '/api/questionnaire-submissions/mass-delete';
    return this.apiService.put(
      apiUrl,
      leadIds,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  uploadFile(formData: any) {
    const apiUrl = '/api/v1/questionnaire-submission/lead/upload';
    return this.apiService.post(
      apiUrl,
      formData,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions(),
      false,
      true
    );
  }

  uploadFileV1(formData: any) {
    const apiUrl = '/api/questionnaire-submission/lead/upload';
    return this.apiService.post(
      apiUrl,
      formData,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getSelectedLeadsListExcel(leadIds: any) {
    const apiUrl = '/api/leads/excel';
    return this.apiService.savePdf(
      apiUrl,
      leadIds,
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getSelectedLeadsListPDF(leadIds: any) {
    const apiUrl = '/api/leads/pdf';
    return this.apiService.savePdf(
      apiUrl,
      leadIds,
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  sendSimpleEmail(requestObject: any) {
    const apiUrl = '/api/v1/lead/send-custom-email';
    return this.apiService.post(
      apiUrl,
      requestObject,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  sendSimpleSms(requestObject: any) {
    const apiUrl = '/api/v1/lead/send-custom-sms';
    return this.apiService.post(
      apiUrl,
      requestObject,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  updateMassLeadStatus(leadIds: any, status: string) {
    const apiUrl =
      '/api/questionnaire-submissions/mass-update?status=' + status;
    return this.apiService.put(
      apiUrl,
      leadIds,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  saveFile(formSubmissionId: number, questionId: number, formData: any) {
    const apiUrl = `/api/public/form-submission/${formSubmissionId}/question/${questionId}/uploadfile`;
    return this.apiService.post(
      apiUrl,
      formData,
      '',
      true,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  assignMultipleTagsToLead(requestObject: any) {
    const apiUrl = '/api/public/leads/bulk/tags';
    return this.apiService.post(
      apiUrl,
      requestObject,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getSMSTemplatesListForLead(templateFor: string, leadId: any) {
    const apiUrl = `/api/smstemplates/by-templateFor/${templateFor}/lead/${leadId}`;
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  updatSmsChatStatus(leadId: any, status: string, moduleName: string = 'lead') {
    const apiUrl = `/api/v1/${moduleName}/${leadId}/sms-chat-status/${status}`;
    return this.apiService.put(
      apiUrl,
      '',
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getEmailTemplateListForLead(templateFor: string, leadId: any) {
    const apiUrl = `/api/emailTemplates/templateFor/${templateFor}/lead/${leadId}`;
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getTemplatesListForLead(templateFor: string, leadId: any) {
    const apiUrl = `/api/emailSmsTemplates/${templateFor}/${leadId}`;
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getLeadDashboardData() {
    const apiUrl = '/api/leads/dashboard';
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getLeadDashboardGraphData() {
    const apiUrl = '/api/leads/dashboard/graph-data';
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getLeadCommentsAndTask(leadId: any) {
    const apiUrl = `/api/leads/${leadId}/details/merged-data`;
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getLeadAuditForTimeline(email: string, id: string) {
    const apiUrl = `/api/v1/audit/lead/timeline?leadEmail=${email}&leadId=${id}`;
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getOptedOutEmailSMS() {
    const apiUrl = '/api/outout/emails';
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }
}
