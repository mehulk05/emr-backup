import { Component, Input, OnChanges } from '@angular/core';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
import { environment } from 'src/environments/environment';
import { ChatConfigService } from '../../service/chat-config.service';

@Component({
  selector: 'app-chatbot-template',
  templateUrl: './chatbot-template.component.html',
  styleUrls: ['./chatbot-template.component.css']
})
export class ChatbotTemplateComponent implements OnChanges {
  domain =
    location.protocol +
    '//' +
    location.hostname +
    (location.port ? ':' + location.port : '');
  chatEmbededCode = '';
  chatbotDomain = environment.CHAT_BOT_DOMAIN;
  chatbotTemplate: any[] = [];
  chatbotId: any;
  defaultChatbot: any = {
    previewIframeUrl: 'https://chatbot.growthemr.com/business/723/chat3'
  };
  @Input() businessId: string;
  allowAvailbaleTemplates = false;
  constructor(
    private alertService: ToasTMessageService,
    private chatConfigService: ChatConfigService
  ) {}
  ngOnChanges(): void {
    if (this.businessId) {
      this.getChatBotTemplatesFromApi();
      const chatUrl =
        this.chatbotDomain + '/business/' + this.businessId + '/chat1';
      this.chatEmbededCode =
        '<div id="emr-chat-div" data-url="' +
        chatUrl +
        '" style="bottom: 20px; position: fixed;  right: 15px; z-index: 99999999;"></div>' +
        '<script src="' +
        this.chatbotDomain +
        '/assets/js/chatbot.js"></script>';
    }
  }

  getChatbotTemplates() {
    const template1: any = {};
    const template2: any = {};
    const template3: any = {};
    const template4: any = {};
    template1.id = 1;
    template2.id = 2;
    template3.id = 3;
    template4.id = 4;
    template1.code =
      this.chatbotDomain + '/business/' + this.businessId + '/chat2';
    template1.chatEmbededCode =
      '<div id="emr-chat-div" data-url="' +
      template1.code +
      '" style="bottom: 0; position: fixed;  right: 0; z-index: 998;"></div>' +
      '<script src="' +
      this.chatbotDomain +
      '/assets/js/emr-chat2.js"></script>';
    template1.previewUrl =
      this.chatbotDomain + '/assets/composer2.html?bid=' + this.businessId;

    template2.code =
      this.chatbotDomain + '/business/' + this.businessId + '/chat';
    template2.chatEmbededCode =
      '<div id="emr-chat-div" data-url="' +
      template2.code +
      '" style="bottom: 0; position: fixed;  right: 0; z-index: 998;"></div>' +
      '<script src="' +
      this.chatbotDomain +
      '/assets/js/emr-chat.js"></script>';
    template2.previewUrl =
      this.chatbotDomain + '/assets/composer.html?bid=' + this.businessId;

    template3.code =
      this.chatbotDomain + '/business/' + this.businessId + '/chat3';
    template3.chatEmbededCode =
      '<div id="emr-chat-div" data-url="' +
      template3.code +
      '" style="bottom: 0; position: fixed;  right: 0; z-index: 998;"></div>' +
      '<script src="' +
      this.chatbotDomain +
      '/assets/js/emr-chat3.js"></script>';
    template3.previewUrl =
      this.chatbotDomain + '/assets/composer3.html?bid=' + this.businessId;

    template4.code =
      this.chatbotDomain + '/business/' + this.businessId + '/chat4';
    template4.chatEmbededCode =
      '<div id="emr-chat-div" data-url="' +
      template4.code +
      '" style="bottom: 0; position: fixed;  right: 0; z-index: 998;"></div>' +
      '<script src="' +
      this.chatbotDomain +
      '/assets/js/emr-chat4.js"></script>';
    template4.previewUrl =
      this.chatbotDomain + '/assets/composer4.html?bid=' + this.businessId;
    this.chatbotTemplate.push(template1, template3, template4, template2);
  }

  getChatBotTemplatesFromApi() {
    this.chatConfigService.getAllChatbot(this.businessId).then((data: any) => {
      data.map((item: any) => {
        if (item.chatBotId == 1) {
          item['previewCode'] =
            this.chatbotDomain + '/business/' + this.businessId + '/chat';
        } else {
          item['previewCode'] =
            this.chatbotDomain +
            '/business/' +
            this.businessId +
            '/chat' +
            item.chatBotId;
        }
      });
      this.chatbotTemplate = data;
      this.getDefaultChatbot();
      // data.map(item=>{
      //   chatbotTemplate.
      // })
    });
  }

  getDefaultChatbot() {
    this.chatConfigService.getDefaultChatbot(this.businessId).then(
      (data: any) => {
        this.chatbotId = data.chatBotId;
        const index = this.chatbotTemplate.findIndex(
          (obj) => obj.chatBotId === this.chatbotId
        );
        if (index > -1) {
          this.defaultChatbot = this.chatbotTemplate.splice(index, 1); // 2nd parameter means remove one item only
        }
        this.defaultChatbot = this.defaultChatbot[0];
        console.log(index, this.defaultChatbot, this.chatbotTemplate);
      },
      () => {
        this.alertService.error('Error while fetching default chatbot');
      }
    );
  }

  makeDefaultChatbot(template: any) {
    //chatbotID will be index+1 bec index is startiing at 0 and chatBotId starts at 1
    this.chatConfigService.updateDefaultChatBot(template.id).then(
      () => {
        this.alertService.success('Default Chatbot updated successfully');
        this.getChatBotTemplatesFromApi();
      },
      () => {
        this.alertService.error('Error while making default chatbot');
      }
    );
  }

  previewChatBot(code: any) {
    console.log(code);
    const url = code.appPreviewUrl.replace('composer.html', 'composer1.html');

    window.open(url, '_blank');
  }
}
