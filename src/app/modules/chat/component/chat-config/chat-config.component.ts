import { Component, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
import { RegexEnum } from 'src/app/shared/common/constants/regex';
import { ConvertImageService } from 'src/app/shared/services/image-utils/convertImage.service';
import { ChatConfigService } from '../../service/chat-config.service';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';

@Component({
  selector: 'app-chat-config',
  templateUrl: './chat-config.component.html',
  styleUrls: ['./chat-config.component.css']
})
export class ChatConfigComponent implements OnInit, OnChanges {
  @Input() chatConfig: any;
  @Input() userDetails: any;
  chatConfigForm!: FormGroup;
  logoUrl: any;

  icons = [
    'https://g99plus.b-cdn.net/Emr/Asset%201@1080x.png',
    'https://g99plus.b-cdn.net/Emr/Asset%202@1080x.png',
    'https://g99plus.b-cdn.net/Emr/Asset%203@1080x.png'
  ];

  isImageUploading: boolean = false;
  imageChangedEvent: any = '';
  croppedImage: any = '';
  consentLeadText = '';
  configureConsentForm = true;
  showModalForImage: boolean = false;
  valid: boolean = false;
  defaultChatbotLogo: boolean = false;
  @ViewChild('myFileInput') myFileInput: any;
  constructor(
    private chatConfigService: ChatConfigService,
    private alertService: ToasTMessageService,
    public formBuilder: FormBuilder,
    private convertImageService: ConvertImageService,
    private localStorageService: LocalStorageService
  ) {}

  ngOnInit(): void {
    this.initChatConfigForm();
    this.loadUserDetails();
  }
  initChatConfigForm() {
    const businessInfo = this.localStorageService.readStorage('businessData');
    this.consentLeadText = `By sharing my mobile number and email address, I hereby give my consent to receive promotional messages and emails from ${businessInfo.name}.`;
    this.chatConfigForm = this.formBuilder.group({
      morningStartTime: [
        '',
        [Validators.required, Validators.pattern(RegexEnum.chatTime)]
      ],
      morningEndTime: [
        '',
        [Validators.required, Validators.pattern(RegexEnum.chatTime)]
      ],
      noonStartTime: [
        '',
        [Validators.required, Validators.pattern(RegexEnum.chatTime)]
      ],
      noonEndTime: [
        '',
        [Validators.required, Validators.pattern(RegexEnum.chatTime)]
      ],
      eveningStartTime: [
        '',
        [Validators.required, Validators.pattern(RegexEnum.chatTime)]
      ],
      eveningEndTime: [
        '',
        [Validators.required, Validators.pattern(RegexEnum.chatTime)]
      ],
      weeksToShow: ['', [Validators.required]],
      privacyLink: ['', []],
      botName: [
        '',
        [Validators.required, Validators.pattern(RegexEnum.textField_Spaces)]
      ],
      welcomeMessage: [
        '',
        [Validators.required, Validators.pattern(RegexEnum.textField_Spaces)]
      ],
      defaultWelcomeMessage: [
        '',
        [Validators.required, Validators.pattern(RegexEnum.textField_Spaces)]
      ],
      formMessage: [
        '',
        [Validators.required, Validators.pattern(RegexEnum.textField_Spaces)]
      ],
      faqNotFoundMessage: [
        '',
        [Validators.required, Validators.pattern(RegexEnum.textField_Spaces)]
      ],
      backgroundColor: ['#003B6F', [Validators.required]],
      foregroundColor: ['#fff', [Validators.required]],
      longCodePhoneNumber: ['', []],
      enableAppointment: [true, []],
      showPoweredBy: [true, []],
      poweredByText: ['', [Validators.pattern(RegexEnum.httpUrl)]],
      enableInPersonAppointment: [true, []],
      enableVirtualAppointment: [true, []],
      consentFormRequired: [true, []],
      consentTextForm: [this.consentLeadText, []],

      isChatbotStatic: [true, []],
      appointmentBookingUrl: ['', [Validators.pattern(RegexEnum.httpUrl)]]
    });
  }
  ngOnChanges(): void {
    if (this.chatConfig && this.chatConfig?.tenantId) {
      this.patchChatValue(this.chatConfig);
      this.defaultChatbotLogo =
        this.chatConfig?.iconUrl ??
        'https://g99plus.b-cdn.net/AEMR/assets/img/profileDefault.png';
    }
    this.loadClinic(this.chatConfig?.tenantId);
  }

  patchChatValue(response: any) {
    if (response?.poweredByText && !response.poweredByText.startsWith('http')) {
      response.poweredByText = 'https://growth99.com/';
    }
    this.chatConfigForm.patchValue({
      morningStartTime: response.morningStartTime,
      morningEndTime: response.morningEndTime,
      noonStartTime: response.noonStartTime,
      noonEndTime: response.noonEndTime,
      eveningStartTime: response.eveningStartTime,
      eveningEndTime: response.eveningEndTime,
      weeksToShow: response.weeksToShow,
      privacyLink: response.privacyLink,
      botName: response.botName,
      welcomeMessage: response.welcomeMessage,
      defaultWelcomeMessage: response.defaultWelcomeMessage,
      formMessage: response.formMessage,
      faqNotFoundMessage: response.faqNotFoundMessage,
      backgroundColor: response.backgroundColor,
      foregroundColor: response.foregroundColor,
      enableAppointment: response.enableAppointment,
      enableInPersonAppointment: response.enableInPersonAppointment,
      enableVirtualAppointment: response.enableVirtualAppointment,
      longCodePhoneNumber: response.longCodePhoneNumber,
      showPoweredBy: response?.showPoweredBy,
      poweredByText: response?.poweredByText,
      isChatbotStatic: response?.isChatbotStatic ?? true,
      consentFormRequired: response?.consentFormRequired ?? true,
      consentTextForm: response?.consentTextForm ?? this.consentLeadText
    });
  }

  submitChatConfig() {
    const values = this.chatConfigForm.value;
    this.chatConfigService.updateChatConfig(values).then(
      (response: any) => {
        this.alertService.success('Chat configuration updated successfully.');
        this.patchChatValue(response);
      },
      () => {
        this.alertService.error('Unable to update chat config.');
      }
    );
  }

  get f() {
    return this.chatConfigForm.controls;
  }

  loadUserDetails() {
    this.userDetails = this.localStorageService.readStorage('currentUser');
    console.log(this.userDetails);
    console.log(this.userDetails.logoUrl);
  }

  selectImg(icon: any) {
    this.chatConfig.iconUrl = icon;
    this.chatConfigService.updateChatIcon(icon).then(
      () => {
        this.alertService.success('Image saved successfully.');
        window.location.reload();
      },
      () => {
        this.alertService.error('Unable to save image.');
      }
    );
  }

  /* -------------------------------------------------------------------------- */
  /*                            Image upload functions                           */
  /* -------------------------------------------------------------------------- */
  fileChangeEvent(e: any) {
    this.showModalForImage = true;
    this.imageChangedEvent = e;
  }
  saveImage() {
    const formData = new FormData();
    formData.append(
      'file',
      this.convertImageService.base64ToFile(this.croppedImage)
    );
    this.chatConfigService.uploadChatConfigIcon(formData).then(
      (response: any) => {
        this.logoUrl = response?.iconUrl;
        this.chatConfig.iconUrl = response?.iconUrl;
        this.alertService.success('Image  uploaded successfully.');
        this.cancelImageUpload();
        window.location.reload();
      },
      () => {
        this.alertService.error('Unable to upload image.');
        this.cancelImageUpload();
      }
    );
  }

  onChangeconfigureConsent(values: any) {
    console.log(values.currentTarget.checked);
    if (values.currentTarget.checked) {
      this.configureConsentForm = true;
    } else {
      this.configureConsentForm = false;
    }
  }

  cancelImageUpload() {
    this.showModalForImage = false;
    this.myFileInput.nativeElement.value = '';
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
  }
  imageLoaded() {
    // show cropper
  }
  cropperReady() {
    // cropper ready
  }
  loadImageFailed() {
    // show message
  }

  loadClinic(businessId: any) {
    this.chatConfigService
      .getDefaultCinicOptimized(businessId)
      .then((data: any) => {
        this.chatConfigForm.patchValue({
          appointmentBookingUrl: data.appointmentUrl
        });
      });
  }
}
