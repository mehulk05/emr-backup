import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
import { environment } from 'src/environments/environment';
import { IntegrationService } from '../../service/integration.service';
import { IcomponentIntegrationObj } from './component-intergation.model';

@Component({
  selector: 'app-component-integration-new',
  templateUrl: './component-integration-new.component.html',
  styleUrls: ['./component-integration-new.component.css']
})
export class ComponentIntegrationNewComponent implements OnInit {
  quickLinkData: any;
  chatbotUrl: string;
  businessId: any;
  userId: any;
  domain =
    location.protocol +
    '//' +
    location.hostname +
    (location.port ? ':' + location.port : '');

  componentIntegrationObj: IcomponentIntegrationObj = {};
  questionnaireId: any;

  configureUrl: any = {
    contactForm: 'form-builder/0/lead-capture-form',
    appointment: 'appointment/booking-history',
    chatbot: 'chat/chat-config',
    vc: 'vc/symptoms/compose',
    review: 'clinics'
  };
  constructor(
    private integrationService: IntegrationService,
    private localStorage: LocalStorageService,
    private router: Router,
    private toastService: ToasTMessageService
  ) {}

  ngOnInit(): void {
    this.businessId = this.localStorage.readStorage('businessInfo')?.id;
    this.userId = this.localStorage.readStorage('currentUser')?.id;
    this.integrationService.getLeadCaptureForm().then((response: any) => {
      this.questionnaireId = response.id;
      this.createCodeAndPreviewUrlForComponents();
    });
    if (this.userId) {
      this.getQuickLinks();
    }

    if (this.businessId) {
      this.getDefaultChatbot();
    }
  }

  createCodeAndPreviewUrlForComponents() {
    const publicQuestionnaireUrl =
      environment.OLD_EMR_DOMAIN +
      '/assets/static/form.html?bid=' +
      this.businessId +
      '&fid=' +
      this.questionnaireId;

    const contactFormCode =
      '<script src="' +
      this.domain +
      '/assets/js/form-tracking.js"></script>' +
      '<iframe style="height:610px;width:500px;border:0" src="' +
      publicQuestionnaireUrl +
      '" title="Contact Form"></iframe>';

    this.componentIntegrationObj.contactFormCode = contactFormCode;
    this.componentIntegrationObj.contactFormUrl = publicQuestionnaireUrl;

    const symptomSelectorLink =
      this.domain +
      '/assets/static/composer.html?bid=' +
      this.businessId +
      '&fid=' +
      this.questionnaireId;

    const symptomSelectorIframe =
      '<iframe style="height:700px;width:1200px;border:0" src="' +
      symptomSelectorLink +
      '" title="Contact Form"></iframe>';

    this.componentIntegrationObj.vcCode = symptomSelectorIframe;
    this.componentIntegrationObj.vcurl = symptomSelectorLink;
    console.log(this.componentIntegrationObj);
  }

  getQuickLinks() {
    this.integrationService.getQuickLinks(this.userId).then(
      (data: any) => {
        if (data.myWebsiteUrl && data.myWebsiteUrl.startsWith('www')) {
          console.log('true');
          data.myWebsiteUrl = 'http://' + data.myWebsiteUrl;
        }
        this.quickLinkData = data;
        this.componentIntegrationObj.appointmentUrl = data?.clinicBookingUrl;
        this.componentIntegrationObj.appointmentUrlObj = data?.clinicBookingUrl;

        console.log('clinicBookingUrl', data);
        if (!data?.clinicBookingUrl) {
          this.getAppointmentById(this.businessId);
        }
        this.componentIntegrationObj.reveiwUrl = data?.reviewUrl;

        this.componentIntegrationObj.reviewCode =
          '<script src="' +
          environment.G99_REVIEW_DOMAIN +
          'reviews.js"></script>' +
          '<iframe style="width: 100%;" frameborder="0;" className="reviewsIframe" scrolling="no" id="ReviewsWidget" src="' +
          data?.reviewUrl +
          '"></iframe>';
      },
      () => {
        this.getAppointmentById(this.businessId);
      }
    );
  }

  getAppointmentById(bid: any) {
    this.integrationService.getDefaultQuickLink(bid).then((data: any) => {
      this.componentIntegrationObj.appointmentUrl = data?.clinicBookingUrl;
      this.componentIntegrationObj.appointmentUrlObj = data?.clinicBookingUrl;
    });
  }

  getDefaultChatbot() {
    this.integrationService
      .getDefaultChatbot(this.businessId)
      .then((data: any) => {
        this.chatbotUrl =
          environment.CHAT_BOT_DOMAIN +
          '/assets/composer' +
          data.chatBotId +
          '.html?bid=' +
          this.businessId;

        this.componentIntegrationObj.chatbotUrl = data?.previewIframeUrl;
        this.componentIntegrationObj.chatbotCode = data?.code;
        console.log(this.componentIntegrationObj);
      });
  }

  copyCode(code: any) {
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = code;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    console.log(selBox);
    document.body.removeChild(selBox);
    this.toastService.success('Copied!');
  }

  previewUrl(url: string) {
    window.open(url, '_blank');
  }

  configure(componentName: any) {
    const url: any = this.configureUrl[componentName];
    this.router.navigateByUrl(url);
  }
}
