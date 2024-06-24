import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import moment from 'moment';
import { ClinicService } from 'src/app/modules/account-and-settings/clinic/services/clinic.service';
import { AppointmentService } from 'src/app/modules/appointment/services/appointment.service';
import { CalendarService } from 'src/app/modules/appointment/services/calendar.service';
import { RegexEnum } from '../../common/constants/regex';
import { LocalStorageService } from '../../services/local-storage.service';
import { FormatTimeService } from '../../services/time-utils/formatTime.service';
import { ToasTMessageService } from '../../services/toast-message.service';

@Component({
  selector: 'app-book-appointment',
  templateUrl: './book-appointment.component.html',
  styleUrls: ['./book-appointment.component.css']
})
export class BookAppointmentComponent implements OnInit {
  @Input() showImportModal: boolean = false;
  timezone: any;
  appointmentForm!: FormGroup;
  appointmentData: any = {};
  selectedClinicData: any;
  patients: any[] = [];
  serviceByClinicId: any = [];
  @Input() businessId: any;
  @Input() patientData: any;
  dateTimeObj: any = {};
  providersByServiceId: any;
  isSelectedDateTimeAvaialble: boolean = false;
  filteredProviderList: any = [];
  isProviderOnVacation: boolean = false;
  selectedCellDate: any;
  selectedCellTime: any;
  isLoading: boolean;
  appointmentId: any;
  clinics: any;
  formTitle: string;

  @Output() afterAppointmentCreated: EventEmitter<any> = new EventEmitter();

  constructor(
    private calendarService: CalendarService,
    public formBuilder: FormBuilder,
    private toastService: ToasTMessageService,
    private formatTimeService: FormatTimeService,
    private localStorageService: LocalStorageService,
    private clinicService: ClinicService,
    private appointmentService: AppointmentService
  ) {}

  ngOnInit(): void {
    this.formTitle = 'Add Appointment';
    this.initializeAppointmentForm();
    this.loadClinics();
    this.getPatients();
  }

  getPatients() {
    this.calendarService.getPatients().then(
      (response: any) => {
        this.patients = response;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  initializeAppointmentForm() {
    this.selectedClinicData = {};
    this.selectedClinicData.isProviderBasedAppointment = true;
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
      date: ['', [Validators.required]],
      serviceIds: [[], [Validators.required]],
      providerId: ['', [Validators.required]],
      time: ['', [Validators.required]],
      appointmentType: ['InPerson', [Validators.required]],
      source: ['Calendar']
    });

    if (this.patientData) {
      this.appointmentForm.patchValue({
        firstName: this.patientData.firstName,
        lastName: this.patientData?.lastName,
        phone: this.patientData?.phone,
        email: this.patientData.email
      });
    }
  }

  /* -------------------------------------------------------------------------- */
  /*                   Fill patient details by email if exist                   */
  /* -------------------------------------------------------------------------- */
  OnEmailFeildBlur(e: any, hasError: any) {
    console.log(e.target.value, hasError);
    const email: any = e.target.value;
    if (email && !hasError) {
      this.calendarService.getUserByEmail(email).then(
        (response: any) => {
          if (response && response?.firstName) {
            this.appointmentForm.patchValue({
              firstName: response.firstName,
              lastName: response.lastName,
              phone: response?.phone
            });
          }
        },
        () => {
          this.toastService.error('Unable to load user details.');
        }
      );
    }
  }

  OnNameFeildBlur(firstName: any, lastName: any, hasError: any) {
    if (firstName && lastName && !hasError) {
      this.patients
        .filter(
          (data: any) =>
            data.firstName == firstName && data.lastName == lastName
        )
        .forEach((response: any) => {
          this.appointmentForm.patchValue({
            firstName: response?.firstName,
            lastName: response?.lastName,
            phone: response?.phone,
            email: response.email
          });
        });
    }
  }

  /* -------------------------------------------------------------------------- */
  /*                   Fill patient details by phone if exist                   */
  /* -------------------------------------------------------------------------- */
  OnPhoneFeildBlur(e: any, hasError: any) {
    console.log(e.target.value, hasError);
    const phone: any = e.target.value;
    if (phone && !hasError) {
      this.calendarService.getUserByPhone(phone).then(
        (response: any) => {
          if (response && response?.firstName) {
            this.appointmentForm.patchValue({
              firstName: response.firstName,
              lastName: response?.lastName,
              email: response.email
            });
          }
        },
        () => {
          //this.toastService.error('Unable to load user details.');
        }
      );
    }
  }

  onClinicSelect(clinicId: any) {
    this.selectedClinicData = this.clinics.filter(
      (data: any) => data.id == clinicId.value
    )[0];
    this.loadServiceByClinicId(clinicId);
  }

  loadServiceByClinicId(clinicId: any) {
    if (clinicId != '') {
      this.appointmentService.getAllServicesForDropdown(null).then(
        (response: any) => {
          this.serviceByClinicId = response.serviceList;
        },
        (error) => {
          console.log(error);
        }
      );
    } else {
      // this.servicesList = [];
      // this.appointmentForm.patchValue({
      //   serviceIds: []
      // });
    }
  }

  async onServiceSelect(e: any, isEdit?: boolean) {
    let serviceIds = [0];
    if (isEdit) {
      serviceIds = e;
    } else {
      serviceIds = e.value.length > 0 ? e.value : [0];
    }
    if (this.appointmentForm.value.clinicId) {
      const clinicResult: any = await this.appointmentService.getClinic(
        this.businessId,
        this.appointmentForm.value.clinicId
      );

      this.selectedClinicData = clinicResult;
      console.log(this.selectedClinicData);
      if (clinicResult && !clinicResult.isProviderBasedAppointment) {
        this.loadProvidersByServiceId(serviceIds);
      } else {
        const formData: any = {
          // eslint-disable-next-line prettier/prettier

          date: moment(this.appointmentForm.value.date).format(
            'YYYY-MM-DD 00:00:00 ZZ'
          ),
          clinicId: this.appointmentForm.value.clinicId,
          serviceIds: this.appointmentForm.value.serviceIds,
          appointmentId: null
        };
        this.appointmentForm.patchValue({
          providerId: 0
        });
        this.getTimeSlotsWithoutProvider(formData);
      }
    }
  }

  loadProvidersByServiceId(serviceIds: any) {
    this.calendarService
      .getProviderByServiceIds(serviceIds)
      .then((response: any) => {
        if (response.userDTOList.length > 0) {
          response.userDTOList.map((data: any) => {
            data['fullName'] = data.firstName + ' ' + data.lastName;
          });
          this.providersByServiceId = response.userDTOList;
          const providerIds = this.providersByServiceId.map(
            (provider: any) => provider.id
          );
          if (this.appointmentData.providerId) {
            this.getVacationScheduleForProvider(providerIds);
          }
        } else {
        }
      })
      .catch(() => {
        // this.toastService.error('Unable to load providers.');
      });
  }

  getTimeSlotsWithoutProvider(formData: any) {
    this.appointmentService
      .getTimeSlotsWithoutProvider(this.businessId, formData)
      .then((response: any) => {
        this.dateTimeObj.availableTimes = [];
        const selectedTime = this.appointmentForm.value.time;
        response.forEach((time: any) => {
          const value = moment(time).format('YYYY-MM-DD HH:mm:ss ZZ');
          if (value == selectedTime) {
            this.isSelectedDateTimeAvaialble = true;
          }
          this.dateTimeObj.availableTimes.push({
            label: this.formatTimeService.formatTimeslot(
              time,
              this.appointmentData.timeZone
            ),
            value: value
          });
        });
        console.log(this.dateTimeObj);
      });
  }
  get f() {
    return this.appointmentForm.controls;
  }

  onDateSelect(e?: any) {
    console.log(e);
    if (this.appointmentForm.value.providerId) {
      const date = moment(this.appointmentForm.value.date).format(
        'YYYY-MM-DD HH:mm:ss ZZ'
      );
      this.loadAvailableTimeSlot(date);
      this.selectedCellDate = this.appointmentForm.value.Date;
      this.selectedCellTime = this.appointmentForm.value.Time;
    }
  }

  getVacationScheduleForProvider(providerIds: any) {
    this.calendarService
      .getVacationSchedulesByProviders(
        this.appointmentForm.value.clinicId,
        providerIds
      )
      .then(
        (response: any) => {
          const vacationDates = response;
          this.filterProvidersByVacationTime(
            this.providersByServiceId,
            vacationDates
          );
          this.providersByServiceId = this.filteredProviderList;
        },
        () => {
          this.toastService.error('Unable to load clinic provider schedules.');
        }
      );
  }

  filterProvidersByVacationTime(users: any, vacationDates: any) {
    this.filteredProviderList = [];
    const DATE_FORMAT = 'YYYY-MM-DD';
    const TIME_FORMAT = 'HH:mm';
    const cellDate = moment(this.selectedCellDate, DATE_FORMAT);
    const cellTime = moment(
      this.formatTimeService.convertTime12to24(this.selectedCellTime),
      TIME_FORMAT
    );
    if (vacationDates && vacationDates.length > 0) {
      users.forEach((user: any) => {
        this.isProviderOnVacation = false;
        vacationDates.forEach((schedule: any) => {
          if (user.id == schedule.providerId) {
            const startDate = moment(schedule.fromDate, DATE_FORMAT);
            const endDate = moment(schedule.toDate, DATE_FORMAT);
            schedule.userScheduleTimings.forEach((timings: any) => {
              const startTimeStr = moment(timings.timeFromDate, TIME_FORMAT);
              const endTimeStr = moment(timings.timeToDate, TIME_FORMAT);

              if (cellDate >= startDate && cellDate <= endDate) {
                if (
                  cellTime.get('hour') > startTimeStr.get('hour') &&
                  cellTime.get('hour') < endTimeStr.get('hour')
                ) {
                  this.isProviderOnVacation = true;
                } else {
                  if (cellTime.get('hour') === startTimeStr.get('hour')) {
                    if (
                      cellTime.get('minute') >= startTimeStr.get('minute') &&
                      startTimeStr.get('hour') !== endTimeStr.get('hour')
                    ) {
                      this.isProviderOnVacation = true;
                    }
                  }
                  if (cellTime.get('hour') === endTimeStr.get('hour')) {
                    if (cellTime.get('minute') < endTimeStr.get('minute')) {
                      this.isProviderOnVacation = true;
                    }
                  }
                }
              }
            });
          }
        });
        if (!this.isProviderOnVacation) {
          this.filteredProviderList.push(user);
        }
      });
    } else {
      this.filteredProviderList = users;
    }
  }

  loadAvailableTimeSlot(date: any) {
    this.dateTimeObj.availableTimes = [];
    const clinicId = this.appointmentForm.value.clinicId;
    const serviceIds = this.appointmentForm.value.serviceIds;
    const providerId = this.appointmentForm.value.providerId;
    const selectedTime = this.appointmentForm.value.time;
    // const date = this.appointmentForm.value.date;
    this.appointmentService
      .getAvailableTimeslots(
        clinicId,
        serviceIds,
        providerId,
        date,
        this.appointmentId
      )
      .then((response: any) => {
        console.log('res==========' + response);
        if (response.length > 0) {
          // this.isSelectedDateTimeAvaialble = true;
          let availableTimeCount = 0;

          response.forEach((time: any) => {
            const value = moment(time).format('YYYY-MM-DD HH:mm:ss ZZ');
            if (value == selectedTime) {
              this.isSelectedDateTimeAvaialble = true;
              availableTimeCount = availableTimeCount + 1;
              this.appointmentForm.patchValue({
                time: value
              });
            }
            this.dateTimeObj.availableTimes.push({
              label: this.formatTimeService.formatTimeslot(
                time,
                this.appointmentData.timeZone
              ),
              value: value
            });
          });
          if (this.appointmentId) {
            this.appointmentForm.patchValue({
              time: this.dateTimeObj.time
            });
          }
          if (availableTimeCount == 0 && !this.appointmentId) {
            // this.toastService.error('The selected Time slot is not available');
            if (this.dateTimeObj.availableTimes?.length > 0) {
              this.appointmentForm.patchValue({
                time: this.dateTimeObj.availableTimes[0].value
              });
              this.isSelectedDateTimeAvaialble = true;
            } else {
              this.isSelectedDateTimeAvaialble = false;
            }
          } else {
            this.appointmentForm.patchValue({
              time: selectedTime
            });
          }
        } else {
          this.toastService.error(
            'There are no time slots  available for the selected date'
          );
          this.isSelectedDateTimeAvaialble = false;
          this.appointmentForm.value.time = '';
        }
      });
  }

  onTimeSelect(e: any) {
    this.isSelectedDateTimeAvaialble = true;
    console.log('time slot============' + e, this.appointmentForm.value);
  }
  submit() {
    if (this.isSelectedDateTimeAvaialble) {
      const formData = this.appointmentForm.value;
      if (this.appointmentId) {
        this.updateAppointment(formData);
      } else {
        this.createAppointment(formData);
      }
    } else {
      this.toastService.error(
        'The selected date or time is not available to book appointment.'
      );
    }
  }

  createAppointment(formData: any) {
    /* ------------ Below logic is to convert appointment Date to utc ----------- */
    formData['appointmentDate'] = this.appointmentForm.value.time;
    console.log(formData);
    const date: any = formData.appointmentDate;
    const timeZone =
      this.timezone ??
      this.localStorageService.readStorage('defaultClinic')?.timezone;

    const t = moment.utc(moment(date, 'YYYY-MM-DD HH:mm:ss ZZ')).format();

    var clearUTCDate = moment(date, 'YYYY-MM-DD HH:mm:ss ZZ')
      .utcOffset(t)
      .format('YYYY-MM-DD HH:mm:00');
    console.log(date, timeZone, t, clearUTCDate);
    var zonedDateTime = moment
      .tz(clearUTCDate, timeZone)
      .format('YYYY-MM-DD HH:mm:00 ZZ');

    formData.appointmentDate = zonedDateTime;
    this.isLoading = true;
    /* --------------------- APi call for create appoinment --------------------- */
    this.appointmentService
      .createNewAppointment(formData)
      .then((response: any) => {
        this.isLoading = false;
        if (response.statusCode == 200) {
          this.afterAppointmentCreated.emit(true);
          this.toastService.success('Appointment created successfully');
          this.showImportModal = false;
        } else if (response.statusCode == 500) {
          this.toastService.error(response.message);
        }
      })
      .catch((e: any) => {
        this.isLoading = false;
        if (e?.error.errorMessage.includes('This email is already exist')) {
          this.toastService.error(e?.error.errorMessage);
        } else {
          this.toastService.error('Unable to create the appointment!');
        }
      });
  }

  updateAppointment(formData: any) {
    formData.appointmentDate = moment(formData.time).format(
      'YYYY-MM-DD HH:mm:00 ZZ'
    );
    console.log('formData.appointmentDate ' + formData.appointmentDate);
    console.log(formData, this.appointmentForm.value);
    this.isLoading = true;
    this.appointmentService
      .updateAppointment(this.appointmentId, formData)
      .then(() => {
        this.afterAppointmentCreated.emit(true);
        this.toastService.success('Appointment updated successfully');
        this.showImportModal = false;
        this.isLoading = false;
      })
      .catch((e: any) => {
        this.isLoading = false;
        if (e?.error.errorMessage.includes('This email is already exist')) {
          this.toastService.error(e?.error.errorMessage);
        } else {
          this.toastService.error('Unable to update the appointment!');
        }
      });
  }

  hideModal() {
    this.showImportModal = false;
    this.afterAppointmentCreated.emit(false);
  }

  onProviderSelect() {
    this.loadAvailableDates();
  }

  loadAvailableDates() {
    const clinicId = this.appointmentForm.value.clinicId;
    const serviceIds = this.appointmentForm.value.serviceIds;
    const providerId = this.appointmentForm.value.providerId;

    this.appointmentService
      .getAvailableDates(clinicId, serviceIds, providerId)
      .then(
        (response: any) => {
          if (response.length > 0) {
            var minDate = response.reduce(function (a: any, b: any) {
              return new Date(a) < new Date(b) ? a : b;
            });
            var maxDate = response.reduce(function (a: any, b: any) {
              return new Date(a) > new Date(b) ? a : b;
            });
            this.dateTimeObj.availableDateByProviderId = response;
            if (!this.appointmentId) {
              this.validateSelectedDateByDefault(
                this.dateTimeObj.availableDateByProviderId
              );
            }

            this.dateTimeObj.calendarMinDate = new Date(minDate);
            this.dateTimeObj.calendarMaxDate = new Date(maxDate);
            // this.loadAvailableTimeSlot(this.appointmentForm.value.date)
          } else {
            this.toastService.error(
              'There are no dates available for the selected date'
            );
            this.isSelectedDateTimeAvaialble = false;
            this.appointmentForm.value.date = '';
          }
        },
        () => {
          this.toastService.error(
            'Unable to load available dates of provider.'
          );
        }
      );
  }

  validateSelectedDateByDefault(avaialableDates: any) {
    this.isSelectedDateTimeAvaialble = true;
    const selectedDate = moment(this.appointmentForm?.value.date).format(
      'DDMMYYYY'
    );
    const convertedDates: any[] = [];
    avaialableDates.map((data: any) => {
      const convertUtcDateToNormalDate = new Date(data);
      const convertedNormalDateToMoment = moment(
        convertUtcDateToNormalDate
      ).format('DDMMYYYY');
      convertedDates.push(convertedNormalDateToMoment);
    });

    if (convertedDates.indexOf(selectedDate) > -1) {
      this.onDateSelect();
    } else {
      this.isSelectedDateTimeAvaialble = false;
      this.toastService.error(
        'The selected date is not available to book appointment. Please select some other date'
      );
    }
  }

  // loadClinics() {
  //   this.clinicService
  //     .getClinics()
  //     .then((response: any) => {
  //       const clinicsForFilter = response;
  //       this.timezone = clinicsForFilter[0].timezone;
  //       localStorage.setItem('clinicTimeZone', clinicsForFilter[0].timezone);
  //       this.clinics = clinicsForFilter;
  //       if (this.clinics.length > 0) {
  //         this.selectedClinicData = this.clinics[0];
  //       }
  //     })
  //     .catch(() => {
  //       this.toastService.error('Unable to load clinics.');
  //     });
  // }
  // loadClinics() {
  //   this.clinicService
  //     .getClinics()
  //     .then((response: any) => {
  //       const clinicsForFilter = response;
  //       this.timezone = clinicsForFilter[0].timezone;
  //       localStorage.setItem('clinicTimeZone', clinicsForFilter[0].timezone);
  //       this.clinics = clinicsForFilter;

  //       // Check if only one clinic is available
  //       if (this.clinics.length === 1) {
  //         this.selectedClinicData = this.clinics[0];
  //         // Also set the clinicId in the form
  //         this.appointmentForm.patchValue({
  //           clinicId: this.selectedClinicData.id
  //         });
  //       }
  //     })
  //     .catch(() => {
  //       this.toastService.error('Unable to load clinics.');
  //     });
  // }
  loadClinics() {
    this.clinicService
      .getClinics()
      .then((response: any) => {
        const clinicsForFilter = response;
        this.timezone = clinicsForFilter[0].timezone;
        localStorage.setItem('clinicTimeZone', clinicsForFilter[0].timezone);
        this.clinics = clinicsForFilter;

        // Check if only one clinic is available
        if (this.clinics.length === 1) {
          this.selectedClinicData = this.clinics[0];
          // Also set the clinicId in the form
          this.appointmentForm.patchValue({
            clinicId: this.selectedClinicData.id
          });
          // Load services for the selected clinic
          this.loadServiceByClinicId(this.selectedClinicData.id);
        }
      })
      .catch(() => {
        this.toastService.error('Unable to load clinics.');
      });
  }

  isEnabledVirtualConsulatation() {
    return this.selectedClinicData?.disableVirtualAppointment ? false : true;
  }
  isEnabledInPersonAppointment() {
    return this.selectedClinicData?.disableInPersonAppointment ? false : true;
  }
}
