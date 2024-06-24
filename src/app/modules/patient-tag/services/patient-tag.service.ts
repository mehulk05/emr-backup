import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/shared/services/api.service';
import { HttpHelperService } from 'src/app/shared/services/HttpHelperService';
@Injectable({
  providedIn: 'root'
})
export class PatientTagService {
  constructor(
    private httpHelperService: HttpHelperService,
    private apiService: ApiService
  ) {}

  patientTagList() {
    const apiUrl = '/api/ptag/list';
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  deleteTagById(id: any) {
    const apiUrl = '/api/ptag/' + id;
    return this.apiService.delete(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  create(formData: any) {
    const apiUrl = '/api/ptag';
    return this.apiService.post(
      apiUrl,
      formData,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  get(id: any) {
    const apiUrl = '/api/ptag/' + id;
    return this.apiService.get(
      apiUrl,
      'Unable to load Patients',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  update(id: any, formData: any) {
    const apiUrl = '/api/ptag/' + id;
    return this.apiService.put(
      apiUrl,
      formData,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  list() {
    const apiUrl = '/api/ptag/list';
    return this.apiService.get(
      apiUrl,
      'Unable to load Questionaries',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }
}
