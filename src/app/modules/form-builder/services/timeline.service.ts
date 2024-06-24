import { Injectable } from '@angular/core';
import { HttpHelperService } from 'src/app/shared/services/HttpHelperService';
import { ApiService } from 'src/app/shared/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class TimelineService {
  constructor(
    private apiService: ApiService,
    private httpHelperService: HttpHelperService
  ) {}
  getTimeline(formId: number) {
    const apiUrl = `/api/form-audit/${formId}`;
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }
}
