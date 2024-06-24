import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReviewListComponent } from './components/review-list/review-list.component';
import { AuthGuard } from 'src/app/shared/services/auth-guards/auth.guard';
import { AddEditConfigurationComponent } from './components/add-edit-configuration/add-edit-configuration.component';
import { ContactFormTabComponent } from './components/contact-form-tab/contact-form-tab.component';
import { FormsBuilderSharedModuleModule } from './forms-builder-shared-module.module';
import { FormSubmissionAnsComponent } from './form-submission-ans/form-submission-ans.component';
import { ContactFormNotificationFormComponent } from './components/contact-form-notification-form/contact-form-notification-form.component';

const routes: Routes = [
  {
    path: '',
    component: ReviewListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'review',
    component: ReviewListComponent,
    canActivate: [AuthGuard]
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
  declarations: [],
  imports: [
    CommonModule,
    FormsBuilderSharedModuleModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class ReviewFormModule {}
