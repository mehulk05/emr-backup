import {
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  ViewChild
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { EmailTemplateService } from '../../services/email-template.service';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
// import { environment } from 'src/environments/environment';
// import sizeof from 'object-sizeof';
import 'grapesjs-preset-newsletter';
import { RegexEnum } from 'src/app/shared/common/constants/regex';
import { LeadsService } from 'src/app/modules/leads/service/leads.service';
@Component({
  selector: 'app-add-edit-email-template',
  templateUrl: './add-edit-email-template.component.html',
  styleUrls: ['./add-edit-email-template.component.css']
})
export class AddEditEmailTemplateComponent implements OnInit {
  @ViewChild('ckeditor', { static: false }) ckeditor: any;
  config: any = {
    allowedContent: true,
    width: '100%'
  };
  isModalVisibile: boolean = false;
  private _editor: any;

  // templateValues = ['Lead', 'Appointment', 'Event', 'Form', 'Mass-Email'];
  templateValues = [
    { id: 'Lead', name: 'Lead' },
    { id: 'Patient', name: 'Patient' },
    { id: 'Appointment', name: 'Appointment' },
    { id: 'Event', name: 'Event' },
    { id: 'Form', name: 'Form' },
    { id: 'MassEmail', name: 'Mass Email' }
  ];

  leadTerget = ['Lead', 'Clinic'];
  patientTarget = ['Patient', 'Clinic'];
  appointmentTarget = ['Patient', 'Clinic'];
  massEmailTarget = ['Lead', 'Patient'];
  submitted = false;
  testsubmitted = false;
  emailForm!: FormGroup;
  testEmailTemplateForm!: FormGroup;
  emailTemplateId!: any;
  emailTemplateNames!: any[];
  filterEmailVariables!: any[];
  leadEmailVariables!: any[];
  patientEmailVariables!: any[];
  massEmailVariables!: any[];
  emailVariables!: any[];
  questionnaires: any = [];
  questions: any[] = [];
  currentDate = new Date();
  chatSessionList: any;
  questionnaireId: any = null;
  rowData: any = [];
  isShowTestModel: boolean = false;

  newsLetters: any = [];
  searchForm!: FormGroup;
  appointmentEmailVariables: any = [];
  title: string = 'Create Email Template';
  source: any;
  totalCharacterLength = 8000;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private emailService: EmailTemplateService,
    private toasterService: ToasTMessageService,
    private leadsService: LeadsService,
    private renderer: Renderer2,
    private el: ElementRef
  ) {}

  get editor() {
    return this._editor;
  }

  showAiModal = false;
  category =
    'Generate the better content while keeping the variable names , programming syntax';
  message = '';

  ngOnInit(): void {
    this.source = this.route.snapshot.queryParams?.source ?? 'leads';
    this.generateFromGrups();
    this.route.paramMap.subscribe((params: any) => {
      this.emailTemplateId = parseInt(params.get('id'));
      if (this.emailTemplateId) {
        this.title = 'Edit Email Template';
        this.getEmailTemplate(this.emailTemplateId);
      } else {
        this.emailForm.get('emailTarget').setValidators(Validators.required);
        this.emailForm.patchValue({
          templateFor: SOURCE_ENUM[this.source]
        });
      }
    });
    this.getEmailTemplateNames();
    this.getMassEmailVariables();
    this.loadQuestionnaires();
    this.getLeadVariables();
    this.getPatientVariables();
    this.loadChatSessionlist();
    this.getAppointmentVariables();
  }

  editorReady() {
    if ((window as any).CKEDITOR) {
      (window as any).CKEDITOR.dtd.button.a = 1;
    }
  }

  getAppointmentVariables() {
    console.log('In getAppointmentVariables');
    this.emailService.getVariables('Appointment').then((data: any) => {
      this.appointmentEmailVariables = data;
    });
  }

  generateFromGrups() {
    this.emailForm = this.fb.group({
      id: [''],
      name: ['', Validators.required],
      emailTemplateName: ['', []],
      subject: ['', Validators.required],
      body: ['', Validators.required],
      templateFor: ['Lead', Validators.required],
      questionnaireId: ['', []],
      isCustom: [false, []],
      emailTarget: ['', []]
    });

    this.testEmailTemplateForm = this.fb.group({
      email: ['', [Validators.required, Validators.pattern(RegexEnum.email)]],
      leadId: ['', [Validators.required]],
      emailTemplateId: ['', []]
    });

    this.searchForm = this.fb.group({
      search: ['', []]
    });

    // this._editor = this.initializeEditor();
    // this.editor.on('asset:add', () => {
    //   console.log('Asset add fired');
    // });

    // this._editor.setComponents('');
  }

  getEmailTemplate(emailTemplateId: number) {
    this.emailService.getEmailId(emailTemplateId).then(
      (data: any) => {
        this.emailForm.patchValue(data);

        if (data.questionnaire && data.questionnaire.id) {
          this.emailForm.patchValue({
            questionnaireId: data.questionnaire.id
          });

          this.loadQuestionnaireQuestions(data.questionnaire.id);
        }

        //  this._editor.setComponents(data.body);
        if (data.emailTemplateName) {
          this.filterEmailTemplateByEventId(data.emailTemplateName);
        }
        this.emailForm.patchValue({
          templateFor: data?.templateFor
        });
        console.log(this.emailForm.value, data.templateFor);
      },
      (error) => {
        console.log(error);
      }
    );
  }
  loadChatSessionlist() {
    this.leadsService.getTestContactQuestionnaireSubmissions().then((data) => {
      this.rowData = data;
    });
  }

  getEmailTemplateNames() {
    this.emailService.getEmailTemplateNames().then((data: any) => {
      this.emailTemplateNames = data;
      //console.log(this.emailTemplateNames);
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

  loadQuestionnaireQuestions(id: any) {
    if (id == '') {
      this.questions = [];
    } else {
      this.emailService.getAllQuestions(id).then((response: any) => {
        this.questions = response;
      });
    }
  }

  addFormVariable(event: any, question: any) {
    let innerHtml = this.emailForm.value.body;
    let questionName = question.name;
    questionName = questionName.replace(/ /g, '_');
    innerHtml += ' ${' + questionName + '}';
    this.emailForm.patchValue({ body: innerHtml });
  }

  addVariables(event: any, variable: any) {
    if (variable.variable == 'BUSINESS_LOGO') {
      var style =
        " <img src='${" +
        variable.variable +
        "}'   width='250' height='120'  style='line-height: 100%; outline-color: initial; outline-style: none; outline-width: initial; text-decoration-line: none; text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial; box-sizing: border-box; width: 250px; height: 120px;' >";
      this.ckeditor.instance.insertHtml(style);
    } else {
      this.ckeditor.instance.insertHtml(
        ' ${' + variable.variable.replace(/ /g, '_') + '}'
      );
    }
    const innerHtml = this.emailForm.value.body;
    this.emailForm.patchValue({ body: innerHtml });
  }

  filterEmailTemplateByEventId(filterVal: any) {
    if (filterVal) {
      this.emailService.getVariables(filterVal).then((data: any) => {
        this.filterEmailVariables = data;
      });
    }
  }

  getLeadVariables() {
    this.emailService.getVariables('LeadEmail').then((data: any) => {
      // console.log(data);
      this.leadEmailVariables = data;
      // this.massEmailVariables =  data;
      // console.log(this.massEmailVariables);
    });
  }

  getPatientVariables() {
    this.emailService.getVariables('PatientEmail').then((data: any) => {
      // console.log(data);
      this.patientEmailVariables = data;
      // this.massEmailVariables =  data;
      // console.log(this.massEmailVariables);
    });
  }

  getMassEmailVariables() {
    this.emailService.getVariables('MassEmail').then((data: any) => {
      console.log(data);
      this.massEmailVariables = data;
      console.log(this.massEmailVariables);
    });
  }

  get f() {
    return this.emailForm.controls;
  }

  get testEmailForm() {
    return this.testEmailTemplateForm.controls;
  }

  onCancelClick() {
    this.isShowTestModel = false;
  }

  private applyImageStyles() {
    const parser = new DOMParser();
    const document = parser.parseFromString(
      this.emailForm.value.body,
      'text/html'
    );
    const images = document.querySelectorAll('img');

    images.forEach((image: any) => {
      image.style.maxWidth = '100%';
    });

    this.emailForm.patchValue({
      body: document.body.innerHTML
    });
    console.log(document.body.innerHTML);
  }
  OnSubmitForm() {
    this.applyImageStyles();
    console.log(this.emailForm.value);
    const images = this.el.nativeElement.querySelectorAll('img');

    images.forEach((image: any) => {
      this.renderer.setStyle(image, 'max-width', '100%');
    });
    this.submitted = true;

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

    //console.log(this.emailForm.value.templateFor);
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
        emailTemplateName: this.emailForm.value.emailTemplateName
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

    // if (sizeof(this.emailForm.value) > environment.FORM_MAX_SIZE) {
    //   this.toasterService.error('Email template size is greater than 2 MB');
    //   return;
    // } else {
    if (this.emailTemplateId) {
      this.SubmitFormUpdate();
    } else {
      console.log(this.emailForm.value);
      this.SubmitFormCreate();
    }
    // }
  }

  SubmitFormUpdate() {
    console.log(this.emailForm.value);
    this.emailService.update(this.emailForm.value).then(
      () => {
        this.toasterService.success('Email Template updated successfully.');
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
    console.log(this.emailForm.value);
    this.emailService.save(this.emailForm.value).then(
      () => {
        this.returntoEmailList();
        this.toasterService.success('Email Template saved successfully.');
        this.submitted = false;
      },
      (error) => {
        console.log(error);
        this.submitted = false;
      }
    );
  }

  returntoEmailList() {
    // this.router.navigate(['/emailtemplates']);
    this.router.navigate(['emailtemplates'], {
      queryParams: {
        source: this.source
      },
      queryParamsHandling: 'merge'
    });
  }

  openLibrary() {
    this.isModalVisibile = true;
    // this.modalDialog.show();
    this.onSearchSubmit();
  }

  public modalDlgClose = (): void => {
    // this.modalDialog.hide();
  };

  openLibrary1() {
    this.isShowTestModel = true;
  }

  public modalDlgClose1 = (): void => {
    this.isShowTestModel = false;
    // this.modalDialog1.hide();
  };

  useTemplate(newsLetter: { content: any }) {
    this.emailForm.patchValue({
      body: this.ckeditor.instance.insertHtml(newsLetter.content)
    });
    this.isModalVisibile = false;
  }

  onSearchSubmit() {
    const formData = this.searchForm.value;
    this.emailService.getNewsLetters(formData.search).then((response: any) => {
      this.newsLetters = response;
    });
  }

  SubmitTestTemplate() {
    if (this.testEmailTemplateForm.valid) {
      this.testEmailTemplateForm.patchValue({
        emailTemplateId: this.emailTemplateId
      });
      const formData = this.testEmailTemplateForm.value;
      this.emailService.testEmailTemplate(formData).then(() => {
        this.isShowTestModel = false;
        this.testsubmitted = false;
        this.toasterService.success('Test Email Sent Successfully');
        this.testEmailTemplateForm.reset();
      });
    }
  }

  cancelTestEmail() {
    this.isShowTestModel = false;
    this.testsubmitted = false;
    this.testEmailTemplateForm.reset();
  }

  onModuleChange(event: any) {
    if (event.value == 'Appointment' || event.value == 'Lead') {
      this.emailForm.get('emailTarget').setValidators(Validators.required);
    } else {
      this.emailForm.get('emailTarget').clearValidators();
      this.emailForm.get('emailTarget').setErrors(null);
    }
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

  // CK Editor Methods
}

export const SOURCE_ENUM: any = {
  leads: 'Lead',
  patient: 'Patient',
  appointment: 'Appointment',
  event: 'Event',
  massemail: 'MassEmail'
};
