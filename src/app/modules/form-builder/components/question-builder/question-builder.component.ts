import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
import { QuestionMode } from 'src/app/shared/common/constants/Question';
import { RegexEnum } from 'src/app/shared/common/constants/regex';
import { QuestionarieService } from '../../services/questionarie.service';
import { noWhitespaceValidator } from 'src/app/modules/authentication/whitespace-validator';

@Component({
  selector: 'app-question-builder',
  templateUrl: './question-builder.component.html',
  styleUrls: ['./question-builder.component.css']
})
export class QuestionBuilderComponent implements OnInit {
  @Input() questionnaireId: any = null;
  @Input() question: any = null;
  @Input() isLeadCaptureForm: any = null;
  @Input() isLeadForm: any = null;
  @Input() isEditable: any = true;
  @Input() enabledModernUi: any;
  @Output() afteronDeleteQuestion: any = new EventEmitter();
  @Output() afteronSaveQuestion: any = new EventEmitter();
  @Input() index: number;

  showTextSelection = false;

  showDropDown = false;
  showAnswer = false;
  submitted = false;
  chatQuestionnaire = false;
  otherRegexSelection = false;
  preSelectCheckbox = false;
  isLeadCaptureFormPredefinedQuestions = false;
  showModal: boolean = false;
  modalData: any;
  tncFile: any;
  fileTypes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/jpg',
    '.gif',
    '.pdf',
    'application/pdf',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];
  tncFilelink: string;

  validationList: any[] = [
    { name: 'Email', regex: RegexEnum.email },
    // { name: 'Phone', regex: '^[6-9]\\d{9}$' },
    { name: 'Phone', regex: RegexEnum.phone },
    { name: 'Name including space', regex: '^[a-zA-Z]([a-zA-Z ]*)?$' },
    { name: 'Name without space', regex: RegexEnum.textFeild },
    {
      name: 'User Name contain special character without space',
      regex: '^[^\n ]*$'
    },
    // { name: 'date validation dd/MM/yyyy or dd-MM-yyyy', regex: '^(((0[1-9]|[12][0-9]|30)[-/]?(0[13-9]|1[012])|31[-/]?(0[13578]|1[02])|(0[1-9]|1[0-9]|2[0-8])[-/]?02)[-/]?[0-9]{4}|29[-/]?02[-/]?([0-9]{2}(([2468][048]|[02468][48])|[13579][26])|([13579][26]|[02468][048]|0[0-9]|1[0-6])00))$' },
    // { name: 'date validation MM/dd/yyyy or MM-dd-yyyy', regex: '^(((0[13-9]|1[012])[-/]?(0[1-9]|[12][0-9]|30)|(0[13578]|1[02])[-/]?31|02[-/]?(0[1-9]|1[0-9]|2[0-8]))[-/]?[0-9]{4}|02[-/]?29[-/]?([0-9]{2}(([2468][048]|[02468][48])|[13579][26])|([13579][26]|[02468][048]|0[0-9]|1[0-6])00))$' },
    // { name: 'date validation yyyy/MM/dd or yyyy-MM-yyyy', regex: '^([0-9]{4}[-/]?((0[13-9]|1[012])[-/]?(0[1-9]|[12][0-9]|30)|(0[13578]|1[02])[-/]?31|02[-/]?(0[1-9]|1[0-9]|2[0-8]))|([0-9]{2}(([2468][048]|[02468][48])|[13579][26])|([13579][26]|[02468][048]|0[0-9]|1[0-6])00)[-/]?02[-/]?29)$' }

    {
      name: 'date validation dd/MM/yyyy or dd-MM-yyyy',
      regex:
        '^(0?[1-9]|[12][0-9]|3[01])[-/](0?[1-9]|1[012])[-/]((?:19|20|21)[0-9][0-9])$'
    },
    {
      name: 'date validation MM/dd/yyyy or MM-dd-yyyy',
      regex:
        '^(0?[1-9]|1[012])[-/](0?[1-9]|[12][0-9]|3[01])[-/]((?:19|20|21)[0-9][0-9])$'
    },
    {
      name: 'date validation yyyy/MM/dd or yyyy-MM-dd',
      regex:
        '^((?:19|20|21)[0-9][0-9])[-/](0?[1-9]|1[012])[-/](0?[1-9]|[12][0-9]|3[01])$'
    }
  ];

  filteredValidationList: any[] = [];

  mode = 'Display';
  questionForm!: FormGroup;
  constructor(
    public formBuilder: FormBuilder,
    private alertService: ToasTMessageService,
    private questionnaireService: QuestionarieService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    if (this.question.mode && this.question.mode == QuestionMode.Editing) {
      this.changeMode(QuestionMode.Editing);
    }
    if (this.question != null) {
      if (
        this.question.name == 'First Name' ||
        this.question.name == 'Last Name' ||
        this.question.name == 'Email' ||
        this.question.name == 'Phone Number' ||
        this.question.name == 'Gender' ||
        this.question.name == 'Symptoms'
      ) {
        this.isLeadCaptureFormPredefinedQuestions = true;
      }
      this.questionForm.patchValue({
        name: this.question.name,
        type: this.question.type,
        required: this.question.required,
        hidden: this.question.hidden,
        validate: this.question.validate,
        regex: this.question.regex,
        questionOrder: this.question.questionOrder,
        answer: this.question.answer,
        id: this.question.id,
        allowMultipleSelection: this.question.allowMultipleSelection,
        allowLabelsDisplayWithImages:
          this.question.allowLabelsDisplayWithImages,
        validationMessage: this.question.validationMessage,
        showDropDown: this.question.showDropDown,
        preSelectCheckbox: this.question.preSelectCheckbox,
        subHeading: this.question.subHeading,
        description: this.question.description,
        externalReferenceLink: this.question.externalReferenceLink,
        tncFilelink: this.question.tncFilelink,
        tncFileType: this.question.tncFileType,
        tncText: this.question.tncText
      });

      if (
        this.question.questionChoices != null &&
        this.question.questionChoices.length > 0
      ) {
        const control = <FormArray>this.questionForm.controls.questionChoices;
        this.question.questionChoices.forEach((x: any) => {
          control.push(this.formBuilder.group(x));
        });
      }

      if (!this.question.allowMultipleSelection) {
        this.showDropDown = true;
      }
      if (
        !this.question.allowMultipleSelection &&
        !this.question.showDropDown
      ) {
        this.preSelectCheckbox = true;
      }

      if (this.enabledModernUi) {
        this.validationList.push({
          name: 'URL',
          regex: RegexEnum.httpUrl
        });
      }
      this.filteredValidationList = [...this.validationList];

      this.tncFilelink = this.question.tncFilelink;
      this.onQstnTypeChange(this.question.type);
    }
  }

  initializeForm() {
    this.questionForm = this.formBuilder.group({
      name: ['', [noWhitespaceValidator()]],
      type: ['', [Validators.required]],
      required: ['', []],
      hidden: ['', []],
      validate: ['', []],
      regex: ['', []],
      questionOrder: ['', []],
      answer: ['', []],
      id: ['', []],
      selectDate: ['', []],
      allowLabelsDisplayWithImages: [false, []],
      allowMultipleSelection: [false, []],
      questionChoices: this.formBuilder.array([]),
      questionImages: this.formBuilder.array([]),
      validationMessage: ['', []],
      showDropDown: [false, []],
      preSelectCheckbox: [false, []],
      subHeading: ['', []],
      description: ['', []],
      externalReferenceLink: ['', [Validators.pattern(RegexEnum.httpUrl)]],
      tncFilelink: ['', []],
      tncFileType: ['', []],
      tncText: ['', []]
    });
  }
  get f() {
    return this.questionForm.controls;
  }

  changeMode(newMode: any) {
    this.mode = newMode;
    if (this.mode === 'Editing' || 'Display') {
      this.questionForm.patchValue({
        name: this.question.name,
        type: this.question.type,
        required: this.question.required,
        hidden: this.question.hidden,
        validate: this.question.validate,
        regex: this.question.regex,
        questionOrder: this.question.questionOrder,
        answer: this.question.answer,
        id: this.question.id,
        selectDate: this.question.selectDate,
        allowMultipleSelection: this.question.allowMultipleSelection,
        allowLabelsDisplayWithImages:
          this.question.allowLabelsDisplayWithImages,
        validationMessage: this.question.validationMessage,
        subHeading: this.question.subHeading,
        description: this.question.description,
        externalReferenceLink: this.question.externalReferenceLink,
        tncFilelink: this.question.tncFilelink,
        tncFileType: this.question.tncFileType,
        tncText: this.question.tncText
      });
      this.tncFilelink = this.question.tncFilelink;
    }
  }

  get questionChoices(): FormArray {
    return this.questionForm.get('questionChoices') as FormArray;
  }

  newQuestion(): FormGroup {
    return this.formBuilder.group({
      name: '',
      id: ''
    });
  }

  userDefineRegexSave() {
    console.log('hi');
  }

  addQuestion() {
    this.questionChoices.push(this.newQuestion());
  }

  removeQuestion(i: number) {
    this.questionChoices.removeAt(i);
  }

  onQuestionTypeChange(e: any) {
    this.onQstnTypeChange(e.target.value);
  }

  onQstnTypeChange(e: any) {
    console.log(e);
    if (e == 'Multiple_Selection_Text') {
      this.showTextSelection = true;
      this.showAnswer = false;
    } else if (e == 'Text') {
      this.showTextSelection = false;
      this.showAnswer = true;
    } else if (e == 'Phone_Number') {
      this.filteredValidationList = this.filteredValidationList.filter(
        (validation) => validation.name != 'Phone'
      );
      if (this.questionForm.controls['regex'].value == RegexEnum.mobile) {
        this.questionForm.controls['regex'].setValue(undefined);
      }
    } else {
      this.showTextSelection = false;
      this.showAnswer = false;
      this.filteredValidationList = [...this.validationList];
    }
    if (!(e === 'Input' || e === 'Text' || e === 'Date')) {
      this.questionForm.patchValue({
        validate: '',
        regex: undefined,
        validationMessage: ''
      });
    }
  }

  submitForm = () => {
    const invalid = this.findInvalidControls();
    console.log(invalid);
    console.log(this.questionForm.controls);
    console.log('Form submitted', this.questionForm.value);
    if (this.questionForm.value.validate === false) {
      this.questionForm.value.regex = '';
    }
    this.submitted = true;
    if (this.questionForm.invalid) {
      return;
    }
    if (
      this.questionForm.value.regex &&
      !this.questionForm.value.validationMessage
    ) {
      this.alertService.error('Please Enter validation message');
      return;
    }

    const formData = this.questionForm.value;
    console.log(formData.name.toLowerCase());
    if (
      !formData.id &&
      this.isLeadCaptureForm &&
      (formData.name.toLowerCase() == 'gender' ||
        formData.name.toLowerCase() == 'first name' ||
        formData.name.toLowerCase() == 'last name' ||
        formData.name.toLowerCase() == 'email' ||
        formData.name.toLowerCase() == 'phone number' ||
        formData.name.toLowerCase() == 'symptoms')
    ) {
      this.alertService.error('Do not use predefined questions');
      return;
    }
    if (this.enabledModernUi && formData.type == 'Terms_And_Conditions') {
      if (!this.tncFile && !this.tncFilelink) {
        this.alertService.error('Please upload a file');
        return;
      }
    }

    console.log(formData);
    this.questionnaireService.saveQuestion(this.questionnaireId, formData).then(
      (response: any) => {
        this.questionForm.patchValue({
          id: response.id
        });
        if (this.tncFile) {
          const mForm = new FormData();
          mForm.append('tncFile', this.tncFile);
          this.questionnaireService
            .saveQuestionWithTncFile(this.questionnaireId, response.id, mForm)
            .then(
              (response: any) => {
                this.alertService.success('Question saved successfully.');
                this.changeMode('Display');
                this.questionForm.patchValue({
                  id: response.id
                });
                this.question = response;
                this.tncFile = undefined;
                this.afteronSaveQuestion.emit();
              },
              () => {
                this.changeMode('Display');
                this.alertService.error('Unable to save the question.');
              }
            );
        } else {
          this.alertService.success('Question saved successfully.');
          this.changeMode('Display');
          this.question = response;
          console.log(this.question);
          // this.onSaveQuestion.emit({questionId:this.question.id });
          this.afteronSaveQuestion.emit();
        }
      },
      () => {
        this.changeMode('Display');
        this.alertService.error('Unable to save the question.');
      }
    );
  };

  saveChange(question: any) {
    console.log('que', question);
    this.questionnaireService.saveQuestion(this.questionnaireId, question).then(
      (response: any) => {
        this.alertService.success('Question saved successfully.');
        this.changeMode('Display');
        this.questionForm.patchValue({
          id: response.id
        });
        this.question = response;
      },
      () => {
        this.changeMode('Display');
        this.alertService.error('Unable to save the question.');
      }
    );
  }

  onRegexTypeChange(event: any) {
    console.log('eve', event.target.value);
    const value = event.target.value;
    if (value == 'Other') {
      this.otherRegexSelection = true;
    }
  }

  // resetNewQuestion() {
  //   if (this.router.url.includes('chat-config')) {
  //     // Reset the form logic here
  //     this.afteronDeleteQuestion.emit({ questionId: null });
  //   } else {
  //     // Redirect to / if the conditions are not met
  //     const currentUrl = this.router.url;
  //     this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
  //       this.router.navigate([currentUrl]);
  //     });
  //   }
  // }

  deleteQuestion(question: any) {
    this.modalData = { name: 'question', id: question.id };
    this.showModal = true;
    this.modalData.feildName = question.name;
    this.modalData.titleName = 'Question';
  }
  onCloseModal(e: any) {
    console.log('e', e);
    this.showModal = false;
    if (e.isDelete) {
      this.remove(this.modalData.id);
      // this.discardQuestion(this.modalData.id);
    }
  }

  remove(questionId: any): void {
    this.afteronDeleteQuestion.emit({ questionId: questionId });
    this.alertService.success('Question deleted successfully.');
  }
  discardQuestion(questionId: any): void {
    // this.resetNewQuestion();
    this.afteronDeleteQuestion.emit({ questionId: questionId });
  }
  onMultipleSelectionChange(e: any) {
    console.log('In onMultipleSelectionChange');
    console.log(e);
    if (e == 'yes') {
      this.showDropDown = false;
      this.preSelectCheckbox = false;
      this.questionForm.patchValue({
        showDropDown: false,
        preSelectCheckbox: false
      });
    } else {
      this.showDropDown = true;
      if (!this.questionForm.value.showDropDown) {
        this.preSelectCheckbox = true;
      }
    }
  }
  onDropDownSelectionChange(e: any) {
    console.log('In onDropDownSelectionChange');
    console.log(e);
    if (e == 'yes') {
      this.preSelectCheckbox = false;
      this.questionForm.patchValue({
        preSelectCheckbox: false
      });
    } else {
      this.preSelectCheckbox = true;
    }
  }

  public findInvalidControls() {
    const invalid = [];
    const controls = this.questionForm.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    return invalid;
  }

  fileChangeEvent(e: any) {
    if (!e?.target || e.target.files?.length <= 0) {
      return;
    }
    if (this.fileTypes.includes(e.target.files[0]?.type)) {
      this.tncFile = e.target.files[0];
    } else {
      this.alertService.error(
        'Only Image, Pdf, Word Doc and PPT are supported.'
      );
    }
  }

  deleteTncFile() {
    this.tncFile = undefined;
    this.tncFilelink = '';
  }
}
