import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/shared/services/api.service';
import { HttpHelperService } from 'src/app/shared/services/HttpHelperService';

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  constructor(
    private httpHelperService: HttpHelperService,
    private apiService: ApiService
  ) {}

  getPatientOptimized(id: number) {
    const apiUrl = '/api/v1/patients/' + id;
    return this.apiService.get(
      apiUrl,
      'Unable to load Paitent Details !',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  createPatient(patientForm: any) {
    const apiUrl = '/api/patients';
    return this.apiService.post(
      apiUrl,
      patientForm,
      'Unable to create the patient at the moment',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  updatePatient(id: number, patientForm: any) {
    const apiUrl = '/api/patients/' + id;
    return this.apiService.put(
      apiUrl,
      patientForm,
      'Unable to update Patient at the moment!',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getPatientQuestionnaireOptimized(patientId: number) {
    const apiUrl = '/api/v1/patient/' + patientId + '/questionnaire';
    return this.apiService.get(
      apiUrl,
      'Unable to load Paitent Questionarie!',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getPatientConsentSignUrl(appointmentConsentId: number) {
    const apiUrl = '/api/consents/' + appointmentConsentId + '/signurl';
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getayments(patientId: number) {
    const apiUrl = '/api/payment?patientId=' + patientId;
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }
  updatePatientConsentStatus(appointmentConsentId: number, status: any) {
    const apiUrl =
      '/api/consents/' + appointmentConsentId + '/status?status=' + status;
    return this.apiService.put(
      apiUrl,
      {},
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }
  getPatientAppointmentsOptimized(patientId: number) {
    const apiUrl = '/api/v1/patients/' + patientId + '/appointments';
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  uploadFile(formData: any) {
    const apiUrl = '/api/v1/patients/excel/upload';
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

  deletePatient(patientId: number) {
    const apiUrl = '/api/public/users/delete?userId=' + patientId;
    return this.apiService.put(
      apiUrl,
      {},
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getPatientTask(id: any) {
    const apiUrl = '/api/workflowtasks/patient/' + id;
    return this.apiService.get(
      apiUrl,
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

  getPatientTimeline(id: any) {
    const apiUrl = '/api/v1/audit/patient?patientId=' + id;
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  emailTemplate(id: any) {
    const apiUrl = '/api/v1/audit/appointment/content?id=' + id;
    return this.apiService.getText(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptionsForHtml()
    );
  }

  patientTagList() {
    const apiUrl = '/api/ptag/list';
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  updateLeadTags(patientId: number, tagIds: any) {
    const apiUrl = '/api/patient/' + patientId + '/tags';
    return this.apiService.put(
      apiUrl,
      tagIds,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  /* getPaitentTask(id: any) {
    const apiUrl = '/api/workflowtasks/lead/' + id;
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  } */

  addPaitentComment(formData: any) {
    const apiUrl = '/api/patient-comment';
    return this.apiService.post(
      apiUrl,
      formData,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  sendPatientCommentEmail(formData: any) {
    console.log(formData);
    const apiUrl = '/api/patient-comment/notes/email';
    return this.apiService.post(
      apiUrl,
      formData,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  savePatientNotesFile(Id: number, formData: any) {
    const apiUrl = '/api/patient-comment/' + Id + '/patient-notes-file';
    return this.apiService.put(
      apiUrl,
      formData,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  downloadPatient(id: any) {
    const apiUrl = '/api/workflowtasks/patient/' + id;
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  downloadPatientsExcel(tag: any, status: any, selectedId: any[]) {
    const apiUrl =
      '/api/v1/patients/excel/downloads?tag=' +
      tag +
      '&status=' +
      status +
      '&patientIds=' +
      selectedId;
    return this.apiService.saveExcel(
      apiUrl,
      false,
      this.httpHelperService.getTenantHttpOptions(),
      false,
      true
    );
  }

  downloadPatientsPdf(tag: any, status: any, selectedId: []) {
    const apiUrl =
      '/api/v1/patients/pdf/downloads?tag=' +
      tag +
      '&status=' +
      status +
      '&patientIds=' +
      selectedId;
    return this.apiService.saveExcel(
      apiUrl,
      false,
      this.httpHelperService.getTenantHttpOptions(),
      false,
      true
    );
  }

  downloadPatientDetailpdf(id: any) {
    console.log('id', id);
    const apiUrl = '/api/patients/pdf/' + id;
    return this.apiService.savePdf(
      apiUrl,
      id,
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getPatientList(patientIds: any) {
    const apiUrl = '/api/patient/pdf/list';
    return this.apiService.post(
      apiUrl,
      patientIds,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  updatSmsChatStatus(
    patientId: any,
    status: string,
    moduleName: string = 'patient'
  ) {
    const apiUrl = `/api/v1/${moduleName}/${patientId}/sms-chat-status/${status}`;
    return this.apiService.put(
      apiUrl,
      '',
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  patientCommentList(patientId: number) {
    const apiUrl = '/api/patient-comment/' + patientId + '/list';
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

  sendSMS(patientId: number, templateId: number) {
    const apiUrl =
      '/api/v1/patient/' + patientId + '/sms-template/' + templateId;
    return this.apiService.post(
      apiUrl,
      {},
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  sendSimpleEmail(requestObject: any) {
    const apiUrl = '/api/v1/patient/send-custom-email';
    return this.apiService.post(
      apiUrl,
      requestObject,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  sendSimpleSms(requestObject: any) {
    const apiUrl = '/api/v1/patient/send-custom-sms';
    return this.apiService.post(
      apiUrl,
      requestObject,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  updatePatientStatus(patientId: number, status: any) {
    const apiUrl = '/api/patient/' + patientId + '/status/' + status;
    return this.apiService.put(
      apiUrl,
      {},
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  editInlinePaitent(leadObj: any, id: any) {
    const apiUrl = '/api/patient/' + id;
    return this.apiService.patch(
      apiUrl,
      leadObj,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getPatientStatsDashboard() {
    const apiUrl = '/api/questionnaire/contact-submissions/dashboard';
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  deleteMassPatient(leadIds: any) {
    const apiUrl = '/api/patient/mass-delete';
    return this.apiService.put(
      apiUrl,
      leadIds,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  updateMassPatientStatus(leadIds: any, status: string) {
    const apiUrl = '/api/patient/mass-update?status=' + status;
    return this.apiService.put(
      apiUrl,
      leadIds,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  assignMultipleTagsToLead(requestObject: any) {
    const apiUrl = '/api/patient/bulk/tags';
    return this.apiService.post(
      apiUrl,
      requestObject,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getSMSTemplatesListForPatient(templateFor: string, patientId: any) {
    const apiUrl = `/api/smstemplates/by-templateFor/${templateFor}/lead/${patientId}`;
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getEmailTemplateListForPatient(templateFor: string, patientId: any) {
    const apiUrl = `/api/emailTemplates/templateFor/${templateFor}/lead/${patientId}`;
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
