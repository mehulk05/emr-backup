import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/shared/services/api.service';
import { HttpHelperService } from 'src/app/shared/services/HttpHelperService';

@Injectable({
  providedIn: 'root'
})
export class CalendarService {
  constructor(
    private httpHelperService: HttpHelperService,
    private apiService: ApiService
  ) {}

  getProviderByServiceIds(serviceIds: any) {
    let apiUrl = '/api/v1/users/services/providers';
    if (serviceIds != null && serviceIds != '') {
      apiUrl = apiUrl + '?serviceId=' + serviceIds;
    } else {
      apiUrl = apiUrl + '?serviceId=';
    }
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getOptimizedUserSchedule(providerId: number) {
    const apiUrl = '/api/v1/user/' + providerId + '/schedules';
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getVacationSchedulesByProviders(clinicId: number, providerIds: number[]) {
    const apiUrl = '/api/v1/user/clinic/' + clinicId + '/schedules/vacation';
    return this.apiService.post(
      apiUrl,
      providerIds,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getVacationSchedules(clinicId: number, providerId: number) {
    const apiUrl =
      '/api/v1/user/' +
      providerId +
      '/clinic/' +
      clinicId +
      '/schedules/vacation';
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  updateClinicVacationSchedule(vacationSchedule: any, clinicId: any) {
    const apiUrl = '/api/clinics/vacation/' + clinicId;
    return this.apiService.put(
      apiUrl,
      vacationSchedule,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getWorkingSchedules(clinicId: number, providerId: number) {
    const apiUrl =
      '/api/v1/user/' +
      providerId +
      '/clinic/' +
      clinicId +
      '/schedules/working';
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getOptimziedUser(userId: number) {
    const apiUrl = '/api/v1/user/' + userId;
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }
  getUserByEmail(email: string) {
    const apiUrl = '/api/v1/userByEmail/' + email;
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }
  getUserByPhone(phone: string) {
    const apiUrl = '/api/v1/userByPhone/' + phone;
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getPatients() {
    const apiUrl = '/api/v1/patientsByTenantId';
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getClinicVacationById(id: any) {
    const apiUrl = '/api/clinics/vacation/vacationId/' + id;
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  deleteClinicVacationById(id: any) {
    const apiUrl = '/api/clinics/vacation/' + id;
    return this.apiService.delete(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getUserSchedulesForAppointment(
    clinicId: number,
    providerId: number,
    scheduleTypes: any
  ) {
    const apiUrl = `/api/v1/appointents/user/${providerId}/clinic/${clinicId}/schedules/${scheduleTypes}`;
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getProvidersDataForAppointment(serviceIds: any, formData: any) {
    let apiUrl = '/api/v1/appointments/edit/provider-data';
    if (serviceIds != null && serviceIds != '') {
      apiUrl = apiUrl + '?serviceId=' + serviceIds;
    } else {
      apiUrl = apiUrl + '?serviceId=';
    }
    return this.apiService.post(
      apiUrl,
      formData,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }
}
