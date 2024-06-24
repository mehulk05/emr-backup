import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/shared/services/api.service';
import { HttpHelperService } from 'src/app/shared/services/HttpHelperService';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(
    private httpHelperService: HttpHelperService,
    private apiService: ApiService
  ) {}

  getAllUsers() {
    const apiUrl = '/api/v1/users/all';
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getAllUsersForDropDown() {
    const apiUrl = '/api/v1/users/dropDown';
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

  deleteUser(userId: number) {
    const apiUrl = '/api/public/users/delete?userId=' + userId;
    return this.apiService.put(
      apiUrl,
      '',
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  updateUser(userId: number, formData: any) {
    const apiUrl = '/api/users/' + userId;
    return this.apiService.put(
      apiUrl,
      formData,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  createUser(formData: any) {
    const apiUrl = '/api/users';
    return this.apiService.post(
      apiUrl,
      formData,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getOptimizedClinicServiceCategories(clinicId: any) {
    let apiUrl = '/api/v1/clinics/serviceCategories';
    if (clinicId != null && clinicId != '') {
      apiUrl = apiUrl + '?clinicId=' + clinicId;
    } else {
      apiUrl = apiUrl + '?clinicId=';
    }
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getClinics() {
    const apiUrl = '/api/v1/clinics/allClinics';
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getOptimizedCategoriesServices(categoryId: any) {
    let url = '/api/v1/services/serviceCategories';
    if (categoryId != null && categoryId != '') {
      url = url + '?categoryId=' + categoryId;
    } else {
      url = url + '?categoryId=';
    }
    return this.apiService.get(
      url,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  uploadImage(userId: number, formData: FormData) {
    const apiUrl = '/api/users/' + userId + '/profile';
    return this.apiService.post(
      apiUrl,
      formData,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getAllOptimizedCinicList() {
    const apiUrl = '/api/v1/clinics/all';
    return this.apiService.get(
      apiUrl,
      'Unable to load clinic list',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  createProviderSchedule(providerId: number, providerScheduleForm: any) {
    console.log('po', providerId, providerScheduleForm);
    const apiUrl = '/api/provider/' + providerId + '/schedules';
    return this.apiService.post(
      apiUrl,
      providerScheduleForm,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  createVacationSchedule(providerId: number, vacationScheduleForm: any) {
    const apiUrl = '/api/provider/' + providerId + '/vacation-schedules';
    return this.apiService.post(
      apiUrl,
      vacationScheduleForm,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getOptimizedUserClinicSchedule(
    providerId: number,
    clinicId: number,
    scheduleType: String
  ) {
    console.log('schdeule type', scheduleType);
    const apiUrl =
      '/api/v1/user/' +
      providerId +
      '/clinic/' +
      clinicId +
      '/schedules/' +
      scheduleType;
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getUserSchedule(providerId: number) {
    const apiUrl = '/api/user/' + providerId + '/schedules';
    return this.apiService.get(
      apiUrl,
      'Unable to load user schedule list',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
    // let url = this.httpHelperService.getApiUrl() + '/api/user/' + providerId + '/schedules';
    // return this.http.get<any>(url);
  }

  deleteAppointment(appointmentId: number) {
    const apiUrl = '/api/appointments/' + appointmentId;
    return this.apiService.delete(
      apiUrl,
      'Unable to delete paid appointments',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getProvidersAppointmentOptimized(userId: any) {
    const apiUrl = '/api/v1/appointment/user/' + userId;
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  resetPassword(usernmae: any) {
    const apiUrl = '/api/public/users/reset-password?username=' + usernmae;
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions(0)
    );
  }

  resetPasswordNow(passwordData: any) {
    const apiUrl = '/api/public/users/reset-password-now';
    return this.apiService.post(
      apiUrl,
      passwordData,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }
  public deleteProfile(userId: any) {
    const apiUrl = '/api/users/' + userId + '/profile/delete';
    return this.apiService.delete(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getDefaultCinicOptimized() {
    const apiUrl = '/api/clinics/default';
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }
}
