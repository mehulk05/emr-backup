import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
import { currentUserService } from 'src/app/modules/authentication/services/current-user.service';
import { environment } from 'src/environments/environment';
import { QuestionarieService } from '../../services/questionarie.service';
import { ConvertImageService } from 'src/app/shared/services/image-utils/convertImage.service';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { noWhitespaceValidator } from '../../../authentication/whitespace-validator';
@Component({
  selector: 'app-add-edit-questionarie',
  templateUrl: './add-edit-questionarie.component.html',
  styleUrls: ['./add-edit-questionarie.component.css']
})
export class AddEditQuestionarieComponent implements OnInit {
  reviewFormType = 'REVIEW';
  notificationTypeValue = ['EMAIL', 'SMS'];
  domain =
    location.protocol +
    '//' +
    location.hostname +
    (location.port ? ':' + location.port : '');
  publicQuestionnaireUrl: any = null;
  iframeUrl: string;
  modernUiIframeUrl: string;
  modernUiUrl: string;
  cssFormResponse: any = null;
  submitted = false;
  questionnaireId: string = null;
  questionnaireForm!: FormGroup;
  notificationForm!: FormGroup;
  theCheckbox = true;
  questionnaire: any = null;
  questionList: any;
  selectedNotificationId: number;
  notificationList: any;
  isEditNotification: boolean = false;
  businessId = '';
  buttonBackgroundColor = '';
  buttonForegroundColor = '';
  titleColor = '';
  popupTitleColor = '';
  popupLabelColor = '';
  inputBoxShadowColor = '';
  activeSideColor = '';
  composerText: any = null;
  isLeadCaptureForm = false;
  isLeadForm = false;
  showThankYouPageUrlLinkInContactForm = false;
  showThankYouPageUrlLinkInVC = false;
  showThankYouPageUrlLinkInLandingPage = false;
  configureThankYouMessageInContactForm = false;
  configureConsentForm = true;
  configureThankYouMessageInLandingPage = false;
  configureThankYouMessageInVC = false;
  emailTemplates: any = [];
  emailTemplate: any = null;
  qId: any;
  disableLeadFormCheckBox: boolean = false;
  enabledModernUi: boolean = false;
  defaultBackgroundImages: any[] = [
    {
      index: 0,
      imageUrl: 'assets/bg-images/image-1.jpeg',
      isSelected: true,
      file: null
    },
    {
      index: 1,
      imageUrl: 'assets/bg-images/image-2.jpeg',
      isSelected: false,
      file: null
    },
    {
      index: 2,
      imageUrl: 'assets/bg-images/image-3.jpeg',
      isSelected: false,
      file: null
    },
    {
      index: 3,
      imageUrl: 'assets/bg-images/image-4.jpeg',
      isSelected: false,
      file: null
    },
    undefined
  ];
  backgroundImages: any[] = this.defaultBackgroundImages;
  backgroundImagesMap: Map<number, string> = new Map();
  currentImageChangeIndex: number;
  backgroundImagesNotFound: boolean;

  @ViewChild('myFileInput') myFileInput: any;
  @ViewChild('logoImg') logoImg!: ElementRef;

  isImageUploading: boolean = false;
  imageChangedEvent: any = '';
  croppedImage: any = '';
  showModalForImage: boolean = false;

  // backgroundImageUrl: string;
  showImgWarning: boolean = false;
  lastPage: any;
  pageType: any = '';
  consentLeadText = '';

  constructor(
    public formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private questionnaireService: QuestionarieService,
    private authenticationService: currentUserService,
    private alertService: ToasTMessageService,
    private convertImageService: ConvertImageService,
    private localStorageService: LocalStorageService
  ) {}

  ngOnInit(): void {
    const businessInfo = this.localStorageService.readStorage('businessData');
    this.consentLeadText = `By sharing my mobile number and email address, I hereby give my consent to receive promotional messages and emails from ${businessInfo.name}.`;
    this.questionnaireForm = this.formBuilder.group({
      name: ['', [Validators.required, noWhitespaceValidator()]],
      chatQuestionnaire: [false, []],
      isPublic: [false, []],
      enableModernUi: [false, []],
      showLogo: [false, []],
      showTitle: [false, []],
      buttonBackgroundColor: ['#357ffa', []],
      buttonForegroundColor: ['#357ffa', []],
      titleColor: ['inherit', []],
      popupTitleColor: ['inherit', []],
      popupLabelColor: ['inherit', []],
      inputBoxShadowColor: ['#357ffa', []],
      activeSideColor: ['#003b6f', []],
      textForComposer: [''],
      showTextForComposer: [false],
      hideFieldTitle: [false],
      isCustom: [false, []],
      emailTemplateId: [''],
      isLeadForm: [false, []],
      thankYouPageUrl: ['', []],
      submitButtonText: ['Submit', [noWhitespaceValidator()]],
      showThankYouPageUrlLinkInContactForm: [false, []],
      showThankYouPageUrlLinkInVC: [false, []],
      showThankYouPageUrlLinkInLandingPage: [false, []],
      thankYouPageUrlVC: ['', []],
      thankYouPageUrlLandingPage: ['', []],

      configureThankYouMessageInContactForm: [false, []],
      configureThankYouMessageInLandingPage: [false, []],
      configureThankYouMessageInVC: [false, []],
      thankYouPageMessageContactForm: ['', []],
      consentLeadTextForm: [this.consentLeadText, []],
      consentLeadForm: [false, []],
      thankYouPageMessageLandingPage: ['', []],
      thankYouPageMessageVC: ['', []],
      isG99ReviewForm: [false, []],
      backgroundImage: [this.backgroundImages?.find((bg) => bg.isSelected), []]
    });

    this.questionnaireForm.controls['backgroundImage'].valueChanges.subscribe(
      (value) => {
        const currentSelected = this.backgroundImages
          .filter((bg) => !!bg)
          .find((bg) => bg.isSelected);
        if (currentSelected && currentSelected.index != value.index) {
          if (this.questionnaireId && !this.backgroundImagesNotFound) {
            this.updateBackgroundImageStatus(value.index);
          } else {
            this.updateBackgroundImages(value.index);
          }
        }
      }
    );

    this.initiliazeNotificationForm();

    this.activatedRoute.queryParams.subscribe((data: any) => {
      console.log(data);
      this.lastPage = data?.from;
      this.pageType = data?.type;
    });
    this.activatedRoute.params.subscribe((routeParams: any) => {
      console.log('route', routeParams);
      this.qId = routeParams.questionnaireId;
      if (this.qId == 0) {
        // we need to load default chat questionnire
        this.questionnaireService.getLeadCaptureForm().then((response: any) => {
          this.questionnaireId = response.id;
          this.isLeadCaptureForm = true;
          this.init();
        });
      } else {
        this.questionnaireId = this.qId;
        this.init();
      }
    });

    this.isEditNotification = false;
  }

  updateBackgroundImageStatus(index: number) {
    this.questionnaireService
      .updateBackgroundImageStatus(this.questionnaireId, index)
      .then(
        () => {
          this.updateBackgroundImages(index);
          this.alertService.success('Background Image Updated Successfully.');
        },
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        () => {}
      );
  }

  updateBackgroundImages(index: number) {
    this.backgroundImages
      .filter((bg) => !!bg)
      .forEach((bg) => {
        bg.isSelected = bg.index == index;
      });
  }

  OpenNotficationModal() {
    this.initiliazeNotificationForm();
  }

  initiliazeNotificationForm() {
    this.isEditNotification = false;
    this.notificationForm = this.formBuilder.group({
      notificationType: ['', [Validators.required]],
      phoneNumber: [
        '',
        [Validators.required, Validators.pattern('^[0-9_-]{10}')]
      ],
      messageText: [''],
      toEmailAddress: [
        '',
        [
          Validators.required,
          Validators.pattern(
            '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$'
          )
        ]
      ]
    });
    this.notificationForm
      .get('notificationType')
      .valueChanges.subscribe((val: string) => {
        console.log(val);
        if (val == 'EMAIL') {
          //   this.notificationForm.controls['toEmailAddress'].setValidators([Validators.required]);
          this.notificationForm.controls['phoneNumber'].clearValidators();
        } else {
          console.log(val);
          this.notificationForm.controls['toEmailAddress'].clearValidators();
        }
        this.notificationForm.controls[
          'toEmailAddress'
        ].updateValueAndValidity();
        this.notificationForm.controls['phoneNumber'].updateValueAndValidity();
      });
  }

  init() {
    if (this.questionnaireId) {
      this.loadQuestionnaire();
      this.getAllNotifications();
      this.loadEmailTemplate();
      let formName = 'Contact Form';
      if (this.reviewFormType) {
        formName = 'Review Form';
      }
      this.authenticationService.currentUserSubject.subscribe((data: any) => {
        this.businessId = data?.businessId;
        //this.publicQuestionnaireUrl = this.domain + "/business/" + data.businessId + "/questionnaire/" + this.questionnaireId;
        this.publicQuestionnaireUrl =
          environment.OLD_EMR_DOMAIN +
          '/assets/static/form.html?bid=' +
          data.businessId +
          '&fid=' +
          this.questionnaireId +
          '&agencyId=' +
          data?.agencyId;
        console.log(this.publicQuestionnaireUrl);
        this.iframeUrl =
          '<script src="' +
          this.domain +
          '/assets/js/form-tracking.js"></script>' +
          '<iframe style="height:610px;width:500px;border:0" src="' +
          this.publicQuestionnaireUrl +
          '" title=' +
          formName +
          '></iframe>';
        this.modernUiUrl = `${environment.OLD_EMR_DOMAIN}/public/v2/form/${data.businessId}/${this.questionnaireId}`;
        this.modernUiIframeUrl =
          '<script src="' +
          this.domain +
          '/assets/js/form-tracking.js"></script>' +
          '<iframe style="height:610px;width:500px;border:0" src="' +
          this.modernUiUrl +
          '" title=' +
          formName +
          '></iframe>';
      });
    }

    this.loadEmailTemplates();
    localStorage.removeItem('isChecked');
  }

  loadQuestionnaire() {
    console.log('Questionnaire Id is :' + this.questionnaireId);
    this.questionnaireService.getQuestionnaire(this.questionnaireId).then(
      (response: any) => {
        if (response.isContactForm != null && response.isContactForm)
          this.isLeadCaptureForm = true;
        if (response.isLeadForm != null && response.isLeadForm)
          this.isLeadForm = true;
        this.configureConsentForm = response.consentLeadForm;
        this.composerText = response.textForComposer;
        this.questionnaireForm.patchValue({
          name: response.name,
          chatQuestionnaire: response.chatQuestionnaire,
          isPublic: response.isPublic,
          enableModernUi: response.enableModernUi,
          showLogo: response.showLogo,
          showTitle: response.showTitle,
          buttonBackgroundColor: response.buttonBackgroundColor,
          buttonForegroundColor: response.buttonForegroundColor,
          titleColor: response.titleColor,
          popupTitleColor: response.popupTitleColor,
          popupLabelColor: response.popupLabelColor,
          inputBoxShadowColor: response.inputBoxShadowColor,
          activeSideColor: response.activeSideColor,
          textForComposer: response.textForComposer,
          showTextForComposer: response.showTextForComposer,
          hideFieldTitle: response.hideFieldTitle,
          isCustom: response.isCustom,
          isLeadForm: response.isLeadForm,
          consentLeadTextForm:
            response.consentLeadTextForm &&
            response.consentLeadTextForm.length > 0
              ? response.consentLeadTextForm
              : this.consentLeadText,
          consentLeadForm: response.consentLeadForm,
          submitButtonText: response.submitButtonText,
          thankYouPageUrl: response.thankYouPageUrl,
          showThankYouPageUrlLinkInContactForm:
            response.showThankYouPageUrlLinkInContactForm,
          thankYouPageUrlLandingPage: response.thankYouPageUrlLandingPage,
          showThankYouPageUrlLinkInLandingPage:
            response.showThankYouPageUrlLinkInLandingPage,
          thankYouPageUrlVC: response.thankYouPageUrlVC,
          showThankYouPageUrlLinkInVC: response.showThankYouPageUrlLinkInVC,
          configureThankYouMessageInContactForm:
            response.configureThankYouMessageInContactForm,
          configureThankYouMessageInLandingPage:
            response.configureThankYouMessageInLandingPage,
          configureThankYouMessageInVC: response.configureThankYouMessageInVC,
          thankYouPageMessageContactForm:
            response.thankYouPageMessageContactForm,
          thankYouPageMessageLandingPage:
            response.thankYouPageMessageLandingPage,
          thankYouPageMessageVC: response.thankYouPageMessageVC,
          isG99ReviewForm: response.isG99ReviewForm
        });

        if (response.isLeadForm) {
          this.disableLeadFormCheckBox = true;
        }
        if (response.emailTemplate != null) {
          console.log('Email template Id :- ' + response.emailTemplate.id);
          this.questionnaireForm.patchValue({
            emailTemplateId: response.emailTemplate.id
          });
        }

        if (response.buttonBackgroundColor != null)
          this.buttonBackgroundColor = response.buttonBackgroundColor;
        if (response.buttonForegroundColor != null)
          this.buttonForegroundColor = response.buttonForegroundColor;
        if (response.titleColor != null) this.titleColor = response.titleColor;
        if (response.popupTitleColor != null)
          this.popupTitleColor = response.popupTitleColor;
        if (response.popupLabelColor != null)
          this.popupLabelColor = response.popupLabelColor;
        if (response.inputBoxShadowColor != null)
          this.inputBoxShadowColor = response.inputBoxShadowColor;
        if (response.activeSideColor != null)
          this.activeSideColor = response.activeSideColor;
        this.questionnaire = response;

        this.cssFormResponse = response?.css;

        if (response.showThankYouPageUrlLinkInContactForm)
          this.showThankYouPageUrlLinkInContactForm = true;
        if (response.showThankYouPageUrlLinkInVC)
          this.showThankYouPageUrlLinkInVC = true;
        if (response.showThankYouPageUrlLinkInLandingPage)
          this.showThankYouPageUrlLinkInLandingPage = true;

        if (response.configureThankYouMessageInContactForm)
          this.configureThankYouMessageInContactForm = true;
        if (response.configureThankYouMessageInLandingPage)
          this.configureThankYouMessageInLandingPage = true;
        if (response.configureThankYouMessageInVC)
          this.configureThankYouMessageInVC = true;
        if (!response.submitButtonText)
          this.questionnaireForm.patchValue({
            submitButtonText: 'Submit'
          });

        this.enabledModernUi = response.enableModernUi;
        // this.backgroundImageUrl = response.backgroundImageUrl ? `${response.backgroundImageUrl}?t=${new Date().getTime()}` : undefined;
        if (
          !response.backgroundImages ||
          (response.backgroundImages && response.backgroundImages.length == 0)
        ) {
          this.backgroundImagesNotFound = true;
        }
        this.backgroundImages =
          response.backgroundImages ?? this.defaultBackgroundImages;
        if (
          this.backgroundImages &&
          this.backgroundImages.filter((bg) => !!bg).length
        ) {
          this.questionnaireForm.patchValue({
            backgroundImage: this.backgroundImages
              .filter((bg) => !!bg)
              .find((bg: any) => bg.isSelected)
          });
          this.backgroundImages = this.backgroundImages
            .filter((bg) => !!bg)
            .sort((a, b) => a.index - b.index);
        } else {
          this.backgroundImages = this.defaultBackgroundImages;
        }
        if (this.backgroundImages.length != 5) {
          this.backgroundImages.push(undefined);
        }
      },
      () => {
        this.alertService.error('Unable to save the questionnaireForm.');
      }
    );
  }

  loadEmailTemplates() {
    this.questionnaireService.getAllEmailListOptimized().then(
      (data: any) => {
        this.emailTemplates = data;
      },
      () => {
        this.alertService.error('Unable to load email template.');
      }
    );
  }

  loadEmailTemplate() {
    this.questionnaireService
      .getEmailByQuestionnaire(this.questionnaireId)
      .then(
        (data: any) => {
          if (data != null) this.emailTemplate = data;
        },
        () => {
          this.alertService.error('Unable to load email template.');
        }
      );
  }

  get f() {
    return this.questionnaireForm.controls;
  }

  submitForm = () => {
    this.submitted = true;
    if (this.questionnaireForm.invalid) {
      return;
    }

    const formData = this.questionnaireForm.value;
    if (this.pageType === this.reviewFormType) {
      formData['reviewForm'] = true;
    }
    console.log(formData);
    if (this.questionnaireId) {
      this.questionnaireService
        .updateQuestionnaire(this.questionnaireId, formData)
        .then(
          (response: any) => {
            if (
              response.enableModernUi &&
              response.backgroundImages?.length == 0
            ) {
              const uploadData = this.getImagesForUpload(
                formData.backgroundImage.index
              );
              this.questionnaireService
                .uploadBackgroundImages(response.id, uploadData)
                .then(
                  () => {
                    this.alertService.success(
                      'Questionnaire updated successfully.'
                    );
                    const href = this.activatedRoute.snapshot.url[1]?.path;
                    if (
                      this.lastPage &&
                      this.lastPage === 'questionarie-list'
                    ) {
                      this.router.navigate(['/clinical-doc/questionnaire']);
                    } else if (href === 'edit') {
                      this.pageType == this.reviewFormType
                        ? this.router.navigate(['/review-form/'])
                        : this.router.navigate(['/form-builder/']);
                    } else {
                      this.enabledModernUi = formData.enableModernUi;
                    }
                  },
                  () => {
                    this.alertService.error(
                      'Unable to save the questionnaire.'
                    );
                  }
                );
            } else {
              this.alertService.success('Questionnaire updated successfully.');
              const href = this.activatedRoute.snapshot.url[1]?.path;
              console.log('href', href);
              if (this.lastPage && this.lastPage === 'questionarie-list') {
                this.router.navigate(['/clinical-doc/questionnaire']);
              } else if (href === 'edit') {
                this.pageType == this.reviewFormType
                  ? this.router.navigate(['/review-form/'])
                  : this.router.navigate(['/form-builder/']);
              } else {
                this.enabledModernUi = formData.enableModernUi;
              }
            }
          },
          () => {
            this.alertService.error('Unable to save the questionnaire.');
          }
        );
    } else {
      this.questionnaireService.createQuestionnaire(formData).then(
        (response: any) => {
          if (response.enableModernUi && this.backgroundImages) {
            const uploadData = this.getImagesForUpload(
              formData.backgroundImage.index
            );
            this.questionnaireService
              .uploadBackgroundImages(response.id, uploadData)
              .then(
                () => {
                  if (this.lastPage && this.lastPage === 'questionarie-list') {
                    this.router.navigate(['/clinical-doc/questionnaire']);
                  } else {
                    this.pageType == this.reviewFormType
                      ? this.router.navigate(['/review-form/'])
                      : this.router.navigate(['/form-builder/']);
                  }
                  this.alertService.success(
                    'Questionnaire saved successfully.'
                  );
                },
                () => {
                  this.alertService.error('Unable to save the questionnaire.');
                }
              );
          } else {
            if (this.lastPage && this.lastPage === 'questionarie-list') {
              this.router.navigate(['/clinical-doc/questionnaire']);
            } else {
              this.pageType == this.reviewFormType
                ? this.router.navigate(['/review-form/'])
                : this.router.navigate(['/form-builder/']);
            }
            this.alertService.success('Questionnaire saved successfully.');
          }
        },
        () => {
          this.alertService.error('Unable to save the questionnaire.');
        }
      );
    }
  };

  getImagesForUpload(selectedIndex: number): FormData {
    const uploadData = new FormData();
    this.backgroundImages.forEach((image) => {
      if (image) {
        if (this.backgroundImagesMap.has(image.index)) {
          image.imageUrl = '';
          image.file = this.convertImageService.base64ToFile(
            this.backgroundImagesMap.get(image.index)
          );
        }
        image.isSelected = image.index == selectedIndex;

        uploadData.append(
          `${image.index}||${image.imageUrl}||${image.isSelected}`,
          image.file
        );
      }
    });
    return uploadData;
  }

  back = () => {
    console.log('path', this.activatedRoute.snapshot.url);
    const href = this.activatedRoute.snapshot.url[2]?.path;
    this.submitted = false;
    console.log('href', href);
    if (this.lastPage && this.lastPage === 'questionarie-list') {
      this.router.navigate(['/clinical-doc/questionnaire']);
    } else if (href === 'lead-capture-form') {
      const pageName =
        this.pageType === this.reviewFormType
          ? '/review-form/'
          : '/form-builder/';
      this.router.navigate([`${pageName}${this.qId}/lead-capture-form`]);
      window.location.reload();
    } else {
      const pageName =
        this.pageType === this.reviewFormType
          ? '/review-form/'
          : '/form-builder/';
      this.router.navigate([pageName]);
    }
  };

  copyQuestionnairFormCode() {
    console.log('I copied');

    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = this.iframeUrl;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    console.log(selBox);
    document.body.removeChild(selBox);
    this.alertService.success('Copied!');
  }

  saveNotificationDetail() {
    console.log('this.notificationForm:', this.notificationForm.value);

    const body = {
      notificationType: this.notificationForm.value.notificationType,
      phoneNumber: this.notificationForm.value.phoneNumber,
      messageText: this.notificationForm.value.messageText,
      toEmail: this.notificationForm.value.toEmailAddress
    };

    this.questionnaireService
      .createQuestionnaireNotification(this.questionnaireId, body)
      .then(
        () => {
          this.notificationForm.reset();
          this.alertService.success(
            'Questionnaire Notification saved successfully.'
          );
          this.getAllNotifications();
        },
        () => {
          this.notificationForm.reset();
          this.alertService.error('Unable to save the questionnaire.');
        }
      );
  }

  getAllNotifications() {
    console.log('In Get all notifications');
    this.questionnaireService
      .fetchQuestionnaireAllNotification(this.questionnaireId)
      .then(
        (response: any) => {
          this.notificationList = response;
        },
        () => {
          this.alertService.error('Unable to save the questionnaire.');
        }
      );
  }

  deleteNotification(id: any) {
    this.questionnaireService
      .deleteQuestionnaireNotification(this.questionnaireId, id)
      .then(
        () => {
          this.getAllNotifications();
          this.alertService.success(
            'Questionnaire Notification deleted successfully.'
          );
        },
        () => {
          this.alertService.error('Unable to Delete the notification');
        }
      );
  }

  editNotification(id: any) {
    this.isEditNotification = true;
    console.log(id);
    this.questionnaireService
      .getQuestionnaireNotificationOverId(this.questionnaireId, id)
      .then(
        (response: any) => {
          console.log({ response });

          this.selectedNotificationId = response.id;

          this.notificationForm = this.formBuilder.group({
            notificationType: response.notificationType,
            phoneNumber: response.phoneNumber,
            messageText: response.messageText,
            toEmailAddress: response.toEmail
          });
        },
        () => {
          this.alertService.error('Unable to Update the notification');
        }
      );
  }

  updateNotificationDetail() {
    const emailTemp = {
      emailBody: this.notificationForm.value.emailBody,
      emailSubject: this.notificationForm.value.emailSubject
    };

    const body = {
      notificationType: this.notificationForm.value.notificationType,
      phoneNumber: this.notificationForm.value.phoneNumber,
      messageText: this.notificationForm.value.messageText,
      toEmail: this.notificationForm.value.toEmailAddress,
      emailTemplate: JSON.stringify(emailTemp)
    };

    this.questionnaireService
      .updateQuestionnaireNotification(
        this.questionnaireId,
        this.selectedNotificationId,
        body
      )
      .then(
        (response: any) => {
          console.log({ response });
          this.notificationForm.reset();
          this.isEditNotification = false;
          this.alertService.success(
            'Questionnaire Notification saved successfully.'
          );
          this.getAllNotifications();
        },
        () => {
          this.notificationForm.reset();
          this.alertService.error('Unable to save the questionnaire.');
        }
      );
  }
  preview() {
    window.open(this.publicQuestionnaireUrl, '_blank');
  }
}
