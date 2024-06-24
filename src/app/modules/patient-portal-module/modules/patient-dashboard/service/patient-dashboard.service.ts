import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/shared/services/api.service';
import { HttpHelperService } from 'src/app/shared/services/HttpHelperService';

@Injectable({
  providedIn: 'root'
})
export class PatientDashboardService {
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

  getayments(patientId: number) {
    const apiUrl = '/api/payment?patientId=' + patientId;
    return this.apiService.get(
      apiUrl,
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

  getDefaultCinicOptimized() {
    const apiUrl = '/api/v1/clinics/default';
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

  getSingleAppointment(appointmentId: number) {
    const apiUrl = '/api/appointments/' + appointmentId;
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getAppointmentPayments(appointmentId: any) {
    const apiUrl = '/api/payment/appointment?appointmentId=' + appointmentId;
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getBusinessOptimized(businessId: any) {
    const apiUrl = '/api/v1/businesses/' + businessId;
    return this.apiService.get(
      apiUrl,
      'Unable to load Business Information',
      false,
      this.httpHelperService.getTenantHttpOptions(businessId)
    );
  }
}
