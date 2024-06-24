import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DragDropModule } from '@angular/cdk/drag-drop';
import { FormsModule } from '@angular/forms';
import { CKEditorModule } from 'ckeditor4-angular';
import { NgPrimeModule } from '../ng-prime/ng-prime.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { AddEditQuestionarieComponent } from './components/add-edit-questionarie/add-edit-questionarie.component';
import { AddEditConfigurationComponent } from './components/add-edit-configuration/add-edit-configuration.component';
import { ContactFormNotificationFormComponent } from './components/contact-form-notification-form/contact-form-notification-form.component';
import { ContactFormNotificationTableComponent } from './components/contact-form-notification-table/contact-form-notification-table.component';
import { ContactFormRightCardComponent } from './components/contact-form-right-card/contact-form-right-card.component';
import { ContactFormTabComponent } from './components/contact-form-tab/contact-form-tab.component';
import { QuestionBuilderComponent } from './components/question-builder/question-builder.component';
import { QuestionarieBuilderComponent } from './components/questionarie-builder/questionarie-builder.component';
import { QuestionarieListComponent } from './components/questionarie-list/questionarie-list.component';
import { FormSubmissionListComponent } from './form-submission-list/form-submission-list.component';
import { FormSubmissionAnsComponent } from './form-submission-ans/form-submission-ans.component';
import { ImageCropperModule } from 'ngx-image-cropper';
import { ReviewListComponent } from './components/review-list/review-list.component';
import { RouterModule } from '@angular/router';
import { QuestionnaireLogicComponent } from './components/questionnaire-logic/questionnaire-logic.component';
import { AddEditLogicComponent } from './components/questionnaire-logic/add-edit-logic-popup/add-edit-logic.component';
import { PatientFormSubmissionListComponent } from './patient-form-submission-list/patient-form-submission-list.component';
import { PatientFormSubmissionAnsComponent } from './patient-form-submission-ans/patient-form-submission-ans.component';
import { TimelineComponent } from './components/timeline/timeline.component';

@NgModule({
  declarations: [
    QuestionarieListComponent,
    AddEditQuestionarieComponent,
    QuestionarieBuilderComponent,
    QuestionBuilderComponent,
    ContactFormRightCardComponent,
    ContactFormTabComponent,
    ContactFormNotificationFormComponent,
    ContactFormNotificationTableComponent,
    FormSubmissionListComponent,
    FormSubmissionAnsComponent,
    ReviewListComponent,
    AddEditConfigurationComponent,
    QuestionnaireLogicComponent,
    AddEditLogicComponent,
    PatientFormSubmissionListComponent,
    PatientFormSubmissionAnsComponent,
    TimelineComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgPrimeModule,
    SharedModule,
    CKEditorModule,
    DragDropModule,
    ImageCropperModule,
    RouterModule
  ],
  exports: [
    AddEditQuestionarieComponent,
    QuestionarieBuilderComponent,
    QuestionBuilderComponent,
    ContactFormRightCardComponent,
    ContactFormTabComponent,
    ContactFormNotificationFormComponent,
    ContactFormNotificationTableComponent,
    FormSubmissionListComponent,
    FormSubmissionAnsComponent,
    ReviewListComponent,
    AddEditConfigurationComponent,
    QuestionnaireLogicComponent,
    AddEditLogicComponent
  ]
})
export class FormsBuilderSharedModuleModule {}
