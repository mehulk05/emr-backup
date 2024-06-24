import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { QuestionAnswer } from '../../models/question-answer.model';
import { PublicForm } from '../../models/public-form.model';
import { PublicAccessibleService } from '../../services/public-accessible.service';
import { ConfirmationService } from 'primeng/api';
import { LocalStorageService } from '../../../../shared/services/local-storage.service';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
import { environment } from 'src/environments/environment';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { RegexEnum } from 'src/app/shared/common/constants/regex';
import moment from 'moment';
import { BusinessHoursValidatorService } from 'src/app/shared/services/custom-validators/business-hours-validator-service';
import { BusinessHours } from 'src/app/shared/models/business/BusinessHours';
import { BusinessEmailAsyncValidatorService } from 'src/app/shared/services/custom-validators/business-email-async-validator.service';
import { DomSanitizer } from '@angular/platform-browser';
import {
  CountryISO,
  PhoneNumberFormat,
  SearchCountryField
} from 'ngx-intl-tel-input';

export enum QuestionType {
  INPUT = 'Input',
  YES_NO = 'Yes_No',
  MULTIPLE_SELECT = 'Multiple_Selection_Text',
  DATE = 'Date',
  FILE = 'File',
  BUSINESS_HOURS = 'Business_Hours',
  ADDRESS = 'Address',
  TERMS_AND_CONDITIONS = 'Terms_And_Conditions',
  PHONE_NUMBER = 'Phone_Number',
  CONSENT = 'Consent'
}

export enum Constants {
  SERVICES_QUESTION_ID = -1,
  SERVICES_KEY = 'specializationServices',
  SPECIALIZATION_KEY = 'specializationId',
  SPECIALIZATION_QUESTION = 'please add specialization'
}

export interface QuestionState {
  formControl: FormControl;
  questionType: string;
  validations: Array<any>;
  isValid: Boolean;
  condition: any;
  skippedCount?: number;
}

export interface AnswerDTO {
  questionId: number;
  questionType: string;
  answer: any;
}

export enum ConditionType {
  EQUALS = 'EQUALS',
  NOT_EQUALS = 'NOT_EQUALS',
  GREATER_THEN = 'GREATER_THEN',
  LESS_THEN = 'LESS_THEN'
}

@Component({
  selector: 'app-public-dynamic-form-page',
  templateUrl: './public-dynamic-form-page.component.html',
  styleUrls: ['./public-dynamic-form-page.component.css'],
  providers: [ConfirmationService]
})
export class PublicDynamicFormPageComponent implements OnInit {
  constructor(
    private activatedRoute: ActivatedRoute,
    private elRef: ElementRef,
    private confirmationService: ConfirmationService,
    private publicAccessibleService: PublicAccessibleService,
    private toastService: ToasTMessageService,
    private localStorageService: LocalStorageService,
    private ngxLoader: NgxUiLoaderService,
    private businessHoursValidatorService: BusinessHoursValidatorService,
    private businessEmailAsyncValidatorService: BusinessEmailAsyncValidatorService,
    private sanitizer: DomSanitizer,
    private fb: FormBuilder
  ) {}

  bid: string;
  fid: string;
  agencyId: any;
  trackingUrl: string;
  redirectUrl: string;
  isFormOnWebsite: any;
  gcaptchaKey: string;
  trackingCode: any;
  thankYouPageMessageContactForm: any;
  thankyouPageRedirect: boolean;
  showThankYou: boolean = false;

  formSubmissionId: number;
  form: PublicForm;
  formGroup: FormGroup;
  questions: Array<QuestionAnswer>;
  currentQuestionNo: number = 0;
  questionSerialNo: number = 1;
  showQuestion: Boolean = false;
  _formState: Map<any, QuestionState> = new Map();
  dateFormat: string = 'mm/dd/yy';
  showTitle: Boolean = true;
  submitButtonText: string = 'Submit';
  backgroundColor: string = '#003B6F';
  foregroundColor: string = '#FFFFFF';
  value: number = 0;
  showForm: boolean = false;
  userEmail: string;
  localStorageKey: string;
  localStorageMap: Map<number, object> = new Map();
  logoUrl: string;
  backgroundImageUrl: string = '../../../../../assets/large.jpeg';
  @ViewChild('backgroundImage') backgroundImageEl: ElementRef;
  specializationIndex: number;

  emailPopupForm: FormGroup;
  showEmailPopup: boolean = false;
  showLogo: boolean = false;

  isMandatoryConsentEnabled = false;
  isMandatoryConsentEnabledChecked = false;
  mandatoryConsentText = '';

  openHours = moment.utc().set('hours', 9).set('minutes', 0).set('seconds', 0);
  closeHours = moment
    .utc()
    .set('hours', 17)
    .set('minutes', 0)
    .set('seconds', 0);
  defaultBusinessHour: BusinessHours = {
    day: '',
    checked: true,
    openHour: moment(this.openHours.format('YYYY-MM-DD HH:mm:ss')).toDate(),
    closeHour: moment(this.closeHours.format('YYYY-MM-DD HH:mm:ss')).toDate()
  };
  businessHour: BusinessHours = {
    day: '',
    checked: false,
    openHour: undefined,
    closeHour: undefined
  };
  weekDays: any[] = [
    'MONDAY',
    'TUESDAY',
    'WEDNESDAY',
    'THURSDAY',
    'FRIDAY',
    'SATURDAY',
    'SUNDAY'
  ];

  addressOptionCountry: any = {
    ComponentRestrictions: {
      country: ['US']
    }
  };
  isOnboardingForm: boolean = false;

  dateFormates: any = {
    '^(0?[1-9]|[12][0-9]|3[01])[-/](0?[1-9]|1[012])[-/]((?:19|20|21)[0-9][0-9])$':
      'dd/mm/yy',
    '^(0?[1-9]|1[012])[-/](0?[1-9]|[12][0-9]|3[01])[-/]((?:19|20|21)[0-9][0-9])$':
      'mm/dd/yy',
    '^((?:19|20|21)[0-9][0-9])[-/](0?[1-9]|1[012])[-/](0?[1-9]|[12][0-9]|3[01])$':
      'yy/mm/dd'
  };

  imageTypes: string[] = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];

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
  skippedQuestionsByCondition: number[] = [];

  ngOnInit(): void {
    this.bid = this.activatedRoute.snapshot.params.bid;
    this.fid = this.activatedRoute.snapshot.params.fid;
    this.agencyId = this.activatedRoute.snapshot.queryParams.agencyId ?? null;
    const source = this.activatedRoute.snapshot.queryParams.source;

    this.trackingUrl = document.referrer;
    if (
      this.trackingUrl &&
      (this.trackingUrl.includes('clinical-doc') || source == 'quickLinks')
    ) {
      this.trackingUrl = window.location.href;
    }

    const redirect = this.activatedRoute.snapshot.queryParams.redirect;
    if (redirect) {
      this.redirectUrl = this.activatedRoute.snapshot.queryParams.redirectUrl;
    }

    if (window.addEventListener) {
      window.addEventListener('message', this.handleMessage);
    } else {
      (<any>window).attachEvent('onmessage', this.handleMessage);
    }
    parent.postMessage('closeChat', '*');

    this.gcaptchaKey = environment.siteKey;
    this.isOnboardingForm = !!environment.ONBOARDING_FORMS.find(
      (f) => f.fid == parseInt(this.fid) && f.bid == parseInt(this.bid)
    );
    this.init();

    this.emailPopupForm = new FormGroup({
      email: new FormControl('', [
        Validators.required,
        Validators.pattern(RegexEnum.email)
      ])
    });
  }

  @HostListener('window:keydown.enter', ['$event'])
  onEnterKeyPress(event: KeyboardEvent) {
    if (!event.shiftKey && !event.defaultPrevented) {
      this.setAnswer();
    }
    return false;
  }

  handleMessage(e: any) {
    if (e && typeof e.data == 'string' && e.data.startsWith('http')) {
      this.trackingUrl = e.data;
      if (this.trackingUrl.includes('website')) {
        this.isFormOnWebsite = true;
      }
    }
  }

  init() {
    if (!(this.bid && this.fid)) {
      this.toastService.errorToast('Form you are looking for not found.');
      return;
    }
    this.publicAccessibleService
      .getBusinessData(this.bid)
      .then((business: any) => {
        if (!business.deleted) {
          if (business.logoUrl) this.logoUrl = business.logoUrl;

          var allPromises = [
            this.publicAccessibleService.getFormQuestionnaire(
              this.bid,
              this.fid
            )
          ];
          if (this.isOnboardingForm) {
            allPromises.push(
              this.publicAccessibleService.getSpecializations(this.bid)
            );
          }
          Promise.all(allPromises).then(
            (response: any[]) => {
              const data = response[0];
              this.setDocumentMetadata(data);

              this.form = data;

              let questions = data.patientQuestionAnswers as QuestionAnswer[];
              if (questions && questions.length > 0) {
                questions = [...questions];
                questions = questions.filter((question) => !question.hidden);
                this.questions = questions;
                if (data?.consentLeadForm) {
                  const consent = {} as QuestionAnswer;
                  consent.answerText = data?.consentLeadTextForm;
                  consent.questionId = 10000000;
                  consent.questionType = 'Consent';
                  consent.required = true;
                  consent.answer = true;
                  this.questions.push(consent);
                }
              }
              if (this.isOnboardingForm) {
                this.setOnboardingFormSpecializations(response[1]);
              }

              this.initializeQuestionsState();
              this.localStorageKey = `q_${this.bid}_${this.fid}`;
              const localStorageData = this.getLocalStorageData();
              if (localStorageData && localStorageData.answers) {
                this.localStorageMap = this.objectToMap(
                  localStorageData.answers
                );
                this.formSubmissionId = localStorageData.formSubmissionId;
                this.setFormData(localStorageData.answers);
                this.currentQuestionNo = this.getLastValidIndex();
                this.setQuestionSerialNo();
              }

              this.formGroup = this.fb.group(
                {
                  formControl: this.formControl
                },
                {
                  updateOn: 'change'
                }
              );

              if (this.isOnboardingForm) {
                this.setOnboardingFormBusinessNameValidator();
              }

              this.initializeUiState();

              setTimeout(() => {
                this.value =
                  (100 / this.questions.length) * (this.currentQuestionNo + 1);
                this.showForm = true;
                this.showQuestion = true;
              }, 200);
            },
            () => {
              console.log('Error while fething Form data');
              this.toastService.errorToast(
                'Form you are looking for not found.'
              );
            }
          );
        } else {
          this.toastService.info('The Business is disabled.');
        }
      });
  }

  setOnboardingFormSpecializations(response: any[]) {
    const specializationIndex = this.questions.findIndex(
      (question) =>
        question.questionName?.toLowerCase() ===
        Constants.SPECIALIZATION_QUESTION
    );
    if (specializationIndex != -1) {
      this.specializationIndex = specializationIndex;
      const specializations = response?.map((sp: any) => {
        return {
          choiceId: sp.id,
          choiceName: sp.name
        };
      });
      this.questions[specializationIndex].patientQuestionChoices =
        specializations;
      this.questions.splice(specializationIndex + 1, 0, {
        questionId: Constants.SERVICES_QUESTION_ID,
        questionName: 'Please add Services',
        questionType: QuestionType.MULTIPLE_SELECT,
        allowMultipleSelection: true,
        patientQuestionChoices: [],
        required: true,
        hidden: false,
        validate: false,
        validationMessage: '',
        answer: '',
        showDropDown: false,
        preSelectCheckbox: false
      });
    }
  }

  setOnboardingFormBusinessNameValidator() {
    const question = this.questions.find((question) => {
      return (
        question.questionName?.trim().toLocaleLowerCase() ===
        'what is your business name'
      );
    });
    if (question) {
      this._formState
        .get(question.questionId)
        .formControl.addAsyncValidators(
          this.businessEmailAsyncValidatorService.nameAlreadyExistsValidator(
            this.bid
          )
        );
      this._formState.get(question.questionId).formControl.markAsUntouched({
        onlySelf: true
      });
    }
  }

  setDocumentMetadata(data: any) {
    if (data.thankYouPageUrl) {
      this.thankyouPageRedirect = true;
      this.redirectUrl = data.thankYouPageUrl;
    }

    if (data.configureThankYouMessageInContactForm) {
      this.thankYouPageMessageContactForm = data.thankYouPageMessageContactForm;
    }

    if (
      data.googleAnalyticsGlobalCodeUrl != null &&
      data.googleAnalyticsGlobalCodeUrl != ''
    ) {
      var s = document.createElement('script');
      s.src = data.googleAnalyticsGlobalCodeUrl;
      document.head.appendChild(s);

      if (
        data.googleAnalyticsGlobalCode != null &&
        data.googleAnalyticsGlobalCode != ''
      ) {
        var str = data.googleAnalyticsGlobalCode;
        str = str.replace(/<script>/g, '');
        str = str.replace(/<\/script>/g, '');
        var s1 = document.createElement('script');
        s1.textContent = str;
        document.head.appendChild(s1);
        if (
          data.landingPageTrackCode != null &&
          data.landingPageTrackCode != ''
        ) {
          var str1 = data.landingPageTrackCode;
          str1 = str1.replace(/<script>/g, '');
          str1 = str1.replace(/<\/script>/g, '');
          this.trackingCode = str1;
        }
      }
    }
    const captcha = document.createElement('script');
    captcha.setAttribute(
      'src',
      'https://www.google.com/recaptcha/api.js?render=' + this.gcaptchaKey
    );
    document.head.appendChild(captcha);
  }

  get currentQuestion() {
    return this.questions[this.currentQuestionNo];
  }

  get questionState() {
    return this._formState.get(this.currentQuestion.questionId);
  }

  get formControl() {
    return this._formState.get(this.currentQuestion.questionId).formControl;
  }

  get emailForm() {
    return this.emailPopupForm.controls;
  }

  initializeUiState() {
    if (this.form.backgroundImageUrl)
      this.backgroundImageUrl =
        this.form.backgroundImageUrl + '?t=' + Math.random();

    this.backgroundImageEl.nativeElement.style.backgroundImage = `url(${this.backgroundImageUrl})`;
    this.submitButtonText = this.form.submitButtonText || this.submitButtonText;
    this.showTitle = this.form.showTitle;
    this.showLogo = this.form.showLogo;

    this.backgroundColor =
      this.form.buttonBackgroundColor || this.backgroundColor;
    this.foregroundColor =
      this.form.buttonForegroundColor || this.foregroundColor;
    this.elRef.nativeElement.style.setProperty(
      '--form-color',
      this.backgroundColor
    );
    this.elRef.nativeElement.style.setProperty(
      '--form-bg',
      this.foregroundColor
    );
    this.elRef.nativeElement.style.setProperty(
      '--form-color-hover',
      this.colorLuminance(this.backgroundColor, 0.5)
    );
    this.elRef.nativeElement.style.setProperty(
      '--form-color-active',
      this.colorLuminance(this.backgroundColor, 0.2)
    );
    this.elRef.nativeElement.style.setProperty(
      '--form-color-light',
      this.colorLuminance(this.backgroundColor, 0.9)
    );
    this.elRef.nativeElement.style.setProperty(
      '--form-color-shadow',
      this.colorLuminance(this.backgroundColor, 0.9, 33)
    );
  }

  initializeQuestionsState() {
    for (const question of this.questions) {
      const validations = [];
      if (question.questionType == QuestionType.TERMS_AND_CONDITIONS) {
        question.tncIframeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
          `${question.tncFilelink}#scrollbar=0`
        );
      }
      if (question.required) {
        if (question.questionType == QuestionType.BUSINESS_HOURS) {
          validations.push(
            this.businessHoursValidatorService.validateBusinessHours()
          );
        } else if (
          question.questionType == QuestionType.TERMS_AND_CONDITIONS ||
          question.questionType == QuestionType.CONSENT
        ) {
          validations.push(Validators.requiredTrue);
        } else {
          validations.push(Validators.required);
        }
      }
      if (question.validate && question.regex) {
        if (question.questionType == QuestionType.DATE) {
          this.setDateFormat(question);
        } else {
          if (question.regex == RegexEnum.httpUrl)
            validations.push(Validators.pattern(RegexEnum.httpUrlRegex));
          else validations.push(Validators.pattern(question.regex));
        }
      }

      const controlValue = this.getControlValue(question);

      this._formState.set(question.questionId, {
        formControl: new FormControl(controlValue, validations),
        validations: validations,
        questionType: question.questionType,
        isValid: validations.length == 0,
        condition: this.form.conditions.find(
          (condition) => condition.questionId === question.questionId
        ),
        skippedCount: 0
      });
    }
  }

  getControlValue(question: QuestionAnswer) {
    let controlValue;
    if (
      question.questionType == QuestionType.MULTIPLE_SELECT &&
      !question.showDropDown &&
      question.preSelectCheckbox
    ) {
      controlValue = question.patientQuestionChoices?.map(
        (choice: { choiceId: any }) => choice.choiceId
      );
    } else if (question.questionType == QuestionType.BUSINESS_HOURS) {
      controlValue = this.getDefaultBusinessHours();
    } else if (question.questionType == QuestionType.TERMS_AND_CONDITIONS) {
      controlValue = false;
    } else {
      controlValue = '';
    }
    return controlValue;
  }

  getDefaultBusinessHours(): BusinessHours[] {
    const businessHours = [];
    for (let i = 0; i < this.weekDays.length; i++) {
      businessHours.push({
        index: i,
        ...(i < 5 ? this.defaultBusinessHour : this.businessHour),
        day: this.weekDays[i]
      });
    }
    businessHours.sort((a, b) => a.index - b.index);
    return businessHours;
  }

  getLocalStorageData(): {
    formSubmissionId: number;
    answers: Map<number, object>;
  } {
    try {
      return this.localStorageService.readStorage(this.localStorageKey);
    } catch (error) {
      return null;
    }
  }

  mapToObject(inputMap: Map<any, any>) {
    const obj: any = {};
    inputMap.forEach(function (value, key) {
      obj[key] = value;
    });
    return obj;
  }

  objectToMap(obj: object): Map<any, any> {
    obj = obj || {};
    const map = new Map();
    for (const [key, val] of Object.entries(obj)) {
      map.set(parseInt(key), val);
    }
    return map;
  }

  setUpdateLocalStorageData(answer: any) {
    this.localStorageMap.set(answer.questionId, answer.answer);
    this.updateLocalStorage();
  }

  updateLocalStorage() {
    this.localStorageService.storeItem(this.localStorageKey, {
      answers: this.mapToObject(this.localStorageMap),
      formSubmissionId: this.formSubmissionId
    });
  }

  setFormData(data: unknown) {
    for (const [key, val] of Object.entries(data)) {
      const id = parseInt(key);
      if (id == this.questions[0].questionId) {
        this.userEmail = val;
      }

      const questionState = this._formState.get(id);
      if (questionState) {
        if (questionState.questionType == QuestionType.BUSINESS_HOURS) {
          (val as any[])?.forEach((hour) => {
            if (hour.openHour && hour.closeHour) {
              hour.openHour = new Date(hour.openHour);
              hour.closeHour = new Date(hour.closeHour);
            }
          });
        }
        questionState.formControl.setValue(val);
        questionState.isValid = true;
        const condition = questionState.condition;
        if (
          condition &&
          ((condition.conditionType === ConditionType.EQUALS &&
            condition.conditionValue === questionState.formControl.value) ||
            (condition.conditionType === ConditionType.NOT_EQUALS &&
              condition.conditionValue !== questionState.formControl.value))
        ) {
          const index = this.questions.findIndex(
            (question) => (question.questionId = id)
          );
          if (index !== -1) {
            let i = index + 1;
            const skippedList = [];
            for (; i < this.questions.length; i++) {
              if (
                this.questions[i].questionId ===
                condition.conditionNextQuestionId
              ) {
                break;
              }
              skippedList.push(this.questions[i].questionId);
            }
            this.skippedQuestionsByCondition.push(...skippedList);
            if (
              skippedList.length !== 0 &&
              this._formState.get(this.questions[i].questionId)
            ) {
              this._formState.get(this.questions[i].questionId).skippedCount =
                skippedList.length;
            }
          }
        }
      }
    }
    if (this.isOnboardingForm) {
      const specializationFormControl = this._formState.get(
        this.questions[this.specializationIndex].questionId
      );
      if (this.specializationIndex && specializationFormControl?.isValid) {
        this.publicAccessibleService
          .getSpecializationServices(
            this.bid,
            specializationFormControl.formControl.value
          )
          .then((response: any) => {
            const services = response?.map((service: any) => {
              return {
                choiceId: service.id,
                choiceName: service.name
              };
            });

            this.questions[
              this.specializationIndex + 1
            ].patientQuestionChoices = services;
            const servicesFormControl = this._formState.get(
              Constants.SERVICES_QUESTION_ID
            );
            if (servicesFormControl && servicesFormControl.isValid) {
              const serviceIds: number[] = services.map(
                (service: any) => service.choiceId
              );
              const selectedServices: number[] =
                servicesFormControl.formControl.value;
              if (!selectedServices.every((s) => serviceIds.includes(s))) {
                this._formState
                  .get(Constants.SERVICES_QUESTION_ID)
                  .formControl.reset();
                this._formState.get(Constants.SERVICES_QUESTION_ID).isValid =
                  false;
              }
            }
          });
      }
    }
  }

  setDateFormat(question: QuestionAnswer) {
    const format = this.dateFormates[(question.regex || '') as string];
    this.dateFormat = format || this.dateFormat;
  }

  setAnswer() {
    this.questionState.isValid = this.formControl.valid;
    if (!this.formControl.valid) {
      this.formControl.markAsTouched();
      return;
    }

    if (this.currentQuestionNo == 0) {
      this.userEmail = this.formControl.value;
      this.publicAccessibleService
        .getAnswers(this.bid, this.fid, this.userEmail)
        .then((response: any) => {
          let resetFormControls = false;
          if (this.formSubmissionId !== response.formSubmissionId) {
            resetFormControls = true;
          }
          this.formSubmissionId = response.formSubmissionId;
          if (Object.entries(response.answers).length > 0) {
            this.confirmationService.confirm({
              message: 'Do you want to continue where you left off ?',
              header: 'Confirm To Resume',
              icon: 'pi pi-question-circle',
              acceptIcon: 'd-none',
              acceptLabel: 'Resume',
              rejectIcon: 'd-none',
              rejectLabel: 'Start New',
              accept: () => {
                this.localStorageMap.set(
                  this.currentQuestion.questionId,
                  this.formControl.value
                );
                Object.entries<object>(response.answers).forEach(
                  ([key, val]) => {
                    this.localStorageMap.set(parseInt(key), val);
                  }
                );
                this.updateLocalStorage();
                if (resetFormControls) {
                  this.resetFormControls();
                }
                response.answers[this.currentQuestion.questionId] =
                  this.formControl.value;
                this.setFormData(response.answers);
                const lastValid = this.getLastValidIndex();
                this.goToQuestion(lastValid);
              },
              reject: () => {
                this.localStorageService.removeStorage(this.localStorageKey);
                this.resetFormControls();
                this.publicAccessibleService
                  .deleteAnswers(this.bid, this.fid, this.userEmail)
                  .then((formSubmissionId) => {
                    this.formSubmissionId = Number(formSubmissionId);
                    this.setUpdateLocalStorageData({
                      questionId: this.currentQuestion.questionId,
                      answer: this.formControl.value
                    });
                    this.nextQuestion();
                  });
              },
              key: 'positionDialog'
            });
          } else {
            this.localStorageMap.clear();
            this.setUpdateLocalStorageData({
              questionId: this.currentQuestion.questionId,
              answer: this.formControl.value
            });
            this.resetFormControls();
            this.nextQuestion();
          }
        });
    } else if (this.currentQuestion.questionType === 'Consent') {
      this.nextQuestion();
    } else {
      var isFileDeleted = false;
      var fileUrl = '';
      if (
        this.currentQuestion.questionType === QuestionType.FILE &&
        this.formControl.value?.deleted
      ) {
        if (this.currentQuestion.required) {
          this.formControl.updateValueAndValidity();
          this.formControl.setErrors({ required: 'Please Upload a File' });
          return;
        }
        isFileDeleted = true;
        fileUrl = this.formControl.value.fileUrl;
        this.formControl.setValue(null);
      }
      const answer: AnswerDTO = {
        questionId: this.currentQuestion.questionId,
        questionType: this.currentQuestion.questionType,
        answer: this.formControl.value
      };
      this.publicAccessibleService
        .saveAnswer(this.bid, this.fid, this.userEmail, answer)
        .then((formSubmissionId) => {
          this.formSubmissionId = Number(formSubmissionId);
          this.setUpdateLocalStorageData({
            questionId: this.currentQuestion.questionId,
            answer: this.formControl.value
          });
          this.formControl.markAsPristine();
          if (
            this.isOnboardingForm &&
            this.specializationIndex == this.currentQuestionNo
          ) {
            this.publicAccessibleService
              .getSpecializationServices(this.bid, this.formControl.value)
              .then((response: any) => {
                const services = response?.map((service: any) => {
                  return {
                    choiceId: service.id,
                    choiceName: service.name
                  };
                });

                this.questions[
                  this.specializationIndex + 1
                ].patientQuestionChoices = services;
                if (this._formState.has(Constants.SERVICES_QUESTION_ID)) {
                  this._formState
                    .get(Constants.SERVICES_QUESTION_ID)
                    .formControl.reset();
                  this._formState.get(Constants.SERVICES_QUESTION_ID).isValid =
                    false;
                }
                this.nextQuestion();
              });
          } else if (
            this.currentQuestion.questionType === QuestionType.FILE &&
            isFileDeleted
          ) {
            this.deleteFile(fileUrl).then(() => {
              this.nextQuestion();
            });
          } else {
            this.nextQuestion();
          }
        });
    }
  }

  resetFormControls() {
    for (let i = 1; i < this.questions.length; i++) {
      const question = this.questions[i];
      const questionState = this._formState.get(question.questionId);
      questionState.formControl.setValue(this.getControlValue(question));
      questionState.formControl.markAsPristine();
      questionState.formControl.markAsUntouched();
      questionState.isValid = questionState.validations.length == 0;
      questionState.condition = this.form.conditions.find(
        (condition) => condition.questionId === question.questionId
      );
      questionState.skippedCount = 0;
    }
    this._formState.get(this.questions[0].questionId).condition =
      this.form.conditions.find(
        (condition) => condition.questionId === this.questions[0].questionId
      );
    this.skippedQuestionsByCondition = [];
  }

  saveAnswers() {
    if (this.localStorageMap.size == 0) {
      this.toastService.errorToast('No Answers to save!');
      return;
    }
    this.ngxLoader.start();
    setTimeout(() => {
      this.ngxLoader.stop();
      this.toastService.success('Form saved successfully.');
    }, 1500);
  }

  loadAnswers() {
    this.showEmailPopup = true;
  }

  closeEmailPopup() {
    this.showEmailPopup = false;
    this.emailPopupForm.reset();
  }

  fetchAnswers() {
    if (this.emailPopupForm.valid) {
      const email = this.emailPopupForm.controls['email'].value;
      this.publicAccessibleService.getAnswers(this.bid, this.fid, email).then(
        (response: any) => {
          this.formSubmissionId = response.formSubmissionId;
          this.closeEmailPopup();
          if (Object.entries(response.answers).length > 0) {
            this.formControl.setValue(email);
            this.questionState.isValid = true;
            this.userEmail = email;
            this.setUpdateLocalStorageData({
              questionId: this.currentQuestion.questionId,
              answer: email
            });
            this.setFormData(response.answers);
            Object.entries<object>(response.answers).forEach(([key, val]) => {
              this.localStorageMap.set(parseInt(key), val);
            });
            this.updateLocalStorage();
            const lastValid = this.getLastValidIndex();
            this.goToQuestion(lastValid);
            this.toastService.success('Form loaded successfully.');
          } else {
            this.toastService.info('No Form Found with your Email!');
          }
        },
        () => {
          this.toastService.errorToast(
            'Unable to load your Form at the moment!'
          );
        }
      );
    }
  }

  changeAnswer(option: string) {
    this.formControl.setValue(option);
    this.setAnswer();
  }

  handleBusinessHourChange(event: BusinessHours) {
    this.formControl.value[event.index] = event;
    this.formControl.updateValueAndValidity();
  }

  onFileChange(file: any) {
    const fileUrl: string = this.formControl.value?.fileUrl;
    if (fileUrl) {
      this.deleteFile(fileUrl)
        .then(() => {
          if (!file) {
            this.formControl.setValue(null);
            this.formControl.markAsDirty();
          } else {
            this.uploadFile(file);
          }
        })
        .catch((error) => {
          console.error('error while uploading file!!', error);
        });
    } else {
      this.uploadFile(file);
    }
  }

  onFileDelete(e: any) {
    if (e) {
      this.formControl.setValue({ ...this.formControl.value, deleted: true });
      this.formControl.markAsDirty();
    }
  }

  uploadFile(file: any) {
    const formData = new FormData();
    formData.append('file', file);
    this.publicAccessibleService
      .saveFile(
        this.bid,
        this.formSubmissionId,
        this.currentQuestion.questionId,
        formData
      )
      .then((response: any) => {
        const answer = {
          fileUrl: response.location,
          name: file.name,
          size: file.size,
          type: file.type
        };
        this.formControl.setValue(answer);
        this.formControl.markAsDirty();
      })
      .catch((error) => {
        console.error('error while uploading file!!', error);
      });
  }

  deleteFile(fileUrl: string) {
    let keyPart = fileUrl.substring(fileUrl.lastIndexOf('/') + 1);
    keyPart = keyPart.replace(
      `question_${this.formSubmissionId}_${this.currentQuestion.questionId}_`,
      ''
    );
    return this.publicAccessibleService.deleteFile(
      this.bid,
      this.formSubmissionId,
      this.currentQuestion.questionId,
      keyPart
    );
  }

  onFileError(error: string) {
    if (error && error.length > 0) {
      this.toastService.errorToast(error);
    }
  }

  handleAddressChange(address: any) {
    this.formControl.setValue(address.formatted_address);
  }

  validateCondition(condition: any) {
    let result = false;
    if (
      [ConditionType.GREATER_THEN, ConditionType.LESS_THEN].includes(
        condition.conditionType
      )
    ) {
      if (condition.conditionType === ConditionType.GREATER_THEN) {
        try {
          return (
            parseInt(this.formControl.value?.trim()) >
            parseInt(condition.conditionValue)
          );
        } catch (err) {
          // Not able to parse the number
          return false;
        }
      } else if (condition.conditionType === ConditionType.LESS_THEN) {
        try {
          return (
            parseInt(this.formControl.value?.trim()) <
            parseInt(condition.conditionValue)
          );
        } catch (err) {
          return false;
        }
      }
    }
    if (this.currentQuestion.questionType === QuestionType.MULTIPLE_SELECT) {
      if (
        this.currentQuestion.preSelectCheckbox ||
        this.currentQuestion.allowMultipleSelection
      ) {
        const answerOptions: number[] = this.formControl.value;
        const conditionAnswers: string[] = condition.conditionValue.split('$$');
        if (answerOptions && conditionAnswers.length === answerOptions.length) {
          result = this.currentQuestion.patientQuestionChoices
            .filter((choice) => answerOptions.includes(choice.choiceId))
            .every((answer) => conditionAnswers.includes(answer.choiceName));
        }
      } else {
        let answerText = '';
        const answerId = this.formControl.value;
        const answerChoice = this.currentQuestion.patientQuestionChoices.find(
          (choice) => choice.choiceId == answerId
        );
        if (answerChoice) answerText = answerChoice.choiceName;
        result = answerText === condition.conditionValue;
      }
    } else if (this.currentQuestion.questionType === QuestionType.DATE) {
      result = moment(this.formControl.value).isSame(
        moment(condition.conditionValue)
      );
    } else {
      result = this.formControl.value === condition.conditionValue;
    }
    return condition.conditionType === ConditionType.EQUALS ? result : !result;
  }

  nextQuestion(fromUi?: boolean) {
    if (fromUi && (this.formControl.errors || this.formControl.dirty)) {
      this.setAnswer();
      return;
    }
    if (this.currentQuestionNo == this.questions.length - 1) {
      this.submitForm();
      return;
    }
    this.showQuestion = false;
    const condition = this.questionState.condition;
    let i = this.currentQuestionNo + 1;
    const skippedList = [];
    if (condition && this.validateCondition(condition)) {
      for (; i < this.questions.length; i++) {
        if (
          this.questions[i].questionId === condition.conditionNextQuestionId
        ) {
          break;
        }
        skippedList.push(this.questions[i].questionId);
      }
      this.skippedQuestionsByCondition.push(...skippedList);
    }
    setTimeout(() => {
      if (i !== this.currentQuestionNo + 1 && i < this.questions.length) {
        this.currentQuestionNo = i;
        this.questionState.skippedCount = skippedList.length;
      } else {
        this.currentQuestionNo++;
      }
      if (
        this.currentQuestion.questionType != QuestionType.TERMS_AND_CONDITIONS
      ) {
        this.setQuestionSerialNo();
      }
      this.formGroup.setControl('formControl', this.formControl);
      this.value = (100 / this.questions.length) * (this.currentQuestionNo + 1);
      if (
        (this.currentQuestion.questionType == QuestionType.DATE ||
          this.currentQuestion.questionType == QuestionType.FILE) &&
        !this.formControl.value
      ) {
        this.formControl.markAsUntouched();
        this.formControl.updateValueAndValidity();
      }
      this.showQuestion = true;
    }, 200);
  }

  prevQuestion() {
    this.showQuestion = false;
    setTimeout(() => {
      if (!!this.questionState?.skippedCount) {
        this.currentQuestionNo -= this.questionState.skippedCount;
      }
      this.currentQuestionNo--;
      if (
        this.currentQuestion.questionType != QuestionType.TERMS_AND_CONDITIONS
      ) {
        this.setQuestionSerialNo();
      }
      this.formGroup.setControl('formControl', this.formControl);
      this.showQuestion = true;
    }, 200);
  }

  goToQuestion(questionIndex: number) {
    this.showQuestion = false;
    this.currentQuestionNo = questionIndex;
    if (
      this.currentQuestion.questionType != QuestionType.TERMS_AND_CONDITIONS
    ) {
      this.setQuestionSerialNo();
    }
    this.formGroup.setControl('formControl', this.formControl);
    setTimeout(() => {
      this.value = (100 / this.questions.length) * (this.currentQuestionNo + 1);
      this.showQuestion = true;
    }, 200);
  }

  setQuestionSerialNo() {
    this.questionSerialNo =
      this.currentQuestionNo -
      this.getSkippedCountTillIndex(this.currentQuestionNo) +
      1;
  }

  getLastValidIndex() {
    for (let i = this.questions.length - 1; i >= 0; i--) {
      if (this.localStorageMap.has(this.questions[i].questionId)) {
        return i;
      }
    }
    return 0;
  }

  getSkippedCountTillIndex(index: number) {
    let count = 0;
    for (let i = 0; i < index; i++) {
      if (
        this.questions[i].questionType == QuestionType.TERMS_AND_CONDITIONS ||
        this.skippedQuestionsByCondition.includes(this.questions[i].questionId)
      )
        count++;
    }
    return count;
  }

  submitForm() {
    this.ngxLoader.start();
    const answerMap: Map<number, any> = new Map();
    for (let i = 0; i < this.questions.length; i++) {
      const question = this.questions[i];
      const control = this._formState.get(question.questionId).formControl;
      if (
        !this._formState.get(question.questionId).isValid &&
        !this.skippedQuestionsByCondition.includes(question.questionId)
      ) {
        this.showQuestion = false;
        this.currentQuestionNo = i;
        this.setQuestionSerialNo();
        this.formGroup.setControl('formControl', this.formControl);
        setTimeout(() => {
          this.showQuestion = true;
        }, 200);
        this.ngxLoader.stop();
        return;
      } else {
        answerMap.set(question.questionId, control.value);
      }
    }

    try {
      const formData = [...this.form.patientQuestionAnswers];

      if (
        this.isOnboardingForm &&
        formData[this.specializationIndex]?.questionName.toLowerCase() ==
          Constants.SPECIALIZATION_QUESTION
      ) {
        const servicesQuestion = answerMap.get(Constants.SERVICES_QUESTION_ID);
        const selectedServices = servicesQuestion?.join(',');
        const specializationQuestionId =
          formData[this.specializationIndex].questionId;
        answerMap.set(
          specializationQuestionId,
          `${answerMap.get(specializationQuestionId)}:${selectedServices}`
        );
      }

      for (const question of formData) {
        if (question.hidden) continue;
        let answerText = '';

        if (question.questionType == QuestionType.FILE) {
          answerText = answerMap.get(question.questionId).fileUrl;
        } else if (question.questionType == QuestionType.MULTIPLE_SELECT) {
          if (question.preSelectCheckbox || question.allowMultipleSelection) {
            const answerOptions: number[] = answerMap.get(question.questionId);
            if (answerOptions) {
              answerText = question.patientQuestionChoices
                .filter((choice) => answerOptions.includes(choice.choiceId))
                .map((choice) => choice.choiceName)
                .join(',');
            }
          } else {
            answerText = answerMap.get(question.questionId);
            const answerChoice = question.patientQuestionChoices.find(
              (choice) => choice.choiceId == answerText
            );
            if (answerChoice) answerText = answerChoice.choiceName;
          }
        } else if (question.questionType == QuestionType.BUSINESS_HOURS) {
          const hours: BusinessHours[] = answerMap.get(question.questionId);
          if (hours && hours.length > 0) {
            answerText = hours
              .filter((hour) => hour.checked)
              .map(
                (hour) =>
                  `${hour.day}-${moment(hour.openHour).format(
                    'hh:mm A'
                  )}-${moment(hour.closeHour).format('hh:mm A')}`
              )
              .join(',');
          }
        } else if (question.questionType == QuestionType.PHONE_NUMBER) {
          const answer = answerMap.get(question.questionId);
          if (answer) {
            answerText = `${answer.dialCode}-${answer.e164Number.replace(
              answer.dialCode,
              ''
            )}`;
          }
        } else {
          answerText = answerMap.get(question.questionId);
        }
        question.answerText = answerText;
      }

      const source = 'Form';
      const formReq = {
        sourceUrl: this.trackingUrl,
        source: source,
        landingPageName: '',
        questionnaireId: this.fid,
        gcaptcharesponse: '',
        patientQuestionAnswers: formData,
        agencyId: this.agencyId
      };

      this.executeGrecaptcha().then(
        (token) => {
          this.ngxLoader.stop();
          formReq.gcaptcharesponse = token;
          this.publicAccessibleService
            .submitForm(this.bid, this.fid, formReq)
            .then(
              () => {
                this.localStorageService.removeStorage(this.localStorageKey);
                this.publicAccessibleService
                  .deleteFormSubmission(this.bid, this.formSubmissionId)
                  .then(
                    // eslint-disable-next-line @typescript-eslint/no-empty-function
                    () => {},
                    () => {
                      console.log('Error while deleting form submission!');
                    }
                  );

                var s2 = document.createElement('script');
                s2.textContent = this.trackingCode;
                document.head.appendChild(s2);

                if (this.thankyouPageRedirect) {
                  window.top.location.href = this.redirectUrl;
                } else {
                  this.showForm = false;
                  this.showThankYou = true;
                }
              },
              () => {
                console.log('error while submitting the form!');
                throw new Error();
              }
            );
        },
        () => {
          console.log('error while fetching recaptcha token');
          throw new Error();
        }
      );
    } catch (error) {
      this.ngxLoader.stop();
      this.toastService.errorToast(
        'Unable to submit form. Please try again later.'
      );
    }
  }

  executeGrecaptcha(): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      if (!window.grecaptcha) {
        resolve('');
        return;
      }
      const captchaKey = this.gcaptchaKey;
      grecaptcha.ready(function () {
        grecaptcha
          .execute(captchaKey, {
            action: 'submit'
          })
          .then(
            function (token) {
              resolve(token);
            },
            (err) => {
              reject(err);
            }
          );
      });
    });
  }

  colorLuminance(hex: string, lum: number, alpha?: number) {
    // validate hex string
    hex = String(hex).replace(/[^0-9a-f]/gi, '');
    if (hex.length < 6) {
      hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    lum = lum || 0;

    // convert to decimal and change luminosity
    var rgb = '#',
      c,
      i;
    for (i = 0; i < 3; i++) {
      c = parseInt(hex.substring(i * 2, i * 2 + 2), 16);
      c = Math.round(Math.min(Math.max(0, c + c * lum), 255)).toString(16);
      rgb += ('00' + c).substring(c.length);
    }
    if (alpha) {
      rgb += alpha;
    }
    return rgb;
  }

  tncChanged(e: any) {
    this.formControl.setValue(e.target.checked);
    this.formControl.markAsDirty();
    this.formControl.updateValueAndValidity();
  }

  getRequiredErrorText() {
    let errorText = 'Please fill this in';
    if (this.currentQuestion.questionType === QuestionType.FILE) {
      errorText = 'Please Upload a File.';
    } else if (this.currentQuestion.questionType === QuestionType.DATE) {
      errorText = 'Please Select a Date';
    } else if (this.currentQuestion.questionType === QuestionType.YES_NO) {
      errorText = 'Please Select Your Answer';
    }
    return errorText;
  }

  showFileDownloadError() {
    document.getElementById('tncFileDownload').style.display = 'block';
  }

  phoneNumberInput() {
    if (this.formControl.valid) {
      (
        document.getElementById(
          `phone_number_${this.currentQuestion.questionId}`
        ) as HTMLInputElement
      ).value = this.formControl.value.nationalNumber;
    }
  }
}
