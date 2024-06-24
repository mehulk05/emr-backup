import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { QuestionarieRoutingModule } from './questionarie-routing.module';
import { QuestionarieListComponent } from './components/questionarie-list/questionarie-list.component';
import { AddEditQuestionarieComponent } from './components/add-edit-questionarie/add-edit-questionarie.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgPrimeModule } from '../../ng-prime/ng-prime.module';
import { ConsentListComponent } from './consents/components/consent-list/consent-list.component';
import { AddEditConsentsComponent } from './consents/components/add-edit-consents/add-edit-consents.component';
import { CKEditorModule } from 'ckeditor4-angular';
import { QuestionarieBuilderComponent } from './components/questionarie-builder/questionarie-builder.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { QuestionBuilderComponent } from './components/question-builder/question-builder.component';
import { ContactFormRightCardComponent } from './components/contact-form-right-card/contact-form-right-card.component';
import { ContactFormTabComponent } from './components/contact-form-tab/contact-form-tab.component';
import { ContactFormNotificationFormComponent } from './components/contact-form-notification-form/contact-form-notification-form.component';
import { ContactFormNotificationTableComponent } from './components/contact-form-notification-table/contact-form-notification-table.component';
import { QuestionnaireSubmissionListComponent } from './questionnaire-submission-list/questionnaire-submission-list.component';
import { QuestionnaireSubmissionAnsComponent } from './questionnaire-submission-ans/questionnaire-submission-ans.component';
import { ImageCropperModule } from 'ngx-image-cropper';
import { NgxPaginationModule } from 'ngx-pagination';
import { ConsentContainerComponent } from './consents/components/consent-container/consent-container.component';
import { ConsentOthersComponent } from './consents/components/consent-others/consent-others.component';
import { AddEditConfigurationComponent } from './components/add-edit-configuration/add-edit-configuration.component';
@NgModule({
  declarations: [
    QuestionarieListComponent,
    AddEditQuestionarieComponent,
    ConsentListComponent,
    AddEditConsentsComponent,
    QuestionarieBuilderComponent,
    QuestionBuilderComponent,
    ContactFormRightCardComponent,
    ContactFormTabComponent,
    ContactFormNotificationFormComponent,
    ContactFormNotificationTableComponent,
    QuestionnaireSubmissionListComponent,
    QuestionnaireSubmissionAnsComponent,
    AddEditConfigurationComponent,
    ConsentContainerComponent,
    ConsentOthersComponent
  ],
  imports: [
    FormsModule,
    CommonModule,
    NgPrimeModule,
    QuestionarieRoutingModule,
    SharedModule,
    CKEditorModule,
    DragDropModule,
    ImageCropperModule,
    NgxPaginationModule
  ]
})
export class QuestionarieModule {}
