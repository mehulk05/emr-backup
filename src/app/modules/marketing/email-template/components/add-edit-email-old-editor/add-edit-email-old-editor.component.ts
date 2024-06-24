import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
// import sizeof from 'object-sizeof';
import { from, forkJoin } from 'rxjs';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
// import { environment } from 'src/environments/environment';
import { EmailTemplateService } from '../../services/email-template.service';
import grapesjs from 'grapesjs';

import 'grapesjs-preset-newsletter';

@Component({
  selector: 'app-add-edit-email-old-editor',
  templateUrl: './add-edit-email-old-editor.component.html',
  styleUrls: ['./add-edit-email-old-editor.component.css']
})
export class AddEditEmailOldEditorComponent implements OnInit {
  @ViewChild('ckeditor', { static: false }) ckeditor: any;
  config = {
    allowedContent: true,
    width: '100%'
  };

  private _editor: any;
  isModalVisibile: boolean = false;
  // templateValues = ['Lead', 'Appointment', 'Event', 'Form', 'MassEmail'];
  templateValues = [
    { id: 'Lead', name: 'Lead' },
    { id: 'Appointment', name: 'Appointment' },
    { id: 'Event', name: 'Event' },
    { id: 'Form', name: 'Form' },
    { id: 'MassEmail', name: 'Mass Email' }
  ];
  leadTerget = ['Lead', 'Clinic'];
  appointmentTarget = ['Patient', 'Clinic'];
  massEmailTarget = ['Lead', 'Patient'];

  submitted = false;
  emailForm!: FormGroup;
  testEmailTemplateForm!: FormGroup;
  emailTemplateId!: any;
  emailTemplateNames!: any[];
  filterEmailVariables!: any[];
  leadEmailVariables!: any[];
  emailVariables!: any[];
  massEmailVariables!: any[];
  questionnaires: any = [];
  questions: any[] = [];
  currentDate = new Date();
  chatSessionList: any;
  questionnaireId: any = null;
  rowData: any = [];

  // @ViewChild('modalDialog') // , { static: true }
  // public modalDialog: DialogComponent;

  // @ViewChild('modalDialog1') // , { static: true }
  // public modalDialog1!: DialogComponent;
  newsLetters: any = [];
  searchForm!: FormGroup;
  appointmentEmailVariables: any = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private emailService: EmailTemplateService,
    private toasterService: ToasTMessageService
  ) {}

  get editor() {
    return this._editor;
  }

  ngOnInit(): void {
    this.generateFromGrups();
    this.route.paramMap.subscribe((params: any) => {
      this.emailTemplateId = parseInt(params.get('id'));
      if (this.emailTemplateId) {
        this.getEmailTemplate(this.emailTemplateId);
      }
    });
    this.getEmailTemplateNames();
    this.getMassEmailVariables();
    this.loadQuestionnaires();
    this.getLeadVariables();
    this.loadChatSessionlist();

    this._editor = this.initializeEditor();
    this.editor.on('asset:add', () => {
      console.log('Asset add fired');
    });
  }

  generateFromGrups() {
    this.emailForm = this.fb.group({
      id: [''],
      name: ['', Validators.required],
      emailTemplateName: ['', []],
      subject: [''],
      body: [''],
      templateFor: ['Lead', []],
      questionnaireId: ['', []],
      isCustom: [false, []],
      emailTarget: ['', []]
    });

    this.testEmailTemplateForm = this.fb.group({
      email: ['', Validators.required],
      leadId: ['', []],
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

        this._editor.setComponents(data.body);
        if (data.emailTemplateName)
          this.filterEmailTemplateByEventId(data.emailTemplateName);
      },
      (error: any) => {
        console.log(error);
      }
    );
  }
  loadChatSessionlist() {
    const chatSessions = from(this.emailService.getChatSessions());
    const contactFormSubmissions = from(
      this.emailService.getContactQuestionnaireSubmissions()
    );
    forkJoin([chatSessions, contactFormSubmissions]).subscribe(
      (results: any) => {
        this.chatSessionList = [];
        results[0].forEach((chatSesion: any) => {
          chatSesion.source = 'Chat';
          chatSesion.name = chatSesion.firstName + ' ' + chatSesion.lastName;
          this.chatSessionList.push(chatSesion);
        });

        results[1].forEach((formSubmission: any) => {
          if (!formSubmission.source) {
            formSubmission.source = 'Form';
          }
          if (!formSubmission.email) {
            formSubmission.email = '';
          }
          if (!formSubmission.phone) {
            formSubmission.phone = '';
          }
          if (!formSubmission.name) {
            formSubmission.name = '';
          }

          const keys = Object.keys(formSubmission);
          var firstName = '';
          var lastName = '';
          keys.forEach((key) => {
            const k1 = key.toLowerCase();
            if (k1.indexOf('phone') > -1 || k1.indexOf('number') > -1) {
              formSubmission.phone = formSubmission[key];
            } else if (k1.indexOf('email') > -1) {
              formSubmission.email = formSubmission[key];
            } else if (
              k1.indexOf('leadsource') > -1 &&
              formSubmission[key] !== null &&
              formSubmission[key] !== ''
            ) {
              formSubmission.source = formSubmission[key];
            }
            // else if (k1.indexOf("name") > -1) {
            //     formSubmission.name = formSubmission[key];
            // }
            else if (k1 == 'id') {
              formSubmission.id = formSubmission[key];
              this.questionnaireId = formSubmission.id;
            } else if (k1.indexOf('firstname') > -1) {
              firstName = formSubmission[key];
            } else if (k1.indexOf('lastname') > -1) {
              lastName = formSubmission[key];
            }
          });
          formSubmission.name = firstName + ' ' + lastName;
          this.chatSessionList.push(formSubmission);
        });

        //console.log(this.chatSessionList);
        this.rowData = this.chatSessionList;
        //console.log(this.rowData);
        // this.totalLeadsCount =  this.chatSessionList.length
        // this.getSourceForPieMap(this.chatSessionList);
        // this.getLeadsCountForMonthAndWeek(this.chatSessionList)
      }
    );
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

  addVariables(event: any, variable: { variable: string }) {
    let innerHtml = this._editor.getSelected().view.$el[0].innerHTML;
    if (variable.variable == 'BUSINESS_LOGO') {
      var style =
        " <img src='${" +
        variable.variable +
        "}'   width='250' height='120'  style='line-height: 100%; outline-color: initial; outline-style: none; outline-width: initial; text-decoration-line: none; text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial; box-sizing: border-box; width: 250px; height: 120px;' >";

      innerHtml += style;
    } else {
      innerHtml += ' ${' + variable.variable + '}';
    }

    console.log(innerHtml);
    this._editor.getSelected().set('content', innerHtml);

    // this._editor.DomComponents.view.render();
    console.log('innnerHtml', this._editor.getSelected().view.$el[0].innerHTML);

    this.emailForm.patchValue({
      body: this._editor.getSelected().view.$el[0].innerHTML
    });
  }

  filterEmailTemplateByEventId(filterVal: any) {
    console.log(filterVal);
    this.emailService.getVariables(filterVal).then((data: any) => {
      this.filterEmailVariables = data;
    });
  }

  getLeadVariables() {
    this.emailService.getVariables('LeadEmail').then((data: any) => {
      this.leadEmailVariables = data;
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

  OnSubmitForm() {
    // console.log(this.emailForm.value)
    this.submitted = true;
    const html = this._editor.runCommand('gjs-get-inlined-html');
    this.emailForm.patchValue({ body: html });
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

    //console.log(this.leadEmailVariables);
    var leadvariable = [];
    if (this.emailForm.value.templateFor == 'Lead') {
      for (var j = 0; j < this.leadEmailVariables.length; j++) {
        leadvariable.push(
          this.leadEmailVariables[j].variable.replace(/ /g, '_')
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
        //console.log(s2);
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
      (error: any) => {
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
      (error: any) => {
        console.log(error);
        this.submitted = false;
      }
    );
  }

  returntoEmailList() {
    this.router.navigate(['/emailtemplates']);
  }

  openLibrary() {
    this.isModalVisibile = true;
    //this.modalDialog.show();
    this.onSearchSubmit();
  }

  public modalDlgClose = (): void => {
    //this.modalDialog.hide();
  };

  openLibrary1() {
    //this.modalDialog1.show();
    // this.onSearchSubmit();
  }

  public modalDlgClose1 = (): void => {
    //this.modalDialog1.hide();
  };

  useTemplate(newsLetter: { content: any }) {
    this._editor.setComponents(newsLetter.content);
    this.modalDlgClose();
  }

  onSearchSubmit() {
    const formData = this.searchForm.value;
    this.emailService.getNewsLetters(formData.search).then((response: any) => {
      this.newsLetters = response;
    });
  }

  SubmitTestTemplate() {
    this.testEmailTemplateForm.patchValue({
      emailTemplateId: this.emailTemplateId
    });
    const formData = this.testEmailTemplateForm.value;
    this.emailService.testEmailTemplate(formData).then(() => {
      //this.modalDialog1.hide();
    });
  }

  private initializeEditor(): any {
    console.dir(window);
    return grapesjs.init({
      container: '#gjs',
      autorender: true,
      forceClass: false,
      storageManager: { type: null },
      components: '',
      style: '',
      plugins: ['gjs-preset-newsletter'],
      pluginsOpts: {
        'gjs-preset-newsletter': {}
      },
      assetManager: {
        uploadText: 'Add image through link or upload image',
        modalTitle: 'Select Image',
        openAssetsOnDrop: 1,
        inputPlaceholder: 'http://url/to/the/image.jpg',
        addBtnText: 'Add image',
        uploadFile: (e: any) => {
          console.log('file selected=>', e);

          const file = e.dataTransfer
            ? e.dataTransfer.files[0]
            : e.target.files[0];
          const formData = new FormData();
          formData.append('file', file);

          this.emailService.uploadImage(formData).then(
            (response: any) => {
              this.editor.AssetManager.add(response.location);
            },
            () => {
              this.toasterService.error('Unable to upload the file.');
            }
          );
        },
        handleAdd: (textFromInput: any) => {
          this.editor.AssetManager.add(textFromInput);
        }
      },
      canvas: {
        styles: [
          'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css',
          'https://maxcdn.bootstrapcdn.com/font-awesome/4.4.0/css/font-awesome.min.css'
        ],
        scripts: [
          'https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js'
        ]
      }
    });
  }
}
