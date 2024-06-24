import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChatSessionDetailComponent } from './component/chat-session-detail/chat-session-detail.component';
import { ChatSessionListComponent } from './component/chat-session-list/chat-session-list.component';
import { ChatUnansweredQuestionComponent } from './component/chat-unanswered-question/chat-unanswered-question.component';
import { ChatDetailTabComponent } from './component/chat-detail-tab/chat-detail-tab.component';
import { CreateEditChatQuestionarieComponent } from './component/create-edit-chat-questionarie/create-edit-chat-questionarie.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'chat-config'
  },
  {
    path: 'chat-config',
    component: ChatDetailTabComponent,
    data: {
      breadcrumb: 'Chat Configuration'
    }
  },
  {
    path: 'chat-questionnaire',
    component: CreateEditChatQuestionarieComponent,
    data: {
      breadcrumb: 'Chat Questionnaire'
    }
  },
  {
    path: 'chat-questionnaire/:chatQuestionnaireId/edit',
    component: CreateEditChatQuestionarieComponent
  },
  {
    path: 'chat-sessions',
    component: ChatSessionListComponent,
    data: {
      breadcrumb: 'Chat-Session List'
    }
  },
  {
    path: 'chat-sessions/:chatSessionId',
    component: ChatSessionDetailComponent,
    data: {
      breadcrumb: 'Chat-Session List'
    }
  },
  {
    // not able to find link
    path: 'chat-unanswered-questions',
    component: ChatUnansweredQuestionComponent,
    data: {
      breadcrumb: 'Unanswered Question List'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChatRoutingModule {}
