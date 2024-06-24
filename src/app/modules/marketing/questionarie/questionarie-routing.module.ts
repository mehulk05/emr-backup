import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/shared/services/auth-guards/auth.guard';
import { ContactFormTabComponent } from './components/contact-form-tab/contact-form-tab.component';
import { QuestionarieListComponent } from './components/questionarie-list/questionarie-list.component';
import { AddEditConsentsComponent } from './consents/components/add-edit-consents/add-edit-consents.component';
import { ContactFormNotificationFormComponent } from './components/contact-form-notification-form/contact-form-notification-form.component';
import { QuestionnaireSubmissionAnsComponent } from './questionnaire-submission-ans/questionnaire-submission-ans.component';
import { ConsentContainerComponent } from './consents/components/consent-container/consent-container.component';
import { AddEditConfigurationComponent } from './components/add-edit-configuration/add-edit-configuration.component';
const routes: Routes = [
  {
    path: 'consents',
    component: ConsentContainerComponent,
    canActivate: [AuthGuard],
    data: {
      breadcrumb: 'Consents List'
    }
  },
  {
    path: 'consents/create',
    component: AddEditConsentsComponent,
    canActivate: [AuthGuard],
    data: {
      breadcrumb: 'Create Consent'
    }
  },
  {
    path: 'consents/:consentId/edit',
    component: AddEditConsentsComponent,
    canActivate: [AuthGuard],
    data: {
      breadcrumb: 'Edit Consent'
    }
  },
  {
    path: 'questionnaire',
    component: QuestionarieListComponent,
    canActivate: [AuthGuard],
    data: {
      breadcrumb: 'Questionnaires List'
    }
  },
  {
    path: 'questionnaire/create',
    component: AddEditConfigurationComponent,
    canActivate: [AuthGuard],
    data: {
      breadcrumb: 'Create Questionnaire'
    }
  },
  {
    path: 'questionnaire/:questionnaireId/edit',
    component: ContactFormTabComponent,
    canActivate: [AuthGuard],
    data: {
      breadcrumb: 'Edit Questionnaire'
    }
  },
  {
    path: 'questionnaire/:questionnaireId/lead-capture-form',
    component: ContactFormTabComponent,
    canActivate: [AuthGuard],
    data: {
      breadcrumb: 'Edit Questionnaire'
    }
  },
  {
    path: ':questionnaireId/view-ans/:questionnaireSubmissionId',
    component: QuestionnaireSubmissionAnsComponent,
    canActivate: [AuthGuard],
    data: {
      breadcrumb: 'Edit Form'
    }
  },
  {
    path: 'questionnaire/:questionnaireId/notification/create',
    component: ContactFormNotificationFormComponent,
    canActivate: [AuthGuard],
    data: {
      breadcrumb: 'Create Notification'
    }
  },
  {
    path: 'questionnaire/:questionnaireId/notification/edit/:notificationId',
    component: ContactFormNotificationFormComponent,
    canActivate: [AuthGuard],
    data: {
      breadcrumb: 'Edit Questionnaire'
    }
  },
  {
    path: 'questionnaire/:questionnaireId/configuration/edit',
    component: AddEditConfigurationComponent,
    canActivate: [AuthGuard],
    data: {
      breadcrumb: 'Edit Questionnaire'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QuestionarieRoutingModule {}
