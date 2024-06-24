import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PatientPaymentDetailComponent } from '../patient-dashboard/components/patient-payment-detail/patient-payment-detail.component';
import { PatientAppointmentCComponent } from './components/patient-appointment-c/patient-appointment-c.component';
import { PatientAppointmmentViewComponent } from './components/patient-appointmment-view/patient-appointmment-view.component';
import { PatientMeetingComponent } from './components/patient-meeting/patient-meeting.component';

const routes: Routes = [
  {
    path: 'myappointments',
    component: PatientAppointmentCComponent,
    data: { showHeader: true, showSidebar: true, showFooter: false }
  },
  {
    path: 'patient/appointment/:appointmentId/preview',
    component: PatientAppointmmentViewComponent,
    data: { showHeader: true, showSidebar: true, showFooter: false }
  },
  {
    path: 'patient/appointment/:appointmentId/payment',
    component: PatientPaymentDetailComponent,
    data: { showHeader: true, showSidebar: true, showFooter: false }
  },
  {
    path: 'patient/appointment/:appointmentId/meeting',
    component: PatientMeetingComponent,
    data: { showHeader: true, showSidebar: true, showFooter: false }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PatientAppointmentRoutingModule {}
