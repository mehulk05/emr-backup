import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/shared/services/api.service';
import { HttpHelperService } from 'src/app/shared/services/HttpHelperService';

@Injectable({
  providedIn: 'root'
})
export class MService {
  constructor(
    private httpHelperService: HttpHelperService,
    private apiService: ApiService
  ) {}

  getAllServices() {
    const apiUrl = '/api/v1/services/all';
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  deleteService(serviceId: number) {
    const apiUrl = '/api/services/' + serviceId;
    return this.apiService.delete(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getAllConsentList() {
    const apiUrl = '/api/v1/consents';
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }
  getAllQuestionnaireList() {
    const apiUrl = '/api/v1/questionnaire';
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getService(serviceId: number) {
    const apiUrl = '/api/services/' + serviceId;
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  createService(serviceForm: any) {
    const apiUrl = '/api/services';
    return this.apiService.post(
      apiUrl,
      serviceForm,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  uploadImage(serviceId: number, formData: FormData) {
    const apiUrl = '/api/services/' + serviceId + '/image';
    return this.apiService.post(
      apiUrl,
      formData,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  updateService(serviceId: number, serviceForm: any) {
    const apiUrl = '/api/services/' + serviceId;
    return this.apiService.put(
      apiUrl,
      serviceForm,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  updateTableList(serviceList: any) {
    const apiUrl = '/api/services/position';
    return this.apiService.put(
      apiUrl,
      serviceList,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }
  deleteMassServices(serviceIds: any) {
    const apiUrl = '/api/services/mass-delete';
    return this.apiService.put(
      apiUrl,
      serviceIds,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }
}
