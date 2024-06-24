import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PatientProfileModule } from './modules/patient-profile/patient-profile.module';
import { PatientDashboardModule } from './modules/patient-dashboard/patient-dashboard.module';
import { PatientAppointmentModule } from './modules/patient-appointment/patient-appointment.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    PatientProfileModule,
    PatientDashboardModule,
    PatientAppointmentModule,
    FormsModule
  ]
})
export class PatientPortalModuleModule {}
