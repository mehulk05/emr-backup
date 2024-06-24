import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PatientAppointmentRoutingModule } from './patient-appointment-routing.module';
import { PatientAppointmentCComponent } from './components/patient-appointment-c/patient-appointment-c.component';
import { NgPrimeModule } from 'src/app/modules/ng-prime/ng-prime.module';
import { PatientAppointmmentViewComponent } from './components/patient-appointmment-view/patient-appointmment-view.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { PatientMeetingComponent } from './components/patient-meeting/patient-meeting.component';

@NgModule({
  declarations: [
    PatientAppointmentCComponent,
    PatientAppointmmentViewComponent,
    PatientMeetingComponent
  ],
  imports: [
    CommonModule,
    PatientAppointmentRoutingModule,
    NgPrimeModule,
    SharedModule
  ]
})
export class PatientAppointmentModule {}
