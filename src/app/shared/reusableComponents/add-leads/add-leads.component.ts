import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormArray } from '@angular/forms';
//import { RegexEnum } from 'src/app/shared/common/constants/regex';
import { LeadsService } from '../../../modules/leads/service/leads.service';
import { AuthService } from 'src/app/modules/authentication/services/auth.service';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
import moment from 'moment';
import { RegexEnum } from 'src/app/shared/common/constants/regex';
import {
  CountryISO,
  PhoneNumberFormat,
  SearchCountryField
} from 'ngx-intl-tel-input';
@Component({
  selector: 'app-add-leads',
  templateUrl: './add-leads.component.html',
  styleUrls: ['./add-leads.component.css']
})
export class AddLeadsComponent implements OnInit {
  acceptable_types = [
    'application/pdf',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];

  regexState: any = {
    [RegexEnum.UNFORMATTED_DD_MM_YYY_FORMAT]: 'DD/MM/YYYY',

    [RegexEnum.UNFORMATTED_MM_DD_YYYY_FORMAT]: 'MM/DD/YYYY',

    [RegexEnum.UNFORMATTED_YYYY_MM_DD_FORMAT]: 'YYYY/MM/DD',

    null: 'DD/MM/YYYY'
  };

  @Input() showModal: boolean = false;
  @Input() modalData: any;
  @Input() modalMessage: any;
  @Output() modalClosed = new EventEmitter<any>();
  patientQuestionnaireForm: FormGroup | any;
  submitButtonLabel = '';
  isLeadFormPhoneValid = false;
  isLeadFormEmailValid = false;
  selectedValue: any = [];
  dobIndex: any;
  dobErrorMessage: any;
  dobRegex: any = null;
  contactFormQuestions: any = [];
  questionnaireName = '';
  submitted = false;
  showComment = false;
  subtitle: any = null;
  showFormHeader = false;
  showTitle = false;
  businessId: any;
  loggedInUser: any;
  leadQuestionnaireId: any;
  formSource: any;
  multiChoiceValidationMessage: any = {};
  // isMandatoryConsentEnabled = false;
  // isMandatoryConsentEnabledChecked = false;
  mandatoryConsentText = '';
  preferredCountries: CountryISO[] = [
    CountryISO.UnitedStates,
    CountryISO.UnitedKingdom
  ];
  searchCountryField: SearchCountryField[] = [
    SearchCountryField.Iso2,
    SearchCountryField.Name
  ];
  phoneNumberFormat: PhoneNumberFormat = PhoneNumberFormat.National;
  selectedCountryISO: CountryISO = CountryISO.UnitedStates;
  constructor(
    public formBuilder: FormBuilder,
    private leadService: LeadsService,
    private authenticationService: AuthService,
    private alertService: ToasTMessageService
  ) {}

  ngOnInit(): void {
    this.authenticationService.currentUser?.subscribe((data: any) => {
      this.loggedInUser = data;
      this.businessId = this.loggedInUser.businessId;
    });
    this.patientQuestionnaireForm = this.formBuilder.group({
      id: ['', []],
      questionnaireId: ['', []],
      source: ['Manual', []],
      patientQuestionAnswers: this.formBuilder.array([])
    });
    var frmArray = this.patientQuestionnaireForm?.get(
      'patientQuestionAnswers'
    ) as FormArray;
    frmArray.clear();
    this.loadQuestionnaire();
  }

  // openLibrary() {
  //   var frmArray = this.patientQuestionnaireForm.get(
  //     'patientQuestionAnswers'
  //   ) as FormArray;
  //   frmArray.clear();
  //   this.loadQuestionnaire();
  // }

  formRequired(pqa: any): boolean {
    const patientQuestionAnswers = this.patientQuestionnaireForm?.get(
      'patientQuestionAnswers'
    ) as FormArray;

    const index = patientQuestionAnswers?.value.findIndex(
      (index: any) => index.questionName === pqa.value.questionName
    );
    if (pqa.value.questionType === 'Yes_No') {
      patientQuestionAnswers?.at(index).get('answer').clearValidators();
      patientQuestionAnswers?.at(index).get('answer').markAsPristine();
      patientQuestionAnswers?.at(index).get('answerText').clearValidators();
      patientQuestionAnswers?.at(index).get('answerText').markAsPristine();
      patientQuestionAnswers
        .at(index)
        .get('answerText')
        .updateValueAndValidity();

      if (pqa.value.required) {
        const selectedIndex = pqa.value.answer;

        if (selectedIndex !== true && selectedIndex !== false) {
          const formControl = patientQuestionAnswers
            .at(index)
            .get('answerText');
          formControl.setValidators(Validators.requiredTrue);
          formControl.setErrors({ required: true });
          formControl.markAsDirty();
        } else {
          patientQuestionAnswers?.at(index).get('answerText').clearValidators();
          patientQuestionAnswers?.at(index).get('answerText').markAsPristine();
        }
      }

      return patientQuestionAnswers
        .at(index)
        .get('answer')
        .hasError('required');
    } else {
      return patientQuestionAnswers
        .at(index)
        .get('answerText')
        .hasError('required');
    }
  }

  onChange(e: any, i: any, j: any, pqa: any) {
    this.selectedValue = [];
    const patientQuestionAnswers = this.patientQuestionnaireForm?.get(
      'patientQuestionAnswers'
    ) as FormArray;
    pqa.value.patientQuestionChoices[j].selected =
      !pqa.value.patientQuestionChoices[j].selected;
    if (
      pqa.value.questionType == 'Multiple_Selection_Text' &&
      pqa.value.required
    ) {
      // const index = (patientQuestionAnswers.value).findIndex(index => index.questionType === pqa.value.questionType);
      const index = i;
      const selectedIndex = pqa.value.patientQuestionChoices.findIndex(
        (x: any) => x.selected
      );

      if (selectedIndex == -1) {
        this.multiChoiceValidationMessage[index] = !pqa.value.answerText;
        const formControl = patientQuestionAnswers?.at(index).get('answerText');
        formControl.setValidators(Validators.requiredTrue);
        formControl.setErrors({ required: true });
        formControl.markAsDirty();
      } else {
        delete this.multiChoiceValidationMessage[index];
        patientQuestionAnswers?.at(index).get('answerText').clearValidators();
        patientQuestionAnswers?.at(index).get('answerText').markAsPristine();
      }
    }

    const selectedValue: any = [];
    pqa.value.patientQuestionChoices.filter(function (item: any) {
      if (item.selected) {
        selectedValue.push(item.choiceName);
      }
    });
    this.selectedValue = selectedValue;
    pqa.value.answerText = this.selectedValue.join(',');
  }

  OnInputChange(pqa: any, index: any) {
    this.dobIndex = index;
    console.log(pqa);
    const question = this.contactFormQuestions[index];
    const regex = question.regex;

    /* -------------------------------------------------------------------------- */
    /*           BELOW LOGIC IS FOR VALIDATION ON CALENDAR FOR DATE TYPE          */
    /* -------------------------------------------------------------------------- */
    let date_format = 'DD-MM-YYYY';
    if (pqa.value.questionType == 'Date') {
      if (regex === RegexEnum.DD_MM_YYY_FORMAT) {
        console.log('condition1');
        date_format = 'DD-MM-YYYY';
      } else if (regex == RegexEnum.MM_DD_YYYY_FORMAT) {
        console.log('condition2');
        date_format = 'MM-DD-YYYY';
      } else if (regex == RegexEnum.YYYY_MM_DD_FORMAT) {
        console.log('condition3');
        date_format = 'YYYY-MM-DD';
      }
      console.log(
        date_format,
        moment(pqa.value.answerText).format(date_format)
      );
      const updatedDate = moment(pqa.value.answerText).format(date_format);

      /* ---------------- getting form control date using formarray --------------- */
      const taskListArrays = this.patientQuestionAnswers;
      console.log('pqa.value.answerText', pqa.value.answerText);
      taskListArrays.controls[index].patchValue({
        answerText: updatedDate
      });
      pqa.value.answerText = updatedDate;
      console.log(updatedDate);
      console.log('pqa.value.answerText', pqa.value.answerText);
      /* -------------------------------------------------------------------------- */
      /*                        CALENDAR DATE VALIDATION ENDS                       */
      /* -------------------------------------------------------------------------- */
    } else {
      if (
        regex ==
          '^(0?[1-9]|[12][0-9]|3[01])[-/](0?[1-9]|1[012])[-/]((?:19|20|21)[0-9][0-9])$' ||
        regex ==
          '^(0?[1-9]|1[012])[-/](0?[1-9]|[12][0-9]|3[01])[-/]((?:19|20|21)[0-9][0-9])$' ||
        regex ==
          '^((?:19|20|21)[0-9][0-9])[-/](0?[1-9]|1[012])[-/](0?[1-9]|[12][0-9]|3[01])$'
      ) {
        this.dobRegex = regex;
        const regex1 = new RegExp(regex);
        console.log('res', regex1.test(pqa.value.answerText));
        if (!pqa.value.answerText) {
          this.dobErrorMessage = null;
          return;
        }
        if (regex1.test(pqa.value.answerText)) {
          this.dobErrorMessage = null;
        } else {
          this.dobErrorMessage = question.validationMessage;
        }
      }
    }
  }

  get patientQuestionAnswers(): FormArray {
    return this.patientQuestionnaireForm?.get(
      'patientQuestionAnswers'
    ) as FormArray;
  }

  get f() {
    return this.patientQuestionnaireForm.controls;
  }

  hideModal(flag?: any, data?: any) {
    this.modalClosed.emit({ close: true, isRefresh: flag ?? false, data });
    this.showModal = false;
  }

  setQuestionChoices(x: any) {
    const arr = new FormArray([]);
    x.patientQuestionChoices.forEach((y: any) => {
      arr.push(
        this.formBuilder.group({
          choiceId: y.choiceId,
          choiceName: y.choiceName,
          selected: y.selected
        })
      );
    });
    if (arr != null && arr.length > 0) {
      console.log(arr);
    }
    return arr;
  }

  validate(
    isTypeValid: any,
    required: any,
    pattern: any,
    isValidate: any
  ): any[] {
    const validator = [];

    if (isTypeValid) {
      if (required) {
        validator.push(Validators.required);
      }

      if (pattern && isValidate) {
        validator.push(Validators.pattern(pattern));
      }
    }

    return validator;
  }

  onFileChangeEvent(event: any, index: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      var pattern = /image-*/;
      if (
        !file.type.match(pattern) &&
        file.type != 'application/pdf' &&
        !this.acceptable_types.includes(file.type)
      ) {
        alert('Invalid format only supports images, pdf and excel');
        return;
      }
      const fileControl =
        this.patientQuestionnaireForm.controls.patientQuestionAnswers?.controls[
          index
        ].value;
      this.onFileChange(file, fileControl.questionId, index);
    }
  }

  validateInput(pqa: any) {
    var result;
    if (!this.dobRegex) {
      const patientQuestionAnswers = this.patientQuestionnaireForm?.get(
        'patientQuestionAnswers'
      ) as FormArray;
      if (
        pqa.value.required &&
        pqa.value.questionType === 'Input' &&
        pqa.value.questionName !== 'Email' &&
        pqa.value.questionName !== 'Date' &&
        pqa.value.questionName !== 'Phone Number'
      ) {
        const index = patientQuestionAnswers?.value.findIndex(
          (index: any) => index.questionName === pqa.value.questionName
        );
        const email = patientQuestionAnswers?.at(index).get('answerText').value;
        var filter = /^[a-zA-Z]([a-zA-Z ]*)?$/;
        result = filter.test(email);
        this.isLeadFormEmailValid = !result;
        return !result;
      }
    }
    return result;
  }

  validateEmail(pqa: any) {
    const patientQuestionAnswers = this.patientQuestionnaireForm?.get(
      'patientQuestionAnswers'
    ) as FormArray;

    if (pqa.value.questionName == 'Email') {
      const index = patientQuestionAnswers?.value.findIndex(
        (index: any) => index.questionName === pqa.value.questionName
      );
      const email = patientQuestionAnswers?.at(index).get('answerText').value;
      var filter = /\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
      var result = filter.test(email);
      this.isLeadFormEmailValid = !result;
      return !result;
    }
    return null;
  }

  validatePhone(pqa: any) {
    const patientQuestionAnswers = this.patientQuestionnaireForm?.get(
      'patientQuestionAnswers'
    ) as FormArray;

    if (pqa.value.questionName == 'Phone Number') {
      const index = patientQuestionAnswers?.value.findIndex(
        (index: any) => index.questionName === pqa.value.questionName
      );
      // patientQuestionAnswers.at(index).get('answerText').setValidators(Validators.pattern("^[0-9_-]{10,12}"))
      patientQuestionAnswers
        .at(index)
        .get('answerText')
        .setValidators(Validators.minLength(10));
      const phone = patientQuestionAnswers?.at(index).get('answerText').value;
      var result = phone.match(/^\d{10}$/g);
      this.isLeadFormPhoneValid = !result;
      return !result;
    }
    return null;
  }

  loadQuestionnaire() {
    this.leadService.getPublicQuestionnaire(this.businessId).then(
      (response: any) => {
        this.leadQuestionnaireId = response.id;
        this.loadQuestions(this.businessId, response.id);
      },
      () => {
        this.alertService.error('Unable to get quetionnaire.');
      }
    );
  }

  handleRegexForDates(question: any) {
    if (question.regex === RegexEnum.UNFORMATTED_DD_MM_YYY_FORMAT) {
      question.regex = RegexEnum.DD_MM_YYY_FORMAT;
      console.log('/DD/MM');
    } else if (question.regex === RegexEnum.UNFORMATTED_MM_DD_YYYY_FORMAT) {
      console.log('/MM/DD');
      question.regex = RegexEnum.MM_DD_YYYY_FORMAT;
      console.log(question.regex, RegexEnum.MM_DD_YYYY_FORMAT);
    } else if (question.regex === RegexEnum.UNFORMATTED_YYYY_MM_DD_FORMAT) {
      question.regex = RegexEnum.YYYY_MM_DD_FORMAT;
      console.log('/YYYY/MM');
    }

    return question.regex;
  }
  loadQuestions(businessId: any, questionnaireId: any) {
    this.leadService.getQuestionnaire(businessId, questionnaireId).then(
      (response: any) => {
        this.contactFormQuestions = response.patientQuestionAnswers;
        this.questionnaireName = response.questionnaireName;
        // this.isMandatoryConsentEnabled = response?.consentLeadForm;
        // this.mandatoryConsentText = response?.consentLeadTextForm;
        this.subtitle = null;
        this.submitButtonLabel = 'Submit';
        this.showFormHeader = false;
        this.patientQuestionnaireForm.patchValue({
          id: response.id,
          questionnaireId: response.questionnaireId
        });
        if (
          response.patientQuestionAnswers != null &&
          response.patientQuestionAnswers.length > 0
        ) {
          const control = <FormArray>(
            this.patientQuestionnaireForm.controls.patientQuestionAnswers
          );
          response.patientQuestionAnswers.forEach((x: any) => {
            console.log(x);
            if (x.questionType == 'Date') {
              const regex: any = this.handleRegexForDates(x);
              x.regex = regex;
              console.log(x.regex, regex);
            }
            if (
              x.questionType === 'Multiple_Selection_Text' &&
              !x.allowMultipleSelection &&
              !x.showDropDown &&
              x.preSelectCheckbox
            ) {
              x.answerText = x.preSelectCheckbox;
            }
            if (
              x.questionName === 'Phone Number' &&
              this.modalData?.phoneNumber
            ) {
              x.answerText = this.modalData?.phoneNumber;
            }
            const group: FormGroup = this.formBuilder.group({
              questionId: x.questionId,
              questionName: x.questionName,
              questionType: x.questionType,
              allowMultipleSelection: x.allowMultipleSelection,
              preSelectCheckbox: x.preSelectCheckbox,
              answer: [
                x.questionType === 'Yes_No' ? null : x.answer,
                this.validate(
                  x.questionType === 'Yes_No',
                  x.required,
                  x.regex,
                  x.validate
                )
              ],
              answerText: [
                x.answerText,
                this.validate(
                  x.questionType === 'Text' || 'Input',
                  x.required,
                  x.regex,
                  x.validate
                )
              ],
              answerComments: x.answerComments,
              patientQuestionChoices: this.setQuestionChoices(x),
              required: x.required,
              hidden: x.hidden,
              showDropDown: x.showDropDown,
              fileSource: null
            });
            if (x.questionType === 'Phone_Number') {
              setTimeout(() => {
                group.markAsPristine();
                group.markAsUntouched();
              }, 500);
            }
            control.push(group);
          });
        }
      },
      () => {
        console.log('err');
        this.alertService.error('Unable to load the email templates.');
      }
    );
  }

  /*** show regex error*/
  getRegexValidatedErrorMessage(pqa: any, index: any) {
    const question = this.contactFormQuestions[index];
    return question.validationMessage;
  }

  /*** check for the regex validation */
  validateRegex(pqa: any, index: any) {
    const question = this.contactFormQuestions[index];
    const regex = question.regex;
    if (regex != null && question.validate) {
      const regex1 = new RegExp(regex);
      if (pqa.value.answerText && !regex1.test(pqa.value.answerText)) {
        return true;
      }
      return false;
    }
    return false;
  }

  onFileChange(file: any, questionId: any, index: any) {
    const formData = new FormData();
    formData.append('file', file);
    this.leadService
      .saveFile(this.leadQuestionnaireId, questionId, formData)
      .then((response: any) => {
        this.patientQuestionnaireForm.controls.patientQuestionAnswers.controls[
          index
        ].patchValue({
          fileSource: response.location
        });
      })
      .catch((error) => {
        console.error('error while uploading file!!', error);
      });
  }

  submitForm() {
    this.submitLead();
  }

  submitLead() {
    this.submitted = true;
    if (this.formSource != undefined && this.formSource !== '') {
      this.patientQuestionnaireForm.patchValue({
        source: this.formSource
      });
    }

    const formData = this.patientQuestionnaireForm.value;
    formData.patientQuestionAnswers = formData.patientQuestionAnswers.map(
      (data: any) => {
        if (data.fileSource) {
          data.answerText = data.fileSource;
        }
        if (
          data.questionType === 'Phone_Number' &&
          data.answerText?.e164Number
        ) {
          data.answerText = `${
            data.answerText.dialCode
          }-${data.answerText.e164Number.replace(
            data.answerText.dialCode,
            ''
          )}`;
        }
        return data;
      }
    );

    this.leadService
      .submitQuestionnaire(this.businessId, this.leadQuestionnaireId, formData)
      .then(
        (leadId: any) => {
          this.alertService.success('Data submitted successfully.');
          const control = <FormArray>(
            this.patientQuestionnaireForm.controls.patientQuestionAnswers
          );
          control.controls.forEach((formGroup) => {
            formGroup.patchValue({
              answer: false,
              answerText: ''
            });
          });

          this.submitted = false;
          //this.modalDialog.hide();
          this.patientQuestionnaireForm = this.formBuilder.group({
            id: ['', []],
            questionnaireId: ['', []],
            source: ['Manual', []],
            patientQuestionAnswers: this.formBuilder.array([])
          });
          this.hideModal(true, { leadId });
        },
        () => {
          this.submitted = false;
        }
      );
  }

  renderPlaceHolderForDate(regex: any) {
    if (regex) {
      return this.regexState[regex];
    } else {
      return 'DD-MM-YYYY';
    }
  }

  phoneNumberInput(pqa: any, i: number) {
    if (pqa.valid) {
      (document.getElementById(`true${i}`) as HTMLInputElement).value =
        pqa.value.answerText.nationalNumber;
    }
  }
}
