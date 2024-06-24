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

  getPublicUser(userId: number, businessId: number) {
    const apiUrl = '/api/public/users/' + userId;
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions(businessId)
    );
  }

  getPublicUserClinic(userId: number, businessId: number) {
    const apiUrl = '/api/public/users/' + userId + '/clinic';
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions(businessId)
    );
  }

  getPublicUserInfoByEmail(email: string) {
    const apiUrl =
      '/api/public/users/byemail?email=' + encodeURIComponent(email);
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions(0)
    );
  }

  getPublicVacationSchedules(clinicId: number, providerId: number) {
    const apiUrl =
      '/api/public/v1/user/' +
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

  getPublicOptimizedUserClinicSchedule(
    providerId: number,
    clinicId: number,
    scheduleType: String
  ) {
    const apiUrl =
      '/api/public/v1/user/' +
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
}
