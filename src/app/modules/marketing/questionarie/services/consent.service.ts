import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/shared/services/api.service';
import { HttpHelperService } from 'src/app/shared/services/HttpHelperService';

@Injectable({
  providedIn: 'root'
})
export class ConsentService {
  constructor(
    private httpHelperService: HttpHelperService,
    private apiService: ApiService
  ) {}

  createConsent(consentForm: any) {
    const apiUrl = '/api/consents';
    return this.apiService.post(
      apiUrl,
      consentForm,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getConsent(consentId: number) {
    const apiUrl = '/api/consents/' + consentId;
    return this.apiService.get(
      apiUrl,
      'Unable to load Questionaries',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  updateConsent(consentId: number, consentForm: any) {
    const apiUrl = '/api/consents/' + consentId;
    return this.apiService.put(
      apiUrl,
      consentForm,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getPatientConsentsOptimized(id: number) {
    const apiUrl = '/api/v1/patients/' + id + '/consents';
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  downloadAppointmentConsent(appointmentConsetId: number) {
    const apiUrl = '/api/consents/' + appointmentConsetId + '/download';
    return this.apiService.getPdf(
      apiUrl,
      {},
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getAllConsentListOptimized() {
    const apiUrl = '/api/v1/consents';
    return this.apiService.get(
      apiUrl,
      'Unable to load Consents',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  assignConsentsToPatient(patientId: any, consentIds: any) {
    const apiUrl =
      '/api/patients/' +
      patientId +
      '/consents/assign?consentIds=' +
      consentIds;
    return this.apiService.post(
      apiUrl,
      {},
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }
}
