import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/shared/services/api.service';
import { HttpHelperService } from 'src/app/shared/services/HttpHelperService';

@Injectable({
  providedIn: 'root'
})
export class PateintAppointmentService {
  constructor(
    private httpHelperService: HttpHelperService,
    private apiService: ApiService
  ) {}

  getPatientAppointmentsOptimized(patientId: number) {
    const apiUrl = '/api/v1/patients/' + patientId + '/appointments';
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getAppointment(aptId: number) {
    const apiUrl = '/api/appointments/' + aptId;
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getPatientConsents(id: number) {
    const apiUrl = '/api/patients/' + id + '/consents';
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getPatientConsentSignUrl(id: number) {
    const apiUrl = '/api/consents/' + id + '/signurl';
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
}
