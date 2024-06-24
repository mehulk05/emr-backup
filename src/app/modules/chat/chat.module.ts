import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChatRoutingModule } from './chat-routing.module';
import { ChatSessionListComponent } from './component/chat-session-list/chat-session-list.component';
import { ChatSessionDetailComponent } from './component/chat-session-detail/chat-session-detail.component';

import { ChatUnansweredQuestionComponent } from './component/chat-unanswered-question/chat-unanswered-question.component';
import { ChatConfigComponent } from './component/chat-config/chat-config.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgPrimeModule } from '../ng-prime/ng-prime.module';
import { ChatDetailTabComponent } from './component/chat-detail-tab/chat-detail-tab.component';
import { ChatbotTemplateComponent } from './component/chatbot-template/chatbot-template.component';
import { ScrapeWebsiteComponent } from './component/scrape-website/scrape-website.component';
import { ChatQuestionarieComponent } from './component/chat-questionarie/chat-questionarie.component';
import { ImageCropperModule } from 'ngx-image-cropper';
import { CreateEditChatQuestionarieComponent } from './component/create-edit-chat-questionarie/create-edit-chat-questionarie.component';
import { ChatQuestionarieListComponent } from './component/chat-questionarie-list/chat-questionarie-list.component';
import { CreateEditQuestionComponent } from './component/create-edit-question/create-edit-question.component';
import { FormsBuilderSharedModuleModule } from '../form-builder/forms-builder-shared-module.module';
import { ChatFormQuestionnaireComponent } from './component/chat-form-questionnaire/chat-form-questionnaire.component';
import { CKEditorModule } from 'ckeditor4-angular';
import { DragDropModule } from '@angular/cdk/drag-drop';

@NgModule({
  declarations: [
    ChatSessionListComponent,
    ChatSessionDetailComponent,
    ChatConfigComponent,
    ChatUnansweredQuestionComponent,
    ChatDetailTabComponent,
    ChatbotTemplateComponent,
    ScrapeWebsiteComponent,
    ChatQuestionarieComponent,
    CreateEditChatQuestionarieComponent,
    ChatQuestionarieListComponent,
    CreateEditQuestionComponent,
    ChatFormQuestionnaireComponent
  ],
  imports: [
    CommonModule,
    ChatRoutingModule,
    SharedModule,
    NgPrimeModule,
    ImageCropperModule,
    FormsBuilderSharedModuleModule,
    CommonModule,
    NgPrimeModule,
    SharedModule,
    CKEditorModule,
    DragDropModule
  ]
})
export class ChatModule {}
