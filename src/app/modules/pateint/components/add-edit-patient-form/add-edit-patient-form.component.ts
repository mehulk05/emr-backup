import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import moment from 'moment';
import { RegexEnum } from 'src/app/shared/common/constants/regex';
import { AppointmentPatientDetail } from 'src/app/shared/models/appointment/AppointmentPatientDto';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
import { PatientService } from '../../services/patient.service';

@Component({
  selector: 'app-add-edit-patient-form',
  templateUrl: './add-edit-patient-form.component.html',
  styleUrls: ['./add-edit-patient-form.component.css']
})
export class AddEditPatientFormComponent implements OnInit {
  @Input() patientId!: number;
  genderValues = ['Male', 'Female'];
  patientForm!: FormGroup;
  patientData!: AppointmentPatientDetail;

  constructor(
    public formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private patientService: PatientService,
    private toastService: ToasTMessageService
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
      username: ['', []],
      isSmsOptedIn: [true, []]
    });
  }

  get f() {
    return this.patientForm.controls;
  }

  submitForm() {
    console.log(this.patientForm.value);
    this.patientForm.patchValue({
      username: this.patientForm.value.email
    });

    const date = this.patientForm.value.dateOfBirth;
    console.log(date);
    if (date) {
      const formattedDate = moment(date).format('YYYY-MM-DD HH:mm:ss');
      console.log(formattedDate, moment.utc(formattedDate).format());
      this.patientForm.value.dateOfBirth = moment.utc(formattedDate).format();
    }
    const formData = this.patientForm.value;
    if (this.patientId) {
      this.patientService.updatePatient(this.patientId, formData).then(
        (response: any) => {
          // console.log(response)
          // this.toastService.success('Patient updated successfully.');
          // this.goBack();

          if (response?.statusCode == 200) {
            this.toastService.success('Patient saved successfully.');
            this.goBack();
          } else if (response?.statusCode == 500) {
            this.toastService.error(response?.message);
          }
        },
        (error: any) => {
          console.log(error);
          this.toastService.error(
            'User with provided email address already exists. Please use different email address.'
          );
        }
      );
    } else {
      this.patientService.createPatient(formData).then(
        (response: any) => {
          console.log(response);

          if (response?.statusCode == 200) {
            this.toastService.success('Patient saved successfully.');
            this.goBack();
          } else if (response?.statusCode == 500) {
            this.toastService.error(response?.message);
          }
        },
        (error: any) => {
          console.log(error);
          if (error?.errorMessage) {
            this.toastService.error(
              'User with provided email address already exists. Please use different email address.'
            );
          }
        }
      );
    }
  }

  goBack = () => {
    this.router.navigate(['/patients'], {
      state: { isDataModified: false }
    });
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
      isSmsOptedIn: this.patientData?.isSmsOptedIn
    });
  }
}
