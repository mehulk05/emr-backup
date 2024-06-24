import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/shared/services/api.service';
import { HttpHelperService } from 'src/app/shared/services/HttpHelperService';
@Injectable({
  providedIn: 'root'
})
export class PackagePaymentService {
  constructor(
    private httpHelperService: HttpHelperService,
    private apiService: ApiService
  ) {}

  getAppointmentPayments(appointmentId: any) {
    const apiUrl =
      '/api/package/payment/appointment?appointmentId=' + appointmentId;
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getStripeAccount() {
    const apiUrl = '/api/public/package/payment/stripe/account';
    return this.apiService.post(
      apiUrl,
      {},
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  createPaymentIntent(paymentData: any) {
    const apiUrl = '/api/public/package/payment/stripe/intent';
    return this.apiService.post(
      apiUrl,
      paymentData,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  confirmPayment(paymentData: any) {
    const apiUrl = '/api/public/package/payment/stripe/confirm';
    return this.apiService.post(
      apiUrl,
      paymentData,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  createTwilioUpgradeSubscrption(tenantId: any) {
    const apiUrl = '/api/public/upgrade/subscribe/' + tenantId;
    return this.apiService.post(
      apiUrl,
      {},
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  updateFailedPayment(paymentData: any) {
    const apiUrl = '/api/public/package/payment/stripe/failed';
    return this.apiService.put(
      apiUrl,
      paymentData,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  createStripeCustomerAndAssignPaymentDetails(
    paymentId: string,
    businessId: any
  ) {
    const apiUrl =
      '/api/public/v1/subscription/update_default_payment/' + paymentId;
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions(businessId)
    );
  }

  subscribeToProduct(payload: any) {
    const apiUrl = '/api/public/v1/subscription/subscribe/' + payload.packageId;
    return this.apiService.post(
      apiUrl,
      payload,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getSubscriptions() {
    const apiUrl = '/api/public/v1/subscription/getSubscriptions';
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  unsubscribePackage(subscriptionId: any) {
    const apiUrl = '/api/public/v1/subscription/unsubscribe/' + subscriptionId;
    return this.apiService.post(
      apiUrl,
      {},
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getCustomerDefaultPayament() {
    const apiUrl = '/api/public/v1/subscription/get_customer_payment_details';
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getPaymentsList() {
    const apiUrl = '/api/public/v1/subscription/payments';
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getUpgradePaymentsList() {
    const apiUrl = '/api/public/v1/subscription/payments/upgrade';
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }
}
