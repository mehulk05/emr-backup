import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditQuestionarieComponent } from './components/edit-questionarie/edit-questionarie.component';
import { PatientDashboardTabComponent } from './components/patient-dashboard-tab/patient-dashboard-tab.component';
import { PatientPaymentDetailComponent } from './components/patient-payment-detail/patient-payment-detail.component';

const routes: Routes = [
  {
    path: 'patient/dashboard',
    component: PatientDashboardTabComponent,
    data: { showHeader: true, showSidebar: true, showFooter: false }
  },
  {
    path: 'patient/:patientId/questionnaire/:questionnaireId',
    component: EditQuestionarieComponent,
    data: { showHeader: true, showSidebar: true, showFooter: false }
  },
  {
    path: 'patient/appointment/:appointmentId/payment',
    component: PatientPaymentDetailComponent,
    data: { showHeader: true, showSidebar: true, showFooter: false }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PatientDashboardRoutingModule {}
