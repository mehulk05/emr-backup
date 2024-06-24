import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PatientChangePasswordComponent } from './components/patient-change-password/patient-change-password.component';
import { PatientProfileTabComponent } from './components/patient-profile-tab/patient-profile-tab.component';

const routes: Routes = [
  {
    path: 'patient/profile',
    component: PatientProfileTabComponent,
    data: { showHeader: true, showSidebar: true, showFooter: false }
  },
  {
    path: 'patient/change-password',
    component: PatientChangePasswordComponent,
    data: { showHeader: true, showSidebar: true, showFooter: false }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PatientProfileRoutingModule {}
