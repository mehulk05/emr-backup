import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/shared/services/api.service';
import { HttpHelperService } from 'src/app/shared/services/HttpHelperService';

@Injectable({
  providedIn: 'root'
})
export class MassEmailSmsService {
  constructor(
    private httpHelperService: HttpHelperService,
    private apiService: ApiService
  ) {}

  getBroadCastList() {
    const apiUrl = "/api/trigger?query='BroadCast'";
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getBroadCastListFilter(search: any, page: any, size: any, isEmail: any) {
    const apiUrl =
      '/api/trigger/filter?search=' +
      search +
      '&page=' +
      page +
      '&size=' +
      size +
      '&isEmail=' +
      isEmail;
    return this.apiService.get(
      apiUrl,
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

  deleteTemplates(ids: any) {
    const apiUrl = '/api/trigger/delete/' + ids;
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

  getMassPatientsCount(appointmentStatus: string[], moduleName: string) {
    const apiUrl =
      '/api/v1/patients/count?appointmentStatus=' +
      appointmentStatus +
      '&moduleName=' +
      moduleName;
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getMassLeadsCount(leadStatus: string[], moduleName: string) {
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

  getMassLeadPatientCount(triggerConditions: string[], moduleName: string) {
    const leadsCount = this.getMassLeadsCount(triggerConditions, moduleName);
    const patientsCount = this.getMassPatientsCount(
      triggerConditions,
      moduleName
    );
    return Promise.all([leadsCount, patientsCount]);
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

  getEmailSmsCount() {
    const apiUrl = '/api/v1/audit/email-sms/count';
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }
}
