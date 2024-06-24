import { moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
import { AuthService } from 'src/app/modules/authentication/services/auth.service';
import { RegexEnum } from 'src/app/shared/common/constants/regex';
import { environment } from 'src/environments/environment';
import { IntegrationService } from '../../service/integration.service';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';

@Component({
  selector: 'app-integration-page',
  templateUrl: './integration-page.component.html',
  styleUrls: ['./integration-page.component.css']
})
export class IntegrationPageComponent implements OnInit {
  maxSelectedFeatureCount = 4;
  selectedFeatureCount = 0;
  showButtonGroup: boolean;
  layoutType: string = 'fixed';
  integrationForm: FormGroup;
  integrationPreviewUrl = environment.CHAT_BOT_DOMAIN;
  integrationScript: any = ``;
  businessId: any;
  integrationList: any = [];
  integrationId: any;
  displayModal = false;
  labelName: any;
  currenEditingLabelName: any;
  @Input() showModal: boolean = false;
  @Input() modalData: any;
  @Input() modalMessage: any;
  @Output() modalClosed = new EventEmitter<any>();
  chatbotData: { label: any; index: any; labelFeildName: any };
  appointmentUrl: any;
  defaultClinic: any;

  selectedFeatureObj: any = {
    isAppointmentSelected: false,
    isSymptomComposerSelected: false,
    isContactFormSelected: false,
    isClinicReviewSelected: false
  };

  constructor(
    public formBuilder: FormBuilder,
    private alertService: ToasTMessageService,
    private integrationFeatureService: IntegrationService,
    private authService: AuthService,
    private localStorageService: LocalStorageService
  ) {}

  ngOnInit(): void {
    this.appointmentUrl =
      this.localStorageService.readStorage('defaultQuickLinks')?.appointmentUrl;
    this.defaultClinic =
      this.localStorageService.readStorage('defaultClinic')?.id;

    this.initForm();
    this.authService.currentUserSubject.subscribe((data) => {
      this.businessId = data?.businessId;
      if (
        window.location.href.includes('growthemr') ||
        window.location.href.includes('localhost')
      ) {
        this.integrationScript =
          '<div id="buisness-id" data-id="' +
          data?.businessId +
          '"></div> <script id="integration-script" src="' +
          environment.CHAT_BOT_DOMAIN +
          '/assets/js/integration-dev.js"></script>';
      } else {
        this.integrationScript =
          '<div id="buisness-id" data-id="' +
          data?.businessId +
          '"></div> <script id="integration-script" src="' +
          environment.CHAT_BOT_DOMAIN +
          '/assets/js/integration.js"></script>';
      }
      this.integrationPreviewUrl =
        this.integrationPreviewUrl +
        '/assets/integration.html?bid=' +
        data?.businessId;

      this.loadIntegrationFeatures();
    });
  }

  initForm() {
    this.integrationForm = this.formBuilder.group({
      isAppointmentSelected: [false, [Validators.required]],
      isChatbotSelected: [false, [Validators.required]],
      isSymptomComposerSelected: [false, [Validators.required]],
      isContactFormSelected: [false, [Validators.required]],
      isClinicReviewSelected: [false],

      customUrlForAppointment: [
        this.appointmentUrl,
        [Validators.pattern(RegexEnum.httpUrlRegex)]
      ],
      customUrlForContactForm: ['', [Validators.pattern(RegexEnum.httpUrl)]],

      customUrlForVC: ['', [Validators.pattern(RegexEnum.httpUrl)]],

      chatbotLabel: ['Chatbot', [Validators.required]],
      appointmentLabel: ['Book Now', [Validators.required]],
      contactFormLabel: ['Contact', [Validators.required]],
      composerLabel: ['Self Assessment', [Validators.required]],
      clinicReviewLabel: ['Reviews', [Validators.required]],
      showChatbotAsNewTab: [false],
      showClinicReviewAsNewTab: [false],
      showContactFormAsNewTab: [false],
      showSymptomComposerAsNewTab: [false],
      showAppointmentAsNewTab: [false],

      customCssForButton: [''],
      chatbotLabelPosition: [5],
      composerLabelPosition: [1],
      appointmentLabelPosition: [2],
      contactFormLabelPosition: [3],
      clinicReviewLabelPosition: [4]
    });
  }

  get f() {
    return this.integrationForm.controls;
  }

  loadIntegrationFeatures() {
    this.integrationList = [];
    this.integrationFeatureService.getIntegrationFeature().then(
      (data: any) => {
        if (data) {
          this.patchIntegrationForm(data);
        }
      },
      () => {
        this.alertService.error('Error while fetching feature !!');
      }
    );
  }

  patchIntegrationForm(data: any) {
    console.log(this.appointmentUrl);
    this.integrationId = data.id;
    this.integrationForm.patchValue({
      isAppointmentSelected: data?.isAppointmentSelected,
      isChatbotSelected: data?.isChatbotSelected,
      isContactFormSelected: data?.isContactFormSelected,
      isSymptomComposerSelected: data?.isSymptomComposerSelected,
      isClinicReviewSelected: data?.isClinicReviewSelected,

      appointmentLabel: data?.appointmentLabel,
      chatbotLabel: data?.chatbotLabel,
      composerLabel: data?.composerLabel,
      contactFormLabel: data?.contactFormLabel,
      clinicReviewLabel: data?.clinicReviewLabel ?? 'Clinic Review',

      customCssForButton: data?.customCssForButton,
      customUrlForAppointment:
        data?.customUrlForAppointment?.length > 0
          ? data?.customUrlForAppointment
          : this.appointmentUrl,
      customUrlForContactForm: data?.customUrlForContactForm,
      customUrlForVC: data?.customUrlForVC,

      appointmentLabelPosition: data?.appointmentLabelPosition,
      chatbotLabelPosition: data?.chatbotLabelPosition,
      composerLabelPosition: data?.composerLabelPosition,
      contactFormLabelPosition: data?.contactFormLabelPosition,
      clinicReviewLabelPosition: data?.clinicReviewLabelPosition,

      showChatbotAsNewTab: data?.showChatbotAsNewTab,
      showClinicReviewAsNewTab: data?.showClinicReviewAsNewTab ?? false,
      showContactFormAsNewTab: data?.showContactFormAsNewTab ?? false,
      showSymptomComposerAsNewTab: data?.showSymptomComposerAsNewTab ?? false,
      showAppointmentAsNewTab: data?.showAppointmentAsNewTab ?? false
    });
    this.layoutType = data?.layoutType ?? 'fixed';
    this.integrationList.push({
      label: data?.appointmentLabel,
      index: data?.appointmentLabelPosition ?? 3,
      labelFeildName: 'appointmentLabelPosition',
      featureName: 'isAppointmentSelected'
    });
    if (this.layoutType === 'vertical') {
      this.maxSelectedFeatureCount = 3;
    }

    // this.selectedFeatureCount = Object.values(
    //   this.integrationForm.value
    // ).filter((value) => value === true).length;

    // Update selectedFeatureObj
    this.selectedFeatureObj.isAppointmentSelected =
      this.integrationForm.get('isAppointmentSelected')?.value || false;
    this.selectedFeatureObj.isSymptomComposerSelected =
      this.integrationForm.get('isSymptomComposerSelected')?.value || false;
    this.selectedFeatureObj.isContactFormSelected =
      this.integrationForm.get('isContactFormSelected')?.value || false;
    this.selectedFeatureObj.isClinicReviewSelected =
      this.integrationForm.get('isClinicReviewSelected')?.value || false;

    this.selectedFeatureCount = Object.keys(this.integrationForm.value).reduce(
      (count, key) => {
        if (key.startsWith('is') && key !== 'isChatbotSelected') {
          count += data[key] ? 1 : 0;
        }
        return count;
      },
      0
    );
    console.log(this.selectedFeatureCount);
    // this.integrationList.push({
    //   label: data?.chatbotLabel,
    //   index: data?.chatbotLabelPosition ?? 4,
    //   labelFeildName: 'chatbotLabelPosition'
    // });
    this.integrationList.push({
      label: data?.contactFormLabel,
      index: data?.contactFormLabelPosition ?? 4,
      labelFeildName: 'contactFormLabelPosition',
      featureName: 'isContactFormSelected'
    });

    this.integrationList.push({
      label: data?.composerLabel,
      index: data?.composerLabelPosition ?? 2,
      labelFeildName: 'composerLabelPosition',
      featureName: 'isSymptomComposerSelected'
    });

    this.integrationList.push({
      label: data?.clinicReviewLabel ?? 'Clinic Review',
      index: data?.clinicReviewLabelPosition ?? 4,
      labelFeildName: 'clinicReviewLabelPosition',
      featureName: 'isClinicReviewSelected'
    });

    this.chatbotData = {
      label: data?.chatbotLabel,
      index: 5,
      labelFeildName: 'chatbotLabelPosition'
    };
    console.log(this.integrationList);
    this.integrationList.sort(function (a: any, b: any) {
      return a.index - b.index;
    });
  }

  submitForm(formInfo?: any) {
    console.log(this.integrationForm.value);
    const formData = formInfo ?? this.integrationForm.value;
    formData.layoutType = this.layoutType;

    if (this.integrationId) {
      this.integrationFeatureService
        .updateIntegrationFeature(this.integrationId, formData)
        .then(
          () => {
            this.loadIntegrationFeatures();

            if (this.integrationPreviewUrl.includes('&abc=123')) {
              this.integrationPreviewUrl = this.integrationPreviewUrl.replace(
                '&abc=123',
                ''
              );
            } else {
              this.integrationPreviewUrl =
                this.integrationPreviewUrl + '&abc=123';
            }
            this.alertService.success('Feature updated successfully !!');
          },
          () => {
            this.alertService.error('Error while upadting feature !!');
          }
        );
    } else {
      this.integrationFeatureService.createIntegrationFeature(formData).then(
        () => {
          this.loadIntegrationFeatures();
          this.alertService.success('Feature created successfully !!');
        },
        () => {
          this.alertService.error('Error while creating feature !!');
        }
      );
    }
  }

  editLabel(labelName: any) {
    console.log('labelname', labelName);
    this.currenEditingLabelName = labelName;
    this.displayModal = true;
    this.showModal = true;
    this.labelName = this.integrationForm.value[labelName];
  }

  hideModal() {
    this.modalClosed.emit({ close: true });
    this.showModal = false;
  }

  saveLabel() {
    this.integrationForm.value[this.currenEditingLabelName] = this.labelName;
    console.log(this.integrationForm.value, this.labelName);
    this.displayModal = false;
    this.showModal = false;
    this.submitForm();
  }

  drop(event: any) {
    //console.log("Drop Question =>", event.container.data, event.previousIndex, event.currentIndex);
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }

    const questionOrders: any = [];
    console.log(this.integrationForm.value);
    const formData = this.integrationForm.value;
    console.log(event.container.data);
    event.container.data.forEach((element: any, index: any) => {
      this.integrationForm.value[element?.labelFeildName] = index + 1;
      questionOrders.push({
        label: element.label,
        index: index,
        labelFeildName: element?.labelFeildName
      });
    });
    this.integrationList = questionOrders;
    console.log(formData);
    console.log(this.integrationList, questionOrders);

    this.submitForm();
  }

  moveDown(menu: any) {
    console.log(this.integrationList);
    let currentIndex = 0;
    for (let i = 0; i < this.integrationList.length; i++) {
      if (menu.index == this.integrationList[i].index) {
        currentIndex = i;
        break;
      }
    }

    if (currentIndex == this.integrationList.length - 1) {
      // nothing to do
    } else {
      moveItemInArray(this.integrationList, currentIndex, currentIndex + 1);
      this.updateRow();
    }
    // console.table(this.integrationList);
  }

  moveUp(menu: any) {
    let currentIndex = 0;
    for (let i = 0; i < this.integrationList.length; i++) {
      if (menu.index == this.integrationList[i].index) {
        currentIndex = i;
        break;
      }
    }

    if (currentIndex == 0) {
      // nothing to do
    } else {
      moveItemInArray(this.integrationList, currentIndex, currentIndex - 1);
      this.updateRow();
    }
  }

  updateRow() {
    // const menus = this.integrationList.map((item: any, index: number) => ({
    //   ...item,
    //   index: index
    // }));

    const questionOrders: any = [];
    this.integrationList.forEach((element: any, index: any) => {
      this.integrationForm.value[element?.labelFeildName] = index + 1;
      questionOrders.push({
        label: element.label,
        index: index,
        labelFeildName: element?.labelFeildName
      });
    });
    this.submitForm();
  }

  setLayoutType(layoutType: string) {
    this.layoutType = layoutType;
    if (this.layoutType === 'vertical') {
      this.maxSelectedFeatureCount = 3;
    } else {
      this.maxSelectedFeatureCount = 4;
    }
    this.submitForm();
  }

  onShowType($event: any, flag: string) {
    console.log($event, flag);
    this.integrationForm.value[flag] = $event.checked;
  }

  handleCheckboxSelection(flag: any, event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.selectedFeatureObj[flag] = isChecked;
    if (isChecked) {
      this.selectedFeatureCount++;
    } else {
      this.selectedFeatureCount--;
    }
    console.log(this.selectedFeatureCount, this.selectedFeatureObj);
  }
  stopPropagation(event: MouseEvent): void {
    event.stopPropagation();
  }

  handleContentChange(content: string) {
    // Do something with the received content
    console.log(content);
    this.integrationForm.patchValue({
      customCssForButton: content
    });
  }
}
