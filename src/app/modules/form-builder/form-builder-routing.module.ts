import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/shared/services/auth-guards/auth.guard';
import { ContactFormNotificationFormComponent } from './components/contact-form-notification-form/contact-form-notification-form.component';
import { ContactFormTabComponent } from './components/contact-form-tab/contact-form-tab.component';
import { AddEditConfigurationComponent } from './components/add-edit-configuration/add-edit-configuration.component';
import { QuestionarieListComponent } from './components/questionarie-list/questionarie-list.component';
import { FormSubmissionAnsComponent } from './form-submission-ans/form-submission-ans.component';
import { PatientFormSubmissionAnsComponent } from './patient-form-submission-ans/patient-form-submission-ans.component';
const routes: Routes = [
  {
    path: '',
    component: QuestionarieListComponent,
    canActivate: [AuthGuard],
    data: {
      breadcrumb: 'Form List'
    }
  },
  {
    path: 'create',
    component: AddEditConfigurationComponent,
    canActivate: [AuthGuard],
    data: {
      breadcrumb: 'Create Form'
    }
  },
  {
    path: ':questionnaireId/edit',
    component: ContactFormTabComponent,
    canActivate: [AuthGuard],
    data: {
      breadcrumb: 'Edit Form'
    }
  },
  {
    path: ':questionnaireId/view-ans/:questionnaireSubmissionId',
    component: FormSubmissionAnsComponent,
    canActivate: [AuthGuard],
    data: {
      breadcrumb: 'Edit Form'
    }
  },
  {
    path: 'patient/:patientId/questionnaire/:questionnaireId/view-ans/:questionnaireSubmissionId',
    component: PatientFormSubmissionAnsComponent,
    canActivate: [AuthGuard],
    data: {
      breadcrumb: 'Edit Form'
    }
  },
  {
    path: ':questionnaireId/lead-capture-form',
    component: ContactFormTabComponent,
    canActivate: [AuthGuard],
    data: {
      breadcrumb: 'Edit Questionnaire'
    }
  },
  {
    path: ':questionnaireId/notification/create',
    component: ContactFormNotificationFormComponent,
    canActivate: [AuthGuard],
    data: {
      breadcrumb: 'Create Notification'
    }
  },
  {
    path: ':questionnaireId/notification/edit/:notificationId',
    component: ContactFormNotificationFormComponent,
    canActivate: [AuthGuard],
    data: {
      breadcrumb: 'Edit Notification'
    }
  },
  {
    path: ':questionnaireId/configuration/edit',
    component: AddEditConfigurationComponent,
    canActivate: [AuthGuard],
    data: {
      breadcrumb: 'Add/Edit Configuration'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FormBuilderRoutingModule {}
