import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { FormatTimeService } from 'src/app/shared/services/time-utils/formatTime.service';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
import { PatientService } from '../../../services/patient.service';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { TwoWayTextChatComponent } from 'src/app/shared/reusableComponents/two-way-text-chat/two-way-text-chat.component';
import { TwoWayTextService } from 'src/app/modules/two-way-text/services/two-way-text.service';

@Component({
  selector: 'app-patient-detail-right-tab',
  templateUrl: './patient-detail-right-tab.component.html',
  styleUrls: ['./patient-detail-right-tab.component.css']
})
export class PatientDetailRightTabComponent implements OnInit, OnDestroy {
  @ViewChild(TwoWayTextChatComponent)
  twoWayTextChatComponent: TwoWayTextChatComponent;
  leadStatusForm: FormGroup;
  patientId: any;
  @Input() currentIndex: any;
  selectedTag: any;
  tags: any = [];
  tagSelect: boolean;
  leadTasks: any;
  showModal: boolean;
  leadComments: any = [];
  commentValue: boolean;
  comment: any;
  tagId: any = [];
  showSearch = false;
  showTemplatesModal: boolean = false;
  activeTab: string = 'SMS';
  smsChat: any[] = [];
  leadChatStatus: string = 'OPEN';
  leadFullName: string = '';
  communication: string = '';
  businessName: string = '';
  enableTwoWayAiAutoSuggestion: boolean = false;
  remainingText = 200;

  totalCharacterLengthEmail = 8000;
  categoryEmail =
    'Generate the better content while keeping the variable names , programming syntax';

  showAiModal = false;
  totalCharacterLength = 160;
  category =
    'Compose improved GSM7 compliant text within the 153 characters limit keeping the variable names , programming syntax';

  smsTemplates: any = {};
  smsTemplateId: any;
  emailTemplateId: any;
  emailTemplates: any;
  email = '';

  simpleEmailForm: FormGroup;
  simpleSmsForm: FormGroup;
  patient: any;
  businessInfo: any;
  leadPhoneNumber: string = '';
  messageBody: string = '';
  isLogsRefreshing: boolean = false;
  timer: any;
  businessNumber: string = '';
  isTwilioEnabled: boolean = false;
  isOptOutEnabled: boolean = false;
  constructor(
    public formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private patientService: PatientService,
    private toastService: ToasTMessageService,
    public formatTimeService: FormatTimeService,
    private localStorageService: LocalStorageService,
    private twoWayTextService: TwoWayTextService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((data: any) => {
      this.patientId = data.params.patientId;
      this.loadPatientInfo();
      this.loadPatientComments();
      this.loadSMSTemplates();
      this.loadEmailTemplates();
      this.loadSourceAuditLogs();
      this.refreshAuditLogs();
    });
    this.leadStatusForm = this.formBuilder.group({
      tagId: [[], []]
    });

    this.simpleEmailForm = this.formBuilder.group({
      subject: ['', [Validators.required]],
      body: ['', [Validators.required]],
      email: ['', [Validators.required]],
      patientId: ['', [Validators.required]]
    });

    this.simpleSmsForm = this.formBuilder.group({
      body: ['', [Validators.required]],
      phoneNumber: ['', [Validators.required]],
      patientId: ['', [Validators.required]]
    });
    this.businessName =
      this.localStorageService.readStorage('businessInfo')?.name;
    this.enableTwoWayAiAutoSuggestion =
      this.localStorageService.readStorage(
        'businessInfo'
      )?.enableAiTwoWaySMSSuggestion;
    this.businessInfo = this.localStorageService.readStorage('businessInfo');
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

  loadPatientInfo() {
    this.patientService
      .getPatientOptimized(this.patientId)
      .then((response: any) => {
        this.updatePatientInfo(response);
      });
  }

  updatePatientInfo(response: any, fromParent?: boolean) {
    this.patient = response;
    this.email = this.patient.email;
    console.log('emailid', this.email);
    this.leadStatusForm.patchValue({
      tagId: response.tag
    });
    this.email = this.patient.email;
    this.tagId = response.tag;
    if (this.tagId) this.selectedTag = this.tagId.map((x: any) => x.id);
    if (response.tagId != null) {
      response.tagId.forEach((id: any) => {
        this.tagId.push(id);
      });
    }
    this.simpleEmailForm.patchValue({
      email: response.email,
      patientId: this.patientId
    });

    this.simpleSmsForm.patchValue({
      phoneNumber: response.phone,
      patientId: this.patientId
    });
    this.checkEmailOptOut();
    if (!fromParent) {
      this.messageBody = '';
      if (this.twoWayTextChatComponent) {
        this.twoWayTextChatComponent.setMessageBody('');
      }
    }
  }

  loadPatientComments() {
    this.patientService.patientCommentList(this.patientId).then(
      (response: any) => {
        this.leadComments = response;
      },
      () => {
        this.toastService.error(
          'Unable to load the questionnaire submission comment.'
        );
      }
    );
  }

  loadSMSTemplates() {
    this.patientService
      .getSMSTemplatesListForPatient('Appointment', this.patientId)
      .then(
        (response) => {
          this.smsTemplates = response;
        },
        () => {
          this.toastService.error('Unable to load the sms templates.');
        }
      );
  }

  loadEmailTemplates() {
    this.patientService
      .getEmailTemplateListForPatient('Appointment', this.patientId)
      .then(
        (response: any) => {
          this.emailTemplates = response;
          console.log('emails', this.emailTemplateId);
        },
        () => {
          this.toastService.error('Unable to load the email templates.');
        }
      );
  }

  sendSMS() {
    if (!this.smsTemplateId) return;
    this.patientService.sendSMS(this.patientId, this.smsTemplateId).then(
      () => {
        this.loadPatientInfo();
        this.loadPatientComments();
        this.toastService.success('SMS Sent Successfully.');
        this.smsTemplateId = '';
      },
      () => {
        this.toastService.error('Unable to send SMS.');
      }
    );
  }
  sendCustomSms(message: string) {
    this.simpleSmsForm.controls['body'].setValue(message);
    this.sendSimpleSms();
  }

  checkEmailOptOut() {
    this.patientService.getOptedOutEmailSMS().then((optedOutEmails: any) => {
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

  sendSimpleEmail() {
    if (this.simpleEmailForm.valid) {
      //console.log('Email is --' + answer);
      const emailBody = this.simpleEmailForm.get('body').value;
      // emailBody = emailBody.replaceAll('\n', '<br>');
      this.simpleEmailForm.patchValue({
        body: emailBody
      });
      this.patientService.sendSimpleEmail(this.simpleEmailForm.value).then(
        () => {
          this.toastService.success('Email sent successfully.');
          this.simpleEmailForm.reset();
          this.simpleEmailForm.patchValue({
            email: this.patient.email,
            patientId: this.patientId
          });
        },
        () => {
          this.toastService.error(
            'System error occured. Please try again or contact support'
          );
        }
      );
    }
  }

  sendSimpleSms() {
    //console.log('Text is ' + value);
    //const phoneNumber: string = this.getAnswerFromQuestionAnswers('Phone Number');
    //console.log(this.simpleSmsForm);
    if (this.simpleSmsForm.valid) {
      //console.log('Phone Number is --' + answer);
      this.patientService.sendSimpleSms(this.simpleSmsForm.value).then(
        (res: any) => {
          if (res && res.status == 200) {
            this.simpleSmsForm.reset();
            this.simpleSmsForm.patchValue({
              phoneNumber: this.patient.phone,
              patientId: this.patientId
            });
            this.loadSourceAuditLogs();
            this.messageBody = '';
            this.twoWayTextChatComponent.setMessageBody('');
          } else {
            let msg = 'Error while sending SMS';
            if (res?.status == 500 && res?.errorMessage) {
              msg = res.errorMessage;
            }
            this.toastService.error(msg);
          }
        },
        (e: any) => {
          if (e.message) this.toastService.error(e.message);
          else
            this.toastService.error(
              'System error occured. Please try again or contact support'
            );
        }
      );
    }
  }

  get subject() {
    return this.simpleEmailForm.get('subject');
  }

  get body() {
    return this.simpleEmailForm.get('body');
  }

  aiModelClose(event: any) {
    if (event?.replace) {
      this.simpleSmsForm.patchValue({
        body: event.replaceData
      });
    }
    this.showAiModal = false;
  }

  aiModelCloseEmail(event: any) {
    if (event?.replace) {
      this.simpleEmailForm.patchValue({
        body: event.replaceData
      });
    }
    this.showAiModal = false;
  }
  chatStatusChange(status: string) {
    this.patientService.updatSmsChatStatus(this.patientId, status).then(
      () => {
        this.leadChatStatus = status;
        this.toastService.success('Status changed successfully.');
      },
      () => {
        this.toastService.error('Unable to change status.');
      }
    );
  }
  onSearch() {
    this.showSearch = !this.showSearch;
  }
  onToggleChatDropdown() {
    this.twoWayTextChatComponent.toggleChatStatusDropDown();
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
  toggleEmailSMSTab(tab: string) {
    this.activeTab = tab;
  }
  loadSourceAuditLogs(fromRefresh?: boolean) {
    this.twoWayTextService.getSourceAuditLogs(this.patientId).then(
      (response: any) => {
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
    }, 20000);
  }

  valueChange() {
    this.remainingText = 200 - this.simpleSmsForm.value.body.length;
  }
}
