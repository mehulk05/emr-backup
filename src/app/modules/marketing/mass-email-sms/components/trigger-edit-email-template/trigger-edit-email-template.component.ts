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
// import sizeof from 'object-sizeof';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
import { EmailTemplateService } from '../../../email-template/services/email-template.service';
// import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-trigger-edit-email-template',
  templateUrl: './trigger-edit-email-template.component.html',
  styleUrls: ['./trigger-edit-email-template.component.css']
})
export class TriggerEditEmailTemplateComponent implements OnInit, OnChanges {
  @Input() showModal: any;
  @Input() modalData: any;
  emailForm: FormGroup;
  @ViewChild('ckeditor') ckeditor: any;
  leadEmailVariables: any[] = [];
  @Output() modalClosed = new EventEmitter<any>();
  questionnaires: any;
  filterEmailVariables: any;
  questions: any[] = [];
  appointmentEmailVariables: any = [];
  massEmailVariables!: any[];
  patientEmailVariables: any[] = [];

  constructor(
    private fb: FormBuilder,
    private emailService: EmailTemplateService,
    private toasterService: ToasTMessageService
  ) {}

  ngOnInit(): void {
    this.emailForm = this.fb.group({
      id: [''],
      name: ['', Validators.required],
      emailTemplateName: ['', []],
      subject: ['', Validators.required],
      body: ['', Validators.required],
      templateFor: ['Lead', Validators.required],
      questionnaireId: ['', []],
      isCustom: [false, []],
      emailTarget: ['', Validators.required]
    });
  }

  ngOnChanges(): void {
    if (this.modalData && this.modalData?.id) {
      this.loadEmailTemplate();
      this.getMassEmailVariables();
      this.loadQuestionnaires();
      this.getLeadVariables();
      this.getAppointmentVariables();
      this.getPatientVariables();
    }
  }

  editorReady() {
    if ((window as any).CKEDITOR) {
      (window as any).CKEDITOR.dtd.button.a = 1;
    }
  }

  loadEmailTemplate() {
    this.emailService.getEmailId(this.modalData?.id).then(
      (data: any) => {
        this.emailForm.patchValue(data);

        if (data.questionnaire && data.questionnaire.id) {
          this.emailForm.patchValue({
            questionnaireId: data.questionnaire.id
          });
          // this.loadQuestionnaireQuestions(data.questionnaire.id);
        }
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  getMassEmailVariables() {
    this.emailService.getVariables('MassEmail').then((data: any) => {
      console.log(data);
      this.massEmailVariables = data;
      console.log(this.massEmailVariables);
    });
  }

  getPatientVariables() {
    this.emailService.getVariables('PatientEmail').then((data: any) => {
      this.patientEmailVariables = data;
    });
  }

  loadQuestionnaires() {
    this.emailService.getAllQuestionnaireList().then((response: any) => {
      this.questionnaires = response;

      for (var i = 0; i < response.length; i++) {
        if (response[i].isContactForm) {
          this.emailService
            .getAllQuestions(response[i].id)
            .then((response: any) => {
              //
              for (var j = 0; j < response.length; j++) {
                this.leadEmailVariables.push({
                  label: response[j].name,
                  variable: response[j].name
                });
              }
            });
          //console.log(this.leadEmailVariables);
          break;
        }
      }
    });
  }

  getLeadVariables() {
    this.emailService.getVariables('LeadEmail').then((data: any) => {
      this.leadEmailVariables = data;
    });
  }

  hideModal() {
    this.modalClosed.emit({ close: true, isDelete: false });
    this.showModal = false;
  }

  saveForm() {
    // console.log(this.emailForm.value)
    //this.submitted = true;

    if (!this.emailForm.valid) {
      let control;
      Object.keys(this.emailForm.controls)
        .reverse()
        .forEach((field) => {
          if (this.emailForm.get(field).invalid) {
            control = this.emailForm.get(field);
            control.markAsDirty();
          }
        });

      if (control) {
        const el = $('.ng-invalid:not(form):first');
        $('html,body').animate(
          { scrollTop: el.offset().top - 20 },
          'slow',
          () => {
            el.focus();
          }
        );
      }
      return;
    }

    console.log(this.emailForm.value.templateFor);
    var leadvariable = [];
    if (this.emailForm.value.templateFor == 'Lead') {
      for (var j = 0; j < this.leadEmailVariables.length; j++) {
        leadvariable.push(
          this.leadEmailVariables[j].variable.replace(/ /g, '_')
        );
      }
    } else if (this.emailForm.value.templateFor == 'Patient') {
      for (var j = 0; j < this.patientEmailVariables.length; j++) {
        leadvariable.push(
          this.patientEmailVariables[j].variable.replace(/ /g, '_')
        );
      }
    } else if (this.emailForm.value.templateFor == 'Event') {
      for (var j = 0; j < this.filterEmailVariables.length; j++) {
        leadvariable.push(
          this.filterEmailVariables[j].variable.replace(/ /g, '_')
        );
      }

      this.emailForm.patchValue({
        emailTemplateName: this.emailForm.value.emailTemplateName.value
      });
    } else if (this.emailForm.value.templateFor == 'Form') {
      for (var j = 0; j < this.questions.length; j++) {
        leadvariable.push(this.questions[j].variable.replace(/ /g, '_'));
      }
    } else if (this.emailForm.value.templateFor == 'Appointment') {
      for (var j = 0; j < this.appointmentEmailVariables.length; j++) {
        leadvariable.push(
          this.appointmentEmailVariables[j].variable.replace(/ /g, '_')
        );
      }
    } else if (this.emailForm.value.templateFor == 'MassEmail') {
      for (var j = 0; j < this.massEmailVariables.length; j++) {
        leadvariable.push(
          this.massEmailVariables[j].variable.replace(/ /g, '_')
        );
      }
    }

    var arr = this.emailForm.value.body
      .split('$')
      .map((el: any) => el.split('}'))
      .reduce((acc: any, curr: any) => acc.concat(curr));
    //console.log(arr);
    //console.log(leadvariable);
    //   var errorvariable = false;
    var variables = [];
    for (var i = 0; i < arr.length; i++) {
      if (arr[i].startsWith('{')) {
        var s2 = arr[i].substring(1);
        //console.log(leadvariable);
        if (leadvariable.indexOf(s2) == -1) {
          if (
            s2 == 'symptoms' ||
            s2 == 'symptom_service.SERVICE_CATEGORY' ||
            s2 == 'symptom_service.SERVICE_NAME' ||
            s2 == 'symptom_service.SERVICE_DESCRIPTION' ||
            s2 == 'symptom_service.SERVICE_LINK' ||
            s2 == 'payment.PAYMENT_AMOUNT' ||
            s2 == 'payment.PAYMENT_TYPE' ||
            s2 == 'payment.PAYMENT_DATE' ||
            s2 == 'serivce.SERVICE_SRNO' ||
            s2 == 'serivce.SERVICE_NAME' ||
            s2 == 'service.SERVICE_COST'
          ) {
          } else {
            variables.push('${' + s2 + '}');
          }
          //   errorvariable = true;
          //   this.toasterService.error("variable ${"+ s2 + "} is not predefined variable. Use only predefined variables");
          //   return;
        }
      }
    }
    console.log(variables);
    if (variables.length > 0) {
      var alertvariable = '';
      for (var i = 0; i < variables.length; i++) {
        alertvariable = alertvariable + variables[i] + ',';
      }

      this.toasterService.error(
        'variable ' +
          alertvariable.slice(0, alertvariable.length - 1) +
          ' is not predefined variables. Use only predefined variables'
      );

      return;
    }

    // if (sizeof(this.emailForm.value) > environment.FORM_MAX_SIZE) {
    //   this.toasterService.error('Email template size is greater than 2 MB');
    //   return;
    // } else {
    this.SubmitFormUpdate();
    // }
  }

  SubmitFormUpdate() {
    this.emailService.update(this.emailForm.value).then(
      () => {
        this.toasterService.success('Email Template updated successfully.');
        this.hideModal();
      },
      (error) => {
        console.log(error);
        this.toasterService.success('Error while updating the Email Template');
        // this.submitted = false;
      }
    );
  }

  get f() {
    return this.emailForm.controls;
  }

  addVariables(event: any, variable: any) {
    if (variable.variable == 'BUSINESS_LOGO') {
      var style =
        " <img src='${" +
        variable.variable +
        "}'   width='250' height='120'  style='line-height: 100%; outline-color: initial; outline-style: none; outline-width: initial; text-decoration-line: none; text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial; box-sizing: border-box; width: 250px; height: 120px;' >";
      this.ckeditor.instance.insertHtml(style);
    } else {
      console.log(this.ckeditor);
      // body =
      //   this.emailForm.controls.body.value +
      //   ' ${' +
      //   variable.variable.replace(/ /g, '_') +
      //   '}';
      this.ckeditor.instance.insertHtml(
        ' ${' + variable.variable.replace(/ /g, '_') + '}'
      );
    }

    const innerHtml = this.emailForm.value.body;
    //this.ckeditor.instance.insertHtml(body);
    this.emailForm.patchValue({ body: innerHtml });
    console.log(innerHtml);
    console.log(this.emailForm.value.body);
    // this.emailForm.patchValue({ body: body });
  }

  getAppointmentVariables() {
    this.emailService.getVariables('Appointment').then((data: any) => {
      this.appointmentEmailVariables = data;
    });
  }
}
