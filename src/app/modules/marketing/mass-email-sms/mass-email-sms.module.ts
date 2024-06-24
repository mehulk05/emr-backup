import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MassEmailSmsRoutingModule } from './mass-email-sms-routing.module';
import { MassEmailSmsListComponent } from './components/mass-email-sms-list/mass-email-sms-list.component';
import { AddEditMassEmailSmsComponent } from './components/add-edit-mass-email-sms/add-edit-mass-email-sms.component';
import { FormsModule } from '@angular/forms';
import { NgPrimeModule } from '../../ng-prime/ng-prime.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { AddEditTriggersComponent } from './components/add-edit-triggers/add-edit-triggers.component';
import { TriggersListComponent } from './components/triggers-list/triggers-list.component';
import { TriggerEditSmsTemplateComponent } from './components/trigger-edit-sms-template/trigger-edit-sms-template.component';
import { TriggerEditEmailTemplateComponent } from './components/trigger-edit-email-template/trigger-edit-email-template.component';
import { CKEditorModule } from 'ckeditor4-angular';
import { PreviewEmailSmsTemplateComponent } from './components/preview-email-sms-template/preview-email-sms-template.component';
import { MassEmailSmsAudtiDetailComponent } from './components/mass-email-sms-audti-detail/mass-email-sms-audti-detail.component';
import { PreviewAuditTemplateComponent } from './components/preview-audit-template/preview-audit-template.component';
import { CompletedEmailAuditListComponent } from './components/mass-email-sms-audti-detail/completed-email-audit-list/completed-email-audit-list.component';
import { CompletedSmsAuditListComponent } from './components/mass-email-sms-audti-detail/completed-sms-audit-list/completed-sms-audit-list.component';
import { TriggersTabComponent } from './components/triggers-list/triggers-tab/triggers-tab.component';
import { AppointmentTriggersListComponent } from './components/triggers-list/appointment-triggers-list/appointment-triggers-list.component';
import { LeadsTriggersListComponent } from './components/triggers-list/leads-triggers-list/leads-triggers-list.component';
import { MassEmailSmsTabComponent } from './components/mass-email-sms-tab/mass-email-sms-tab.component';
import { MatMenuModule } from '@angular/material/menu';
import { TriggerAuditComponent } from './components/triggers-list/trigger-audit/trigger-audit.component';
import { SmsSegmentsWarningComponent } from './components/sms-segments-warning/sms-segments-warning.component';
import { EmailSegmentsWarningComponent } from './components/email-segments-warning/email-segments-warning.component';
import { NgChartsModule } from 'ng2-charts';
@NgModule({
  declarations: [
    MassEmailSmsListComponent,
    AddEditMassEmailSmsComponent,
    TriggersListComponent,
    AddEditTriggersComponent,
    TriggerEditSmsTemplateComponent,
    TriggerEditEmailTemplateComponent,
    PreviewEmailSmsTemplateComponent,
    MassEmailSmsAudtiDetailComponent,
    PreviewAuditTemplateComponent,
    CompletedEmailAuditListComponent,
    CompletedSmsAuditListComponent,
    TriggersTabComponent,
    AppointmentTriggersListComponent,
    LeadsTriggersListComponent,
    MassEmailSmsTabComponent,
    TriggerAuditComponent,
    SmsSegmentsWarningComponent,
    EmailSegmentsWarningComponent
  ],
  imports: [
    FormsModule,
    CommonModule,
    NgPrimeModule,
    MassEmailSmsRoutingModule,
    SharedModule,
    CKEditorModule,
    MatMenuModule,
    NgChartsModule
  ]
})
export class MassEmailSmsModule {}
