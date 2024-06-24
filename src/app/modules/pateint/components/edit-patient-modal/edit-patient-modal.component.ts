import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  OnChanges,
  ViewChild
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import moment from 'moment';
import { RegexEnum } from 'src/app/shared/common/constants/regex';
import { AppointmentPatientDetail } from 'src/app/shared/models/appointment/AppointmentPatientDto';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
import { PatientService } from '../../services/patient.service';

@Component({
  selector: 'app-edit-patient-modal',
  templateUrl: './edit-patient-modal.component.html',
  styleUrls: ['./edit-patient-modal.component.css']
})
export class EditPatientModalComponent implements OnInit, OnChanges {
  @Input() showModal: boolean = false;
  @Input() modalData: any;
  @Output() modalClosed = new EventEmitter<any>();
  @ViewChild('pcalendar') pcalendar: any;
  genderValues = ['Male', 'Female'];
  patientForm!: FormGroup;
  patientData!: AppointmentPatientDetail;
  patientId: any;
  selectedStatus: String;
  patientStatus: any = ['NEW', 'EXISTING'];
  constructor(
    public formBuilder: FormBuilder,
    private patientService: PatientService,
    private toastService: ToasTMessageService
  ) {}

  ngOnInit(): void {
    this.initializepatientForm();
    console.log(this.patientId);
    this.selectedStatus = this.modalData.patientStatus;
  }

  ngOnChanges(): void {
    if (this.modalData) {
      this.patientId = this.modalData;
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
      patientStatus: ['', []],
      isSmsOptedIn: [true, []]
    });
  }

  get f() {
    return this.patientForm.controls;
  }

  submitForm() {
    console.log(this.patientForm.value);
    this.patientForm.patchValue({
      username: this.patientForm.value.email,
      patientStatus: this.selectedStatus
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
        () => {
          this.toastService.success('Patient updated successfully.');
          this.modalClosed.emit({ close: false, isEdit: true });
          this.showModal = false;
        },
        () => {
          this.toastService.error(
            'User with provided email address already exists. Please use different email address.'
          );
        }
      );
    } else {
      this.patientService.createPatient(formData).then(
        () => {
          this.toastService.success('Patient saved successfully.');
          this.showModal = false;
        },
        () => {
          this.toastService.error(
            'User with provided email address already exists. Please use different email address.'
          );
        }
      );
    }
  }

  async getPaitentDetails() {
    this.patientData = (await this.patientService.getPatientOptimized(
      this.patientId
    )) as any;

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
      patientStatus: this.patientData?.patientStatus,
      isSmsOptedIn: this.patientData?.isSmsOptedIn
    });
    this.patientForm.controls['email'].disable();
    this.selectedStatus = this.patientData.patientStatus;
  }

  hideModal() {
    this.modalClosed.emit({ close: true, isDelete: false, isEdit: false });
    this.showModal = false;
  }

  saveLead() {
    this.submitForm();
  }
  selectStatus(status: any) {
    this.selectedStatus = status;
  }
}
