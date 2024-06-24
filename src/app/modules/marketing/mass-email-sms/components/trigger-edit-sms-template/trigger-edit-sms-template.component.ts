import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
import { SmsService } from '../../services/sms.service';

@Component({
  selector: 'app-trigger-edit-sms-template',
  templateUrl: './trigger-edit-sms-template.component.html',
  styleUrls: ['./trigger-edit-sms-template.component.css']
})
export class TriggerEditSmsTemplateComponent implements OnInit, OnChanges {
  @Input() showModal: any;
  @Input() modalData: any;
  @ViewChild('smsBody') smsBody: any;
  @Output() modalClosed = new EventEmitter<any>();
  smsForm: FormGroup;
  leadSmsVariables: any[] = [];
  appointmentSMSVariables: any[] = [];
  massSMSVariables: any[] = [];
  patientSmsVariables: any[] = [];

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
  totalCharacterLength = 0;
  numberOfSegments: number = 0;
  showSmsVariableMessage: boolean = false;
  showEncodingMessage: boolean = false;
  constructor(
    private alertService: ToasTMessageService,
    private fb: FormBuilder,
    private smsService: SmsService,
    private toasterService: ToasTMessageService
  ) {}

  ngOnInit(): void {
    this.smsForm = this.fb.group({
      id: [''],
      name: ['', Validators.required],
      body: ['', Validators.required],
      templateFor: ['Lead', []],
      smsTemplateName: ['', []],
      isCustom: [false, []],
      smsTarget: ['', []]
    });
  }

  ngOnChanges(): void {
    if (this.modalData && this.modalData?.id) {
      this.loadSmsTempalte();
      this.getMassSMSVariables();
      this.loadQuestionnaires();
      this.getLeadVariables();
      this.getAppointmentVariables();
      this.getPatientVariables();
    }
  }

  loadSmsTempalte() {
    this.smsService.getEmailId(this.modalData?.id).then(
      (data: any) => {
        this.smsForm.patchValue(data);
        this.totalCharacterLength = data.body.length;
        this.numberOfSegments = this.calculateSegments(data.body.length);
        this.getLeadSMSVariables();
        this.loadQuestionnairesSMS();
        this.loadVariablesData();
      },

      () => {
        this.alertService.error('Error while fetching template');
      }
    );
  }

  getMassSMSVariables() {
    this.smsService.getVariables('MassSMS').then((data: any) => {
      this.massSMSVariables = data;
    });
  }

  getPatientVariables() {
    this.smsService.getVariables('Patient').then((data: any) => {
      this.patientSmsVariables = data;
    });
  }

  loadQuestionnairesSMS() {
    this.smsService.getAllQuestionnaireList().then((response: any) => {
      for (var i = 0; i < response.length; i++) {
        if (response[i].isContactForm) {
          this.smsService
            .getAllQuestions(response[i].id)
            .then((response: any) => {
              const varList: string[] =
                this.leadSmsVariables.length > 0 &&
                this.leadSmsVariables.map((btnVar: any) => btnVar.variable);
              for (var j = 0; j < response.length; j++) {
                !this.leadSmsVariables.find((btnVar: any) =>
                  varList.includes(btnVar.variable)
                ) &&
                  this.leadSmsVariables.push({
                    label: response[j].name,
                    variable: response[j].name
                  });
              }
            });
          console.log(this.leadSmsVariables);
          break;
        }
      }
    });
  }
  hideModal(isEdit: boolean = false) {
    this.modalClosed.emit({ close: true, isDelete: false, isEdit });
    this.showModal = false;
  }

  valueChange() {
    this.totalCharacterLength = this.smsForm.value.body.length;
    this.numberOfSegments = this.calculateSegments(this.smsForm.value.body);
  }
  saveForm() {
    console.log(this.smsForm.valid, this.smsForm.value);

    if (!this.smsForm.valid) {
      return;
    }

    var leadvariable = [];
    if (this.smsForm.value.templateFor == 'Lead') {
      for (var j = 0; j < this.leadSmsVariables.length; j++) {
        leadvariable.push(this.leadSmsVariables[j].variable.replace(/ /g, '_'));
      }
    }
    if (this.smsForm.value.templateFor == 'Patient') {
      for (var j = 0; j < this.patientSmsVariables.length; j++) {
        leadvariable.push(
          this.patientSmsVariables[j].variable.replace(/ /g, '_')
        );
      }
    } else if (this.smsForm.value.templateFor == 'Appointment') {
      for (var j = 0; j < this.appointmentSMSVariables.length; j++) {
        leadvariable.push(
          this.appointmentSMSVariables[j].variable.replace(/ /g, '_')
        );
      }
    } else if (this.smsForm.value.templateFor == 'MassSMS') {
      for (var j = 0; j < this.massSMSVariables.length; j++) {
        leadvariable.push(this.massSMSVariables[j].variable.replace(/ /g, '_'));
      }
    }
    var arr = this.smsForm.value.body
      .split('$')
      .map((el: any) => el.split('}'))
      .reduce((acc: any, curr: any) => acc.concat(curr));
    console.log(arr);
    var variables = [];
    for (var i = 0; i < arr.length; i++) {
      if (arr[i].startsWith('{')) {
        var s2 = arr[i].substring(1);
        if (leadvariable.indexOf(s2) == -1) {
          variables.push('${' + s2 + '}');
        }
      }
    }

    if (variables.length > 0) {
      var alertvariable = '';
      for (var i = 0; i < variables.length; i++) {
        alertvariable = alertvariable + variables[i] + ',';
      }

      this.alertService.error(
        'variable ' +
          alertvariable.slice(0, alertvariable.length - 1) +
          ' is not predefined variables. Use only predefined variables'
      );

      return;
    }

    // if (this.smsForm.value.body.length > 160) {
    //   this.toasterService.error(
    //     'Body length should be less than 160 characters.'
    //   );
    //   return;
    // }

    this.SubmitSMSFormUpdate();
  }

  SubmitSMSFormUpdate() {
    this.smsService.update(this.smsForm.value).then(
      () => {
        this.alertService.success('SMS Template updated successfully.');
        this.hideModal(true);
      },
      () => {
        this.alertService.error('Error while updating the SMS Template.');
      }
    );
  }
  get f() {
    return this.smsForm.controls;
  }

  addVariables(variable: any) {
    const elem = this.smsBody.nativeElement;
    let body = this.smsForm.controls.body.value;
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
    // if (body.length + varValue.length < 160) {
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
    this.smsForm.patchValue({
      body: body
    });
    this.numberOfSegments = this.calculateSegments(this.smsForm.value.body);
    this.totalCharacterLength = body.length;
  }

  getLeadSMSVariables() {
    this.smsService.getVariables('Lead').then((data: any) => {
      this.leadSmsVariables = data;
    });
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

  loadVariablesData() {
    this.smsService.getSmsVariablesData().then((response: any) => {
      this.variablesData = response;
      let smsBody: string = this.smsForm.value.body;
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
      this.smsForm.patchValue({
        body: smsBody
      });
      this.numberOfSegments = this.calculateSegments(this.smsForm.value.body);
      this.totalCharacterLength = smsBody.length;
    });
  }

  getAppointmentVariables() {
    this.smsService.getVariables('Appointment').then((data: any) => {
      this.appointmentSMSVariables = data;
    });
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
