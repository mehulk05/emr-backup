import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/shared/services/api.service';
import { HttpHelperService } from 'src/app/shared/services/HttpHelperService';

@Injectable({
  providedIn: 'root'
})
export class ChatQuestionarieService {
  constructor(
    private httpHelperService: HttpHelperService,
    private apiService: ApiService
  ) {}

  getChatQuestionnaireList() {
    const apiUrl = '/api/chatquestionnaire';
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  deleteChatQuestionnaire(chatQuestionnaireId: number) {
    const apiUrl = '/api/chatquestionnaire/' + chatQuestionnaireId;
    return this.apiService.delete(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  updateChatQuestionnaire(chatQuestionnaireId: number, questionnaireForm: any) {
    const apiUrl = '/api/chatquestionnaire/' + chatQuestionnaireId;
    return this.apiService.put(
      apiUrl,
      questionnaireForm,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  createChatQuestionnaire(questionnaireForm: any) {
    const apiUrl = '/api/chatquestionnaire/';
    return this.apiService.post(
      apiUrl,
      questionnaireForm,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getChatQuestionnaire(chatQuestionnaireId: number) {
    const apiUrl = '/api/chatquestionnaire/' + chatQuestionnaireId;
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getQuestions(chatQuestionnaireId: number) {
    const apiUrl =
      '/api/chatquestionnaire/' + chatQuestionnaireId + '/chatquestions';
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  deleteQuestion(chatQuestionnaireId: number, chatQuestionId: any) {
    const apiUrl =
      '/api/chatquestionnaire/' +
      chatQuestionnaireId +
      '/chatquestions/' +
      chatQuestionId;
    return this.apiService.delete(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  saveQuestion(chatQuestionnaireId: number, chatQuestionnaireForm: any) {
    const apiUrl =
      '/api/chatquestionnaire/' + chatQuestionnaireId + '/chatquestions';
    return this.apiService.post(
      apiUrl,
      chatQuestionnaireForm,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }
}
