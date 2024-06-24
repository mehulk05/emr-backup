import { Injectable } from '@angular/core';
import { HttpHelperService } from 'src/app/shared/services/HttpHelperService';
import { ApiService } from 'src/app/shared/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class TriggerExcelService {
  constructor(
    private httpHelperService: HttpHelperService,
    private apiService: ApiService
  ) {}

  downloadTriggerExcel(body: any) {
    const apiUrl = '/api/v1/trigger/excel';
    return this.apiService.saveExcelPost(
      apiUrl,
      false,
      body,
      this.httpHelperService.getTenantHttpOptions(),
      false,
      true
    );
  }

  uploadFile(formData: any) {
    const apiUrl = '/api/v1/trigger/upload';
    return this.apiService.post(
      apiUrl,
      formData,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions(),
      false,
      true
    );
  }
}
