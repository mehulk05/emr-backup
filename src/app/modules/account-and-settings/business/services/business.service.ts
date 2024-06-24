/* eslint-disable prettier/prettier */
import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/shared/services/api.service';
import { HttpHelperService } from 'src/app/shared/services/HttpHelperService';

@Injectable({
  providedIn: 'root'
})
export class BusinessService {
  constructor(
    private httpHelperService: HttpHelperService,
    private apiService: ApiService
  ) {}

  getBusinessOptimized(businessId: any) {
    const apiUrl = '/api/v1/businesses/' + businessId;
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions(businessId)
    );
  }

  getBusinessOptimizedd(businessId: any) {
    const apiUrl = '/api/businesses/' + businessId; ///api/businesses/{businessId}
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions(businessId)
    );
  }

  getBuyPacks() {
    const apiUrl = '/api/public/emailSmsPackage';
    return this.apiService.get(
      apiUrl,
      'Unable to load Buy Packs',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getBusinessOptimizedList() {
    const apiUrl = '/api/all/businesses';
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getAuthKey() {
    const apiUrl = '/api/keys/';
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  exportFile() {
    const apiUrl = '/api/onboardingAndFineart/export';
    return this.apiService.getPdf(
      apiUrl,
      {},
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  patchUpdateBusinessInfo(businessId: number, formData: FormData) {
    const apiUrl = '/api/businesses/' + businessId + '/profile';
    return this.apiService.patch(
      apiUrl,
      formData,
      'Unable to update business information',
      false,
      this.httpHelperService.getTenantHttpOptions(businessId)
    );
  }

  updateBusiness(businessId: number, formData: FormData) {
    const apiUrl = '/api/businesses/' + businessId;
    return this.apiService.put(
      apiUrl,
      formData,
      'Unable to update business information',
      false,
      this.httpHelperService.getTenantHttpOptions(businessId)
    );
  }
  uploadLogo(businessId: number, formData: FormData) {
    console.log('formdata', formData);
    const apiUrl = '/api/businesses/' + businessId + '/logo';
    return this.apiService.post(
      apiUrl,
      formData,
      'Unable to update Logo for buisness',
      false,
      this.httpHelperService.getTenantHttpOptions(businessId)
    );
  }
  uploadFile(formData: FormData) {
    const apiUrl = '/api/onboardingAndFineart/upload';
    return this.apiService.post(
      apiUrl,
      formData,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  updateBusinessSubdomain(businessId: number, businessForm: any) {
    const apiUrl = '/api/businesses/' + businessId + '/subdomain';
    return this.apiService.put(
      apiUrl,
      businessForm,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions(businessId)
    );
  }

  updateBusinessConfiguration(businessId: number, businessForm: any) {
    const apiUrl = '/api/businesses/' + businessId + '/configuration';
    return this.apiService.put(
      apiUrl,
      businessForm,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions(businessId)
    );
  }

  updateBusinessNotification(businessId: number, businessForm: any) {
    const apiUrl = '/api/businesses/' + businessId + '/notification';
    return this.apiService.put(
      apiUrl,
      businessForm,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions(businessId)
    );
  }

  updateTwoWayTextStatus(businessId: number, businessForm: any) {
    const apiUrl = `/api/businesses/${businessId}/notification/two-way-text`;
    return this.apiService.put(
      apiUrl,
      businessForm,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions(businessId)
    );
  }

  updateSmsForwardingStatus(businessId: number, businessForm: any) {
    const apiUrl = `/api/businesses/${businessId}/notification/sms-forwarding`;
    return this.apiService.put(
      apiUrl,
      businessForm,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions(businessId)
    );
  }

  updateSmsAIMessageStatus(businessId: number, businessForm: any) {
    const apiUrl = `/api/businesses/${businessId}/notification/sms-ai-suggestion`;
    return this.apiService.put(
      apiUrl,
      businessForm,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions(businessId)
    );
  }

  updateBusinessPaymentRefund(businessId: number, businessForm: any) {
    const apiUrl = '/api/paymentRefund/businesses/' + businessId;
    return this.apiService.put(
      apiUrl,
      businessForm,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions(businessId)
    );
  }
  updateBusinessDataStudioCode(businessId: number, businessForm: any) {
    const apiUrl = '/api/businesses/' + businessId + '/dataStudio';
    return this.apiService.put(
      apiUrl,
      businessForm,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions(businessId)
    );
  }

  updateBusinessseoCode(businessId: number, businessForm: any) {
    const apiUrl = '/api/businesses/' + businessId + '/seo';
    return this.apiService.put(
      apiUrl,
      businessForm,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions(businessId)
    );
  }

  updateBusinessPaidMediaCode(businessId: number, businessForm: any) {
    const apiUrl = '/api/businesses/' + businessId + '/paidMedia';
    return this.apiService.put(
      apiUrl,
      businessForm,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions(businessId)
    );
  }

  updateSyndicationReport(businessId: number, businessForm: any) {
    const apiUrl = '/api/businesses/' + businessId + '/syndication';
    return this.apiService.put(
      apiUrl,
      businessForm,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions(businessId)
    );
  }

  updateBusinessTrackingCode(businessId: number, businessForm: any) {
    const apiUrl = '/api/businesses/' + businessId + '/trackingcode';
    return this.apiService.put(
      apiUrl,
      businessForm,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions(businessId)
    );
  }

  getEmailSmsCount() {
    const apiUrl = '/api/v1/audit/email-sms/count';
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  disableAestheticRecords(id: any, value: any) {
    const apiUrl =
      '/api/api-integrations/enable?id=' + id + '&disable=' + value;
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  disableAestheticRecordsAPiPull(id: any, value: any) {
    const apiUrl =
      '/api/api-integrations/pull/enable?id=' + id + '&disable=' + value;
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getTriggerAudit(communicationType: string) {
    const apiUrl =
      '/api/v1/audit/email-sms/trigger/count?communicationType=' +
      communicationType;
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getTriggerAuditDetails(
    triggerId: number,
    communicationType: string,
    triggerModule: string
  ) {
    const apiUrl =
      '/api/v1/audit/email-sms/trigger/' +
      triggerId +
      '?communicationType=' +
      communicationType +
      '&triggerModule=' +
      triggerModule;
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getEmailSmsBody(id: any) {
    const apiUrl = '/api/v1/audit/appointment/content?id=' + id;
    return this.apiService.getText(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptionsForHtml()
    );
  }

  getEmailSmsPackage() {
    const apiUrl = '/api/emailSmsPackage/all';
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  saveApiIntegrationRecords(formData: any) {
    const apiUrl = '/api/api-integrations';
    return this.apiService.post(
      apiUrl,
      formData,
      'Unable to update API integration information',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getApiIntegrationRecords(type: any) {
    const apiUrl = '/api/api-integrations?type=' + type;
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getApiIntegrationRecordsActive() {
    const apiUrl = '/api/api-integrations/active';
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getApiIntegrationStatus() {
    const apiUrl = '/api/api-integrations/status';
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getApiIntegrationHistoryCountRecords(type: any) {
    const apiUrl = '/api/api-integrations/histories/count?type=' + type;
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getApiIntegrationHistoryRecords(type: any, page: any, size: any) {
    const apiUrl =
      '/api/api-integrations/histories?type=' +
      type +
      '&page=' +
      page +
      '&size=' +
      size;
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  callAestheticRecords(type: any, formData: any, id: any) {
    const apiUrl =
      '/api/api-integrations/thirdParty?id=' + id + '&type=' + type;
    return this.apiService.post(
      apiUrl,
      formData,
      'Unable to update Api Aesthetic records information',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getSyndicationReport() {
    const apiUrl = '/api/syndicationReports';
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  addSyndicationReport(formData: any) {
    const apiUrl = '/api/syndicationReports';
    return this.apiService.post(
      apiUrl,
      formData,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  removeReport(id: any) {
    const apiUrl = '/api/syndicationReports/' + id;
    return this.apiService.delete(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  updateSyndicationReportById(formData: any, id: any) {
    const apiUrl = '/api/syndicationReports/' + id;
    return this.apiService.put(
      apiUrl,
      formData,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  updateSmsAutoReplyStatus(businessId: number, status: any) {
    const apiUrl = `/api/business/smsAutoReply/${status}`;
    return this.apiService.put(
      apiUrl,
      '',
      '',
      false,
      this.httpHelperService.getTenantHttpOptions(businessId)
    );
  }

  getOptedOutEmailSMS() {
    const apiUrl = '/api/outout/emails';
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  updateEmailNotificationForMessages(businessId: number, status: any) {
    const apiUrl = `/api/business/emailNotificationForSms/${status}`;
    return this.apiService.put(
      apiUrl,
      '',
      '',
      false,
      this.httpHelperService.getTenantHttpOptions(businessId)
    );
  }

  getOptedOutEmailSMSListForBusiness(businessId: number) {
    const apiUrl = '/api/optout/list/' + businessId;
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }
}
