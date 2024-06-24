import { Injectable } from '@angular/core';
import { forkJoin } from 'rxjs';
import { ApiService } from 'src/app/shared/services/api.service';
import { HttpHelperService } from 'src/app/shared/services/HttpHelperService';

@Injectable({
  providedIn: 'root'
})
export class TriggersService {
  constructor(
    private httpHelperService: HttpHelperService,
    private apiService: ApiService
  ) {}

  getTriggerList() {
    const apiUrl = '/api/trigger';
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getTriggerData(id: any) {
    const apiUrl = '/api/trigger/' + id;
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getMassPatientsCount(
    appointmentStatus: any,
    moduleName: any,
    patientStatus?: any,
    patientTagIds?: any
  ) {
    const apiUrl =
      '/api/v1/patients/count?appointmentStatus=' +
      appointmentStatus +
      '&moduleName=' +
      moduleName +
      '&patientStatus=' +
      patientStatus +
      '&patientTagIds=' +
      patientTagIds;
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getMassLeadsCount(leadStatus: any, moduleName: any) {
    const apiUrl =
      '/api/v1/leads/count?leadStatus=' +
      leadStatus +
      '&moduleName=' +
      moduleName;
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getMassLeadCountByTag(
    leadStatus: any,
    moduleName: any,
    leadTagIds: any[],
    source: any[]
  ) {
    const apiUrl =
      '/api/v1/leads/count?leadStatus=' +
      leadStatus +
      '&moduleName=' +
      moduleName +
      '&leadTagIds=' +
      leadTagIds +
      '&source=' +
      source;
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getMassLeadPatientCount(triggerConditions: any, moduleName: any) {
    const leadsCount = this.getMassLeadsCount(triggerConditions, moduleName);
    const patientsCount = this.getMassPatientsCount(
      triggerConditions,
      moduleName,
      [],
      []
    );
    return forkJoin([leadsCount, patientsCount]);
  }

  createTrigger(triggerData: any) {
    const apiUrl = '/api/trigger';
    return this.apiService.post(
      apiUrl,
      triggerData,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  createTriggerForm(triggerData: any) {
    const apiUrl = '/api/trigger/form';
    return this.apiService.post(
      apiUrl,
      triggerData,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  createTriggerPatient(triggerData: any) {
    const apiUrl = '/api/trigger/patient';
    return this.apiService.post(
      apiUrl,
      triggerData,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  createAppointmentTrigger(triggerData: any) {
    const apiUrl = '/api/trigger/appointment';
    return this.apiService.post(
      apiUrl,
      triggerData,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  updateTrigger(triggerData: any, triggerId: any) {
    const apiUrl = '/api/trigger/' + triggerId;
    return this.apiService.put(
      apiUrl,
      triggerData,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  updateAppointmentTrigger(triggerData: any, triggerId: any) {
    const apiUrl = '/api/trigger/appointment/' + triggerId;
    return this.apiService.put(
      apiUrl,
      triggerData,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  deleteTemplate(id: any) {
    const apiUrl = '/api/trigger/' + id;
    return this.apiService.delete(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  updateTriggerStatus(id: any, status: any) {
    const apiUrl = '/api/trigger/status/' + id;
    return this.apiService.put(
      apiUrl,
      status,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getEmail_Sms_Users_Data() {
    const apiUrl = '/api/v1/trigger/edit';
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  updateMassLeadTrigger(triggerData: any, triggerId: any) {
    const apiUrl = '/api/trigger/mass-lead/' + triggerId;
    return this.apiService.put(
      apiUrl,
      triggerData,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  updateMassPatientTrigger(triggerData: any, triggerId: any) {
    const apiUrl = '/api/trigger/mass-patient/' + triggerId;
    return this.apiService.put(
      apiUrl,
      triggerData,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  updateMassLeadPatientTrigger(triggerData: any, triggerId: any) {
    const apiUrl = '/api/trigger/mass-lead-patient/' + triggerId;
    return this.apiService.put(
      apiUrl,
      triggerData,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  createMassLeadTrigger(triggerData: any) {
    const apiUrl = '/api/trigger/mass-lead';
    return this.apiService.post(
      apiUrl,
      triggerData,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  createMassPatientTrigger(triggerData: any) {
    const apiUrl = '/api/trigger/mass-patient';
    return this.apiService.post(
      apiUrl,
      triggerData,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  createMassLeadPatientTrigger(triggerData: any) {
    const apiUrl = '/api/trigger/mass-lead-patient';
    return this.apiService.post(
      apiUrl,
      triggerData,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getTriggerAuditDetails(
    triggerId: number,
    communicationType: string,
    triggerModule: string
  ) {
    const apiUrl =
      '/api/v1/audit/email-sms/trigger/' +
      triggerId +
      '?communicationType=' +
      communicationType +
      '&triggerModule=' +
      triggerModule;
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getMassTriggerAuditDetails(
    triggerId: number,
    communicationType: string,
    triggerModule: string
  ) {
    const apiUrl =
      '/api/v1/audit/mass-email-sms/trigger/' +
      triggerId +
      '?communicationType=' +
      communicationType +
      '&triggerModule=' +
      triggerModule;
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getEmailSmsBody(id: any) {
    const apiUrl = '/api/v1/audit/appointment/content?id=' + id;
    return this.apiService.getText(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptionsForHtml()
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

  getTriggerAuditData(id: any) {
    const apiUrl = `/api/trigger-audit/${id}`;
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  loadSmsTemplates() {
    const apiUrl = '/api/v1/trigger/sms-templates';
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }
}
