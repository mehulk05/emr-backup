import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/shared/services/api.service';
import { HttpHelperService } from 'src/app/shared/services/HttpHelperService';

@Injectable({
  providedIn: 'root'
})
export class AuthHelperService {
  constructor(
    private apiService: ApiService,
    private httpHelperService: HttpHelperService
  ) {}
  public verifyEmail(token: string) {
    const apiUrl = `/api/public/users/verify-email?token=${token}`;
    return this.apiService.put(
      apiUrl,
      {},
      'Unable to verify email.',
      false,
      this.httpHelperService.getHttpOptionsForUpload(),
      {}
    );
  }
}
