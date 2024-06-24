import { Component, OnInit, Input } from '@angular/core';
import { BusinessService } from '../../services/business.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  AuditTriggerCountList,
  AuditTriggerDetailList
} from 'src/app/shared/models/business/business';
import { FormatTimeService } from 'src/app/shared/services/time-utils/formatTime.service';
import { LeadsService } from 'src/app/modules/leads/service/leads.service';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
@Component({
  selector: 'app-email-sms-audit',
  templateUrl: './email-sms-audit.component.html',
  styleUrls: ['./email-sms-audit.component.css']
})
export class EmailSmsAuditComponent implements OnInit {
  @Input() businessInfo: any;
  @Input() loggedInUser: any;
  emailSmsCountForm: FormGroup;
  emailSent: any;
  smsSent: any;
  emailLimit: any;
  smsLimit: any;
  rowData: AuditTriggerCountList[] = [];
  rowTriggerData: AuditTriggerDetailList[] = [];

  emailSmsQuotaResponse: any;
  globalFilterColumn = ['triggerId', 'triggerName', 'triggerCount'];
  columns = [
    { header: 'Trigger Id', field: 'triggerId' },
    { header: 'Trigger Name', field: 'triggerName' },
    { header: 'Trigger Count', field: 'triggerCount' },
    { header: 'Actions', field: 'actions' }
  ];
  globalFilterDetailColumn = [
    'leadId',
    'contentId',
    'templateName',
    'phoneNumber',
    'email',
    'date'
  ];
  emailLeadColumns = [
    { header: 'Lead ID', field: 'leadId' },
    { header: 'Email', field: 'email' },
    { header: 'Template Name', field: 'templateName' },
    { header: 'Body', field: 'contentId' },
    { header: 'Date', field: 'date' }
  ];
  emailAppointmentColumns = [
    { header: 'Appointment ID', field: 'leadId' },
    { header: 'Patient ID', field: 'patientId' },
    { header: 'Email', field: 'email' },
    { header: 'Template Name', field: 'templateName' },
    { header: 'Body', field: 'contentId' },
    { header: 'Date', field: 'date' }
  ];
  emailAllColumns = [
    { header: 'Lead/Patient ID', field: 'leadId' },
    { header: 'Email', field: 'email' },
    { header: 'Template Name', field: 'templateName' },
    { header: 'Body', field: 'contentId' },
    { header: 'Date', field: 'date' }
  ];
  smsLeadColumns = [
    { header: 'Lead ID', field: 'leadId' },
    { header: 'Phone', field: 'phoneNumber' },
    { header: 'Template Name', field: 'templateName' },
    { header: 'Segments', field: 'smsSegments' },
    { header: 'Body', field: 'contentId' },
    { header: 'Date', field: 'date' }
  ];
  smsAppointmentColumns = [
    { header: 'Appointment ID', field: 'leadId' },
    { header: 'Patient ID', field: 'patientId' },
    { header: 'Phone', field: 'phoneNumber' },
    { header: 'Template Name', field: 'templateName' },
    { header: 'Segments', field: 'smsSegments' },
    { header: 'Body', field: 'contentId' },
    { header: 'Date', field: 'date' }
  ];
  smsAllColumns = [
    { header: 'Lead/Patient ID', field: 'leadId' },
    { header: 'Phone', field: 'phoneNumber' },
    { header: 'Template Name', field: 'templateName' },
    { header: 'Segments', field: 'smsSegments' },
    { header: 'Body', field: 'contentId' },
    { header: 'Date', field: 'date' }
  ];
  detailColumns: any[] = [];
  selectedColumns: any[] = this.columns;
  selectedDetailColumns: any[] = [];
  communicationType: string;
  triggerId: number;
  showPreviewModal: boolean;
  body: any;
  static readonly SMS = 'SMS';
  static readonly EMAIL = 'EMAIL';
  triggerModule: string;
  constructor(
    public formBuilder: FormBuilder,
    private businessService: BusinessService,
    public formatTimeService: FormatTimeService,
    private leadService: LeadsService,
    private toastService: ToasTMessageService
  ) {}
  ngOnInit(): void {
    this.emailSmsCountForm = this.formBuilder.group({
      emailLimit: ['', [Validators.required]],
      smsLimit: ['', Validators.required],
      emailSentMonthly: [''],
      smsSentMonthly: ['']
    });
    this.loadBusiness();
    this.getEmailSmsCount();
  }

  loadBusiness() {
    this.businessService
      .getBusinessOptimized(this.loggedInUser?.businessId)
      .then(
        (response: any) => {
          //
          this.emailSmsCountForm.patchValue({
            emailLimit: response.emailLimit,
            smsLimit: response.smsLimit
          });
          this.emailLimit = response.emailLimit;
          this.smsLimit = response.smsLimit;
        },
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        () => {}
      );
  }

  getEmailSmsCount() {
    this.businessService.getEmailSmsCount().then((response: any) => {
      this.emailSmsCountForm.patchValue({
        emailSentMonthly: response.emailCount,
        smsSentMonthly: response.smsCount
      });
      this.emailSent = response.emailCount;
      this.smsSent = response.smsCount;
      this.emailSmsQuotaResponse = response;
    });
  }

  getTriggerAudit(communicationType: string) {
    this.rowData = [];
    this.rowTriggerData = [];
    this.communicationType = communicationType;
    this.businessService.getTriggerAudit(communicationType).then(
      (response: any) => {
        this.rowData = response;
      },
      () => {
        this.toastService.error('Data Not Available');
      }
    );
  }

  getTriggerAuditDetails(
    triggerId: number,
    triggerModule: string,
    triggerType: string
  ) {
    this.triggerId = triggerId;
    if (
      triggerModule === LEAD ||
      triggerModule === MASS_LEAD ||
      triggerModule === LEADS ||
      triggerModule === NA ||
      triggerModule === FORMS
    ) {
      this.setColumns(this.emailLeadColumns, this.smsLeadColumns);
    } else if (
      triggerModule === APPOINTMENT ||
      triggerModule === MASS_PATIENT ||
      triggerModule === PATIENT
    ) {
      this.setColumns(this.emailAppointmentColumns, this.smsAppointmentColumns);
    } else if (triggerModule === ALL_MODULE) {
      this.setColumns(this.emailAllColumns, this.smsAllColumns);
    }
    this.businessService
      .getTriggerAuditDetails(triggerId, triggerType, triggerModule)
      .then(
        (response: any) => {
          this.rowTriggerData = response;
          if (this.rowTriggerData && this.rowTriggerData.length) {
            this.rowTriggerData.forEach((e: any) => {
              e.date = this.formatTimeService.formatTimeWithoutTimezone(e.date);
            });
            setTimeout(() => {
              window.scrollTo(0, document.body.scrollHeight);
            }, 100);
            window.scrollTo(0, document.body.scrollHeight);
          } else {
            this.toastService.error('Data Not Available');
          }
          this.triggerModule = triggerModule;
        },
        () => {
          this.toastService.error('Data Not Available');
        }
      );
  }

  getBody(id: any, label: string) {
    if (
      this.triggerModule === LEAD ||
      this.triggerModule === MASS_LEAD ||
      this.triggerModule === LEADS ||
      this.triggerModule === NA ||
      this.triggerModule === FORMS ||
      (this.triggerModule === ALL_MODULE && label === LEAD)
    ) {
      this.leadService.emailTemplate(id).then(
        (data: any) => {
          //
          this.body = data;
          if (this.body) this.showPreviewModal = true;
        },
        () => {
          this.toastService.error('Data Not Available');
        }
      );
    } else if (
      this.triggerModule === APPOINTMENT ||
      this.triggerModule === MASS_PATIENT ||
      this.triggerModule === PATIENT ||
      (this.triggerModule === ALL_MODULE && label === APPOINTMENT)
    ) {
      this.businessService.getEmailSmsBody(id).then(
        (data: any) => {
          //
          this.body = data;
          if (this.body) this.showPreviewModal = true;
        },
        () => {
          this.toastService.error('Data Not Available');
        }
      );
    }
  }

  onCloseModal() {
    this.showPreviewModal = false;
  }

  onDetailClicked(e: any) {
    this.getTriggerAuditDetails(e.triggerId, e.triggerModule, e.triggerType);
  }

  setColumns(emailColumnNames: any[], smsColumnNames: any[]) {
    if (this.communicationType === EmailSmsAuditComponent.EMAIL) {
      this.detailColumns = emailColumnNames;
      this.selectedDetailColumns = emailColumnNames;
    } else if (this.communicationType === EmailSmsAuditComponent.SMS) {
      this.detailColumns = smsColumnNames;
      this.selectedDetailColumns = smsColumnNames;
    }
  }
}
const LEAD: string = 'Lead';
const LEADS: string = 'leads';
const NA: string = 'NA';
const APPOINTMENT: string = 'Appointment';
const MASS_LEAD: string = 'MassLead';
const MASS_PATIENT: string = 'MassPatient';
const ALL_MODULE: string = 'All';
const PATIENT: string = 'patient';
const FORMS: string = 'forms';
