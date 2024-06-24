import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PatientDashboardRoutingModule } from './patient-dashboard-routing.module';
import { PatientDashboardComponent } from './components/patient-dashboard/patient-dashboard.component';
import { PatientQuestionarieComponent } from './components/patient-questionarie/patient-questionarie.component';
import { PatientPaymentComponent } from './components/patient-payment/patient-payment.component';
import { PatientAppointmentComponent } from './components/patient-appointment/patient-appointment.component';
import { PatientConsentComponent } from './components/patient-consent/patient-consent.component';
import { PatientDashboardTabComponent } from './components/patient-dashboard-tab/patient-dashboard-tab.component';
import { NgPrimeModule } from 'src/app/modules/ng-prime/ng-prime.module';
import { FileSaverModule } from 'ngx-filesaver';
import { PateintModule } from 'src/app/modules/pateint/pateint.module';
import { EditQuestionarieComponent } from './components/edit-questionarie/edit-questionarie.component';
import { ReactiveFormsModule } from '@angular/forms';
import { PatientPaymentDetailComponent } from './components/patient-payment-detail/patient-payment-detail.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgxPrintModule } from 'ngx-print';

@NgModule({
  declarations: [
    PatientDashboardComponent,
    PatientQuestionarieComponent,
    PatientPaymentComponent,
    PatientAppointmentComponent,
    PatientConsentComponent,
    PatientDashboardTabComponent,
    EditQuestionarieComponent,
    PatientPaymentDetailComponent
  ],
  imports: [
    CommonModule,
    PatientDashboardRoutingModule,
    NgPrimeModule,
    SharedModule,
    FileSaverModule,
    PateintModule,
    ReactiveFormsModule,
    NgxPrintModule
  ]
})
export class PatientDashboardModule {}
