import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryListDetailed } from 'src/app/shared/models/category/categories';
import { ConsentListOptimized } from 'src/app/shared/models/consents/consentList';
import { QuestionarieListOptimized } from 'src/app/shared/models/questionarie/questionarieList';
import { ServiceList } from 'src/app/shared/models/services/OptimizedService';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
import { ClinicService } from '../../../clinic/services/clinic.service';
import { CategoryService } from '../../../service-category/services/category.service';
import { MService } from '../../service/mservice.service';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { RegexEnum } from 'src/app/shared/common/constants/regex';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';

@Component({
  selector: 'app-add-edit-service-form',
  templateUrl: './add-edit-service-form.component.html',
  styleUrls: ['./add-edit-service-form.component.css']
})
export class AddEditServiceFormComponent implements OnInit {
  mediafiles: any;
  images: any;
  serviceForm!: FormGroup;
  serviceId: any = null;
  clinicList: any = [];
  questionnaireList: QuestionarieListOptimized[] = [];
  serviceCategories: CategoryListDetailed[] = [];
  consentList: ConsentListOptimized[] = [];
  allServiceList: ServiceList[] = [];
  showAiModal = false;
  aiContent = '';
  serviceTimeDurations = [
    5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95,
    100, 105, 110, 115, 120, 125, 130, 135, 140, 145, 150, 155, 160, 165, 170,
    175, 180, 210, 240, 250, 260, 270
  ];
  file: any;
  userContent = true;
  alContentData = false;
  showModalForImage: boolean = false;
  @ViewChild('myFileInput') myFileInput: any;
  isImageUploading: boolean = false;
  croppedImage: any = '';
  imageChangedEvent: any = '';
  uploadFile: any;
  disableAdd: boolean = true;
  duplicateLabel: boolean = false;
  labels: any = [];
  submitted: boolean = false;
  imageRemoved: boolean = false;
  isDepositAllowed: boolean = false;
  isPreBookingCostAllowed: boolean = true;
  title: string = 'Create Service';
  message = '';
  category = 'Write the summary within 2500 characters';
  totalCharacterLength = 2500;
  constructor(
    public formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private clinicService: ClinicService,
    private categoryService: CategoryService,
    private toastService: ToasTMessageService,
    private mService: MService,
    private localStorageService: LocalStorageService
  ) {}

  ngOnInit(): void {
    this.serviceForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      //serviceCategoryId: ['', [Validators.required]],
      serviceCategoryId: ['', [Validators.required]],
      durationInMinutes: ['0', [Validators.required]],
      serviceCost: [
        '0',
        [Validators.required, Validators.pattern(RegexEnum.amount)]
      ],
      description: [''],
      serviceURL: [
        '',
        [
          Validators.pattern(
            '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?'
          )
        ]
      ],
      consentIds: [[], []],
      questionnaireIds: [[], []],
      clinicIds: [[], [Validators.required]],
      file: ['', []],
      files: ['', []],
      preBookingCost: ['0', [Validators.pattern(RegexEnum.amount)]],
      imageRemoved: [false, []],
      isPreBookingCostAllowed: [false, []],
      showInPublicBooking: [false, []],
      priceVaries: [false, []],
      showDepositOnPublicBooking: [false, []],
      disableBookingWithChatbot: [false, []]
    });
    this.loadConsents();
    this.loadQuestionnaires();
    this.loadClinics();
    this.loadServices();
    this.serviceId = this.activatedRoute.snapshot.params.serviceId;
    if (this.serviceId) {
      this.title = 'Edit Service';
      this.loadServiceById();
    }
  }

  loadServiceById() {
    this.mService.getService(this.serviceId).then(
      (response: any) => {
        const clinicIds: any[] = [];
        const constents: any = [];
        const questionnaires: any = [];
        response.clinics.map((clinic: any) => {
          clinicIds.push(clinic.clinic.id);
        });

        response.consents.map((consent: any) => {
          constents.push(consent.id);
        });

        response.questionnaires.map((questionnaire: any) => {
          questionnaires.push(questionnaire.id);
        });

        this.loadClinicServiceCategories(clinicIds);
        let preBookingCosthold;
        if (response.preBookingCost == 0) {
          preBookingCosthold = response.clinics[0].clinic.defaultPreBookingCost;
        } else {
          preBookingCosthold = response.preBookingCost;
        }

        this.serviceForm.patchValue({
          name: response.name,
          serviceCategoryId: response.serviceCategory.id,
          durationInMinutes: response.durationInMinutes,
          serviceCost: response.serviceCost,
          description: response.description,
          serviceURL: response.serviceURL,
          consentIds: constents,
          questionnaireIds: questionnaires,
          clinicIds: clinicIds,
          preBookingCost: preBookingCosthold,
          isPreBookingCostAllowed: response.isPreBookingCostAllowed,
          showInPublicBooking: response.showInPublicBooking,
          priceVaries: response.priceVaries,
          showDepositOnPublicBooking: response.showDepositOnPublicBooking,
          alDescription: response.alDescription,
          disableBookingWithChatbot: response.disableBookingWithChatbot
        });

        if (response != null && response.isPreBookingCostAllowed) {
          this.isDepositAllowed = true;
        } else {
          this.isDepositAllowed = false;
        }

        if (response.priceVaries) {
          this.isPreBookingCostAllowed = false;
        }

        if (response != null && response.imageUrl != null) {
          var image = { id: '', url: '' };
          image.url = response.imageUrl;
          this.uploadFile = response.imageUrl;
          image.id = '0';
          this.mediafiles = image;
        }
      },
      () => {
        this.toastService.error('Unable to load service.');
      }
    );
  }

  loadConsents() {
    this.mService.getAllConsentList().then(
      (response: any) => {
        const bdData: any =
          this.localStorageService.readStorage('businessData');
        if (bdData.dentalSpecializationOnly && !bdData.otherSpecialization) {
          this.consentList = response.filter(
            (consent: any) =>
              consent.specialization &&
              consent.specialization.name.toLowerCase() == 'dental'
          );
        } else this.consentList = response;
      },
      () => {
        this.toastService.error('Unable to load consents.');
      }
    );
  }

  loadQuestionnaires() {
    this.mService.getAllQuestionnaireList().then(
      (response: any) => {
        this.questionnaireList = response;
      },
      () => {
        this.toastService.error('Unable to load questionnaires.');
      }
    );
  }

  loadClinics() {
    this.clinicService.getClinics().then(
      (response: any) => {
        this.clinicList = response;
        if (this.serviceId == null && response.length == 1) {
          const selectedClinics = [];
          selectedClinics.push(response[0]);
          this.serviceForm.patchValue({ clinics: selectedClinics });

          const clinicIds = [];
          clinicIds.push(selectedClinics[0].id);
          this.loadClinicServiceCategories(clinicIds);
        }
      },
      () => {
        this.toastService.error('Unable to load clinics.');
      }
    );
  }

  loadClinicServiceCategories(clinicIds: any) {
    if (clinicIds != '') {
      this.categoryService.getClinicServiceCategories(clinicIds).then(
        (response: any) => {
          this.serviceCategories = response;
        },
        () => {
          this.toastService.error('Unable to load clinic services.');
        }
      );
    } else {
      this.serviceCategories = [];
    }
  }

  onClinicSelect(e: any) {
    this.loadClinicServiceCategories(e.value);
  }

  loadServices() {
    this.mService.getAllServices().then((response: any) => {
      this.allServiceList = response.serviceList;
      this.labels = response.serviceList;
    });
  }

  saveImage() {
    this.imageRemoved = false;
    this.uploadFile = this.croppedImage;
    this.file = this.croppedImage;
    this.images = this.croppedImage;
    this.cancelImageUpload();
  }

  fileChangeEvent(e: any) {
    this.showModalForImage = true;
    this.imageChangedEvent = e;
  }

  onPriceVaries(values: any) {
    if (values.currentTarget.checked) {
      this.isPreBookingCostAllowed = false;
      this.isDepositAllowed = false;
      this.serviceForm.patchValue({
        isPreBookingCostAllowed: false,
        showDepositOnPublicBooking: false
      });
    } else {
      this.isPreBookingCostAllowed = true;
    }
  }

  onChange(values: any) {
    if (values.currentTarget.checked) {
      this.isDepositAllowed = true;
    } else {
      this.isDepositAllowed = false;
      this.serviceForm.patchValue({
        showDepositOnPublicBooking: false
      });
    }
  }

  get f() {
    return this.serviceForm.controls;
  }

  goBack = () => {
    this.router.navigate(['/services'], {
      state: { isDataModified: false }
    });
  };
  submitForm() {
    this.serviceForm.patchValue({
      imageRemoved: this.imageRemoved
    });
    const formData = this.serviceForm.value;
    if (
      this.isDepositAllowed &&
      formData.preBookingCost > formData.serviceCost
    ) {
      this.toastService.error(
        'Deposit cost cannot be greater than the service cost'
      );
      return;
    }

    if (
      formData.isPreBookingCostAllowed &&
      (!formData.preBookingCost || formData.preBookingCost == 0)
    ) {
      this.toastService.error('Enter deposit cost');
      return;
    }
    if (!this.isDepositAllowed) {
      formData.preBookingCost = 0;
    }
    this.submitted = true;
    if (this.serviceId) {
      this.mService.updateService(this.serviceId, formData).then(
        () => {
          if (this.images) {
            const formData1 = new FormData();
            if (this.images) {
              formData1.append('file', base64ToFile(this.images));
            } else {
              formData1.append('file', this.images);
            }
            this.mService.uploadImage(this.serviceId, formData1).then(
              () => {
                this.toastService.success('Service updated successfully.');
                this.router.navigate(['/services']);
              },
              () => {
                this.toastService.error('Unable to save service.');
              }
            );
          } else {
            this.toastService.success('Service updated successfully.');
            this.router.navigate(['/services']);
          }
        },
        () => {
          this.toastService.error('Unable to save service.');
        }
      );
    } else {
      const serviceName = this.serviceForm.controls.name.value;
      var index = this.allServiceList.findIndex(
        (x: any) =>
          x.name.toLowerCase().trim() === serviceName.toLowerCase().trim()
      );
      if (index == 0 || index > 0) {
        this.toastService.error('Service with Same name already exist');
      } else {
        this.mService.createService(formData).then(
          (response: any) => {
            if (this.images) {
              const formData1 = new FormData();
              formData1.append('file', base64ToFile(this.images));

              this.mService.uploadImage(response.id, formData1).then(
                () => {
                  this.toastService.success('Service saved successfully.');
                  this.router.navigate(['/services']);
                },
                () => {
                  this.toastService.error('Unable to save service.');
                }
              );
            } else {
              this.toastService.success('Service saved successfully.');
              this.router.navigate(['/services']);
            }
          },
          () => {
            this.toastService.error('Unable to save service.');
          }
        );
      }
    }
  }

  onLabelAdd = ($event: any) => {
    const name = $event.target?.value;
    if (this.labels.some((label: any) => label.name == name)) {
      this.duplicateLabel = true;
    } else {
      this.duplicateLabel = false;
    }
    this.disableAdd = name === '' || this.duplicateLabel;
  };

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

  cancelImageUpload() {
    this.showModalForImage = false;
    this.myFileInput.nativeElement.value = '';
  }

  removeFile() {
    this.uploadFile = '';
    this.images = '';
    this.imageRemoved = true;
  }

  aiModelClose(event: any) {
    if (event?.replace) {
      this.serviceForm.patchValue({
        description: event.replaceData
      });
    }
    this.showAiModal = false;
  }
}

export function base64ToFile(base64Image: string): Blob {
  const split = base64Image.split(',');
  const type = split[0].replace('data:', '').replace(';base64', '');
  const byteString = atob(split[1]);
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i += 1) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], { type });
}
