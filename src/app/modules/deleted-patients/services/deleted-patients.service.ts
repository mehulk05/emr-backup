import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/shared/services/api.service';
import { HttpHelperService } from 'src/app/shared/services/HttpHelperService';

@Injectable({
  providedIn: 'root'
})
export class DeletedPatientsService {
  constructor(
    private httpHelperService: HttpHelperService,
    private apiService: ApiService
  ) {}

  getPatientsWithFilterParams(page: any, size: any) {
    const apiUrl = '/api/patients/deleted?page=' + page + '&size=' + size;
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  convertToPatients(patientIds: any) {
    const apiUrl = '/api/patient/mass-recover';
    return this.apiService.put(
      apiUrl,
      patientIds,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getPatientsWithSearchParam(page: any, size: any, search?: string) {
    const apiUrl =
      '/api/patients/deleted?page=' +
      page +
      '&size=' +
      size +
      '&search=' +
      search;
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }
}
