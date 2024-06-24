/* eslint-disable @angular-eslint/no-output-on-prefix */
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngxs/store';
import moment from 'moment';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
import { IBooking } from '../../models/booking.model';
import { AppointmentService } from '../../services/appointment.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-patient-information',
  templateUrl: './patient-information.component.html',
  styleUrls: ['./patient-information.component.css']
})
export class PatientInformationComponent implements OnInit {
  isPayNow: boolean = false;
  @Input() booking: IBooking;
  @Output() onAppointmentSuccess = new EventEmitter<any>();
  submitted = false;
  patientForm!: FormGroup;
  completed: boolean = false;
  isAppointmentSuccess = false;
  isShowPayButton = false;
  preBookingOnly = false;
  notesLabel = 'Additional Notes (Optional)';
  notesRequiredOptional = false;
  isEmailPresent = false;
  btnStyle = {
    backgroundColor: '#003B6F',
    color: '#FFFFFF',
    border: '#003B6F',
    textTransform: 'uppercase'
  };

  btnTextStyle = {
    color: '#FFFFFF',
    textTransform: 'uppercase'
  };

  titleStyle = {
    color: '#000',
    textTransform: 'uppercase'
  };

  activeLinkStyle = {
    color: '#003B6F'
  };

  activeLinkBorder = {
    borderColor: '#003B6F'
  };

  buttonBackgroundColor = '#003B6F';

  focus: boolean;
  index: any;
  backgroundColor = localStorage.getItem('bcc');
  foregroundColor = localStorage.getItem('fcc');
  titleColor = localStorage.getItem('tc');
  userId: any;
  landingPageId: any;
  isNewUser: boolean = false;
  @Output() onBack = new EventEmitter<any>();
  constructor(
    public formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private appointmentBookingService: AppointmentService,
    private alertService: ToasTMessageService,
    private store: Store,
    private userService: UserService,
    private localStorageService: LocalStorageService
  ) {}

  goBack() {
    this.onBack.emit('fromPatientInfo');
  }

  ngOnInit(): void {
    // this.patientForm.get('appointmentType')?.setValue('InPerson');
    this.activatedRoute.queryParams.subscribe((d) => {
      if (Object.keys(d).length > 0) {
        this.userId = d.u;
        this.landingPageId = d?.lpid;
      }
    });
    this.patientForm = this.formBuilder.group({
      firstName: [
        '',
        [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]
      ],
      lastName: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]],
      email: [
        '',
        [
          Validators.required,
          Validators.pattern(
            '^([a-zA-Z0-9_.-]+)@([a-zA-Z0-9_-]+)\\.([a-z]{2,10})(\\.[a-z]{2,10})?$'
          )
        ]
      ],
      phone: ['', [Validators.required, Validators.pattern('^[1-9][0-9]{9}$')]],
      notes: ['', []],
      source: ['Public'],
      // appointmentType: ['', []]
      appointmentType: ['', [Validators.required]]
    });
    console.log(this.booking.selectedServices.length);
    console.log(this.booking);
    // if (this.booking.selectedClinic.showPayButton) {
    //   this.isShowPayButton = true;
    // }
    // if (this.booking.selectedClinic.preBookingOnly) {
    //   this.preBookingOnly = true;
    // }
    for (let i = 0; i < this.booking.selectedServices.length; i++) {
      console.log(this.booking.selectedServices[i]);
      if (this.booking.selectedServices[i].isPreBookingCostAllowed) {
        this.preBookingOnly = true;
      }

      if (
        !this.booking.selectedServices[i].priceVaries &&
        this.booking.selectedClinic.showPayButton
      ) {
        this.isShowPayButton = true;
      }
    }

    if (this.booking.selectedClinic?.notesLabel) {
      this.notesLabel = this.booking.selectedClinic.notesLabel;
    }

    if (this.booking.selectedClinic?.notesRequiredOptional) {
      this.patientForm.controls['notes'].setValidators([Validators.required]);
    }

    let response: any;
    if (this.landingPageId) {
      response = JSON.parse(localStorage.getItem('websitePersonalization'));
    } else {
      response = JSON.parse(localStorage.getItem('personalization'));
    }
    if (
      response != null &&
      (response.buttonBackgroundColor != null ||
        response.buttonBackgroundColor != '')
    ) {
      this.setPersonalizationColors(response);
    }
    //this.loadPersonalizationColors()
  }

  setPersonalizationColors(response: any) {
    if (response) {
      this.btnStyle = {
        backgroundColor: response.buttonBackgroundColor,
        color: response.buttonForegroundColor,
        border: response.buttonBackgroundColor,
        textTransform: 'uppercase'
      };
      if (
        response.buttonForegroundColor != null &&
        response.buttonForegroundColor != ''
      ) {
        this.activeLinkStyle = {
          color: response.buttonBackgroundColor
        };
        this.buttonBackgroundColor = response.buttonBackgroundColor;
        this.btnTextStyle = {
          color: response.buttonForegroundColor,
          textTransform: 'uppercase'
        };
        this.backgroundColor = response.buttonBackgroundColor;

        // this.themeService.setDarkTheme(
        //   response.appButtonForegroundColor,
        //   response.appButtonBackgroundColor,
        //   response.buttonBackgroundColor,
        //   response.buttonForegroundColor
        // );
      }

      if (response.titleColor != null && response.titleColor != '') {
        this.titleColor = response.titleColor;
        this.titleStyle = {
          color: response.titleColor,
          textTransform: 'uppercase'
        };
      }
    }
  }
  // convenience getter for easy access to form fields
  get f() {
    return this.patientForm.controls;
  }

  submitForm(isPayNow: boolean) {
    console.log(this.booking?.selectedClinic?.hidePayLater);
    this.isPayNow = isPayNow;
    this.submitted = true;
    // if (this.patientForm.invalid) {
    //   return;
    // }

    const formData = this.patientForm.value;
    formData.clinicId = this.booking.selectedClinic.id;
    formData.providerId = this.booking.provider.id;
    formData.serviceIds = [];

    this.booking.selectedServices.map((service: any) => {
      formData.serviceIds.push(service.id);
    });
    const timeZone = localStorage.getItem('clinicTimeZone');
    console.log('clinicTimeZone ' + timeZone);
    //let moment = require('moment');
    //require('moment-timezone');
    //moment.tz.setDefault(timeZone);
    var clearUTCDate = moment(this.booking.time)
      .utcOffset(this.booking.time)
      .format('YYYY-MM-DD HH:mm:00');
    //console.log("clearUTCDate "+clearUTCDate);
    console.log(this.booking);
    var zonedDateTime = moment.tz(clearUTCDate, timeZone);
    formData.appointmentDate = zonedDateTime.format('YYYY-MM-DD HH:mm:00 ZZ');
    console.log('formData.appointmentDate ' + formData.appointmentDate);

    const businessId = this.booking.businessId;
    this.appointmentBookingService
      .createNewAppointment(businessId, formData)
      .then(
        (response: any) => {
          if (response.statusCode == 200) {
            this.isAppointmentSuccess = true;
            this.onAppointmentSuccess.emit({ appointment: response.data });
            this.isPayNow ? ' ' : this.onHandleRedirect();
            localStorage.removeItem('personalization');
            localStorage.removeItem('selectedTimezone');
          } else if (response.statusCode == 500) {
            this.alertService.error(response.message);
          }
        },
        (error: any) => {
          if (error?.error?.message) {
            this.alertService.error(error?.error?.message);
          } else {
            this.alertService.error('Unable to create the appointment!');
          }
        }
      );
  }

  async onHandleRedirect() {
    console.log(this.booking.selectedClinic);
    if (this.booking.selectedClinic.seamlessPatientExperience) {
      const result: any =
        await this.appointmentBookingService.getConsentFaqInfo(
          this.booking.businessId,
          this.booking.appointment.id
        );
      if (
        (result && result.appointmentConsents.length > 0) ||
        result.appointmentQuestionnaires.length > 0
      ) {
        this.localStorageService.storeItem('appointmentDataObj', this.booking);
        this.router.navigate(['/ap-booking/business/seamlessBooking'], {
          queryParams: {
            b: this.booking.businessId,
            c: this.booking.selectedClinic.id,
            serviceId: this.booking.selectedServices[0]?.id
          }
        });
      } else {
        this.router.navigateByUrl('thankyou?bid=' + this.booking.businessId);
      }
    } else {
      this.router.navigateByUrl('thankyou?bid=' + this.booking.businessId);
    }
  }
  onPaymentSuccess() {
    console.log(this.booking.selectedClinic.seamlessPatientExperience);
    console.log('[ay,,ent fone');
    // this.store.dispatch([new SetAppointmentBookingData(this.booking)]);

    this.completed = true;
    // this.router.navigateByUrl('thankyou?bid=' + this.booking.businessId);
  }

  onPaymentCancel() {
    this.completed = true;
    //    this.isAppointmentSuccess = false
    //    this.isPayNow =false;
    this.router.navigateByUrl(
      'thankyou?bid=' + this.booking.businessId + '&paynow=yes'
    );
  }

  focusFunction(index: any) {
    this.index = index;
    this.focus = true;
  }

  updateUserDetailsByEmail() {
    const email = this.patientForm.value.email;
    this.isNewUser = false;
    this.userService.getPublicUserInfoByEmail(email).then(
      (response: any) => {
        if (response && response.email) {
          console.log(response);
          this.isEmailPresent = true;
          this.patientForm.patchValue({
            email: response.email,
            firstName: response.firstName,
            lastName: response.lastName,
            phone: response.phone
          });
          this.patientForm.controls['email'].clearValidators();
          this.patientForm.controls['firstName'].clearValidators();
          this.patientForm.controls['lastName'].clearValidators();
          this.patientForm.controls['phone'].clearValidators();

          this.patientForm.controls['email'].updateValueAndValidity();
          this.patientForm.controls['firstName'].updateValueAndValidity();
          this.patientForm.controls['lastName'].updateValueAndValidity();
          this.patientForm.controls['phone'].updateValueAndValidity();
          this.patientForm.updateValueAndValidity();
          const controls = this.patientForm.controls;
          const invalid = [];
          for (const name in controls) {
            if (controls[name].invalid) {
              invalid.push(name);
            }
          }
          console.log(invalid);
        } else {
          this.isNewUser = true;
          if (this.isEmailPresent) {
            this.isEmailPresent = false;
            this.patientForm.patchValue({
              firstName: '',
              lastName: '',
              phone: ''
            });
            this.patientForm.controls['firstName'].addValidators([
              Validators.required,
              Validators.pattern('^[a-zA-Z ]+$')
            ]);
            this.patientForm.controls['lastName'].addValidators([
              Validators.required,
              Validators.pattern('^[a-zA-Z ]+$')
            ]);
            this.patientForm.controls['phone'].addValidators([
              Validators.required,
              Validators.pattern('^[1-9][0-9]{9}$')
            ]);
          }
        }
      },
      () => {
        this.isNewUser = true;
        this.alertService.error('Unable to load user details.');
      }
    );
  }

  isEnabledVirtualConsulatation() {
    return this.booking?.selectedClinic?.disableVirtualAppointment
      ? false
      : true;
  }
  isEnabledInPersonConsulatation() {
    return this.booking?.selectedClinic?.disableInPersonAppointment
      ? false
      : true;
  }

  hidePayLaterOnly() {
    return this.booking?.selectedClinic?.hidePayLater ? false : true;
  }
}
