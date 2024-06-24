import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import moment from 'moment';
import { RegexEnum } from 'src/app/shared/common/constants/regex';
import { AppointmentDto } from 'src/app/shared/models/appointment/AppointmentDto';
import { OptimizedClinic } from 'src/app/shared/models/clinics/optimizedClinic';
import { OptimizedProvider } from 'src/app/shared/models/providers/OptimizedProvider';
import { OptimizedService } from 'src/app/shared/models/services/OptimizedService';
import { FormatTimeService } from 'src/app/shared/services/time-utils/formatTime.service';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
import { AppointmentService } from '../../../services/appointment.service';
import { Location } from '@angular/common';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
@Component({
  selector: 'app-add-edit-booking-history',
  templateUrl: './add-edit-booking-history.component.html',
  styleUrls: ['./add-edit-booking-history.component.css']
})
export class AddEditBookingHistoryComponent implements OnInit {
  appointmentId!: number;
  appointmentStatus = [
    'Pending',
    'Confirmed',
    'Completed',
    'Canceled',
    'Updated'
  ];
  calendarMinDate = new Date();
  calendarMaxDate = moment().add(30, 'days').toDate();
  appointmentForm!: FormGroup;
  appointmentData!: AppointmentDto;
  clinics: OptimizedClinic[] = [];
  providers: OptimizedProvider[] = [];
  servicesList: OptimizedService[] = [];
  selectedServices: OptimizedService[] = [];
  availableTimes: any[] = [];
  appointmentStartDate: string = '';
  availableDates: any = [];
  isSingleClick = false;
  timeLabel: string = '';
  time: string = '';
  notesLabel: string = 'Notes';
  selectedClinicData: any;
  cancelConfirmVisible: boolean = false;
  constructor(
    public formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private appointmentService: AppointmentService,
    private formatTimeService: FormatTimeService,
    private toastService: ToasTMessageService,
    private localStorageService: LocalStorageService,
    public location: Location
  ) {}
  ngOnInit(): void {
    this.initializeAppointmentForm();
    this.appointmentId = this.activatedRoute.snapshot.params.appointmentId;
    if (this.appointmentId) {
      this.loadClinics();
      this.loadProviders();
      this.getAppointmentData();
    }
    this.selectedClinicData =
      this.localStorageService.readStorage('defaultClinic');
  }

  initializeAppointmentForm() {
    this.appointmentForm = this.formBuilder.group({
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
      notes: ['', []],
      clinicId: ['', [Validators.required]],
      serviceIds: [[], [Validators.required]],
      providerId: ['', []],
      date: ['', [Validators.required]],
      time: ['', [Validators.required]],
      appointmentType: ['InPerson', [Validators.required]],
      appointmentConfirmationStatus: ['', [Validators.required]],
      source: ['']
    });
  }

  async getAppointmentData() {
    this.appointmentService
      .getOptimizedSingleAppointment(this.appointmentId)
      .then((data: any) => {
        this.appointmentData = data;
        console.log('apponin', this.appointmentData);
        this.loadServiceByClinicId(this.appointmentData.clinicId);
        const serviceIds1 = this.appointmentData.serviceList.map(
          (data: any) => {
            this.selectedServices.push({
              id: data.serviceId,
              name: data.serviceName
            });
            return data.serviceId;
          }
        );
        // this.appointmentStartDate = moment(
        //   this.appointmentData.appointmentStartDate
        // ).format('YYYY-MM-DD 00:00:00 ZZ');

        this.time = moment(this.appointmentData.appointmentStartDate).format(
          'YYYY-MM-DD HH:mm:ss ZZ'
        );
        this.timeLabel = this.formatTimeService.formatTimeslot(
          this.appointmentData.appointmentStartDate,
          this.appointmentData.timeZone
        );
        const date1 = moment
          .utc(this.appointmentData.appointmentStartDate)
          .format('MM/DD/YYYY');
        this.appointmentForm.patchValue({
          firstName: this.appointmentData.patientFirstName,
          lastName: this.appointmentData.patientLastName,
          email: this.appointmentData.patientEmail,
          phone: this.appointmentData.patientPhone,
          notes: this.appointmentData.notes,
          clinicId: this.appointmentData.clinicId,
          serviceIds: serviceIds1,
          providerId: this.appointmentData.providerId,
          date: date1,
          time: this.time,
          appointmentType: this.appointmentData.appointmentType
            ? this.appointmentData.appointmentType
            : 'InPerson',
          appointmentConfirmationStatus:
            this.appointmentData?.appointmentStatus,
          source: this.appointmentData?.source ?? ''
        });
        if (
          this.appointmentData.notesLabel &&
          this.appointmentData.notesLabel != 'Additional Notes (Optional)'
        ) {
          this.notesLabel = this.appointmentData.notesLabel;
        }
        this.loadTimeslot();
        console.log(this.appointmentForm);
      })
      .catch(() => {
        this.toastService.error(
          'There is some error while fetching appointment'
        );
      });
    //this.loadAvailableDates();
  }
  get f() {
    return this.appointmentForm.controls;
  }

  loadClinics() {
    this.appointmentService.getAllOptimizedCinicList().then(
      (response: any) => {
        this.clinics = response;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  onDateSelect() {
    this.loadTimeslot();
  }

  getClinicServices(event: any) {
    console.log(event.value);
    this.loadServiceByClinicId(event.value);
  }

  loadServiceByClinicId(clinicId: any) {
    if (clinicId != '') {
      this.appointmentService.getAllServicesForDropdown(clinicId).then(
        (response: any) => {
          this.servicesList = response.serviceList;
        },
        (error) => {
          console.log(error);
        }
      );
    } else {
      this.servicesList = [];
      this.appointmentForm.patchValue({
        serviceIds: []
      });
    }
  }

  loadProviders() {
    this.appointmentService.getAllProvidersForDropDown().then(
      (response: any) => {
        this.providers = response;
        this.providers.map((data: any) => {
          data.fullName = data.firstName + ' ' + data.lastName;
        });
      },
      (error) => {
        console.log(error);
      }
    );
  }

  loadAvailableDates() {
    const formData = this.appointmentForm.value;
    const clinicId = formData.clinicId;
    const serviceIds = formData.serviceIds;
    const providerId = formData.providerId;

    if (formData.providerId) {
      this.appointmentService
        .getAvailableDates(clinicId, serviceIds, providerId)
        .then(
          (response: any) => {
            this.availableDates = response;
          },
          (error) => {
            console.log(error);
          }
        );
    } else {
      this.appointmentService
        .getClinicAvailableDates(clinicId, serviceIds)
        .then(
          (response: any) => {
            this.availableDates = response;
          },
          (error) => {
            console.log(error);
          }
        );
    }
  }

  loadTimeslot() {
    const formData = this.appointmentForm.value;
    const clinicId = formData.clinicId;
    const serviceIds = formData.serviceIds;
    const providerId = formData.providerId;
    //   let date = DateUtil.toServerDateFormat(formData.date);
    const date = moment(formData.date).format('YYYY-MM-DD 00:00:00 ZZ');
    this.appointmentService
      .getAvailableTimeslots(
        clinicId,
        serviceIds,
        providerId,
        date,
        this.appointmentId
      )
      .then(
        (response: any) => {
          this.availableTimes = [];
          response.forEach((time: any) => {
            console.log('timeee', time);
            this.availableTimes.push({
              label: this.formatTimeService.formatTimeslot(
                time,
                this.appointmentData.timeZone
              ),
              value: moment(time).format('YYYY-MM-DD HH:mm:ss ZZ')
            });
          });

          if (this.appointmentStartDate == date) {
            this.availableTimes.push({
              label: this.timeLabel,
              value: this.time
            });
          }
        },
        (error) => {
          console.log(error);
        }
      );
  }

  submitForm() {
    const formData: any = this.appointmentForm.value;
    // moment(time).format('YYYY-MM-DD HH:mm:ss ZZ')
    console.log(this.appointmentForm);
    // formData.appointmentDate = moment(
    //   this.appointmentForm.value.time.replace(/-/g, '/')
    // )
    //   .format('YYYY/MM/DD HH:mm:ss ZZ')
    //   .replace(/[/]/g, '-');

    formData.appointmentDate = moment(
      this.appointmentForm.value.time,
      'YYYY-MM-DDTHH:mm:ssZ' // Specify the input format
    )
      .format('YYYY/MM/DD HH:mm:ss ZZ')
      .replace(/[/]/g, '-');

    // formData.appointmentDate =
    //   this.appointmentForm.value.time;
    // .replace(/[/]/g, '-');
    console.log('apponijt', this.appointmentForm.value);

    if (this.appointmentId) {
      this.appointmentService
        .updateAppointment(this.appointmentId, formData)
        .then(() => {
          this.toastService.success('Appointment updated successfully');
          this.location.back();
          this.router.navigate(['/appointment/booking-history']);
        })
        .catch((e) => {
          console.log(e);
          this.toastService.error('Unable to update appointment');
        });
    }
  }
  // cancel submitting form and navigate back
  cancelAppointChanges() {
    this.location.back();
    this.router.navigate(['/appointment/booking-history']);
  }

  cancelAppointments() {
    // this.showModal = false;
    this.appointmentService.cancelAppointment(this.appointmentId).then(
      () => {
        // this.afterAppointmentCreated.emit(true);
        this.toastService.success('Appointment canceled successfully');
        this.location.back();
        this.router.navigate(['/appointment/booking-history']);
      },
      () => {
        // this.toastMessageService.error('Unable to delete a appointment');
      }
    );
  }

  goToPatientDetails() {
    this.isSingleClick = true;
    setTimeout(() => {
      if (this.isSingleClick) {
        this.router.navigate(
          ['/patients/' + this.appointmentData.patientId + '/edit'],
          {
            queryParams: {
              source: 'pateint'
            },
            queryParamsHandling: 'merge'
          }
        );
      }
    }, 250);
  }
  isEnabledVirtualConsulatation() {
    return this.selectedClinicData?.disableVirtualAppointment ? false : true;
  }
  isEnabledInPersonAppointment() {
    return this.selectedClinicData?.disableInPersonAppointment ? false : true;
  }
}
