import { Component, OnInit, ViewChild, DoCheck } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import moment from 'moment';
import { LeadsService } from 'src/app/modules/leads/service/leads.service';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
import { SmsService } from '../../services/sms.service';
import { TriggersService } from '../../services/triggers.service';
import { Dropdown } from 'primeng/dropdown';
import { PatientService } from 'src/app/modules/pateint/services/patient.service';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';

@Component({
  selector: 'app-add-edit-mass-email-sms',
  templateUrl: './add-edit-mass-email-sms.component.html',
  styleUrls: ['./add-edit-mass-email-sms.component.css']
})
export class AddEditMassEmailSmsComponent implements OnInit, DoCheck {
  actionObj: any = {};
  @ViewChild('dropdown') dropdown?: Dropdown;
  triggerForm: FormGroup | any;
  triggerId: number;

  leadStatusList: any = [];
  smsTemplate: any[] = [];
  leadEmailTemplate: any = [];
  leadSmsTemplate: any = [];
  appointmentPatientEmailTemplate: any = [];
  appointmentPatientSMSTemplate: any = [];
  leadPatientSmsTemplate: any = [];
  leadPatientEmailTemplate: any = [];
  appointmentStatusList: any = [];
  patientStatusList: any = [];

  users: any = [];
  appointments: any = [];
  emailTemplates: any = [];
  triggerConditions: any = [];

  readonly LEAD_MODULE = 'MassLead';
  readonly PATIENT_MODULE = 'MassPatient';
  readonly ALL_MODULE = 'All';
  readonly STATUS_COMPLETED = 'COMPLETED';

  lineHeightCSSMap: any = lineHeightMap;
  isLastLevel = true;
  triggerOpen = true;
  actionIndex = -1;
  showBorder = false;

  browserTimezone: string;
  todayDate = new Date();

  emailCount: number = 0;
  smsCount: number = 0;
  isEmailCount: boolean;
  isSmsCount: boolean;
  isEmailQuotaReached: boolean;
  isSmsQuotaReached: boolean;
  availableEmailQuota: number;
  availableSmsQuota: number;
  dropDownSelect: any;
  businessData: any;
  agencyName: any;

  showSmsModal: any;
  showEmailModal: boolean;
  modalData: { id: any; type: string; index?: number };
  showPreviewModal: boolean;

  leadTagList: any = [];
  patientTagList: any = [];
  readonly STATUS_SCHEDULED: string = 'SCHEDULED';
  readonly EMPTY_STRING: string = '';
  executionStatus: string = this.EMPTY_STRING;
  leadSourceList: any = [];
  showPatientStatusDropDown: boolean = true;
  increaseLineHHeigh: any = 0;
  source: any;
  preselectedModuleName: string;
  templateModalData: any = {
    moduleName: '',
    triggerType: '',
    templates: []
  };
  showTemplatesModal: boolean = false;
  segmentsCount: number = 0;
  showSegmentsMessage: boolean = false;
  showEmailMessage: boolean = false;
  cancelModal: boolean = false;
  insufficientQuotaPopup: boolean = false;
  disableSaveButton: boolean = false;
  isDropdownSelected: boolean = false;

  constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private highLevelService: TriggersService,
    private smsService: SmsService,
    private router: Router,
    private alertService: ToasTMessageService,
    private leadService: LeadsService,
    private patientService: PatientService,
    private localStorageService: LocalStorageService
  ) {}

  ngOnInit(): void {
    this.source =
      this.activatedRoute.snapshot.queryParams?.source ?? 'mass-email';
    this.createForm();
    this.getLeadTags();
    this.getPatientTags();
    this.activatedRoute.params.subscribe((data) => {
      console.log(data);
      this.triggerId = data.id;
      if (this.triggerId) {
        this.isLastLevel = false;
        this.getTriggerData(this.triggerId);
        this.getSmsTemplate();
        this.getEmailTemplates();
      }
    });
    this.activatedRoute.queryParams.subscribe((data) => {
      console.log(data);
      this.source = data?.source ?? 'mass-email';
      this.preselectedModuleName = data.moduleName;
      if (this.preselectedModuleName) {
        this.triggerForm.patchValue({
          moduleName: this.preselectedModuleName
        });
      }
    });
    this.getSms_Email_Users();
    this.browserTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    this.dropDownSelect = false;
    this.isEmailCount = false;
    this.isSmsCount = true;
    //this.onDropDownClose();
    if (
      this.executionStatus === this.STATUS_SCHEDULED ||
      this.executionStatus === this.EMPTY_STRING
    )
      this.getEmailSmsQuota();
  }

  ngDoCheck(): void {
    /* ----- Dropdown filter logic for single string array such as currency ----- */
    if (this.dropdown) {
      (this.dropdown.filterBy as any) = {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        split: (_: any) => [(item: any) => item]
      };
    }
  }
  /* ---------------------------- get sms template ---------------------------- */
  getSmsTemplate(id?: any, templateId?: any) {
    const controlArray = <FormArray>this.triggerForm.controls['triggerData'];
    if (this.triggerForm.value.triggerData[id]) {
      let smsTemplate;
      if (this.triggerForm.value.triggerData[id].triggerTarget == 'lead') {
        if (templateId !== null && templateId !== undefined) {
          smsTemplate = this.leadSmsTemplate.find(
            (template: any) => template.id === templateId
          );
        } else {
          smsTemplate = this.leadSmsTemplate[0];
        }
      } else if (
        this.triggerForm.value.triggerData[id].triggerTarget ==
        'AppointmentPatient'
      ) {
        if (templateId !== null && templateId !== undefined) {
          smsTemplate = this.appointmentPatientSMSTemplate.find(
            (template: any) => template.id === templateId
          );
        } else {
          smsTemplate = this.appointmentPatientSMSTemplate[0];
        }
      } else if (
        this.triggerForm.value.triggerData[id].triggerTarget == this.ALL_MODULE
      ) {
        if (templateId !== null && templateId !== undefined) {
          smsTemplate = this.leadPatientSmsTemplate.find(
            (template: any) => template.id === templateId
          );
        } else {
          smsTemplate = this.leadPatientSmsTemplate[0];
        }
      }
      controlArray.controls[id].patchValue({
        triggerTemplate: smsTemplate?.id
      });
      this.segmentsCount = this.calculateSegments(smsTemplate.body);
      if (this.smsCount * this.segmentsCount > this.availableSmsQuota) {
        this.showSegmentsMessage = true;
      } else {
        this.showSegmentsMessage = false;
      }
    }
  }

  calculateSegments(text: string) {
    let segments: number = 0;
    const charCount = text?.length || 0;
    if (charCount === 0) {
      return 0;
    }
    const bodyCharSet = new Set(text.split(''));
    const bodyCharArray = Array.from(bodyCharSet);
    const notGsm = this.containerAnyNonGsmChars(bodyCharArray);
    if (notGsm) {
      segments = charCount <= 70 ? 1 : Math.ceil(charCount / 67);
    } else {
      segments = charCount <= 160 ? 1 : Math.ceil(charCount / 153);
    }
    return segments;
  }

  containerAnyNonGsmChars(arr: string[]) {
    for (const a of arr) {
      if (!this.GSM_CODEPOINTS.has(a.codePointAt(0))) {
        return true;
      }
    }
    return false;
  }

  GSM_CODEPOINTS: Set<number> = new Set([
    0x000a, 0x000c, 0x000d, 0x0020, 0x0021, 0x0022, 0x0023, 0x0024, 0x0025,
    0x0026, 0x0027, 0x0028, 0x0029, 0x002a, 0x002b, 0x002c, 0x002d, 0x002e,
    0x002f, 0x0030, 0x0031, 0x0032, 0x0033, 0x0034, 0x0035, 0x0036, 0x0037,
    0x0038, 0x0039, 0x003a, 0x003b, 0x003c, 0x003d, 0x003e, 0x003f, 0x0040,
    0x0041, 0x0042, 0x0043, 0x0044, 0x0045, 0x0046, 0x0047, 0x0048, 0x0049,
    0x004a, 0x004b, 0x004c, 0x004d, 0x004e, 0x004f, 0x0050, 0x0051, 0x0052,
    0x0053, 0x0054, 0x0055, 0x0056, 0x0057, 0x0058, 0x0059, 0x005a, 0x005b,
    0x005c, 0x005d, 0x005e, 0x005f, 0x0061, 0x0062, 0x0063, 0x0064, 0x0065,
    0x0066, 0x0067, 0x0068, 0x0069, 0x006a, 0x006b, 0x006c, 0x006d, 0x006e,
    0x006f, 0x0070, 0x0071, 0x0072, 0x0073, 0x0074, 0x0075, 0x0076, 0x0077,
    0x0078, 0x0079, 0x007a, 0x007b, 0x007c, 0x007d, 0x007e, 0x00a1, 0x00a3,
    0x00a4, 0x00a5, 0x00a7, 0x00bf, 0x00c4, 0x00c5, 0x00c6, 0x00c9, 0x00d1,
    0x00d6, 0x00d8, 0x00dc, 0x00df, 0x00e0, 0x00e4, 0x00e5, 0x00e6, 0x00c7,
    0x00e8, 0x00e9, 0x00ec, 0x00f1, 0x00f2, 0x00f6, 0x00f8, 0x00f9, 0x00fc,
    0x0393, 0x0394, 0x0398, 0x039b, 0x039e, 0x03a0, 0x03a3, 0x03a6, 0x03a8,
    0x03a9, 0x20ac
  ]);

  hideSegmentsWarningModal(e: any) {
    if (e.close) {
      this.showSegmentsMessage = false;
    }
  }

  hideEmailWarningModal(e: any) {
    if (e.close) {
      this.showEmailMessage = false;
    }
  }

  getEmailTemplates(id?: any, templateId?: any) {
    const controlArray = <FormArray>this.triggerForm.controls['triggerData'];
    if (this.triggerForm.value.triggerData[id]) {
      //let emailTemplate;
      if (this.triggerForm.value.triggerData[id].triggerTarget == 'lead') {
        controlArray.controls[id].patchValue({
          triggerTemplate: templateId ?? this.leadEmailTemplate[0].id
        });
      } else if (
        this.triggerForm.value.triggerData[id].triggerTarget ==
        'AppointmentPatient'
      ) {
        controlArray.controls[id].patchValue({
          triggerTemplate:
            templateId ?? this.appointmentPatientEmailTemplate[0].id
        });
      } else if (
        this.triggerForm.value.triggerData[id].triggerTarget == this.ALL_MODULE
      ) {
        controlArray.controls[id].patchValue({
          triggerTemplate: templateId ?? this.leadPatientEmailTemplate[0].id
        });
      }
    }
  }

  /* --------------------------- get sms email users -------------------------- */
  getSms_Email_Users() {
    this.leadSmsTemplate = [];
    this.leadEmailTemplate = [];

    this.highLevelService.getEmail_Sms_Users_Data().then((data: any) => {
      this.smsTemplate = data.smsTemplateDTOList;
      console.log(this.smsTemplate);
      this.emailTemplates = data.emailTemplateDTOList;
      console.log(this.emailTemplates);
      this.users = data.userDTOList;
      data.smsTemplateDTOList.map((item: any) => {
        if (item.smsTarget == 'Lead' && item.templateFor == 'MassSMS') {
          this.leadSmsTemplate.push(item);
          this.leadPatientSmsTemplate.push(item);
        } else if (
          item.smsTarget == 'Patient' &&
          item.templateFor == 'MassSMS'
        ) {
          this.appointmentPatientSMSTemplate.push(item);
          this.leadPatientSmsTemplate.push(item);
        }
      });

      data.emailTemplateDTOList.map((item: any) => {
        // console.log(item);
        if (item.emailTarget == 'Lead' && item.templateFor == 'MassEmail') {
          this.leadEmailTemplate.push(item);
          this.leadPatientEmailTemplate.push(item);
        } else if (
          item.emailTarget == 'Patient' &&
          item.templateFor == 'MassEmail'
        ) {
          this.appointmentPatientEmailTemplate.push(item);
          this.leadPatientEmailTemplate.push(item);
        }
      });
    });
  }

  /* ----------------------------- get sms quoata ----------------------------- */

  getEmailSmsQuota() {
    let emailLimit: number;
    let smsLimit: number;
    let smsSent;
    let emailSent;
    this.smsService.getEmailSmsQuota().then((response: any) => {
      emailLimit = response.emailLimit;
      smsLimit = response.smsLimit;
      this.smsService.getEmailSmsCount().then((response1: any) => {
        emailSent = response1.emailCount;
        smsSent = response1.smsCount;
        console.log(smsSent, emailSent);
        this.availableEmailQuota = emailLimit;
        console.log(this.availableEmailQuota);
        this.availableSmsQuota = smsLimit;
      });
    });
  }
  /* ------------------------- Create form for trigger ------------------------ */
  createForm() {
    const bdData: any = this.localStorageService.readStorage('businessInfo');
    this.businessData = bdData;
    this.leadStatusList = [
      'NEW',
      'JUNK',
      'COLD',
      'WARM',
      'HOT',
      'PENDING',
      'WON',
      'DEAD'
    ];
    this.appointmentStatusList = [
      { label: 'Pending', value: 'Pending' },
      { label: 'Confirmed', value: 'Confirmed' },
      { label: 'Updated', value: 'Updated' },
      { label: 'Completed', value: 'Completed' },
      { label: 'Canceled', value: 'Canceled' }
    ];
    // this.leadSourceList = [
    //   { label: 'ChatBot', value: 'ChatBot' },
    //   { label: 'Landing Page', value: 'Landing Page' },
    //   { label: 'Self Assessment', value: 'Self Assessment' },
    //   { label: 'Form', value: 'Form' },
    //   { label: 'Manual', value: 'Manual' },
    //   { label: 'Facebook', value: 'Facebook' }
    // ];

    this.businessData = bdData;
    if (this.businessData) {
      this.agencyName = this.businessData?.agency?.name ?? 'Growth99';
      console.log('Agency Name : ' + this.agencyName);
      if (this.agencyName === 'Smile Virtual+') {
        this.leadSourceList = [
          { label: 'ChatBot', value: 'ChatBot' },
          { label: 'Landing Page', value: 'Landing Page' },
          { label: 'Self Assessment', value: 'Self Assessment' },
          { label: 'Form', value: 'Form' },
          { label: 'Manual', value: 'Manual' },
          { label: 'Facebook', value: 'Facebook' },
          { label: 'Smile Virtual', value: 'Smile Virtual' }
        ];
      } else {
        this.leadSourceList = [
          { label: 'ChatBot', value: 'ChatBot' },
          { label: 'Landing Page', value: 'Landing Page' },
          { label: 'Self Assessment', value: 'Self Assessment' },
          { label: 'Form', value: 'Form' },
          { label: 'Manual', value: 'Manual' },
          { label: 'Facebook', value: 'Facebook' }
        ];
      }
    } else {
      this.leadSourceList = [
        { label: 'ChatBot', value: 'ChatBot' },
        { label: 'Landing Page', value: 'Landing Page' },
        { label: 'Self Assessment', value: 'Self Assessment' },
        { label: 'Form', value: 'Form' },
        { label: 'Manual', value: 'Manual' },
        { label: 'Facebook', value: 'Facebook' }
      ];
    }

    this.patientStatusList = ['NEW', 'EXISTING'];

    this.triggerForm = this.fb.group({
      name: ['', [Validators.required]],
      moduleName: [this.LEAD_MODULE, [Validators.required]],
      triggerConditions: [[]],
      leadTags: [[]],
      patientTags: [[]],
      patientStatus: [[]],
      triggerData: this.fb.array([]),
      source: [[]]
    });
  }

  clearFormIfConditionTrue() {
    this.triggerForm.reset({
      name: '',
      moduleName: this.LEAD_MODULE,
      triggerConditions: [],
      leadTags: [],
      patientTags: [],
      patientStatus: [],
      triggerData: [],
      source: []
    });
  }

  /* ------------------------- Get trigger data by id ------------------------- */
  getTriggerData(id: any) {
    this.highLevelService.getTriggerData(id).then((triggerObj: any) => {
      this.triggerOpen = false;

      this.triggerConditions = triggerObj.triggerConditions;
      this.executionStatus = triggerObj.executionStatus;
      if (triggerObj.moduleName) {
        this.preselectedModuleName = triggerObj.moduleName;
      }
      //console.log(this.leadTagListResponse);
      this.triggerForm.patchValue({
        name: triggerObj.name,
        moduleName: triggerObj.moduleName,
        triggerConditions: this.triggerConditions,
        leadTags: this.setLeadTags(triggerObj.leadTags),
        patientTags: this.setPatientTags(triggerObj.patientTags),
        patientStatus: triggerObj.patientStatus,
        source: triggerObj.source
      });
      this.showBorder = true;
      this.actionIndex = 2;
      const triggerDataArray = this.triggerForm.controls
        .triggerData as FormArray;
      triggerDataArray.removeAt(0);
      if (triggerObj.triggerData.length > 0) {
        triggerObj.triggerData.forEach((item: any, index: any) => {
          triggerDataArray.push(
            this.fb.group({
              actionIndex: item.actionIndex,
              addNew: item.addNew,
              triggerTemplate: item.triggerTemplate,
              triggerType: item.triggerType,
              scheduledDateTime: new Date(item.scheduledDateTime),
              triggerTarget: item.triggerTarget ? item.triggerTarget : 'lead',
              triggerFrequency: item.triggerFrequency,
              showBorder: item.showBorder,
              orderOfCondition: item.orderOfCondition
                ? item.orderOfCondition
                : index,
              dateType: item.dateType ? item.dateType : 'NA'
            })
          );
          this.source = item.triggerType == 'EMAIL' ? 'mass-email' : 'mass-sms';
          this.dropDownSelect = true;
          //this.onDropDownClose();
          //console.log('drop2');
          if (item.triggerType == 'EMAIL') {
            this.isEmailCount = true;
            this.isSmsCount = false;
          } else if (item.triggerType == 'SMS') {
            this.isSmsCount = true;
            this.isEmailCount = false;
          }
        });
      }
      if (this.executionStatus === this.STATUS_COMPLETED) {
        this.triggerForm.disable();
      }
      console.log(this.triggerForm.value.patientStatus);
      if (!this.triggerForm.value.patientStatus)
        this.showPatientStatusDropDown = false;
      console.log(this.showPatientStatusDropDown);
    });
    //console.log(this.triggerForm);
    this.handleShowHideActionOnEditTrigger();
  }

  public onDropDownClose() {
    //console.log('drop', this.triggerForm.value);
    const moduleName = this.triggerForm.value.moduleName;
    const triggerConditions = this.triggerForm.value.triggerConditions;
    const patientStatus = this.triggerForm.value.patientStatus;
    const patientTags = this.triggerForm.value.patientTags;
    if (this.dropDownSelect && triggerConditions) {
      if (moduleName == this.LEAD_MODULE) {
        const leadTags = this.triggerForm.value.leadTags;
        const leadTagIds: any[] = [];
        leadTags.forEach((e: any) => {
          leadTagIds.push(e.id);
        });
        const source = this.triggerForm.value.source;
        this.highLevelService
          .getMassLeadCountByTag(
            triggerConditions,
            moduleName,
            leadTagIds,
            source
          )
          .then((data: any) => {
            //console.log('data2', data);
            if (data) {
              this.emailCount = data.emailCount;
              console.log(this.emailCount);
              console.log(this.availableEmailQuota);
              if (this.emailCount > this.availableEmailQuota) {
                this.showEmailMessage = true;
              } else {
                this.showEmailMessage = false;
              }
              this.smsCount = data.smsCount;
              this.isEmailQuotaReached =
                this.availableEmailQuota - this.emailCount < 0 ? true : false;
              console.log(this.emailCount > this.availableEmailQuota);
              this.source === 'mass-email' && this.getEmailTemplates(0);
              this.isSmsQuotaReached =
                this.availableSmsQuota - this.smsCount < 0 ? true : false;
              if (this.smsCount * this.segmentsCount > this.availableSmsQuota) {
                this.showSegmentsMessage = true;
              }
              this.source === 'mass-sms' && this.getSmsTemplate(0);
            }
          });
      } else if (moduleName == this.ALL_MODULE) {
        this.highLevelService
          .getMassLeadPatientCount(triggerConditions, moduleName)
          .subscribe((data: any) => {
            if (data) {
              this.emailCount = data.emailCount;
              console.log(data);
              // console.log(this.emailCount);
              console.log(this.availableEmailQuota);
              let totalEmailCount = 0;

              for (const obj of data) {
                totalEmailCount += obj.emailCount;
              }

              console.log(totalEmailCount); // 225
              if (totalEmailCount > this.availableEmailQuota) {
                this.showEmailMessage = true;
              } else {
                this.showEmailMessage = false;
              }
              this.emailCount = data[0].emailCount + data[1].emailCount;
              this.smsCount = data[0].smsCount + data[1].smsCount;
              this.isEmailQuotaReached =
                this.availableEmailQuota - this.emailCount < 0 ? true : false;
              console.log(this.isEmailQuotaReached);
              this.source === 'mass-email' && this.getEmailTemplates(0);
              this.isSmsQuotaReached =
                this.availableSmsQuota - this.smsCount < 0 ? true : false;
              if (this.smsCount * this.segmentsCount > this.availableSmsQuota) {
                this.showSegmentsMessage = true;
              }
              this.source === 'mass-sms' && this.getSmsTemplate(0);
            }
          });
      } else if (
        moduleName == this.PATIENT_MODULE &&
        patientStatus.length == 2 &&
        patientTags.length == 0 &&
        (triggerConditions.length == 5 || triggerConditions.length == 0)
      ) {
        this.highLevelService
          .getMassPatientsCount(triggerConditions, this.ALL_MODULE, [], [])
          .then((data: any) => {
            if (data) {
              this.emailCount = data.emailCount;
              console.log(this.emailCount);
              console.log(this.availableEmailQuota);
              if (this.emailCount > this.availableEmailQuota) {
                this.showEmailMessage = true;
              } else {
                this.showEmailMessage = false;
              }
              this.smsCount = data.smsCount;
              this.isEmailQuotaReached =
                this.availableEmailQuota - this.emailCount < 0 ? true : false;
              console.log(this.isEmailQuotaReached);
              this.source === 'mass-email' && this.getEmailTemplates(0);
              this.isSmsQuotaReached =
                this.availableSmsQuota - this.smsCount < 0 ? true : false;
              if (this.smsCount * this.segmentsCount > this.availableSmsQuota) {
                this.showSegmentsMessage = true;
              }
              this.source === 'mass-sms' && this.getSmsTemplate(0);
            }
          });
      } else if (moduleName == this.PATIENT_MODULE) {
        const patientTagIds: any[] = [];
        patientTags.forEach((e: any) => {
          patientTagIds.push(e.id);
        });
        this.highLevelService
          .getMassPatientsCount(
            triggerConditions,
            moduleName,
            patientStatus,
            patientTagIds
          )
          .then((data: any) => {
            if (data) {
              this.emailCount = data.emailCount;
              this.smsCount = data.smsCount;
              this.isEmailQuotaReached =
                this.availableEmailQuota - this.emailCount < 0 ? true : false;
              console.log(this.isEmailQuotaReached);
              this.source === 'mass-email' && this.getEmailTemplates(0);
              this.isSmsQuotaReached =
                this.availableSmsQuota - this.smsCount < 0 ? true : false;
              if (this.smsCount * this.segmentsCount > this.availableSmsQuota) {
                this.showSegmentsMessage = true;
              }
              this.source === 'mass-sms' && this.getSmsTemplate(0);
            }
          });
      }
      this.dropDownSelect = false;
    }
  }

  /* ------------------------ Static method without api ----------------------- */

  createTrigger() {
    this.triggerOpen = false;
  }
  updateDropdownState(templateValue: any) {
    // console.log(this.isLastLevel);
    // console.log(this.triggerForm.valid);
    // console.log(this.triggerForm);
    // console.log(this.triggerForm.status);
    this.isDropdownSelected =
      templateValue !== null && templateValue !== undefined;
    console.log(this.isDropdownSelected);
  }

  goTo(actionIndex: any, triggerIndex?: any) {
    this.onDropDownClose();
    const showTemplate = this.source === 'mass-email' ? 'EMAIL' : 'SMS';
    console.log(actionIndex);
    if (actionIndex == 2) {
      this.cancelModal = false;
      let triggerTarget = '';
      if (this.triggerForm.value.moduleName == this.PATIENT_MODULE) {
        triggerTarget = 'AppointmentPatient';
      } else if (this.triggerForm.value.moduleName == this.LEAD_MODULE) {
        triggerTarget = 'lead';
      } else if (this.triggerForm.value.moduleName == this.ALL_MODULE) {
        triggerTarget = this.ALL_MODULE;
      }
      this.showBorder = true;
      const controlArray = <FormArray>this.triggerForm.controls['triggerData'];
      controlArray.clear();
      const group = this.fb.group({
        actionIndex: 0,
        addNew: false,
        triggerTemplate: 0,
        triggerType: showTemplate,
        triggerTarget: triggerTarget,
        scheduledDateTime: new Date(),
        triggerFrequency: 'MIN',
        //taskName: "",
        showBorder: false,
        orderOfCondition: 0,
        dateType: 'NA'
      });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      group.controls['triggerTemplate'].valueChanges.subscribe((value: any) => {
        if (group.controls['actionIndex'].value <= 2) {
          group.patchValue({
            actionIndex: 3,
            addNew: true,
            dateType: 'NA'
          });
        }
        this.isLastLevel = false;
      });
      controlArray.push(group);
      this.updateDropdownState(group.controls['triggerTemplate'].value);
      this.dropDownSelect = true;
      this.onDropDownClose();
    } else if (actionIndex == 3 || actionIndex == 4) {
      this.isLastLevel = false;
      if (this.triggerForm.value.moduleName == this.LEAD_MODULE) {
        const controlArray = <FormArray>(
          this.triggerForm.controls['triggerData']
        );
        controlArray.controls[triggerIndex].patchValue({
          actionIndex: actionIndex,
          addNew: true,
          dateType: 'NA'
        });
      } else if (this.triggerForm.value.moduleName == this.PATIENT_MODULE) {
        const controlArray = <FormArray>(
          this.triggerForm.controls['triggerData']
        );
        controlArray.controls[triggerIndex].patchValue({
          actionIndex: actionIndex,
          addNew: true,
          dateType: 'NA'
        });
      } else if (this.triggerForm.value.moduleName == this.ALL_MODULE) {
        const controlArray = <FormArray>(
          this.triggerForm.controls['triggerData']
        );
        controlArray.controls[triggerIndex].patchValue({
          actionIndex: actionIndex,
          addNew: true,
          dateType: 'NA'
        });
      }
    } else if (actionIndex == 4) {
      const controlArray = <FormArray>this.triggerForm.controls['triggerData'];
      controlArray.controls[triggerIndex].patchValue({
        actionIndex: actionIndex,
        addNew: true
      });
    }
    this.actionIndex = actionIndex;
    this.scrollDiv();
    if (actionIndex === 2) {
      console.log(this.isDropdownSelected);
      console.log(this.actionIndex);
      if (this.isDropdownSelected) {
        this.isLastLevel = false;
      } else {
        this.isLastLevel = true;
      }
      if (this.emailCount < this.availableEmailQuota) {
        this.showEmailMessage = false;
      } else {
        this.showEmailMessage = true;
      }
    }
  }

  CancelLeadsFrom(index: any) {
    this.clearFormIfConditionTrue();
    this.cancelModal = true;
    this.actionIndex = index;
    this.removeTriggerData(this.actionIndex, 0);
  }

  scrollDiv() {
    var $target = $('html,body');
    $target.animate({ scrollTop: $(document).height() }, 1000);
  }

  removeTriggerData(actionIndex: any, indexPosition: any) {
    this.cancelModal = true;
    const controlArray = <FormArray>this.triggerForm.controls['triggerData'];
    const olderData = this.triggerForm.value.triggerData;
    const length = olderData.length;
    if (length == 1 && indexPosition == 0) {
      this.isLastLevel = true;
      const previousData = olderData[indexPosition];
      controlArray.controls[0].patchValue({
        actionIndex: 2,
        addNew: true,
        triggerTemplate: previousData.triggerTemplate,
        triggerType: previousData.triggerType,
        scheduledDateTime: new Date(previousData.scheduledDateTime),
        triggerTarget: previousData.triggerTarget
          ? previousData.triggerTarget
          : 'lead',
        triggerFrequency: previousData.triggerFrequency,
        showBorder: false,
        orderOfCondition: previousData.orderOfCondition
          ? previousData.orderOfCondition
          : indexPosition
      });
      this.actionIndex = actionIndex;
    } else {
      controlArray.removeAt(indexPosition);
      if (controlArray.controls.length > 0) {
        controlArray.controls[controlArray.controls.length - 1].patchValue({
          addNew: true,
          showBorder: false
        });
        if (
          controlArray.controls[controlArray.controls.length - 1].value
            .actionIndex > 2
        ) {
          this.isLastLevel = false;
        } else {
          this.isLastLevel = true;
        }
      }
    }
    this.isEmailCount = false;
    this.isSmsCount = true;
  }

  redirectToTablePage() {
    this.router.navigate(['/triggers/broadcast'], {
      queryParams: {
        source: this.source
      },
      queryParamsHandling: 'merge'
    });
  }

  setModuleName() {
    this.actionObj = {};
    const controlArray = <FormArray>this.triggerForm.controls['triggerData'];
    controlArray.clear();
    this.actionIndex = 0;
    this.emailCount = 0;
    this.smsCount = 0;

    if (this.triggerForm.value.moduleName == this.PATIENT_MODULE) {
      this.triggerForm.controls['triggerConditions'].setValue([]);
    } else if (this.triggerForm.value.moduleName == this.LEAD_MODULE) {
      this.triggerForm.controls['triggerConditions'].setValue([]);
      this.triggerForm.controls['leadTags'].setValue([]);
    } else if (this.triggerForm.value.moduleName == this.ALL_MODULE) {
      this.triggerForm.controls['triggerConditions'].setValue([
        this.ALL_MODULE
      ]);
    }
    this.triggerForm.controls['source'].setValue([]);
    this.getSmsTemplate(0);
    this.getEmailTemplates(0);
    this.isSmsCount = true;
    this.isEmailCount = false;
  }

  setCommunicationType(leadType: any, indexPosition: any) {
    if (leadType == 'EMAIL') {
      this.getEmailTemplates(indexPosition);
      this.isEmailCount = true;
      this.isSmsCount = false;
    }

    if (leadType == 'SMS') {
      this.getSmsTemplate(indexPosition);
      this.isSmsCount = true;
      this.isEmailCount = false;
    }
  }

  setMomentDate() {
    const triggerData = this.triggerForm.value.triggerData;
    triggerData.forEach((e: any) => {
      e.scheduledDateTime = moment(e.scheduledDateTime).format(
        'YYYY-MM-DD HH:mm:00 ZZ'
      );
      //console.log("formattedDateTime " + e.scheduledDateTime);
    });
    this.triggerForm.value.triggerData = triggerData;
  }

  getLeadSmsTemplate(lead: any) {
    this.showPreviewModal = true;
    this.modalData = {
      id: lead,
      type: 'sms'
    };
  }

  editSMSTemplate(smsId: any, index: number) {
    console.log(smsId);
    this.showSmsModal = true;
    this.modalData = {
      id: smsId,
      type: 'sms',
      index: index
    };
  }

  getEmailTemplate(email: any) {
    this.showPreviewModal = true;
    this.modalData = {
      id: email,
      type: 'email'
    };
  }

  editEmailTemplate(emailTemplateId: any) {
    console.log(emailTemplateId);
    this.showEmailModal = true;
    this.modalData = {
      id: emailTemplateId,
      type: 'email'
    };
  }

  onCloseModal(e: any) {
    console.log(e);
    this.showEmailModal = false;
    this.showPreviewModal = false;
  }

  onCloseSmsEditModal(e: any) {
    this.showSmsModal = false;
    if (e?.isEdit) {
      this.loadSmsTemplates(this.modalData.index, this.modalData.id);
    }
  }

  loadSmsTemplates(index?: any, templateId?: any) {
    this.highLevelService.loadSmsTemplates().then(
      (data: any) => {
        this.smsTemplate = data.smsTemplateDTOList;
        const leadSmsTemplate: any[] = [];
        const leadPatientSmsTemplate: any[] = [];
        const appointmentPatientSMSTemplate: any[] = [];
        data.smsTemplateDTOList.map((item: any) => {
          if (item.smsTarget == 'Lead' && item.templateFor == 'MassSMS') {
            leadSmsTemplate.push(item);
            leadPatientSmsTemplate.push(item);
          } else if (
            item.smsTarget == 'Patient' &&
            item.templateFor == 'MassSMS'
          ) {
            appointmentPatientSMSTemplate.push(item);
            leadPatientSmsTemplate.push(item);
          }
        });
        this.leadSmsTemplate = leadSmsTemplate;
        this.leadPatientSmsTemplate = leadPatientSmsTemplate;
        this.appointmentPatientSMSTemplate = appointmentPatientSMSTemplate;
        if (index != null && index != undefined) {
          this.getSmsTemplate(index, templateId);
        }
      },
      () => {
        this.alertService.error('Error while fetching sms templates.');
      }
    );
  }

  submitTrigger() {
    if (!(this.isEmailQuotaReached && this.isSmsQuotaReached)) {
      if (this.triggerId) {
        if (this.triggerForm.value.moduleName == this.LEAD_MODULE) {
          this.setMomentDate();
          this.highLevelService
            .updateMassLeadTrigger(this.triggerForm.value, this.triggerId)
            .then(
              () => {
                this.alertService.success('Trigger Updated successfully');
                // this.router.navigate(['triggers/broadcast']);
                this.redirectToTablePage();
              },
              () => {
                this.alertService.error('Not able to Update');
                // this.router.navigate(['triggers/broadcast']);
                this.redirectToTablePage();
              }
            );
        } else if (this.triggerForm.value.moduleName == this.PATIENT_MODULE) {
          this.setMomentDate();
          this.highLevelService
            .updateMassPatientTrigger(this.triggerForm.value, this.triggerId)
            .then(
              () => {
                //console.log(data)
                this.alertService.success('Trigger Updated successfully');
                // this.router.navigate(['triggers/broadcast']);
                this.redirectToTablePage();
              },
              () => {
                this.alertService.error('Not able to Update');
                // this.router.navigate(['triggers/broadcast']);
                this.redirectToTablePage();
              }
            );
        } else if (this.triggerForm.value.moduleName == this.ALL_MODULE) {
          this.setMomentDate();
          this.highLevelService
            .updateMassLeadPatientTrigger(
              this.triggerForm.value,
              this.triggerId
            )
            .then(
              () => {
                this.alertService.success('Trigger updated successfully');
                // this.router.navigate(['triggers/broadcast']);
                this.redirectToTablePage();
              },
              () => {
                this.alertService.error('Not able to save');
                // this.router.navigate(['triggers/broadcast']);
                this.redirectToTablePage();
              }
            );
        }
      } else if (this.triggerForm.value.moduleName == this.LEAD_MODULE) {
        this.setMomentDate();
        this.highLevelService
          .createMassLeadTrigger(this.triggerForm.value)
          .then(
            () => {
              this.alertService.success('Trigger created successfully');
              // this.router.navigate(['triggers/broadcast']);
              this.redirectToTablePage();
            },
            () => {
              this.alertService.error('Not able to save');
              // this.router.navigate(['triggers/broadcast']);
              this.redirectToTablePage();
            }
          );
      } else if (this.triggerForm.value.moduleName == this.PATIENT_MODULE) {
        this.setMomentDate();
        this.highLevelService
          .createMassPatientTrigger(this.triggerForm.value)
          .then(
            () => {
              this.alertService.success('Trigger created successfully');
              // this.router.navigate(['triggers/broadcast']);
              this.redirectToTablePage();
            },
            () => {
              this.alertService.error('Not able to save');
              // this.router.navigate(['triggers/broadcast']);
              this.redirectToTablePage();
            }
          );
      } else if (this.triggerForm.value.moduleName == this.ALL_MODULE) {
        this.setMomentDate();
        this.highLevelService
          .createMassLeadPatientTrigger(this.triggerForm.value)
          .then(
            () => {
              this.alertService.success('Trigger created successfully');
              // this.router.navigate(['triggers/broadcast']);
              this.redirectToTablePage();
            },
            (error) => {
              this.alertService.error('Not able to save', error);
              // this.router.navigate(['triggers/broadcast']);
              this.redirectToTablePage();
            }
          );
      }
    }
  }

  getLeadTags() {
    this.leadService.leadTagList().then((data: any) => {
      if (data) this.leadTagList = data;
    });
  }

  getPatientTags() {
    this.patientService.patientTagList().then((data: any) => {
      if (data) this.patientTagList = data;
    });
  }

  setLeadTags(leadTagsResponse: any): any {
    const leadTagsLocal: any = [];
    if (null != leadTagsResponse && leadTagsResponse.length > 0) {
      leadTagsResponse.forEach((e1: any) => {
        this.leadTagList.forEach((e2: any) => {
          if (e1 === e2.id)
            leadTagsLocal.push({
              id: e2.id,
              name: e2.name,
              isDefault: e2.isDefault
            });
        });
      });
    }
    //console.log(this.leadTagListResponse);
    return leadTagsLocal;
  }

  setPatientTags(patientTagsResponse: any): any {
    const patientTagsLocal: any = [];
    if (null != patientTagsResponse && patientTagsResponse.length > 0) {
      patientTagsResponse.forEach((e1: any) => {
        this.patientTagList.forEach((e2: any) => {
          if (e1 === e2.id)
            patientTagsLocal.push({
              id: e2.id,
              name: e2.name,
              isDefault: e2.isDefault
            });
        });
      });
    }
    //console.log(this.leadTagListResponse);
    return patientTagsLocal;
  }

  viewCompletedTriggerAudit() {
    this.router.navigateByUrl(
      '/triggers/broadcast/' + this.triggerId + '/audit'
    );
  }

  handleActionOptions(actionFor: string, isShow: boolean) {
    if (isShow) {
      this.increaseLineHHeigh++;
    } else {
      this.increaseLineHHeigh--;
    }
    this.actionObj[actionFor] = isShow;
  }

  handleShowHideActionOnEditTrigger() {
    this.actionObj.showleadTags = true;
    this.actionObj.showLeadSource = true;
    this.actionObj.showPatientTags = true;
    this.actionObj.showAppointmentStatus = true;
  }

  openTemplatesModal(
    moduleName: string,
    triggerType: string,
    indexPosition: any
  ) {
    if (this.emailCount > this.availableEmailQuota) {
      this.disableSaveButton = true;
      console.log('disable save true');
    } else {
      this.disableSaveButton = false;
      console.log('disable save false');
    }
    this.templateModalData.moduleName = moduleName;
    this.templateModalData.triggerType = triggerType;
    this.templateModalData.indexPosition = indexPosition;
    if (moduleName === this.LEAD_MODULE) {
      if (triggerType === 'EMAIL') {
        this.templateModalData.templates = this.leadEmailTemplate;
      } else if (triggerType === 'SMS') {
        this.templateModalData.templates = this.leadSmsTemplate;
      }
    } else if (moduleName === this.PATIENT_MODULE) {
      if (triggerType === 'EMAIL') {
        this.templateModalData.templates = this.appointmentPatientEmailTemplate;
      } else if (triggerType === 'SMS') {
        this.templateModalData.templates = this.appointmentPatientSMSTemplate;
      }
    } else if (moduleName === this.ALL_MODULE) {
      if (triggerType === 'EMAIL') {
        this.templateModalData.templates = this.leadPatientEmailTemplate;
      } else if (triggerType === 'SMS') {
        this.templateModalData.templates = this.leadPatientSmsTemplate;
      }
    }
    this.showTemplatesModal = true;
  }

  showHideTemplatesDialog(e: any) {
    this.showTemplatesModal = e;
  }

  templateSelected(e: any) {
    if (e && e.id) {
      if (this.templateModalData.triggerType == 'EMAIL') {
        this.getEmailTemplates(this.templateModalData.indexPosition, e.id);
      } else if (this.templateModalData.triggerType == 'SMS') {
        this.getSmsTemplate(this.templateModalData.indexPosition, e.id);
      }
    }
  }
}

export const lineHeightMap = {
  1: 'single',
  2: 'two',
  0: 'none'
};
