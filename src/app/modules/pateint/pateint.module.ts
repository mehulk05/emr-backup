import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PateintRoutingModule } from './pateint-routing.module';
import { PatientListComponent } from './components/patient-list/patient-list.component';
import { AddEditPatientFormComponent } from './components/add-edit-patient-form/add-edit-patient-form.component';
import { NgPrimeModule } from '../ng-prime/ng-prime.module';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { PatientQuestionarieComponent } from './components/patient-questionarie/patient-questionarie.component';
import { PatientConsentComponent } from './components/patient-consent/patient-consent.component';
import { PatientPaymentComponent } from './components/patient-payment/patient-payment.component';
import { PatientAppointmentComponent } from './components/patient-appointment/patient-appointment.component';
import { PatientTabComponent } from './components/patient-tab/patient-tab.component';
import { EditPateintQuestionarieComponent } from './components/patient-questionarie/edit-pateint-questionarie/edit-pateint-questionarie.component';
import { AssignPatientQuestionarieComponent } from './components/patient-questionarie/assign-patient-questionarie/assign-patient-questionarie.component';
import { PatientQuestionarieAnsComponent } from './components/patient-questionarie/patient-questionarie-ans/patient-questionarie-ans.component';
import { AssignPatientConsentComponent } from './components/patient-consent/assign-patient-consent/assign-patient-consent.component';
import { FileSaverModule } from 'ngx-filesaver';
import { PatientTaskComponent } from './components/patient-task/patient-task.component';
import { AddEditPatientTaskComponent } from './components/patient-task/add-edit-patient-task/add-edit-patient-task.component';
import { PatientTimelineComponent } from './components/patient-timeline/patient-timeline.component';
import { PreviewEmailSmsTemplateComponent } from './components/patient-timeline/preview-email-sms-template/preview-email-sms-template.component';
import { EditPatientModalComponent } from './components/edit-patient-modal/edit-patient-modal.component';
import { PatientDetailComponent } from './components/patient-detail/patient-detail.component';
import { PatientDetailLeftTabComponent } from './components/patient-detail/patient-detail-left-tab/patient-detail-left-tab.component';
import { PatientDetailRightTabComponent } from './components/patient-detail/patient-detail-right-tab/patient-detail-right-tab.component';
import { PatientFilterComponent } from './components/patient-list/patient-filter/patient-filter.component';
import { PatientStatusColorBoxComponent } from './components/patient-list/patient-status-color-box/patient-status-color-box.component';
import { PatientInlineEditComponent } from './components/patient-detail/patient-inline-edit/patient-inline-edit.component';
import { PatientDashboardComponent } from './components/patient-dashboard/patient-dashboard.component';
import { PatientGraphComponent } from './components/patient-dashboard/patient-graph/patient-graph.component';
import { PatientDyanamicTableComponent } from './components/patient-detail/patient-dyanamic-table/patient-dyanamic-table.component';
import { PatientNotesModalComponent } from './dialogs/patient-notes-modal/patient-notes-modal.component';
import { PateintDetailSinglePageComponent } from './components/pateint-detail-single-page/pateint-detail-single-page.component';
import { DynamicTable1Component } from './components/patient-detail/patient-dyanamic-table/dynamic-table1/dynamic-table1.component';
import { TwoWayTextModule } from '../two-way-text/two-way-text.module';
import { PatientDetailMiddleTabComponent } from './components/patient-detail/patient-detail-middle-tab/patient-detail-middle-tab.component';
import { MatMenuModule } from '@angular/material/menu';
import { NotesUserlistPopupComponent } from './components/notes-userlist-popup/notes-userlist-popup.component';

@NgModule({
  declarations: [
    PatientListComponent,
    AddEditPatientFormComponent,
    PatientQuestionarieComponent,
    PatientConsentComponent,
    PatientPaymentComponent,
    PatientAppointmentComponent,
    PatientTabComponent,
    EditPateintQuestionarieComponent,
    AssignPatientQuestionarieComponent,
    PatientQuestionarieAnsComponent,
    AssignPatientConsentComponent,
    PatientTaskComponent,
    AddEditPatientTaskComponent,
    PatientTimelineComponent,
    PreviewEmailSmsTemplateComponent,
    EditPatientModalComponent,
    PatientDetailComponent,
    PatientDetailLeftTabComponent,
    PatientDetailRightTabComponent,
    PatientDetailMiddleTabComponent,
    PatientFilterComponent,
    PatientStatusColorBoxComponent,
    PatientInlineEditComponent,
    PatientDashboardComponent,
    PatientGraphComponent,
    PatientDyanamicTableComponent,
    PatientNotesModalComponent,
    PateintDetailSinglePageComponent,
    DynamicTable1Component,
    NotesUserlistPopupComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    PateintRoutingModule,
    NgPrimeModule,
    SharedModule,
    FileSaverModule,
    TwoWayTextModule,
    ReactiveFormsModule,
    MatMenuModule
  ],
  exports: [AssignPatientConsentComponent, AssignPatientQuestionarieComponent]
})
export class PateintModule {}
