import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/shared/services/api.service';
import { HttpHelperService } from 'src/app/shared/services/HttpHelperService';

@Injectable({
  providedIn: 'root'
})
export class EmailUnsubscribeService {
  constructor(
    private apiService: ApiService,
    private httpHelperService: HttpHelperService
  ) {}

  public unsubscribeEmail(email: any, tenantId: any, userType: any) {
    const apiUrl =
      '/api/public/v1/optout-email/' + userType + '?email=' + email;
    return this.apiService.putEmailUnsubscribe(
      apiUrl,
      email,
      'Unable to unsubscribe',
      false,
      this.httpHelperService.getHttpOptionsForEmailUnsubscribe(tenantId)
    );
  }
}
