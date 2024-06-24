import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/shared/services/api.service';
import { HttpHelperService } from 'src/app/shared/services/HttpHelperService';

@Injectable({
  providedIn: 'root'
})
export class UserProfileService {
  constructor(
    private httpHelperService: HttpHelperService,
    private apiService: ApiService
  ) {}

  getUserById(id: any) {
    const apiUrl = '/api/v1/user/' + id;

    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  changePassword(formData: any) {
    const url = '/api/users/change-password';
    return this.apiService.post(
      url,
      formData,
      'Old password entered is not correct',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getProvidersAppointmentOptimized(userId: number) {
    const apiUrl = '/api/v1/appointment/user/' + userId;
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  deleteAppointment(appointmentId: number) {
    const apiUrl = '/api/appointments/' + appointmentId;
    return this.apiService.delete(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }
}
