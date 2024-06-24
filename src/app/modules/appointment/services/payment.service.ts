import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/shared/services/api.service';
import { HttpHelperService } from 'src/app/shared/services/HttpHelperService';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  constructor(
    private httpHelperService: HttpHelperService,
    private apiService: ApiService
  ) {}

  getAppointmentPayments(appointmentId: any) {
    const apiUrl = '/api/payment/appointment?appointmentId=' + appointmentId;
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getPublicQuestionnaire(businessId: number) {
    const apiUrl = '/api/public/questionnaire';
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions(businessId)
    );
  }

  getStripeAccount(businessId: any) {
    const apiUrl = '/api/public/payment/stripe/account';
    return this.apiService.post(
      apiUrl,
      {},
      '',
      false,
      this.httpHelperService.getTenantHttpOptions(businessId)
    );
  }

  createPaymentIntent(businessId: any, paymentData: any) {
    const apiUrl = '/api/public/payment/stripe/intent';
    return this.apiService.post(
      apiUrl,
      paymentData,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions(businessId)
    );
  }

  confirmPayment(businessId: any, paymentData: any) {
    const apiUrl = '/api/public/payment/stripe/confirm';
    return this.apiService.post(
      apiUrl,
      paymentData,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions(businessId)
    );
  }

  refundManually(paymentId: any, refundAmount: any) {
    const apiUrl =
      '/api/refund/payment/manually?paymentId=' +
      paymentId +
      '&refundAmount=' +
      refundAmount;
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getPublicDefaultCinic(businessId: any) {
    const apiUrl = '/api/public/v1/clinics/default';
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions(businessId)
    );
  }

  createPreBookingPaymentIntent(businessId: any, paymentData: any) {
    const apiUrl = '/api/public/prebooking/payment/stripe/intent';
    return this.apiService.post(
      apiUrl,
      paymentData,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions(businessId)
    );
  }

  confirmPreBookingPayment(businessId: any, paymentData: any) {
    const apiUrl = '/api/public/prebooking/payment/stripe/confirm';
    return this.apiService.post(
      apiUrl,
      paymentData,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions(businessId)
    );
  }

  createAppointment(businessId: any, appointmentForm: any) {
    const apiUrl = '/api/public/appointments';
    return this.apiService.post(
      apiUrl,
      appointmentForm,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions(businessId)
    );
  }

  createNewAppointment(businessId: any, appointmentForm: any) {
    const apiUrl = '/api/public/appointments/new';
    return this.apiService.post(
      apiUrl,
      appointmentForm,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions(businessId)
    );
  }

  getTwilioA2pUpgradeData(bid?: any) {
    const apiUrl = '/api/public/twilio/get_a2p';
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions(bid)
    );
  }

  saveTwilioA2pUpgradeData(body: any, bid?: any) {
    const apiUrl = '/api/public/twilio/save_a2p';
    return this.apiService.post(
      apiUrl,
      body,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions(bid)
    );
  }
}
