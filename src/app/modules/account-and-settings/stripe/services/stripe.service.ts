import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/shared/services/api.service';
import { HttpHelperService } from 'src/app/shared/services/HttpHelperService';

@Injectable({
  providedIn: 'root'
})
export class StripeService {
  constructor(
    private httpHelperService: HttpHelperService,
    private apiService: ApiService
  ) {}

  getStripeOnboardingUrl() {
    const apiUrl = '/api/stripe/onboard';
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getStripeOnboardingRefreshUrl() {
    const apiUrl = '/api/stripe/refresh';
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }
  public stripeFlowSuccess() {
    const apiUrl = '/api/stripe/success';
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  public resumeStripeOnboarding(accountId: any) {
    const apiUrl = '/api/stripe/resume-onboard?accountId=' + accountId;
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  public getStripeConnectedAccount() {
    const apiUrl = '/api/stripe/account';
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  public deleteStripeConnectedAccount(id: any) {
    const apiUrl = '/api/stripe/account/' + id;
    return this.apiService.delete(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }
}
