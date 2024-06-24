import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/shared/services/api.service';
import { HttpHelperService } from 'src/app/shared/services/HttpHelperService';

@Injectable({
  providedIn: 'root'
})
export class OnlineMeetingService {
  constructor(
    private httpHelperService: HttpHelperService,
    private apiService: ApiService
  ) {}

  public startOnlineMeeting(appointmentId: number) {
    const apiUrl = '/api/appointments/' + appointmentId + '/meetings/start';
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  public endOnlineMeeting(appointmentId: number) {
    const apiUrl = '/api/appointments/' + appointmentId + '/meetings/delete';
    return this.apiService.delete(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }
}
