import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LeadsService } from '../../service/leads.service';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
import { FormatTimeService } from 'src/app/shared/services/time-utils/formatTime.service';
import { ActivatedRoute } from '@angular/router';
import { TwoWayTextService } from 'src/app/modules/two-way-text/services/two-way-text.service';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { TwoWayTextChatComponent } from 'src/app/shared/reusableComponents/two-way-text-chat/two-way-text-chat.component';

@Component({
  selector: 'app-lead-detail-tab1-right',
  templateUrl: './lead-detail-tab1-right.component.html',
  styleUrls: ['./lead-detail-tab1-right.component.css']
})
export class LeadDetailTab1RightComponent
  implements OnInit, OnChanges, OnDestroy
{
  @ViewChild(TwoWayTextChatComponent)
  twoWayTextChatComponent: TwoWayTextChatComponent;
  showSearch = false;
  questionnaireSubmission: any = null;
  @Input() currentIndex: any;
  smsTemplateId: any;
  emailTemplateId: any;
  id: any = null;
  emailTemplates: any = {};
  smsTemplates: any = {};
  simpleEmailForm: FormGroup;
  simpleSmsForm: FormGroup;
  remainingText = 200;
  activeTab: string = 'SMS';
  smsChat: any[] = [];
  leadChatStatus: string = 'OPEN';
  leadFullName: string = '';
  communication: string = '';
  businessName: string = '';
  enableTwoWayAiAutoSuggestion: boolean = false;
  showTemplatesModal: boolean = false;
  email = '';
  leadPhoneNumber: string = '';
  messageBody: string = '';
  isLogsRefreshing: boolean = false;
  timer: any;
  businessInfo: any;
  businessNumber: string = '';
  isTwilioEnabled: boolean = false;
  isOptOutEnabled: boolean = false;
  @Output() handleCallQuestionaireApiCallback = new EventEmitter<any>();
  @Input() leadQuestionarieResponse: any;
  isLoading: boolean;
  constructor(
    private leadService: LeadsService,
    private alertService: ToasTMessageService,
    public formatTimeService: FormatTimeService,
    private activatedRoute: ActivatedRoute,
    public formBuilder: FormBuilder,
    private twoWayTextService: TwoWayTextService,
    private localStorageService: LocalStorageService
  ) {
    this.simpleEmailForm = this.formBuilder.group({
      subject: ['', [Validators.required]],
      body: ['', [Validators.required]],
      email: ['', [Validators.required]],
      leadId: ['', [Validators.required]]
    });

    this.simpleSmsForm = this.formBuilder.group({
      body: ['', [Validators.required]],
      phoneNumber: ['', [Validators.required]],
      leadId: ['', [Validators.required]]
    });
  }
  ngOnChanges(changes: SimpleChanges): void {
    const currentValue = changes.leadQuestionarieResponse.currentValue;
    const previousValue = changes.leadQuestionarieResponse.previousValue;
    console.log('this', this.leadQuestionarieResponse, changes);

    // Check if both current and previous values are defined and the 'id' property is different
    if (currentValue && currentValue.id !== previousValue?.id) {
      this.updateQuestionnaireSubmission(this.leadQuestionarieResponse);
    }
  }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((data: any) => {
      console.log('data', data.params.leadId);
      this.id = data.params.leadId;
      // this.loadQuestionnaireSubmission();
      this.isLoading = true;
      this.emailTemplates = [];
      this.smsTemplates = [];
      setTimeout(() => {
        this.loadTemplates();
        this.loadSourceAuditLogs();
        this.refreshAuditLogs();
      }, 2000);
    });
    this.businessInfo = this.localStorageService.readStorage('businessInfo');
    this.businessName = this.businessInfo?.name;
    this.enableTwoWayAiAutoSuggestion =
      this.businessInfo?.enableAiTwoWaySMSSuggestion;
    if (this.businessInfo?.getTwilioNumber && this.businessInfo.twilioNumber) {
      this.isTwilioEnabled = true;
      this.businessNumber = this.businessInfo.twilioNumber;
    } else {
      this.twoWayTextService.getDefaultNumber().then((response: any) => {
        this.businessNumber = response.defaultNumber;
      });
    }
  }

  ngOnDestroy(): void {
    clearInterval(this.timer);
  }

  toggleEmailSMSTab(tab: string) {
    this.activeTab = tab;
  }

  valueChange() {
    this.remainingText = 200 - this.simpleSmsForm.value.body.length;
  }
  loadQuestionnaireSubmission() {
    this.handleCallQuestionaireApiCallback.emit();
    // this.leadService
    //   .getQuestionnaireSubmission(this.id)
    //   .then((response: any) => {
    //     this.updateQuestionnaireSubmission(response);
    //   });
  }

  updateQuestionnaireSubmission(response: any, fromParent?: boolean) {
    this.questionnaireSubmission = response;
    console.log(this.getAnswerFromQuestionAnswers('Email'));
    this.simpleEmailForm.patchValue({
      email: this.getAnswerFromQuestionAnswers('Email'),
      leadId: this.questionnaireSubmission.id
    });
    this.email = this.getAnswerFromQuestionAnswers('Email');
    this.simpleSmsForm.patchValue({
      // phoneNumber: this.getAnswerFromQuestionAnswers('Phone Number'),
      leadId: this.questionnaireSubmission.id
    });
    this.checkEmailOptOut();
    if (!fromParent) {
      this.messageBody = '';
      if (this.twoWayTextChatComponent) {
        this.twoWayTextChatComponent.setMessageBody('');
      }
    }
    this.simpleSmsForm.patchValue({
      phoneNumber: this.getAnswerFromQuestionAnswers('Phone Number')
    });
  }

  loadSourceAuditLogs(fromRefresh?: boolean) {
    this.isLogsRefreshing = true;
    this.twoWayTextService.getSourceAuditLogs(this.id).then(
      (response: any) => {
        this.isLogsRefreshing = false;
        if (response) {
          this.leadFullName = response.leadFullName;
          this.leadChatStatus = response.leadChatStatus ?? 'OPEN';
          this.communication = response.communication;
          if (this.leadFullName !== response.sourcePhoneNumber) {
            this.leadPhoneNumber = response.sourcePhoneNumber;
          }
          if (fromRefresh) {
            if (this.smsChat?.length !== response.auditLogs?.length) {
              this.smsChat = response.auditLogs;
            }
          } else {
            this.smsChat = response.auditLogs;
          }
          if (response.sourcePhoneNumber) {
            this.simpleSmsForm.patchValue({
              phoneNumber: response.sourcePhoneNumber
            });
          }
        }
      },
      () => {
        clearInterval(this.timer);
      }
    );
  }

  refreshAuditLogs() {
    this.timer = setInterval(() => {
      if (!this.isLogsRefreshing) {
        this.loadSourceAuditLogs(true);
      }
    }, 60000);
  }

  sendSMS() {
    if (!this.smsTemplateId) return;
    this.leadService.sendSMS(this.id, this.smsTemplateId).then(
      () => {
        this.loadQuestionnaireSubmission();
        this.alertService.success('SMS Sent Successfully.');
        this.smsTemplateId = '';
      },
      () => {
        this.alertService.error('Unable to send SMS.');
      }
    );
  }

  sendCustomSms(message: string) {
    if (!this.simpleSmsForm.controls['phoneNumber'].valid) {
      this.simpleSmsForm.patchValue({
        phoneNumber: this.getAnswerFromQuestionAnswers('Phone Number')
      });
    }
    if (!this.simpleSmsForm.controls['phoneNumber'].valid) {
      this.alertService.error('Please update lead phone number');
      return;
    }
    this.simpleSmsForm.controls['body'].setValue(message);
    this.sendSimpleSms();
  }

  checkEmailOptOut() {
    this.leadService.getOptedOutEmailSMS().then((optedOutEmails: any) => {
      if (optedOutEmails && Array.isArray(optedOutEmails)) {
        const isEmailOptedOut = optedOutEmails.some(
          (optedOutEmail) => optedOutEmail.email === this.email
        );
        if (isEmailOptedOut) {
          this.isOptOutEnabled = false;
        } else {
          this.isOptOutEnabled = true;
        }
      } else {
        console.error('Invalid data received from API');
      }
    });
  }

  sendCustomEmail(e: any) {
    if (e.subject && e.body) {
      this.simpleEmailForm.controls['subject'].setValue(e.subject);
      this.simpleEmailForm.controls['body'].setValue(e.body);
      this.sendSimpleEmail();
    }
  }

  loadTemplates() {
    this.leadService.getTemplatesListForLead('Lead', this.id).then(
      (response: any) => {
        this.isLoading = false;
        if (response) {
          if (
            response.emailTemplates != null &&
            response.emailTemplates != undefined
          ) {
            this.emailTemplates = response.emailTemplates;
          } else {
            this.alertService.error('Unable to load the email templates.');
          }
          if (
            response.smsTemplates != null &&
            response.smsTemplates != undefined
          ) {
            this.smsTemplates = response.smsTemplates;
          } else {
            // this.alertService.error('Unable to load the sms templates.');
          }
        }
      },
      () => {
        this.isLoading = false;
        this.alertService.error('Unable to load the email/sms templates.');
      }
    );
  }

  loadSMSTemplates() {
    this.leadService.getSMSTemplatesListForLead('Lead', this.id).then(
      (response) => {
        this.smsTemplates = response;
      },
      () => {
        this.alertService.error('Unable to load the sms templates.');
      }
    );
  }

  loadEmailTemplates() {
    this.leadService.getEmailTemplateListForLead('Lead', this.id).then(
      (response: any) => {
        this.emailTemplates = response;
      },
      () => {
        this.alertService.error('Unable to load the email templates.');
      }
    );
  }

  // sendSimpleEmail() {
  //   if (this.simpleEmailForm.valid) {
  //     const emailBody = this.simpleEmailForm.get('body').value;
  //     // emailBody = emailBody.replaceAll('\n', '<br>');
  //     this.simpleEmailForm.patchValue({
  //       body: emailBody
  //     });
  //     this.leadService.sendSimpleEmail(this.simpleEmailForm.value).then(
  //       () => {
  //         this.alertService.success('Email sent successfully.');
  //         this.simpleEmailForm.reset();
  //         this.simpleEmailForm.patchValue({
  //           email: this.getAnswerFromQuestionAnswers('Email'),
  //           leadId: this.questionnaireSubmission.id
  //         });
  //       },
  //       () => {
  //         this.alertService.error(
  //           'System error occured. Please try again or contact support'
  //         );
  //       }
  //     );
  //   }
  // }
  sendSimpleEmail() {
    if (this.simpleEmailForm.valid) {
      let emailBody = this.simpleEmailForm.get('body').value;

      // Replace email addresses with clickable links
      emailBody = emailBody.replace(
        /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/g,
        '<a href="mailto:$1">$1</a>'
      );

      // Replace phone numbers with clickable links
      emailBody = emailBody.replace(
        /(\d{3}[-.\s]??\d{3}[-.\s]??\d{4}|\(\d{3}\)\s*\d{3}[-.\s]??\d{4}|\d{3}[-.\s]??\d{4})/g,
        '<a href="tel:$1">$1</a>'
      );

      // Update the body with clickable links
      this.simpleEmailForm.patchValue({
        body: emailBody
      });

      this.leadService.sendSimpleEmail(this.simpleEmailForm.value).then(
        () => {
          this.alertService.success('Email sent successfully.');
          this.simpleEmailForm.reset();
          this.simpleEmailForm.patchValue({
            email: this.getAnswerFromQuestionAnswers('Email'),
            leadId: this.questionnaireSubmission.id
          });
        },
        () => {
          this.alertService.error(
            'System error occurred. Please try again or contact support.'
          );
        }
      );
    }
  }

  sendSimpleSms() {
    !this.simpleSmsForm.value.leadId &&
      this.simpleSmsForm.patchValue({
        leadId: this.questionnaireSubmission.id
      });
    if (this.simpleSmsForm.valid) {
      this.leadService.sendSimpleSms(this.simpleSmsForm.value).then(
        (res: any) => {
          if (res && res.status == 200) {
            this.simpleSmsForm.reset();
            this.simpleSmsForm.patchValue({
              // phoneNumber: this.getAnswerFromQuestionAnswers('Phone Number'),
              leadId: this.questionnaireSubmission.id
            });
            this.loadSourceAuditLogs();
            this.messageBody = '';
            this.twoWayTextChatComponent.setMessageBody('');
          } else {
            let msg = 'Error while sending SMS';
            if (res?.status == 500 && res?.errorMessage) {
              msg = res.errorMessage;
            }
            this.alertService.error(msg);
          }
        },
        (e: any) => {
          if (e.message) this.alertService.error(e.message);
          else
            this.alertService.error(
              'System error occured. Please try again or contact support'
            );
        }
      );
    }
  }

  getAnswerFromQuestionAnswers(questionName: string): string {
    for (const element of this.questionnaireSubmission.questionAnswers) {
      if (element.questionName === questionName) {
        return element.answerText;
      }
    }
    return null;
  }

  get subject() {
    return this.simpleEmailForm.get('subject');
  }

  get body() {
    return this.simpleEmailForm.get('body');
  }

  showHideTemplatesDialog(e: any) {
    this.showTemplatesModal = e;
    if (!e) {
      this.twoWayTextChatComponent.hideTemplateDialog('');
    }
  }

  templateSelected(e: any) {
    if (e && e.body) {
      this.twoWayTextChatComponent.setMessageBody(e.body);
    }
  }

  chatStatusChange(status: string) {
    this.leadService.updatSmsChatStatus(this.id, status).then(
      () => {
        this.leadChatStatus = status;
        this.alertService.success('Status changed successfully.');
      },
      () => {
        this.alertService.error('Unable to change status.');
      }
    );
  }

  onSearch() {
    this.showSearch = !this.showSearch;
  }

  onToggleChatDropdown() {
    this.twoWayTextChatComponent.toggleChatStatusDropDown();
  }
}
