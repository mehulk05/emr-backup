import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output
} from '@angular/core';
import { SmsService } from '../../services/sms.service';

@Component({
  selector: 'app-preview-email-sms-template',
  templateUrl: './preview-email-sms-template.component.html',
  styleUrls: ['./preview-email-sms-template.component.css']
})
export class PreviewEmailSmsTemplateComponent implements OnChanges {
  @Input() showModal: any;
  @Input() modalData: any;
  @Output() modalClosed = new EventEmitter<any>();
  leadEmailTemplateData: any;
  constructor(private smsService: SmsService) {}

  ngOnChanges(): void {
    console.log(this.modalData);
    if (this.modalData && this.modalData?.id) {
      if (this.modalData.type == 'email') {
        this.loadEmail();
      } else {
        this.loadSms();
      }
    }
  }

  loadEmail() {
    this.smsService.emailTemplate(this.modalData.id).then((data: any) => {
      // this.leadEmailTemplateData = JSON.stringify(data).replace(/\<#if BUSINESS_LOGO/g, '').replace(/\?>/g, '').replace(/\?/g, '').replace(/\<#else>/g, '').replace(/\\n/g, '').replace(/"/g, '').replace(/\\r/g, '').replace(/\\t/g, '').replace(/\\/g, '')
      this.leadEmailTemplateData = data
        .replace('<#if BUSINESS_LOGO??>', '')
        .replace('<#else>', '');
    });
  }

  loadSms() {
    this.smsService.smsTemplate(this.modalData.id).then((data: any) => {
      this.leadEmailTemplateData = data;
    });
  }
  hideModal() {
    this.modalClosed.emit({ close: true, isDelete: false });
    this.showModal = false;
  }
}
