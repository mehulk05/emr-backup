import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/shared/services/auth-guards/auth.guard';
import { PatientDetailComponent } from './components/patient-detail/patient-detail.component';
import { PatientListComponent } from './components/patient-list/patient-list.component';
import { EditPateintQuestionarieComponent } from './components/patient-questionarie/edit-pateint-questionarie/edit-pateint-questionarie.component';
import { PatientQuestionarieAnsComponent } from './components/patient-questionarie/patient-questionarie-ans/patient-questionarie-ans.component';
import { PatientTabComponent } from './components/patient-tab/patient-tab.component';

const routes: Routes = [
  {
    path: '',
    component: PatientListComponent,
    canActivate: [AuthGuard],
    data: {
      breadcrumb: 'Patients List'
    }
  },
  {
    path: ':patientId/edit',
    component: PatientTabComponent,
    canActivate: [AuthGuard],
    data: {
      breadcrumb: 'Patient Detail'
    }
  },
  {
    path: ':patientId/detail',
    component: PatientDetailComponent,
    canActivate: [AuthGuard],
    data: {
      breadcrumb: 'Patient Detail'
    }
  },
  {
    path: 'create',
    component: PatientTabComponent,
    canActivate: [AuthGuard],
    data: {
      breadcrumb: 'Create Patient'
    }
  },
  {
    path: ':patientId/questionnaire/:questionnaireId',
    component: PatientQuestionarieAnsComponent,
    canActivate: [AuthGuard],
    data: {
      breadcrumb: 'View Questionnaire'
    }
  },
  {
    path: ':patientId/questionnaire/:questionnaireId/fill',
    component: EditPateintQuestionarieComponent,
    canActivate: [AuthGuard],
    data: {
      breadcrumb: 'Fill Questionnaire'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PateintRoutingModule {}
