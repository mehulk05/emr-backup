import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import moment from 'moment';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { AuthService } from 'src/app/modules/authentication/services/auth.service';
import { RegexEnum } from 'src/app/shared/common/constants/regex';
import { AppointmentPatientDetail } from 'src/app/shared/models/appointment/AppointmentPatientDto';
import { ConvertImageService } from 'src/app/shared/services/image-utils/convertImage.service';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
import { PatientProfileService } from '../../service/patient-profile.service';

@Component({
  selector: 'app-patient-profile',
  templateUrl: './patient-profile.component.html',
  styleUrls: ['./patient-profile.component.css']
})
export class PatientProfileComponent implements OnInit {
  profileImageUrl: any =
    'https://g99plus.b-cdn.net/AEMR/assets/img/profileDefault.png';
  showModalForImage: boolean = false;
  isImageUploading: boolean = false;
  @ViewChild('myFileInput') myFileInput: any;
  imageChangedEvent: any = '';
  croppedImage: any = '';
  @Input() patientId: any;
  genderValues = ['Male', 'Female'];
  patientForm!: FormGroup;
  patientData!: AppointmentPatientDetail;

  constructor(
    public formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private convertImageService: ConvertImageService,
    private toastService: ToasTMessageService,
    private patientService: PatientProfileService,
    private localStorgaeService: LocalStorageService
  ) {}

  ngOnInit(): void {
    this.initializepatientForm();
    console.log(this.patientId);
    if (this.patientId) {
      this.patientForm.controls['email'].disable();
      this.getPaitentDetails();
    }
  }

  initializepatientForm() {
    this.patientForm = this.formBuilder.group({
      firstName: [
        '',
        [Validators.required, Validators.pattern(RegexEnum.textFeild)]
      ],
      lastName: [
        '',
        [Validators.required, Validators.pattern(RegexEnum.textFeild)]
      ],
      email: ['', [Validators.required, Validators.pattern(RegexEnum.email)]],
      phone: ['', [Validators.required, Validators.pattern(RegexEnum.mobile)]],
      gender: [null, [Validators.required]],
      dateOfBirth: ['', []],
      addressLine1: ['', []],
      addressLine2: ['', []],
      city: ['', []],
      state: ['', []],
      country: ['', []],
      zipcode: ['', []],
      notes: ['', []],
      profileImageUrl: [''],
      username: ['', []],
      patientStatus: ['NEW']
    });
  }

  get f() {
    return this.patientForm.controls;
  }

  clearDate(e: any) {
    console.log(e);
  }

  submitForm() {
    console.log(this.patientForm.value);
    this.patientForm.patchValue({
      username: this.patientForm.value.email
    });

    const formData = this.patientForm.value;

    if (formData.dateOfBirth) {
      const formattedDate = formData.dateOfBirth;
      moment(formData.dateOfBirth).format('YYYY-MM-DD HH:mm:ss');

      formData.dateOfBirth = moment.utc(formattedDate).format();
    }

    if (this.patientId) {
      this.patientService.updatePatient(this.patientId, formData).then(
        () => {
          this.toastService.success('Client updated successfully.');
          this.goBack();
        },
        () => {
          this.toastService.error(
            'User with provided email address already exists. Please use different email address.'
          );
        }
      );
    }
  }

  goBack = () => {
    this.getPaitentDetails();
  };

  async getPaitentDetails() {
    this.patientData = (await this.patientService.getPatientOptimized(
      this.patientId
    )) as any;
    // const formattedDate = moment(this.patientData?.dateOfBirth)
    //   .local()
    //   .format('YYYY-MM-DD');
    // console.log(this.patientData, formattedDate);

    // const formattedDate = moment(this.patientData?.dateOfBirth).toDate();

    let formattedDate;
    if (this.patientData.dateOfBirth != null) {
      formattedDate = moment(this.patientData?.dateOfBirth).toDate();
    }
    this.patientForm.patchValue({
      firstName: this.patientData?.firstName,
      lastName: this.patientData?.lastName,
      email: this.patientData?.email,
      phone: this.patientData?.phone,
      gender: this.patientData?.gender,
      dateOfBirth: formattedDate,
      addressLine1: this.patientData?.addressLine1,
      addressLine2: this.patientData?.addressLine2,
      city: this.patientData?.city,
      state: this.patientData?.state,
      country: this.patientData?.country,
      zipcode: this.patientData?.zipcode,
      notes: this.patientData?.notes,
      profileImageUrl: this.patientData?.profileImageUrl,
      patientStatus: this.patientData?.patientStatus
    });
    this.profileImageUrl = this.patientData?.profileImageUrl;
  }

  fileChangeEvent(e: any) {
    //console.log(e);
    this.showModalForImage = true;
    this.imageChangedEvent = e;
  }

  cancelImageUpload() {
    this.showModalForImage = false;
    this.myFileInput.nativeElement.value = '';
  }

  saveImage(newUser?: any) {
    if (this.patientId && this.patientId !== 0) {
      //console.log('here');
      const formData = new FormData();
      formData.append(
        'file',
        this.convertImageService.base64ToFile(this.croppedImage)
      );
      this.patientService
        .uploadImage(this.patientId, formData)
        .then((response: any) => {
          this.profileImageUrl = response.profileImageUrl + '?t=' + new Date();
          if (!newUser) {
            var userResp: any = {
              firstName: response.firstName,
              lastName: response.lastName,
              profileImageUrl: this.profileImageUrl,
              id: response.id
            };
            this.sendMessage(userResp);
            this.showModalForImage = false;
          } else {
            this.goBack();
          }
          this.toastService.success('Image updated successfully!!');
        })
        .catch((e: any) => {
          console.log(e);
          this.toastService.error('Error while uploading image');
        });
    } else {
      this.profileImageUrl = this.croppedImage;
      this.showModalForImage = false;
    }
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

  sendMessage(profile: any) {
    const currentUser = this.localStorgaeService.readStorage('currentUser');
    if (this.patientId == currentUser.id) {
      this.authService.sendMessage(profile);
      const currentUser = this.localStorgaeService.readStorage('currentUser');
      currentUser['firstName'] = profile?.firstName ?? currentUser['firstName'];
      currentUser['lastName'] = profile?.lastName ?? currentUser['lastName'];
      currentUser['profileImageUrl'] =
        profile?.profileImageUrl ?? currentUser['profileImageUrl'];
      this.localStorgaeService.storeItem('currentUser', currentUser);
    }
  }

  deleteProfile() {
    console.log('delete');
    this.patientService.deleteProfile(this.patientId).then(
      (response: any) => {
        console.log('re', response);
        this.profileImageUrl = null;
        const currentUser = this.localStorgaeService.readStorage('currentUser');
        var userResp: any = {
          firstName: currentUser.firstName,
          lastName: currentUser.lastName,
          profileImageUrl: this.profileImageUrl,
          id: currentUser.id
        };
        this.sendMessage(userResp);
        this.toastService.success('Deleted successfully.');
      },
      () => {
        this.toastService.error('Unable to delete.');
      }
    );
  }
}
