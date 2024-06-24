import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/shared/services/api.service';
import { HttpHelperService } from 'src/app/shared/services/HttpHelperService';

@Injectable({
  providedIn: 'root'
})
export class ChatConfigService {
  constructor(
    private httpHelperService: HttpHelperService,
    private apiService: ApiService
  ) {}

  getChatConfig() {
    const apiUrl = '/api/chatconfigs';
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getAllChatbot(bid: any) {
    const apiUrl = '/api/chatbottemplates';
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions(bid)
    );
  }

  getDefaultChatbot(businessId: any) {
    const apiUrl = '/api/public/chatbottemplates/default';
    return this.apiService.get(
      apiUrl,
      '',
      true,
      this.httpHelperService.getTenantHttpOptions(businessId)
    );
  }

  updateDefaultChatBot(chatbotId: any) {
    const apiUrl = '/api/chatbottemplates/' + chatbotId + '/default';
    return this.apiService.put(
      apiUrl,
      '',
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }
  updateChatConfig(chatConfig: any) {
    const apiUrl = '/api/chatconfigs';
    return this.apiService.post(
      apiUrl,
      chatConfig,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  updateChatIcon(img: any) {
    const apiUrl = '/api/chatConfigs/image?iconUrl=' + img;
    return this.apiService.patch(
      apiUrl,
      '',
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  uploadChatConfigIcon(formData: any) {
    const apiUrl = '/api/chatconfigs/upload';
    return this.apiService.post(
      apiUrl,
      formData,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  scrapWebsite(scrapForm: any) {
    const url = '/api/chatconfigs/scrap';
    return this.apiService.post(
      url,
      scrapForm,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getDefaultCinicOptimized(bid: any) {
    const url = '/api/v1/clinics/default';
    return this.apiService.get(
      url,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions(bid)
    );
  }

  getAllQuestionaire() {
    const apiUrl = '/api/v1/chatbot/questionnaire';
    return this.apiService.get(
      apiUrl,
      'Unable to load questionaries',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getAllQuestionById(questionnaireId: number) {
    const apiUrl =
      '/api/v1/chatbot/questionnaire/' + questionnaireId + '/questions';
    return this.apiService.get(
      apiUrl,
      'Unable to load questionaries',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  deleteQuestion(questionnaireId: number, questionId: number) {
    const apiUrl =
      '/api/questionnaire/' + questionnaireId + '/questions/' + questionId;
    return this.apiService.delete(
      apiUrl,
      'Unable to delete questionaries',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  updateQuestionnaireQuestionOrder(
    questionnaireId: number,
    questionnaireForm: any
  ) {
    const apiUrl = '/api/questionnaire/' + questionnaireId + '/questions/order';
    return this.apiService.put(
      apiUrl,
      questionnaireForm,
      'Unable to update questionaries position',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  saveQuestion(questionnaireId: number, questionForm: any) {
    const apiUrl = '/api/questionnaire/' + questionnaireId + '/questions';
    return this.apiService.post(
      apiUrl,
      questionForm,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }
}
