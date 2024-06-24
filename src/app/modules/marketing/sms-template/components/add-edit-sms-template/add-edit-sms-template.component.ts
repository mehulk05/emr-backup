import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SmsService } from '../../services/sms.service';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
import { LeadsService } from 'src/app/modules/leads/service/leads.service';

@Component({
  selector: 'app-add-edit-sms-template',
  templateUrl: './add-edit-sms-template.component.html',
  styleUrls: ['./add-edit-sms-template.component.css']
})
export class AddEditSmsTemplateComponent implements OnInit {
  emailForm!: FormGroup;
  testEmailTemplateForm!: FormGroup;
  // templateValues = ['Lead', 'Appointment', 'MassSMS'];
  templateValues = [
    { id: 'Lead', name: 'Lead' },
    { id: 'Patient', name: 'Patient' },
    { id: 'Appointment', name: 'Appointment' },
    { id: 'MassSMS', name: 'Mass SMS' },
    { id: 'Form', name: 'Form' }
  ];

  genderValues = ['Male', 'Female'];
  leadTarget = ['Lead', 'Clinic'];
  patientTarget = ['Patient', 'Clinic'];
  appointmentTarget = ['Patient', 'Clinic'];
  massSMSTarget = ['Lead', 'Patient'];
  reviewFormTarget = ['Review'];

  submitted = false;
  emailTemplateId!: any;
  emailTemplateNames: any[] = [];
  filterEmailVariables: any[] = [];
  leadSmsVariables: any[] = [];
  patientSmsVariables: any[] = [];
  massSMSVariables: any[] = [];
  emailVariables: any[] = [];
  questionnaires: any = [];
  questions: any = [];
  appointmentSMSVariables: any[] = [];
  chatSessionList: any;
  questionnaireId: any = null;
  rowData: any = [];
  currentDate = new Date();
  showTooltip: boolean = false;

  showAiModal = false;
  category =
    "You're an experienced content writer at a reputed consulting firm. Your job is to rewrite the following message in a GSM7 compliant format preferably and keeping all variables under 160 characters. If you think that keeping the 160 character limit would restrict you from doing proper writing, you can choose to go to a maximum of 306 characters only. But your goal should be to keep it as concise as possible without eliminating any information from the message. The 306 character limit should not be breached under any circumstances";
  message = '';

  @ViewChild('smsBody') smsBody: any;
  isShowTestModel: boolean = false;
  title: string = 'Create SMS Template';
  source: any;
  totalCharacterLength = 0;
  totalAiCharacterLength = 160;
  variablesData: any = {};
  businessVariables: any[] = [
    'BUSINESS_NAME',
    'CLINIC_ABOUT',
    'CLINIC_ADDRESS',
    'CLINIC_CONTACT_NUMBER',
    'CLINIC_WEBSITE',
    'CLINIC_FACEBOOK',
    'CLINIC_INSTAGRAM',
    'CLINIC_TWITTER',
    'CLINIC_GOOGLE_MY_BUSINESS',
    'CLINIC_NAME',
    'CLINIC_EMAIL',
    'BOOKING_URL',
    'REVIEW_LINK'
  ];
  numberOfSegments: number = 0;
  showSmsVariableMessage: boolean = false;
  showEncodingMessage: boolean = false;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private smsService: SmsService,
    private toasterService: ToasTMessageService,
    private leadsService: LeadsService
  ) {}

  ngOnInit(): void {
    this.source = this.route.snapshot.queryParams?.source ?? 'leads';
    this.generateFromGrups();
    this.route.paramMap.subscribe((params: any) => {
      console.log(params);
      this.emailTemplateId = parseInt(params.get('id'));
      if (this.emailTemplateId) {
        this.title = 'Edit SMS Template';
        this.getEmailTemplate(this.emailTemplateId);
      } else {
        this.emailForm.get('smsTarget').setValidators(Validators.required);
        this.emailForm.patchValue({
          templateFor: SOURCE_ENUM[this.source]
        });
      }
    });
    this.getMassSMSVariables();
    this.loadQuestionnaires();
    this.getLeadVariables();
    this.getPatientVariables();
    this.loadChatSessionlist();
    this.getAppointmentVariables();
    this.loadVariablesData();
  }

  generateFromGrups() {
    this.emailForm = this.fb.group({
      id: [''],
      name: ['', Validators.required],
      body: ['', Validators.required],
      templateFor: ['Lead', []],
      smsTemplateName: ['', []],
      isCustom: [false, []],
      smsTarget: ['', []]
    });

    this.testEmailTemplateForm = this.fb.group({
      contactNumber: [
        '',
        [Validators.required, Validators.pattern('^[1-9][0-9]{9}$')]
      ],
      leadId: ['', [Validators.required]],
      smsTemplateId: ['', []]
    });
  }

  get f() {
    return this.emailForm.controls;
  }
  get stf() {
    return this.testEmailTemplateForm.controls;
  }
  valueChange() {
    this.totalCharacterLength = this.emailForm.value.body.length;
    // if (!this.emailForm.value.body?.match(/\${([^}]+)}/g)) {
    //   this.showSmsVariableMessage = false;
    // } else {
    //   this.showSmsVariableMessage = true;
    // }
    this.numberOfSegments = this.calculateSegments(this.emailForm.value.body);
  }

  getEmailTemplate(emailTemplateId: number) {
    this.smsService.getEmailId(emailTemplateId).then(
      (data: any) => {
        this.emailForm.patchValue(data);
        this.totalCharacterLength = data.body.length;
        this.setPredefinedVariables();
        this.numberOfSegments = this.calculateSegments(data.body.length);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  loadQuestionnaires() {
    this.smsService.getAllQuestionnaireList().then((response: any) => {
      for (var i = 0; i < response.length; i++) {
        if (response[i].isContactForm) {
          this.smsService
            .getAllQuestions(response[i].id)
            .then((response: any) => {
              for (var j = 0; j < response.length; j++) {
                this.leadSmsVariables.push({
                  label: response[j].name,
                  variable: response[j].name
                });
              }
            });
          //console.log(this.leadSmsVariables);
          break;
        }
      }
    });
  }

  getLeadVariables() {
    this.smsService.getVariables('Lead').then((data: any) => {
      this.leadSmsVariables = data;
    });
  }

  getPatientVariables() {
    this.smsService.getVariables('Patient').then((data: any) => {
      this.patientSmsVariables = data;
    });
  }

  loadVariablesData() {
    this.smsService.getSmsVariablesData().then((response: any) => {
      this.variablesData = response;
      if (this.emailTemplateId) {
        this.setPredefinedVariables();
      }
    });
  }

  setPredefinedVariables() {
    let smsBody: string = this.emailForm.value.body;
    const variables: string[] = smsBody?.match(/[^\${}]+(?=})/g);
    if (variables && variables.length > 0) {
      variables.forEach((variable: string) => {
        if (this.variablesData[variable]) {
          smsBody = smsBody.replace(
            `\${${variable}}`,
            this.variablesData[variable]
          );
        } else {
          this.showSmsVariableMessage = true;
        }
      });
    }
    this.emailForm.patchValue({
      body: smsBody
    });
    this.numberOfSegments = this.calculateSegments(this.emailForm.value.body);
    this.totalCharacterLength = smsBody.length;
  }

  getMassSMSVariables() {
    this.smsService.getVariables('MassSMS').then((data: any) => {
      this.massSMSVariables = data;
    });
  }

  getAppointmentVariables() {
    this.smsService.getVariables('Appointment').then((data: any) => {
      this.appointmentSMSVariables = data;
    });
  }

  addVariables(variable: any) {
    const elem = this.smsBody.nativeElement;
    let body = this.emailForm.controls.body.value;
    let focusAt = elem.selectionEnd;
    const varName = variable.variable.replace(/ /g, '_');
    if (
      this.businessVariables.indexOf(varName) !== -1 &&
      !this.variablesData[varName]
    ) {
      this.toasterService.error(
        `Please configure ${variable.label} to use it as a template variable.`
      );
      return;
    }

    let varValue = '';
    if (this.variablesData[varName]) {
      varValue = ' ' + this.variablesData[varName];
    } else {
      varValue = ' ${' + varName + '}';
      this.showSmsVariableMessage = true;
    }
    // if (body.length + varValue.length < 200) {
    // }
    if (elem.selectionStart || elem.selectionStart == '0') {
      const _startSelection = elem.selectionStart;
      const _endSelection = elem.selectionEnd;
      elem.value =
        elem.value.substring(0, _startSelection) +
        varValue +
        elem.value.substring(_endSelection, elem.value.length);
      focusAt = (elem.value.substring(0, _startSelection) + varValue).length;
      elem.focus();
      elem.selectionEnd = focusAt;
    } else {
      elem.value += varValue;
      elem.focus();
      elem.selectionEnd = elem.value.length;
    }
    body = elem.value;
    //body += " " +   varValue
    // let innerHtml = this.emailForm.value.body
    this.emailForm.patchValue({
      body: body
    });
    this.numberOfSegments = this.calculateSegments(this.emailForm.value.body);
    this.totalCharacterLength = body.length;
  }

  OnSubmitForm() {
    this.submitted = true;

    //console.log(this.emailForm.valid,this.emailForm.value)
    if (!this.emailForm.valid) {
      return;
    }

    var leadvariable = [];
    if (this.emailForm.value.templateFor == 'Lead') {
      for (var j = 0; j < this.leadSmsVariables.length; j++) {
        leadvariable.push(this.leadSmsVariables[j].variable.replace(/ /g, '_'));
      }
    }
    if (this.emailForm.value.templateFor == 'Appointment') {
      for (var j = 0; j < this.appointmentSMSVariables.length; j++) {
        leadvariable.push(
          this.appointmentSMSVariables[j].variable.replace(/ /g, '_')
        );
      }
    } else if (this.emailForm.value.templateFor == 'Patient') {
      for (var j = 0; j < this.patientSmsVariables.length; j++) {
        leadvariable.push(
          this.patientSmsVariables[j].variable.replace(/ /g, '_')
        );
      }
    } else if (this.emailForm.value.templateFor == 'MassSMS') {
      for (var j = 0; j < this.massSMSVariables.length; j++) {
        leadvariable.push(this.massSMSVariables[j].variable.replace(/ /g, '_'));
      }
    }
    var arr = this.emailForm.value.body
      .split('$')
      .map((el: string) => el.split('}'))
      .reduce((acc: string | any[], curr: any) => acc.concat(curr));
    //console.log(arr);
    var variables: any = [];
    for (var i = 0; i < arr.length; i++) {
      if (arr[i].startsWith('{')) {
        var s2 = arr[i].substring(1);
        if (leadvariable.indexOf(s2) == -1) {
          variables.push('${' + s2 + '}');
          this.toasterService.error(
            'variable ${' +
              s2 +
              '} is not predefined variable. Use only predefined variables'
          );
          return;
        }
      }
    }

    if (variables.length > 0) {
      var alertvariable = '';
      for (var i = 0; i < variables.length; i++) {
        alertvariable = alertvariable + variables[i] + ',';
      }
      if (variables.length == 1) {
        this.toasterService.error(
          'variable ' +
            alertvariable.slice(0, alertvariable.length - 1) +
            ' is not predefined variable. Use only predefined variables'
        );
      } else {
        this.toasterService.error(
          'variable ' +
            alertvariable.slice(0, alertvariable.length - 1) +
            ' is not predefined variables. Use only predefined variables'
        );
      }
      return;
    }

    // if (this.emailForm.value.body.length > 160) {
    //   this.toasterService.error(
    //     'Body length should be less than 160 characters.'
    //   );
    //   return;
    // }

    if (this.emailTemplateId) {
      this.SubmitFormUpdate();
    } else {
      this.SubmitFormCreate();
    }
  }

  SubmitFormUpdate() {
    console.log(this.emailForm.value);
    this.smsService.update(this.emailForm.value).then(
      () => {
        this.toasterService.success('SMS Template updated successfully.');
        this.returntoEmailList();
        this.submitted = false;
      },
      (error) => {
        console.log(error);
        this.submitted = false;
      }
    );
  }

  SubmitFormCreate() {
    //console.log(this.emailForm.value);
    this.smsService.save(this.emailForm.value).then(
      () => {
        this.returntoEmailList();
        this.toasterService.success('SMS Template saved successfully.');
        this.submitted = false;
      },
      (error) => {
        console.log(error);
        this.submitted = false;
      }
    );
  }

  returntoEmailList() {
    this.router.navigate(['/smstemplate'], {
      queryParams: {
        source: this.source
      },
      queryParamsHandling: 'merge'
    });
  }

  openLibrary1() {
    this.isShowTestModel = true;
    //  this.onSearchSubmit();
  }

  public modalDlgClose1 = (): void => {
    // this.modalDialog1.hide();
  };

  loadChatSessionlist() {
    this.leadsService.getTestContactQuestionnaireSubmissions().then((data) => {
      this.rowData = data;
    });
    // const chatSessions = from(this.smsService.getChatSessions());
    // const contactFormSubmissions = from(
    //   this.smsService.getContactQuestionnaireSubmissions()
    // );
    // forkJoin([chatSessions, contactFormSubmissions]).subscribe(
    //   (results: any) => {
    //     this.chatSessionList = [];
    //     results[0].forEach((chatSesion: any) => {
    //       chatSesion.source = 'Chat';
    //       chatSesion.name = chatSesion.firstName + ' ' + chatSesion.lastName;
    //       this.chatSessionList.push(chatSesion);
    //     });

    //     results[1].forEach((formSubmission: any) => {
    //       if (!formSubmission.source) {
    //         formSubmission.source = 'Form';
    //       }
    //       if (!formSubmission.email) {
    //         formSubmission.email = '';
    //       }
    //       if (!formSubmission.phone) {
    //         formSubmission.phone = '';
    //       }
    //       if (!formSubmission.name) {
    //         formSubmission.name = '';
    //       }

    //       const keys = Object.keys(formSubmission);
    //       var firstName = '';
    //       var lastName = '';
    //       keys.forEach((key) => {
    //         const k1 = key.toLowerCase();
    //         if (k1.indexOf('phone') > -1 || k1.indexOf('number') > -1) {
    //           formSubmission.phone = formSubmission[key];
    //         } else if (k1.indexOf('email') > -1) {
    //           formSubmission.email = formSubmission[key];
    //         } else if (
    //           k1.indexOf('leadsource') > -1 &&
    //           formSubmission[key] !== null &&
    //           formSubmission[key] !== ''
    //         ) {
    //           formSubmission.source = formSubmission[key];
    //         }

    //         else if (k1.indexOf('id') > -1) {
    //           formSubmission.id = formSubmission[key];
    //           this.questionnaireId = formSubmission.id;
    //         } else if (k1.indexOf('firstname') > -1) {
    //           firstName = formSubmission[key];
    //         } else if (k1.indexOf('lastname') > -1) {
    //           lastName = formSubmission[key];
    //         }
    //       });
    //       formSubmission.name = firstName + ' ' + lastName;
    //       this.chatSessionList.push(formSubmission);
    //     });

    //     this.rowData = this.chatSessionList;

    //   }
    // );
  }

  SubmitTestTemplate() {
    if (this.testEmailTemplateForm.invalid) {
      return;
    }
    this.testEmailTemplateForm.patchValue({
      smsTemplateId: this.emailTemplateId
    });
    const formData = this.testEmailTemplateForm.value;
    this.smsService.testSMSTemplate(formData).then(() => {
      this.isShowTestModel = false;
      this.toasterService.success('Test SMS Sent Successfully');
    });
  }

  cancelTestSms() {
    this.isShowTestModel = false;
    this.testEmailTemplateForm.reset();
  }

  onModuleChange(event: any) {
    console.log(event);
    if (event == 'Appointment') {
      this.getAppointmentVariables();
    }
  }

  aiModelClose(event: any) {
    if (event?.replace) {
      this.emailForm.patchValue({
        body: event.replaceData
      });
    }
    this.showAiModal = false;
  }

  onCancelClick() {
    this.isShowTestModel = false;
  }

  calculateSegments(text: string) {
    let segments: number = 0;
    const charCount = text?.length || 0;
    if (charCount === 0) {
      this.showEncodingMessage = false;
      return 0;
    }
    const bodyCharSet = new Set(text.split(''));
    const bodyCharArray = Array.from(bodyCharSet);
    const notGsm = this.containerAnyNonGsmChars(bodyCharArray);
    if (notGsm) {
      this.showEncodingMessage = true;
      segments = charCount <= 70 ? 1 : Math.ceil(charCount / 67);
    } else {
      this.showEncodingMessage = false;
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
}

export const SOURCE_ENUM: any = {
  leads: 'Lead',
  appointment: 'Appointment',
  massSMS: 'MassSMS',
  patient: 'Patient'
};
