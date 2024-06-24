import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppointmentService } from '../../services/appointment.service';
import { FormatTimeService } from 'src/app/shared/services/time-utils/formatTime.service';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
import { UserService } from 'src/app/modules/user/services/user.service';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { ActivatedRoute, Router } from '@angular/router';
import { RegexEnum } from 'src/app/shared/common/constants/regex';
import { CalendarService } from '../../services/calendar.service';
import moment from 'moment';

@Component({
  selector: 'app-add-edit-appointment-dialog',
  templateUrl: './add-edit-appointment-dialog.component.html',
  styleUrls: ['./add-edit-appointment-dialog.component.css']
})
export class AddEditAppointmentDialogComponent implements OnInit {
  @Input() showModal: boolean = false;
  @Input() clinics: any;
  @Input() timezone: any;
  @Output() afterAppointmentCreated: EventEmitter<any> = new EventEmitter();
  @Output() modalClosed: EventEmitter<any> = new EventEmitter();
  businessId: any;
  selectedClinicData: any;
  appointmentForm!: FormGroup;
  notesLabel: string = 'Notes';
  notesRequired = false;
  patients: any[] = [];
  serviceByClinicId: any = [];
  providersByServiceId: any;
  dateTimeObj: any = {};
  isSelectedDateTimeAvaialble: boolean = false;
  appointmentData: any = {};
  filteredProviderList: any = [];
  selectedCellDate: any;
  isProviderOnVacation: boolean = false;
  workingDates: any;
  isLoading: boolean;
  isAppointmentCreated: any;
  appointmentId: any;
  isSingleClick: boolean;

  constructor(
    public formBuilder: FormBuilder,
    private appointmentService: AppointmentService,
    private formatTimeService: FormatTimeService,
    private calendarService: CalendarService,
    private toastService: ToasTMessageService,
    private userService: UserService,
    private localStorageService: LocalStorageService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.businessId = this.localStorageService.readStorage('businessInfo').id;
    this.initializeAppointmentForm();
  }

  initializeAppointmentForm() {
    this.selectedClinicData = {};
    this.selectedClinicData.isProviderBasedAppointment = true;
    if (this.clinics.length > 0) {
      this.selectedClinicData = this.clinics[0];
    }
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
      providerId: ['', [Validators.required]],
      date: ['', [Validators.required]],
      time: ['', [Validators.required]],
      timeForUpdateAppt: ['', []],
      appointmentType: ['InPerson', [Validators.required]],
      source: ['Calendar']
    });

    if (this.selectedClinicData?.disableInPersonAppointment) {
      this.appointmentForm.patchValue({
        appointmentType: 'Virtual'
      });
    }

    if (this.selectedClinicData?.notesLabel) {
      this.notesLabel = this.selectedClinicData?.notesLabel;
    } else {
      this.notesLabel = 'Notes';
    }

    if (this.selectedClinicData?.notesRequiredOptional) {
      this.notesRequired = true;
      this.appointmentForm.get('notes')?.setValidators(Validators.required);
      this.appointmentForm.get('notes')?.updateValueAndValidity();
    } else {
      this.notesRequired = false;
      this.appointmentForm.get('notes')?.clearValidators();
      this.appointmentForm.get('notes')?.updateValueAndValidity();
    }
  }

  get f() {
    return this.appointmentForm.controls;
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
              email: response.email ?? email,
              firstName: response.firstName,
              lastName: response.lastName,
              phone: response.phone
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
              lastName: response.lastName,
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

    console.log(this.selectedClinicData);
    if (this.selectedClinicData?.disableInPersonAppointment) {
      this.appointmentForm.patchValue({
        appointmentType: 'Virtual'
      });
    }
    if (this.selectedClinicData?.notesLabel) {
      this.notesLabel = this.selectedClinicData?.notesLabel;
    } else {
      this.notesLabel = 'Notes';
    }

    if (this.selectedClinicData?.notesRequiredOptional) {
      console.log('Entered In set validators');
      this.notesRequired = true;
      this.appointmentForm.get('notes').setValidators(Validators.required);
      this.appointmentForm.get('notes').updateValueAndValidity();
    } else {
      this.notesRequired = false;
      this.appointmentForm.get('notes')?.clearValidators();
      this.appointmentForm.get('notes')?.updateValueAndValidity();
    }
    this.loadServiceByClinicId(clinicId.value);
  }

  loadServiceByClinicId(clinicId: any) {
    if (clinicId != '') {
      this.appointmentService.getAllServicesForDropdown(clinicId).then(
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
              this.appointmentData?.timeZone
            ),
            value: value
          });
        });
        console.log(this.dateTimeObj);
      });
  }

  loadProvidersByServiceId(serviceIds: any) {
    this.calendarService
      .getProviderByServiceIds(serviceIds)
      .then((response: any) => {
        if (response.userDTOList && response.userDTOList.length > 0) {
          response.userDTOList.map((data: any) => {
            data['fullName'] = data.firstName + ' ' + data.lastName;
          });
          this.providersByServiceId = response.userDTOList;
          const providerIds = this.providersByServiceId.map(
            (provider: any) => provider.id
          );
          this.loadAvailableDates();
          if (this.appointmentData.providerId) {
            this.getVacationScheduleForProvider(providerIds);
          }
        } else {
          this.loadAvailableDates();
          // this.toastService.error(
          //   'Please assign a provider for the selected service'
          // );
        }
      })
      .catch(() => {
        // this.toastService.error('Unable to load providers.');
      });
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
    const cellDate = moment(this.appointmentForm.value.date, DATE_FORMAT);
    const cellTime = moment(
      this.formatTimeService.convertTime12to24(this.appointmentForm.value.time),
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

  onProviderSelect() {
    this.loadAvailableDates();
  }

  loadAvailableDates() {
    const clinicId = this.appointmentForm.value.clinicId;
    const serviceIds = this.appointmentForm.value.serviceIds;
    const providerId = this.appointmentForm.value.providerId;

    if (clinicId && serviceIds?.length > 0 && providerId) {
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
              this.appointmentForm.controls['date'].setValue('');
              // if (!this.appointmentId) {
              //   this.validateSelectedDateByDefault(
              //     this.dateTimeObj.availableDateByProviderId
              //   );
              // }

              this.dateTimeObj.calendarMinDate = new Date(minDate);
              this.dateTimeObj.calendarMaxDate = new Date(maxDate);
              // this.loadAvailableTimeSlot(this.appointmentForm.value.date)
            } else {
              this.toastService.error(
                'Provider schedule not available for the selected date'
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

  onDateSelect(e?: any) {
    console.log(e);
    const date = moment(this.appointmentForm.value.date).format(
      'YYYY-MM-DD HH:mm:ss ZZ'
    );
    this.loadAvailableTimeSlot(date);
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
        let availableTimeCount = 0;
        const isTimeInResponse = response.some((time: string) => {
          const value = moment(time).format('YYYY-MM-DD HH:mm:ss ZZ');
          return value === selectedTime;
        });

        //Below change is to only show the selected available time in create mode and edit mode should work like previoulsy
        availableTimeCount =
          isTimeInResponse && !this.appointmentId ? availableTimeCount + 1 : 0;
        if (
          !isTimeInResponse &&
          this.appointmentId &&
          this.areDatesEqualIgnoringTime(
            new Date(this.appointmentData?.appointmentStartDate),
            this.appointmentForm.value.date
          )
        ) {
          const value = moment(selectedTime).format('YYYY-MM-DD HH:mm:ss ZZ');
          availableTimeCount = availableTimeCount + 1;
          // Push the selectedTime to the response array
          response.push(value);

          // Update the appointmentForm
          this.appointmentForm.patchValue({
            time: value,
            timeForUpdateAppt: value
          });
        }
        if (response.length > 0) {
          // this.isSelectedDateTimeAvaialble = true;

          response.forEach((time: any) => {
            const value = moment(time).format('YYYY-MM-DD HH:mm:ss ZZ');
            this.dateTimeObj.availableTimes.push({
              label: this.formatTimeService.formatTimeslot(
                time,
                this.appointmentData?.timeZone
              ),
              value: value
            });
          });
          // if (this.appointmentId) {
          //   this.appointmentForm.patchValue({
          //     time: this.dateTimeObj.time
          //   });
          // }
          if (availableTimeCount == 0 && !this.appointmentId) {
            this.isSelectedDateTimeAvaialble = false;
            // this.toastService.error('The selected Time slot is not available');
            this.appointmentForm.patchValue({
              time: this.dateTimeObj.availableTimes[0]
            });
            this.selectTimeSlotAvailable(
              response,
              this.appointmentForm.value.time
            );
          } else {
            this.isSelectedDateTimeAvaialble = true;
            this.appointmentForm.patchValue({
              time: selectedTime,
              timeForUpdateAppt: selectedTime
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

  areDatesEqualIgnoringTime(date1: any, date2: any) {
    const strippedDate1 = new Date(date1);
    strippedDate1.setHours(0, 0, 0, 0); // Set time to midnight (00:00:00)

    const strippedDate2 = new Date(date2);
    strippedDate2.setHours(0, 0, 0, 0); // Set time to midnight (00:00:00)

    // Compare the stripped dates
    return strippedDate1.getTime() === strippedDate2.getTime();
  }

  selectTimeSlotAvailable(response: any, selectedTime: any) {
    response.forEach((time: any) => {
      const value = moment(time).format('YYYY-MM-DD HH:mm:ss ZZ');
      if (value == selectedTime) {
        this.isSelectedDateTimeAvaialble = true;
      }
    });
  }

  isEnabledVirtualConsulatation() {
    return this.selectedClinicData?.disableVirtualAppointment ? false : true;
  }

  isEnabledInPersonConsulatation() {
    return this.selectedClinicData?.disableInPersonAppointment ? false : true;
  }

  onTimeSelect(e: any) {
    this.isSelectedDateTimeAvaialble = true;
    console.log('time slot============', e, this.appointmentForm.value);
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

  cancelAppointments() {
    this.showModal = false;
    this.appointmentService.cancelAppointment(this.appointmentId).then(
      () => {
        this.afterAppointmentCreated.emit(true);
        this.toastService.success('Appointment canceled successfully');
      },
      () => {
        // this.toastMessageService.error('Unable to delete a appointment');
      }
    );
  }

  hideModal() {
    this.showModal = false;
    this.appointmentData = null;
    this.appointmentForm.reset();
    this.appointmentForm = null;
    this.modalClosed.emit(true);
    this.initializeAppointmentForm();
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

    this.isAppointmentCreated = 'created start - 872';

    console.log(formData);
    const date: any = formData.appointmentDate;
    const timeZone =
      this.timezone ??
      this.localStorageService.readStorage('defaultClinic')?.timezone;

    //   const t = moment.utc(moment(date).utc()).format();

    // var clearUTCDate = moment(date).utcOffset(t).format('YYYY-MM-DD HH:mm:00');
    // console.log(date, timeZone, t, clearUTCDate )
    // var zonedDateTime = moment
    //   .tz(clearUTCDate, timeZone)
    //   .format('YYYY-MM-DD HH:mm:00 ZZ');

    const t = moment.utc(moment(date, 'YYYY-MM-DD HH:mm:ss ZZ')).format();

    var clearUTCDate = moment(date, 'YYYY-MM-DD HH:mm:ss ZZ')
      .utcOffset(t)
      .format('YYYY-MM-DD HH:mm:00');
    console.log(date, timeZone, t, clearUTCDate);
    var zonedDateTime = moment
      .tz(clearUTCDate, timeZone)
      .format('YYYY-MM-DD HH:mm:00 ZZ');

    console.log(zonedDateTime, timeZone);
    formData.appointmentDate = zonedDateTime;
    this.isLoading = true;
    this.isAppointmentCreated = formData;

    /* --------------------- APi call for create appoinment --------------------- */
    this.appointmentService
      .createNewAppointment(formData)
      .then((response: any) => {
        console.log(response);
        this.isLoading = false;
        if (response.statusCode == 500) {
          this.toastService.error(response.message);
          return;
        }
        this.toastService.success('Appointment created successfully');
        this.isAppointmentCreated = 'success - 899';
        this.showModal = false;
        this.afterAppointmentCreated.emit(true);
      })
      .catch((e: any) => {
        // this.isAppointmentCreated = 'error'
        const str = JSON.stringify(e);
        // this.isAppointmentCreated = str
        const el = document.createElement('textarea');
        el.value = str;
        el.setAttribute('readonly', '');
        el.style.position = 'absolute';
        el.style.left = '-9999px';
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
        if (e?.error?.errorMessage.includes('This email is already exist')) {
          this.toastService.error(e?.error?.errorMessage);
        } else {
          this.toastService.error('Unable to create the appointment!');
        }
      });
  }

  updateAppointment(formData: any) {
    formData.appointmentDate = moment(
      formData.timeForUpdateAppt.replace(/-/g, '/')
    )
      .format('YYYY/MM/DD HH:mm:ss ZZ')
      .replace(/[/]/g, '-');
    console.log('apponijt', this.appointmentForm.value);

    console.log('formData.appointmentDate ' + formData.appointmentDate);
    console.log(formData, this.appointmentForm.value);
    this.isLoading = true;
    this.appointmentService
      .updateAppointment(this.appointmentId, formData)
      .then(() => {
        this.afterAppointmentCreated.emit(true);
        this.toastService.success('Appointment updated successfully');
        this.showModal = false;
        this.isLoading = false;
      })
      .catch((e: any) => {
        this.isLoading = false;
        if (e?.error?.errorMessage?.includes('This email is already exist')) {
          this.toastService.error(e?.error.errorMessage);
        } else if (e?.error?.message) {
          this.toastService.error(e?.error.message);
        } else {
          this.toastService.error('Unable to update the appointment!');
        }
      });
  }
}
