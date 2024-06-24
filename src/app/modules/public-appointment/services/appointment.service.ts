import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/shared/services/api.service';
import { HttpHelperService } from 'src/app/shared/services/HttpHelperService';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  private _allClinicServices: any;
  constructor(
    private httpHelperService: HttpHelperService,
    private apiService: ApiService
  ) {}

  public getCachedClinicServices(): any {
    return this._allClinicServices;
  }
  public setClinicServices(services: any) {
    this._allClinicServices = services;
  }

  private _selectedAppointment: any;

  public getSelectedAppointment(): any {
    return this._selectedAppointment;
  }
  public setSelectedAppointment(appointment: any) {
    this._selectedAppointment = appointment;
  }
  public getAnyProvider(): any {
    const anyProvider = {
      firstName: 'Any Available Provider',
      id: 0,
      lastName: ''
    };
    return anyProvider;
  }

  getServiceOptimized(businessId: any, serviceId: number) {
    const apiUrl = '/api/public/v1/services/' + serviceId;
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions(businessId)
    );
  }

  getProviderOptimized(businessId: any, clinicId: any) {
    const apiUrl = '/api/public/v1/users/' + clinicId;
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions(businessId)
    );
  }

  getClinicOptimized(businessId: any, clinicId: any) {
    const apiUrl = '/api/public/v1/clinics/' + clinicId;
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions(businessId)
    );
  }

  getClinicServicesForProviderOptmized(
    businessId: any,
    clinicId: number,
    providerId: number
  ) {
    const apiUrl =
      '/api/public/v1/services/clinics/' +
      clinicId +
      '?providerId=' +
      providerId;
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions(businessId)
    );
  }

  getAllCinicListOptmized(businessId: any) {
    const apiUrl = '/api/public/v1/clinics/all';
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions(businessId)
    );
  }

  getAllCinicList(businessId: any) {
    const apiUrl = '/api/public/clinics/all';
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions(businessId)
    );
  }

  getClinicProviders(businessId: any, clinicId: number) {
    const apiUrl = '/api/public/users/' + clinicId + '/providers';
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions(businessId)
    );
  }

  getProvidersOptmized(businessId: any, clinicId: any, serviceIds: any) {
    let apiUrl = '/api/public/v1/users/providers';
    apiUrl =
      apiUrl + '?clinicId=' + clinicId + '&serviceIds=' + serviceIds.join(',');
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions(businessId)
    );
  }

  // getPublicDefaultService(businessId: any) {
  //   console.log('here');
  //   const apiUrl = '/api/public/v1/services/default';
  //   return this.apiService.get(
  //     apiUrl,
  //     '',
  //     false,
  //     this.httpHelperService.getTenantHttpOptions(businessId)
  //   );
  // }

  getAvailableTimeslots(
    businessId: any,
    clinicId: any,
    serviceIds: any,
    providerId: any,
    date: any
  ) {
    const request: any = {
      date: date,
      clinicId: clinicId,
      providerId: providerId,
      serviceIds: serviceIds,
      appointmentId: null
    };
    const apiUrl = '/api/public/provider/' + providerId + '/schedules/times';
    return this.apiService.post(
      apiUrl,
      request,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions(businessId)
    );
  }

  getTimeSlotsForAnyProvider(
    businessId: any,
    clinicId: any,
    serviceIds: any,
    date: any
  ) {
    const request: any = {
      date: date,
      clinicId: clinicId,
      providerId: 0,
      serviceIds: serviceIds,
      appointmentId: null
    };
    const apiUrl = '/api/public/clinic/' + clinicId + '/schedules/times';
    return this.apiService.post(
      apiUrl,
      request,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions(businessId)
    );
  }

  createAppointment(businessId: any, appointmentForm: any) {
    const apiUrl = '/api/public/appointments';
    return this.apiService.post(
      apiUrl,
      appointmentForm,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions(businessId)
    );
  }

  createNewAppointment(businessId: any, appointmentForm: any) {
    const apiUrl = '/api/public/appointments/new';
    return this.apiService.post(
      apiUrl,
      appointmentForm,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions(businessId)
    );
  }

  getTimeSlotsWithoutProvider(businessId: any, formData: any) {
    const apiUrl = '/api/public/clinic/' + formData.clinicId + '/times';
    return this.apiService.post(
      apiUrl,
      formData,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions(businessId)
    );
  }

  getConsentFaqInfo(businessId: any, aptId: any) {
    const apiUrl = '/api/public/appointments/' + aptId + '/consent-faq';
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions(businessId)
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

  getPatientConsentSignUrl(appointmentConsentId: number) {
    const apiUrl = '/api/public/consents/' + appointmentConsentId + '/signurl';
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  updatePatientConsentStatus(appointmentConsentId: number, status: any) {
    const apiUrl =
      '/api/public/consents/' +
      appointmentConsentId +
      '/status?status=' +
      status;
    return this.apiService.put(
      apiUrl,
      {},
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }
}
