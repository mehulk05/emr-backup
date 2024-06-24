import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BusinessRoutingModule } from './business-routing.module';
import { BusinessProfileComponent } from './components/business-profile/business-profile.component';
import { BusinessPersonalizationComponent } from './components/business-personalization/business-personalization.component';
import { SubdomainConfigComponent } from './components/subdomain-config/subdomain-config.component';
import { RefundPolicyComponent } from './components/refund-policy/refund-policy.component';
import { TrackingCodeComponent } from './components/tracking-code/tracking-code.component';
import { DataStudioComponent } from './components/data-studio/data-studio.component';
import { BusinessTabComponent } from './components/business-tab/business-tab.component';
import { NgPrimeModule } from '../../ng-prime/ng-prime.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ImageCropperModule } from 'ngx-image-cropper';
import { FileSaverModule } from 'ngx-filesaver';
import { ColorSketchModule } from 'ngx-color/sketch';
import { ApiDetailsComponent } from './components/api-details/api-details.component';
import { EmailSmsAuditComponent } from './components/email-sms-audit/email-sms-audit.component';
import { LeadsModule } from '../../leads/leads.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { EmailSmsAuditListComponent } from './components/email-sms-audit/email-sms-audit-list/email-sms-audit-list.component';
import { EmailSmsQuotaComponent } from './components/email-sms-audit/email-sms-quota/email-sms-quota.component';
import { EmailSmsQuotaPaymentComponent } from './components/email-sms-audit/email-sms-quota-payment/email-sms-quota-payment.component';
import { PaidMediaComponent } from './components/paid-media/paid-media.component';
import { ApiIntegrationComponent } from './components/api-integration/api-integration.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { SyndicationReportCodeComponent } from './components/syndication-report-code/syndication-report-code.component';
import { SyndicationMultipleReportsComponent } from './components/syndication-report-code/syndication-multiple-reports/syndication-multiple-reports.component';
import { BusinessConfigurationComponent } from './components/business-configuration/business-configuration.component';
import { AccountControlComponent } from './components/account-control/account-control.component';
import { ApiCardIntegrationComponent } from './components/api-card-integration/api-card-integration.component';
import { ModmedComponent } from './components/modmed/modmed.component';
import { SupportCenterComponent } from './components/support-center/support-center.component';
import { OptedoutRecordsComponent } from './components/optedout-records/optedout-records.component';
import { BusinessFormIntegrationComponent } from './components/business-form-integration/business-form-integration.component';

@NgModule({
  declarations: [
    BusinessProfileComponent,
    BusinessPersonalizationComponent,
    SubdomainConfigComponent,
    RefundPolicyComponent,
    TrackingCodeComponent,
    DataStudioComponent,
    BusinessTabComponent,
    ApiDetailsComponent,
    EmailSmsAuditComponent,
    EmailSmsAuditListComponent,
    EmailSmsQuotaComponent,
    EmailSmsQuotaPaymentComponent,
    PaidMediaComponent,
    ApiIntegrationComponent,
    SyndicationReportCodeComponent,
    SyndicationMultipleReportsComponent,
    BusinessConfigurationComponent,
    AccountControlComponent,
    ApiCardIntegrationComponent,
    ModmedComponent,
    SupportCenterComponent,
    OptedoutRecordsComponent,
    BusinessFormIntegrationComponent
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    BusinessRoutingModule,
    SharedModule,
    NgPrimeModule,
    ImageCropperModule,
    ColorSketchModule,
    FileSaverModule,
    LeadsModule,
    NgxPaginationModule
  ]
})
export class BusinessModule {}
