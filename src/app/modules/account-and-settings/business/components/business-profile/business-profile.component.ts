/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  ViewChild
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FileSaverService } from 'ngx-filesaver';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { AuthService } from 'src/app/modules/authentication/services/auth.service';
import { ConvertImageService } from 'src/app/shared/services/image-utils/convertImage.service';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
import { BusinessService } from '../../services/business.service';

@Component({
  selector: 'app-business-profile',
  templateUrl: './business-profile.component.html',
  styleUrls: ['./business-profile.component.css']
})
export class BusinessProfileComponent implements OnInit, OnChanges {
  @Input() loggedInUser: any;
  @Input() businessInfo: any;
  showImportModal: boolean = false;
  businessForm!: FormGroup;

  @ViewChild('myFileInput') myFileInput: any;
  @ViewChild('logoImg') logoImg!: ElementRef;

  isImageUploading: boolean = false;
  imageChangedEvent: any = '';
  croppedImage: any = '';
  showModalForImage: boolean = false;
  duplicateLabel: boolean = false;
  labels: any = [];
  disableAdd: boolean = true;

  logoUrl: any;
  showImgWarning: boolean = false;

  constructor(
    public formBuilder: FormBuilder,
    private toastService: ToasTMessageService,
    private businessService: BusinessService,
    private fileSaverService: FileSaverService,
    private convertImageService: ConvertImageService,
    private authService: AuthService,
    private localStorageService: LocalStorageService
  ) {
    this.businessForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      trainingBusiness: [false, []],
      subDomainName: ['', [Validators.required]],
      showNotesPopupOnLeadLoad: [false, []],
      showPatientDetailsOnSinglePage: [false, []],
      paymentRefundable: [true, []],
      refundablePaymentPercentage: [
        0.0,
        [Validators.required, Validators.min(0), Validators.max(100)]
      ],
      paymentRefundableBeforeHours: [24, [Validators.required]],
      landingPageTrackCode: ['', []],
      googleAnalyticsGlobalCode: ['', []],
      googleAnalyticsGlobalCodeUrl: ['', []]
    });
  }

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngOnInit(): void {
    //this.loadBusiness();
  }
  get f() {
    return this.businessForm.controls;
  }

  ngOnChanges(): void {
    if (this.businessInfo && this.businessInfo?.id) {
      setTimeout(() => {
        this.setBusinessInfo();
      }, 100);
    }
  }

  setBusinessInfo() {
    console.log(this.businessInfo);
    this.businessForm?.patchValue({
      name: this.businessInfo?.name,
      trainingBusiness: this.businessInfo?.trainingBusiness,
      subDomainName: this.businessInfo?.subDomainName,
      landingPageTrackCode: this.businessInfo?.landingPageTrackCode,
      googleAnalyticsGlobalCode: this.businessInfo?.googleAnalyticsGlobalCode,
      googleAnalyticsGlobalCodeUrl:
        this.businessInfo?.googleAnalyticsGlobalCodeUrl,
      showNotesPopupOnLeadLoad: this.businessInfo?.showNotesPopupOnLeadLoad,
      showPatientDetailsOnSinglePage:
        this.businessInfo?.showPatientDetailsOnSinglePage,

      paymentRefundable: this.businessInfo?.paymentRefundable,
      paymentRefundableBeforeHours:
        this.businessInfo?.paymentRefundableBeforeHours,
      refundablePaymentPercentage:
        this.businessInfo?.refundablePaymentPercentage
    });
    if (this.businessInfo?.logoUrl) {
      this.logoUrl = this.businessInfo?.logoUrl + '?t=' + new Date();
    }
    this.authService.emitBuisnessInfoChange(this.businessInfo);
  }

  openImportFile() {
    this.showImportModal = true;
  }

  async submitForm() {
    // Check if the form is invalid
    if (this.businessForm.invalid) {
      return;
    }

    // Validate subDomainName
    const format = /[^a-zA-Z0-9_-]+/;
    if (this.businessForm.value.subDomainName.match(format)) {
      this.toastService.error(
        'Special character and space not allowed in subdomain name'
      );
      return;
    }

    // Extract form data and business info
    const formData = this.businessForm.value;
    // const bigData = this.localStorageService.readStorage('businessInfo') || [];

    // // Update bigData with formData
    // Object.keys(bigData).forEach((key) => {
    //   if (formData[key] !== undefined) {
    //     bigData[key] = formData[key];
    //   }
    // });

    try {
      const res = this.businessService.patchUpdateBusinessInfo(
        this.businessInfo.id,
        formData
      );
      const businessData = this.localStorageService.readStorage('businessData');

      // Step 2: Update only the keys present in the form with the corresponding values
      const updatedBusinessData = { ...businessData, ...formData };

      this.updateLocalStorageItem('businessInfo', updatedBusinessData);
      this.updateLocalStorageItem('businessData', updatedBusinessData);
      console.log(res);
    } catch (e) {
      console.log(e);
    }
    // try {
    //   // Update business name
    //   await this.updateBusinessInfo('name', formData.name, 'Name Updated');

    //   // Update subDomainName
    //   await this.updateBusinessSubdomain(
    //     'subDomainName',
    //     formData.subDomainName,
    //     'SubDomainName Updated'
    //   );

    //   // Update business configuration
    //   const configBody = {
    //     showNotesPopupOnLeadLoad: formData.showNotesPopupOnLeadLoad,
    //     showPatientDetailsOnSinglePage: formData.showPatientDetailsOnSinglePage
    //   };
    //   await this.updateBusinessConfiguration(
    //     configBody,
    //     'Configuration Updated'
    //   );

    //   // Update refund configuration if applicable
    //   if (
    //     formData.refundablePaymentPercentage &&
    //     formData.paymentRefundableBeforeHours
    //   ) {
    //     const refundBody = {
    //       paymentRefundable: formData.paymentRefundable,
    //       refundablePaymentPercentage: formData.refundablePaymentPercentage,
    //       paymentRefundableBeforeHours: formData.paymentRefundableBeforeHours
    //     };
    //     await this.updateBusinessPaymentRefund(
    //       refundBody,
    //       'Refund config Updated'
    //     );
    //   }

    //   // Update tracking code
    //   const trackingCodeData =
    //     await this.businessService.updateBusinessTrackingCode(
    //       this.businessInfo.id,
    //       formData
    //     );
    //   console.log('Tracking code Updated');
    //   console.log('VALUE OF CHECKBOX', formData.paymentRefundable);
    //   this.updateLocalStorageItem('businessInfo', formData);
    //   this.updateLocalStorageItem('businessData', formData);

    //   this.toastService.success('Business Information Updated Successfully!');
    //   const bdData = this.localStorageService.readStorage('businessData');
    //   this.authService.currentBusinessSubject.next(bdData);
    // } catch (error) {
    //   console.error(error);
    //   this.toastService.error('Unable to update information.');
    // }
  }

  // Utility function to update business information
  async updateBusinessInfo(field: string, value: any, logMessage: string) {
    const body: any = { [field]: value };
    const data = await this.businessService.updateBusiness(
      this.businessInfo.id,
      body
    );
    this.authService.emitBuisnessInfoChange(data);
    console.log(logMessage);
    this.updateLocalStorageItem('businessInfo', body);
    this.updateLocalStorageItem('businessData', body);
  }

  // Utility function to update business subDomain
  async updateBusinessSubdomain(field: string, value: any, logMessage: string) {
    const body: any = { [field]: value };
    const data = await this.businessService.updateBusinessSubdomain(
      this.businessInfo.id,
      body
    );
    // this.authService.emitBuisnessInfoChange(data);
    console.log(logMessage);
    this.updateLocalStorageItem('businessInfo', body);
    this.updateLocalStorageItem('businessData', body);
  }

  // Utility function to update business configuration
  async updateBusinessConfiguration(body: any, logMessage: string) {
    const data = await this.businessService.updateBusinessConfiguration(
      this.businessInfo.id,
      body
    );
    console.log(logMessage);
    this.updateLocalStorageItem('businessInfo', body);
    this.updateLocalStorageItem('businessData', body);
  }

  // Utility function to update business payment refund configuration
  async updateBusinessPaymentRefund(body: any, logMessage: string) {
    const data = await this.businessService.updateBusinessPaymentRefund(
      this.businessInfo?.id,
      body
    );
    console.log(logMessage);
    this.updateLocalStorageItem('businessInfo', body);
    this.updateLocalStorageItem('businessData', body);
  }

  updateLocalStorageItem(storageKey: string, source: any) {
    const storedData = this.localStorageService.readStorage(storageKey);
    const updatedData = { ...storedData, ...source };
    this.localStorageService.storeItem(storageKey, updatedData);
  }

  /* -------------------------------------------------------------------------- */
  /*                            Image upload function                           */
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
    this.businessService
      .uploadLogo(this.loggedInUser.businessId, formData)
      .then(
        (response: any) => {
          if (response.logoUrl) {
            this.logoUrl = response.logoUrl + '?t=' + new Date();
          }

          response.logoUrl = this.logoUrl;
          // this.authService.emitBuisnessInfoChange(response);
          this.authService.currentBusinessSubject.next(response);
          this.localStorageService.storeItem('businessData', response);
          this.toastService.success('File uploaded successfully.');
          this.cancelImageUpload();
        },
        () => {
          this.toastService.error('Unable to upload file.');
          this.cancelImageUpload();
        }
      );
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

  loadImg(e: any) {
    const img: any = this.logoImg.nativeElement;
    if (img.height > 120) {
      this.showImgWarning = true;
    } else {
      this.showImgWarning = false;
    }
  }

  onLabelAdd = ($event: any) => {
    const name = $event.target?.value;
    console.log('name', name);
    if (
      this.labels.some(
        (label: any) => label.name.toLowerCase() == name.toLowerCase()
      )
    ) {
      this.duplicateLabel = true;
    } else {
      this.duplicateLabel = false;
    }
    console.log('dupli', this.duplicateLabel);
    this.disableAdd = name === '' || this.duplicateLabel;
  };

  /* -------------------------------------------------------------------------- */
  /*                                CSV FUNCTION                                */
  /* -------------------------------------------------------------------------- */
  downloadToCSV() {
    const name = this.businessInfo?.name;
    this.businessService.exportFile().then(
      (response: any) => {
        this.fileSaverService.save(
          response,
          'Onboarding for ' + name + '.xlsx'
        );
      },
      () => {
        this.toastService.error('Unable to download file.');
      }
    );
  }

  onCloseImportFileModal(e: any) {
    this.showImportModal = false;
    if (e.isImport) {
      this.uploadFile(e.isImport);
    }
  }

  uploadFile(file: any) {
    const formData = new FormData();
    formData.append('file', file);
    this.businessService.uploadFile(file).then(
      () => {
        this.toastService.success('File uploaded successfully.');
      },
      (error) => {
        this.toastService.error('Unable to upload file.');
      }
    );
  }

  onCheckboxValueChanged(newValue: boolean, key: string): void {
    // Update the value in the form control
    this.businessForm.patchValue({
      [key]: newValue
    });
  }

  onCheckboxValueChangedd(newValue: boolean, key: string): void {
    // Update the value in the form control
    this.businessForm.patchValue({
      [key]: newValue
    });
  }
}
