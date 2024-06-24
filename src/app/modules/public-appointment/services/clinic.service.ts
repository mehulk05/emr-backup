import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/shared/services/api.service';
import { HttpHelperService } from 'src/app/shared/services/HttpHelperService';

@Injectable({
  providedIn: 'root'
})
export class ClinicService {
  constructor(
    private httpHelperService: HttpHelperService,
    private apiService: ApiService
  ) {}

  getPublicDefaultCinic(businessId: any) {
    const apiUrl = '/api/public/v1/clinics/default';
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions(businessId)
    );
  }

  getDefaultCinic() {
    const apiUrl = '/api/clinics/default';
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getClinic(businessId: any, clinicId: any) {
    const apiUrl = '/api/public/clinics/' + clinicId;
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

  getClinicOptimized(businessId: any, clinicId: any) {
    const apiUrl = '/api/public/v1/clinics/' + clinicId;
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions(businessId)
    );
  }

  getClinicServicesOptimized(businessId: any, clinicId: any) {
    const apiUrl = '/api/public/v1/services/clinics/' + clinicId;
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions(businessId)
    );
  }

  getClinicProvidersOptimized(businessId: any, clinicId: any) {
    const apiUrl = '/api/public/v1/users/' + clinicId + '/providers';
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions(businessId)
    );
  }
}
