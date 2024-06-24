import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ActionEventArgs,
  AgendaService,
  CellClickEventArgs,
  DayService,
  DragAndDropService,
  EventRenderedArgs,
  EventSettingsModel,
  ICalendarExportService,
  ICalendarImportService,
  MonthService,
  PopupOpenEventArgs,
  RenderCellEventArgs,
  ResizeService,
  ScheduleComponent,
  WeekService,
  WorkWeekService
} from '@syncfusion/ej2-angular-schedule';

import { L10n } from '@syncfusion/ej2-base';
import { extend } from 'jquery';
import moment from 'moment';
import { UserService } from 'src/app/modules/user/services/user.service';
import { RegexEnum } from 'src/app/shared/common/constants/regex';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { FormatTimeService } from 'src/app/shared/services/time-utils/formatTime.service';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
import { AppointmentService } from '../../../services/appointment.service';
import { CalendarService } from '../../../services/calendar.service';
import { Location } from '@angular/common';
L10n.load({
  'en-US': {
    schedule: {
      newEvent: 'Create Appointment',
      editEvent: 'Edit Appointment',
      saveButton: 'Ok'
    }
  }
});
@Component({
  selector: 'app-calendar-view',
  templateUrl: './calendar-view.component.html',
  styleUrls: ['./calendar-view.component.css'],
  providers: [
    DayService,
    WeekService,
    ICalendarExportService,
    ICalendarImportService,
    WorkWeekService,
    MonthService,
    AgendaService,
    ResizeService,
    DragAndDropService
  ],
  encapsulation: ViewEncapsulation.None
})
export class CalendarViewComponent implements OnInit, OnChanges {
  isSelectedDateTimeAvaialble: boolean = false;
  dateTimeObj: any = {};
  userWorkingSchedule: any;
  appointmentData: any = {};
  selectedClinicData: any;
  @Input() appointments: any;
  @Input() clinics: any;
  @Input() timezone: any;
  @Input() userId: any;
  @Input() selectedDropDownsObj: any;
  @Input() providersFromParent: any;
  @Input() currentSelectedProvider: any;
  @Input() businessId: any;
  @Input() currentUserResponse: any;
  cancelConfirmVisible: boolean = false;
  showModal = false;
  isSingleClick = false;
  isAppointment = true;
  showModalVaction = false;
  isProvider = false;
  calendarVisible: boolean = true;
  @Output() afterAppointmentCreated: EventEmitter<any> = new EventEmitter();
  @Output() afterProviderSelection: EventEmitter<any> = new EventEmitter();
  @Output() afterVacationCreated: EventEmitter<any> = new EventEmitter();
  @Output() loadAppointmentsCallback: EventEmitter<any> = new EventEmitter();
  /* ---------------------- Calender scheduler variables ---------------------- */
  @ViewChild('scheduleObj')
  public scheduleObj!: ScheduleComponent;
  public eventSettings: EventSettingsModel = { dataSource: [] };
  public selectedDate: Date = new Date();
  public showQuickInfo: Boolean = window.innerWidth > 1024 ? false : true;
  public workWeekDays!: number[];
  events: any[] = [];
  /* ----------------------------- Form variables ----------------------------- */
  formTitle!: string;
  appointmentId: any;
  appointmentForm!: FormGroup;
  vacationScheduleForm: FormGroup;
  serviceByClinicId: any = [];

  providersByServiceId: any;
  selectedTileDate: any;
  clinicVacationScheduleId: any = '';
  /* --------------------------- Form variables ends -------------------------- */

  /* -------------------------- event colors varaible ------------------------- */
  @Input() providerColorObj: any;
  selectedProvider: any;
  isMobileDevice: boolean = false;
  vacationDates: any;

  filteredProviderList: any = [];
  selectedCellDate: any;
  isProviderOnVacation: boolean = false;
  workingDates: any;
  isLoading: boolean;
  patients: any[] = [];
  isAppointmentCreated: any;
  notesLabel: string = 'Notes';
  currentId: any = '';
  notesRequired = false;
  patientEmails: any[] = [];
  constructor(
    public formBuilder: FormBuilder,
    private appointmentService: AppointmentService,
    private formatTimeService: FormatTimeService,
    private calendarService: CalendarService,
    private toastService: ToasTMessageService,
    private userService: UserService,
    private localStorageService: LocalStorageService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public location: Location
  ) {}

  ngOnInit(): void {
    if (this.clinics.length > 0) {
      this.selectedClinicData = this.clinics[0];
      console.log('selectedClinicData');
      console.log(this.selectedClinicData);
    }
    this.initializeAppointmentForm();
    setTimeout(() => {
      this.getPatients();
    }, 2000);
    this.onResize();
    this.initVacationForm();
    this.getCurrentUser();
    this.updateNotesValidator(); // Call method to update notes validator
    // this.appointmentForm.get('time').valueChanges.subscribe((newValue: any) => {
    //   console.log('newValue', newValue);
    //   // This function will be called whenever the firstName control's value changes.
    //   // newValue contains the updated value.
    // });
  }

  // Method to update notes validator based on clinic data
  updateNotesValidator(): void {
    if (
      this.selectedClinicData &&
      this.selectedClinicData.notesRequiredOptional
    ) {
      this.notesRequired = true;
      this.appointmentForm.get('notes').setValidators(Validators.required);
    } else {
      this.notesRequired = false;
      this.appointmentForm.get('notes').clearValidators();
    }
    this.appointmentForm.get('notes').updateValueAndValidity();
  }

  getCurrentUser() {
    const currentUser =  JSON.parse(localStorage.getItem('currentUser') || '{}');;
    //console.log('Current User', currentUser);
    this.currentId =
      this.activatedRoute.snapshot.params.userId ?? currentUser.id;
    // this.isProvider = currentUser?.isProvider;
    // this.getCurrentUserDetails();
  }

  getCurrentUserDetails() {
    this.userService.getOptimziedUser(this.currentId).then((response: any) => {
      this.isProvider = response?.isProvider;
    });
  }

  initVacationForm() {
    this.vacationScheduleForm = this.formBuilder.group({
      clinicId: ['', [Validators.required]],
      startDate: ['', [Validators.required]],
      endDate: ['', [Validators.required]],
      startTime: [''],
      endTime: [''],
      allDay: [true, [Validators.required]]
    });
  }

  changeSelectAllDays() {
    if (this.vacationScheduleForm.value.allDay) {
      this.vacationScheduleForm.get('startTime').clearValidators();
      this.vacationScheduleForm.get('startTime').setErrors(null);
      this.vacationScheduleForm.get('startTime').updateValueAndValidity();
      this.vacationScheduleForm.get('endTime').clearValidators();
      this.vacationScheduleForm.get('endTime').setErrors(null);
      this.vacationScheduleForm.get('endTime').updateValueAndValidity();
    } else {
      this.vacationScheduleForm
        .get('startTime')
        .addValidators(Validators.required);
      this.vacationScheduleForm
        .get('endTime')
        .addValidators(Validators.required);
    }
  }

  initializeAppointmentForm() {
    this.selectedClinicData = {};
    this.selectedClinicData.isProviderBasedAppointment = true;
    if (this.clinics.length > 0) {
      if (this.clinics.length > 0) {
        if (this.selectedDropDownsObj.clinicIdForFilter) {
          this.selectedClinicData = this.clinics.filter(
            (data: any) =>
              data.id === this.selectedDropDownsObj.clinicIdForFilter
          )[0];
        } else {
          this.selectedClinicData = this.clinics[0];
        }
        this.createCalenderEvents();
        this.scheduleObj.refresh();
      }
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
    } else {
      this.notesRequired = false;
      this.appointmentForm.get('notes')?.clearValidators();
      this.appointmentForm.get('notes')?.updateValueAndValidity();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(
      'this.selectedDropDownsObj',
      this.selectedDropDownsObj,
      this.currentSelectedProvider
    );
    if (
      changes['currentUserResponse'] &&
      this.currentUserResponse?.isProvider
    ) {
      this.isProvider = this.currentUserResponse.isProvider;
    }
    // this.createCalenderEvents();
    if (
      this.currentSelectedProvider &&
      Object.keys(this.currentSelectedProvider).length > 0
    ) {
      this.selectedProvider = this.currentSelectedProvider.fullName;
    } else {
      this.selectedProvider = undefined;
    }
    if (changes['appointments'] && this.scheduleObj) {
      this.createCalenderEvents(true);
      this.scheduleObj.refresh();
    }
    if (changes['clinics'] || changes['selectedDropDownsObj']) {
      if (this.clinics.length > 0) {
        if (this.selectedDropDownsObj.clinicIdForFilter) {
          this.selectedClinicData = this.clinics.filter(
            (data: any) =>
              data.id === this.selectedDropDownsObj.clinicIdForFilter
          )[0];
        } else {
          this.selectedClinicData = this.clinics[0];
        }
        this.createCalenderEvents();
        this.scheduleObj.refresh();
      }
    }
    if (this.selectedClinicData?.disableInPersonAppointment) {
      this.appointmentForm?.patchValue({
        appointmentType: 'Virtual'
      });
    }
    if (this.selectedClinicData?.notesLabel) {
      this.notesLabel = this.selectedClinicData?.notesLabel;
    } else {
      this.notesLabel = 'Notes';
    }

    if (
      this.selectedClinicData?.notesRequiredOptional &&
      this.appointmentForm
    ) {
      this.notesRequired = true;
      this.appointmentForm?.get('notes').setValidators(Validators.required);
    } else {
      this.notesRequired = false;
      this.appointmentForm?.get('notes')?.clearValidators();
      this.appointmentForm?.get('notes')?.updateValueAndValidity();
    }
    if (changes['patients']) {
      this.patientEmails = this.patients?.map((patient) => patient.email) || [];
    }
    //console.log(this.selectedDropDownsObj);
  }

  searchEmail(e: any) {
    this.patientEmails =
      this.patients
        ?.filter(
          (patient) =>
            patient.email &&
            patient.email.toLowerCase().indexOf(e.query.toLowerCase()) == 0
        )
        .map((patient) => patient.email) || [];
  }

  createCalenderEvents(skipUserSchedulesFetch?: boolean) {
    const events: any[] = [];
    if (this.selectedProvider != 'All' && this.selectedProvider != undefined) {
      if (!skipUserSchedulesFetch) {
        this.getUserSchedulesForAppointment(
          this.selectedDropDownsObj.clinicIdForFilter,
          this.selectedDropDownsObj.providerIdForFilter
        );
      }
    } else {
      this.vacationDates = [];
      this.scheduleObj?.refresh();
    }
    if (this.appointments && this.appointments.length > 0) {
      this.appointments.map((appointment: any) => {
        const startDate: any = this.formatTime(
          appointment.timezone,
          appointment.appointmentStartDate
        );
        let endDate;
        if (appointment.appointmentEndDate == null) {
          //endDate = moment(appointment.appointmentDate).add(1, 'hours').toDate();
          endDate = startDate + 1;
        } else {
          //endDate = moment(appointment.appointmentEndDate).toDate()
          endDate = this.formatTime(
            appointment.timezone,
            appointment.appointmentEndDate
          );
        }
        try {
          events.push({
            Id: appointment.id.toString(),
            Subject:
              appointment.patientFirstName + ' ' + appointment.patientLastName,
            CategoryColor: this.providerColorObj[appointment.providerId]?.color
              ? this.providerColorObj[appointment?.providerId]?.color
              : '#1E90FF',
            StartTime: startDate,
            EndTime: endDate,
            Type: 'appointment'
          });
        } catch (e) {
          console.log(
            'Color not found for the provider: ' + appointment.providerId
          );
        }
      });
      // CategoryColor: '#1E90FF',
    }

    if (
      this.selectedClinicData &&
      this.selectedClinicData?.clinicVacationSchedules?.length > 0
    ) {
      try {
        this.selectedClinicData?.clinicVacationSchedules.forEach(
          (schedule: any) => {
            events.push({
              Id: schedule.id.toString(),
              Subject: this.selectedClinicData.name,
              CategoryColor: '#EC5D36',
              StartTime: this.formatTimeService.formatTimeWithoutzone(
                schedule.fromDate
              ),
              EndTime: this.formatTimeService.formatTimeWithoutzone(
                schedule.toDate
              ),
              clinicId: this.selectedClinicData.id,
              Type: 'holiday'
            });
          }
        );
      } catch (e) {
        console.log('exception', e);
      }
    }

    this.events = events;
    this.eventSettings = {
      dataSource: <Object[]>extend([], events, null, true),
      enableTooltip: true
    };
  }

  fromToDate(startDate: string, endDate: string): any {
    if (
      this.vacationScheduleForm.get(startDate).value != '' &&
      this.vacationScheduleForm.get(endDate).value != ''
    ) {
      const fromDate = new Date(
        this.vacationScheduleForm.get(startDate).value.getFullYear(),
        this.vacationScheduleForm.get(startDate).value.getMonth(),
        this.vacationScheduleForm.get(startDate).value.getDate(),
        0,
        0,
        0
      );
      const toDate = new Date(
        this.vacationScheduleForm.get(endDate).value.getFullYear(),
        this.vacationScheduleForm.get(endDate).value.getMonth(),
        this.vacationScheduleForm.get(endDate).value.getDate(),
        0,
        0,
        0
      );
      var currentDate = new Date();
      var formattedCurrentDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate(),
        0,
        0,
        0
      );
      if (fromDate <= formattedCurrentDate) {
        //this.alertService.error("Start Date must be greater than or equal to Current Date");
        return true;
      } else if (fromDate > toDate) {
        this.toastService.error(
          'End Date must be greater than or equal to Start Date'
        );
        return false;
      }
    }
    return true;
  }

  isDateSame(startDate: string, endDate: string): any {
    if (
      this.vacationScheduleForm.get(startDate).value != '' &&
      this.vacationScheduleForm.get(endDate).value != ''
    ) {
      const fromDate = new Date(
        this.vacationScheduleForm.get(startDate).value.getFullYear(),
        this.vacationScheduleForm.get(startDate).value.getMonth(),
        this.vacationScheduleForm.get(startDate).value.getDate(),
        0,
        0,
        0
      );
      const toDate = new Date(
        this.vacationScheduleForm.get(endDate).value.getFullYear(),
        this.vacationScheduleForm.get(endDate).value.getMonth(),
        this.vacationScheduleForm.get(endDate).value.getDate(),
        0,
        0,
        0
      );
      if (fromDate?.getTime() == toDate?.getTime()) {
        return true;
      }
    }
    return false;
  }

  formatTime(timezone: any, time: any) {
    if (!timezone) {
      timezone = this.timezone;
    }
    var input: any = new Date(time);
    var fmt = 'MM/DD/YYYY hh:mm A'; // must match the input
    var zone = timezone;
    var m = moment.tz(input, fmt, zone);
    // convert it to utc
    m.utc();

    // format it for output
    time = m.format(fmt);

    return time;
  }

  public cellDoubleClick(args: CellClickEventArgs): void {
    this.selectedTileDate = args.startTime;
  }

  onActionComplete(args: ActionEventArgs): void {
    if (args && args.requestType) {
      if (
        args.requestType === 'eventChanged' &&
        args.name === 'actionComplete'
      ) {
        if (
          args.changedRecords.length > 0 &&
          args.changedRecords[0]?.EndTime &&
          args.changedRecords[0]?.StartTime &&
          args.changedRecords[0]?.Type != 'holiday'
        ) {
          const utcStartDateTime: any = new Date(
            args.changedRecords[0]?.StartTime
          );
          const utcEndDateTime: any = new Date(args.changedRecords[0]?.EndTime);

          const formData: any = {
            appointmentDate: moment(utcStartDateTime)
              .utcOffset(0, true)
              .format('YYYY-MM-DD HH:mm:00 ZZ'),
            appointmentEndDate: moment(utcEndDateTime)
              .utcOffset(0, true)
              .format('YYYY-MM-DD HH:mm:00 ZZ'),
            clinicId: this.selectedClinicData.id,
            appointmentId: args.changedRecords[0]?.Id,
            appointmentType: 'InPerson'
          };
          this.updateAppointmentDate(args.changedRecords[0]?.Id, formData);
        }

        if (
          args.changedRecords.length > 0 &&
          args.changedRecords[0]?.EndTime &&
          args.changedRecords[0]?.StartTime &&
          args.changedRecords[0]?.Type === 'holiday'
        ) {
          const utcStartDateTime: any = new Date(
            args.changedRecords[0]?.StartTime
          );
          const utcEndDateTime: any = new Date(args.changedRecords[0]?.EndTime);
          var vactaionData = {
            startDate: moment(utcStartDateTime)
              .utcOffset(0, true)
              .format('YYYY-MM-DD 00:00:00 ZZ'),
            endDate: moment(utcEndDateTime)
              .utcOffset(0, true)
              .format('YYYY-MM-DD 00:00:00 ZZ'),
            startTime: moment(utcStartDateTime)
              .utcOffset(0, true)
              .format('HH:mm'),
            endTime: moment(utcEndDateTime).utcOffset(0, true).format('HH:mm'),
            allDay: false
          } as any;

          vactaionData['id'] = Number(args.changedRecords[0].Id);
          this.calendarService
            .updateClinicVacationSchedule(
              [vactaionData],
              this.selectedClinicData.id
            )
            .then(() => {
              this.clinicVacationScheduleId = null;
              this.afterVacationCreated.emit(true);
              this.toastService.success('Vacation updated successfully');
            })
            .catch(() => {
              this.toastService.error(
                'Please reschedule, existing appointments or vacations coinciding with your vacation period.'
              );
              this.afterVacationCreated.emit(true);
            });
        }
      } else if (
        ['dateNavigate', 'viewNavigate'].includes(args.requestType) &&
        args.name === 'actionComplete'
      ) {
        // console.log(this.scheduleObj.getCurrentViewDates());
        const currentDates = this.scheduleObj.getCurrentViewDates();
        let startDate;
        let endDate = null;
        if (currentDates?.length > 0) {
          if (currentDates.length > 1) {
            startDate = moment(currentDates[0])
              .startOf('day')
              .format('yyyy-MM-DD HH:mm');
            endDate = moment(currentDates[currentDates.length - 1])
              .endOf('day')
              .format('yyyy-MM-DD HH:mm');
          } else {
            startDate = moment(currentDates[0])
              .startOf('day')
              .format('yyyy-MM-DD HH:mm');
            endDate = moment(currentDates[0])
              .endOf('day')
              .format('yyyy-MM-DD HH:mm');
          }
        }
        this.loadAppointmentsCallback.emit({
          startDate: startDate,
          endDate: endDate
        });
      }
    }
  }

  onRenderCell(args: RenderCellEventArgs): void {
    if (args.elementType === 'workCells') {
      args.element.classList.add('e-disable-dates');
      // this.disableVacationDates(args);

      this.changeNonWorkDayColor(args);
      this.enableWorkingSchedule(args);
      this.disableVacationDates(args);
      // this.disableClinicVacationDates(args);
      // this.changeWorkDayColor(args);
    }
  }

  onEventRendered(args: EventRenderedArgs): void {
    const categoryColor: string = args.data.CategoryColor as string;
    if (!args.element || !categoryColor) {
      return;
    }
    if (this.scheduleObj.currentView === 'Agenda') {
      (args.element.firstChild as HTMLElement).style.borderLeftColor =
        categoryColor;
    } else {
      args.element.style.backgroundColor = categoryColor;
    }
  }

  public onPopupOpen(args: PopupOpenEventArgs): void {
    if (args.target.classList.contains('e-disable-dates')) {
      args.cancel = true;
      return;
    }
    if (args?.data?.Type === 'holiday') {
      this.showModal = false;
      args.cancel = true;
      this.showModalVaction = true;
      this.editVacationCalendar(args?.data?.Id, args?.data?.clinicId);
    } else {
      console.log(args);
      this.showModal = true;
      /* -------------------------------------------------------------------------- */
      /* In month view to show list of all the events below check is done              */
      /* -------------------------------------------------------------------------- */
      if (args.type === 'EventContainer') {
        this.showModal = false;
      }
      if (args.type === 'Editor' || args.type === 'QuickInfo') {
        args.cancel = true;
      }
      this.formTitle = 'Add Appointment';
      this.appointmentId = args.data;
      if (this.appointmentId.Id) {
        this.appointmentId = this.appointmentId.Id;
        this.loadAppointment();
        console.log(this.appointmentId.Id, 'idss');
        this.formTitle = 'Edit Appointment';
        // Disable the email field when editing appointment
        this.appointmentForm.get('email').disable();
      } else {
        console.log(this.selectedDropDownsObj);
        this.appointmentId = null;
        // this.loadProvidersByServiceId(this.defaultServiceId);// To set default service provider
        this.selectedTileDate = args?.data?.StartTime;
        this.dateTimeObj.availableTimes = [];
        this.initializeAppointmentForm();
        /* --------------------- converting current time to utc --------------------- */
        const utcDateTime: any = new Date(this.selectedTileDate);
        utcDateTime.setHours(utcDateTime.getHours() + 5);
        utcDateTime.setMinutes(utcDateTime.getMinutes() + 30);
        this.dateTimeObj.availableTimes.push({
          label: moment(this.selectedTileDate).format('hh:mm A'),
          value: moment(utcDateTime).format('YYYY-MM-DD HH:mm:ss ZZ')
        });
        this.appointmentForm.patchValue({
          clinicId: this.selectedDropDownsObj?.clinicIdForFilter,
          date: this.selectedTileDate,
          time: moment(utcDateTime).format('YYYY-MM-DD HH:mm:ss ZZ')
        });
        this.vacationScheduleForm.patchValue({
          clinicId: this.selectedDropDownsObj?.clinicIdForFilter,
          startDate: this.selectedTileDate,
          endDate: this.selectedTileDate
        });
        this.loadServiceByClinicId(
          this.selectedDropDownsObj?.clinicIdForFilter
        );
        if (this.providersByServiceId?.length === 1) {
          this.appointmentForm.patchValue({
            providerId: this.providersByServiceId[0].id
          });
        }
      }
    }
  }

  hideModal() {
    this.showModal = false;
    this.appointmentData = null;
    this.appointmentForm.reset();
    this.appointmentForm = null;
    this.initializeAppointmentForm();
  }

  cancelAppointChanges() {
    this.location.back();
    this.router.navigate(['/appointment/calendar']);
  }

  // cancelAppointments() {
  //   this.showModal = false;
  //   // Call the appointment service to cancel the appointment
  //   this.appointmentService.cancelAppointment(this.appointmentId).then(
  //     () => {
  //       // Appointment canceled successfully
  //       this.toastService.success('Appointment canceled successfully');
  //       this.afterAppointmentCreated.emit(true);
  //       // Hide the cancel confirmation pop-up
  //       this.cancelConfirmVisible = false;
  //       // this.otherPopUpVisible = false;

  //       // Redirect to the calendar page
  //       this.router.navigate(['/appointment/calendar']);
  //     },
  //     (error) => {
  //       // Handle any errors that occur during the cancellation process
  //       console.error('Error canceling appointment:', error);
  //       // this.toastMessageService.error('Unable to cancel appointment');
  //     }
  //   );
  // }

  // Update the cancelAppointments() function
  cancelAppointments() {
    // Immediately hide the calendar view
    this.calendarVisible = false;

    // Immediately hide the modal when the "Proceed" button is clicked
    this.showModal = false;

    // Hide the cancel confirmation pop-up
    this.cancelConfirmVisible = false;

    // Call the appointment service to cancel the appointment
    this.appointmentService.cancelAppointment(this.appointmentId).then(
      () => {
        // Appointment canceled successfully
        this.toastService.success('Appointment canceled successfully');
        this.afterAppointmentCreated.emit(true);

        // Redirect to the calendar page
        this.router.navigate(['/appointment/calendar']);
      },
      (error) => {
        // Handle any errors that occur during the cancellation process
        console.error('Error canceling appointment:', error);
      }
    );
  }
  async loadAppointment() {
    const promises = [
      this.appointmentService.getAllServicesForDropdown(null),
      this.appointmentService.getOptimizedSingleAppointment(this.appointmentId)
    ];
    Promise.all(promises)
      .then((data: any) => {
        this.serviceByClinicId = data[0].serviceList;

        this.appointmentData = data[1];
        // console.log('appointmentdata', data[1]);
        // this.loadServiceByClinicId(this.appointmentData.clinicId);
        const serviceIds1 = this.appointmentData.serviceList.map(
          (data: any) => {
            return data.serviceId;
          }
        );
        this.dateTimeObj.appointmentStartDate = moment(
          this.appointmentData.appointmentStartDate
        ).format('YYYY-MM-DD 00:00:00 ZZ');

        this.dateTimeObj.time = moment(
          this.appointmentData.appointmentStartDate
        ).format('YYYY-MM-DD HH:mm:ss ZZ');

        this.dateTimeObj.timeLabel = this.formatTimeService.formatTimeslot(
          this.appointmentData.appointmentStartDate,
          this.appointmentData.timeZone
        );

        // this.onServiceSelect(serviceIds1, true);
        // this.loadProvidersByServiceId(serviceIds1);
        this.appointmentForm.reset();
        this.appointmentForm.controls['timeForUpdateAppt'].addValidators(
          Validators.required
        );
        this.appointmentForm.patchValue({ time: '' });
        console.log('6111 before', this.appointmentForm.value);
        this.appointmentForm.patchValue({
          firstName: this.appointmentData.patientFirstName,
          lastName: this.appointmentData.patientLastName,
          email: this.appointmentData.patientEmail,
          phone: this.appointmentData.patientPhone,
          notes: this.appointmentData.notes,
          clinicId: this.appointmentData.clinicId,
          serviceIds: serviceIds1,
          providerId: this.appointmentData.providerId,
          time: this.dateTimeObj.time,
          timeForUpdateAppt: this.dateTimeObj.time,
          date: new Date(this.appointmentData.appointmentStartDate),
          appointmentType: this.appointmentData.appointmentType
            ? this.appointmentData.appointmentType
            : 'InPerson',
          source: this.appointmentData?.source
        });

        // console.log(
        //   'after',
        //   this.dateTimeObj.time,
        //   this.appointmentData.appointmentStartDate,
        //   this.appointmentForm.value
        // );

        if (
          this.appointmentData.notesLabel &&
          this.appointmentData.notesLabel != 'Additional Notes (Optional)'
        ) {
          this.notesLabel = this.appointmentData.notesLabel;
        }

        const request = {
          date: this.dateTimeObj.time,
          clinicId: this.appointmentData.clinicId,
          providerId: this.appointmentData.providerId,
          serviceIds: serviceIds1,
          appointmentId: this.appointmentId
        };
        this.loadProvidersDataForAppointment(serviceIds1, request);

        if (this.appointmentData.providerId) {
          // this.loadAvailableDates();
          // this.loadAvailableTimeSlot(this.dateTimeObj.time);
        } else {
          const formData: any = {
            // eslint-disable-next-line prettier/prettier

            date: moment(this.appointmentData?.appointmentStartDate).format(
              'YYYY-MM-DD 00:00:00 ZZ'
            ),
            clinicId: this.appointmentData.clinicId,
            serviceIds: serviceIds1,
            appointmentId: this.appointmentData.id
          };
          this.getTimeSlotsWithoutProvider(formData);
        }
      })
      .catch(() => {
        this.toastService.error(
          'There is some error while fetching appointment'
        );
      });
  }

  loadProvidersDataForAppointment(serviceIds: any, request: any) {
    this.calendarService
      .getProvidersDataForAppointment(serviceIds, request)
      .then((response: any) => {
        if (response?.users && response.users.userDTOList?.length > 0) {
          response.users.userDTOList.map((data: any) => {
            data['fullName'] = data.firstName + ' ' + data.lastName;
          });
          this.providersByServiceId = response.users.userDTOList;
          const providerIds = this.providersByServiceId.map(
            (provider: any) => provider.id
          );
          if (this.appointmentData.providerId) {
            this.getVacationScheduleForProvider(providerIds);
          }
        }
        if (response.scheduleDatesList) {
          this.setLoadedAvailableDates(response.scheduleDatesList);
        }
        if (response.scheduleTimesList) {
          this.dateTimeObj.availableTimes = [];
          this.setLoadedAvailableTimeSlots(
            response.scheduleTimesList,
            this.appointmentForm.value.time
          );
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

        const isTimeInResponse = response.some((time: string) => {
          const value = moment(time).format('YYYY-MM-DD HH:mm:ss ZZ');
          return value === selectedTime;
        });

        //Below change is to only show the selected available time in create mode and edit mode should work like previoulsy
        if (
          !isTimeInResponse &&
          this.appointmentId &&
          this.areDatesEqualIgnoringTime(
            new Date(this.appointmentData?.appointmentStartDate),
            this.appointmentForm.value.date
          )
        ) {
          const value = moment(selectedTime).format('YYYY-MM-DD HH:mm:ss ZZ');
          // Push the selectedTime to the response array
          response.push(value);

          setTimeout(() => {
            this.appointmentForm.patchValue({
              time: value,
              timeForUpdateAppt: value
            });
          }, 500);
          // Update the appointmentForm
        }

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
  get f() {
    return this.appointmentForm.controls;
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

  onClinicSelect(clinicId: any) {
    this.selectedClinicData = this.clinics.filter(
      (data: any) => data.id == clinicId.value
    )[0];
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
      this.appointmentForm.get('notes').setValidators(Validators.required);
    } else {
      this.notesRequired = false;
      this.appointmentForm.get('notes')?.clearValidators();
      this.appointmentForm.get('notes')?.updateValueAndValidity();
    }
    this.loadServiceByClinicId(clinicId);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onClinicVacationSelect(clinicId: any) {
    // const selectedClinicDataVacation = this.clinics.filter(
    //   (data: any) => data.id == clinicId.value
    // )[0];
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
        if (response.userDTOList && response.userDTOList.length > 0) {
          response.userDTOList.map((data: any) => {
            data['fullName'] = data.firstName + ' ' + data.lastName;
          });
          this.providersByServiceId = response.userDTOList;
          const providerIds = this.providersByServiceId.map(
            (provider: any) => provider.id
          );
          if (this.providersByServiceId?.length === 1) {
            this.appointmentForm.patchValue({
              providerId: this.providersByServiceId[0].id
            });
          }
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
            this.setLoadedAvailableDates(response);
          },
          () => {
            this.toastService.error(
              'Unable to load available dates of provider.'
            );
          }
        );
    }
  }

  setLoadedAvailableDates(response: any) {
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
        'Provider schedule not available for the selected date'
      );
      this.isSelectedDateTimeAvaialble = false;
      this.appointmentForm.value.date = '';
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
        this.setLoadedAvailableTimeSlots(response, selectedTime);
      });
  }

  setLoadedAvailableTimeSlots(response: any, selectedTime: any) {
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
      setTimeout(() => {
        this.appointmentForm.patchValue({
          time: value,
          timeForUpdateAppt: value
        });
      }, 500);
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
        this.selectTimeSlotAvailable(response, this.appointmentForm.value.time);
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

  onTimeSelect(e: any) {
    this.isSelectedDateTimeAvaialble = true;
    console.log('time slot============', e, this.appointmentForm.value);
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

  updateAppointmentDate(appointmentId: any, formData: any) {
    console.log('formData ', formData);
    this.isLoading = true;
    this.appointmentService
      .updateAppointmentDate(appointmentId, formData)
      .then(() => {
        this.afterAppointmentCreated.emit(true);
        this.toastService.success('Appointment updated successfully');
      })
      .catch((e: any) => {
        this.isLoading = false;
        this.afterAppointmentCreated.emit(true);
        if (e?.error?.errorMessage?.includes('This email is already exist')) {
          this.toastService.error(e?.error.errorMessage);
        } else if (e?.error?.message) {
          this.toastService.error(e?.error.message);
        } else {
          this.toastService.error('Unable to update the appointment!');
        }
      });
  }

  updateAppointment(formData: any) {
    // formData.appointmentDate = moment(
    //   formData.timeForUpdateAppt.replace(/-/g, '/')
    // )
    //   .format('YYYY/MM/DD HH:mm:ss ZZ')
    //   .replace(/[/]/g, '-');

    formData.appointmentDate = moment(
      formData.timeForUpdateAppt,
      'YYYY-MM-DDTHH:mm:ssZ' // Specify the input format
    )
      .format('YYYY/MM/DD HH:mm:ss ZZ')
      .replace(/[/]/g, '-');
    console.log('apponijt', this.appointmentForm.value);

    console.log('formData.appointmentDate ' + formData.appointmentDate);
    console.log(formData, this.appointmentForm.value);
    console.log(this.updateAppointment, 'appointment');
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

  providerSelection(id: any) {
    console.log(id);
    this.selectedProvider = '';
    let pid;
    if (id == 0) {
      pid = 0;
      this.selectedProvider = 'All';
    } else {
      pid = id.id;
      this.selectedProvider = id.fullName;
    }
    this.appointmentForm.patchValue({
      providerIdForFilter: pid
    });
    this.afterProviderSelection.emit(id);
    // this.loadAppointment(
    //   this.defaultClinicId,
    //   this.defaultProviderId,
    //   this.defaultServiceId
    // );
  }

  /* -------------------------------------------------------------------------- */
  /*                   Fill patient details by email if exist                   */
  /* -------------------------------------------------------------------------- */
  OnEmailSelected(e: any, hasError: any) {
    this.fetchPatientByEmail(e, hasError);
  }
  OnEmailFeildBlur(e: any, hasError: any) {
    console.log(e.target.value, hasError);
    const email: any = e.target.value;
    this.fetchPatientByEmail(email, hasError);
  }

  fetchPatientByEmail(email: any, hasError: any) {
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
  @HostListener('window:resize', ['$event'])
  onResize() {
    if (window.innerWidth <= 768) {
      this.isMobileDevice = true;
    } else {
      this.isMobileDevice = false;
    }
  }

  OnEditCreateAppointment(e: any) {
    if (e && e.id) {
      this.appointmentId = e.id;
      this.loadAppointment();
      this.showModal = true;
    } else {
      console.log(e);
      if (e?.selectedDate) {
        this.selectedTileDate = e?.selectedDate;
        this.dateTimeObj.availableTimes = [];

        this.initializeAppointmentForm();
        const utcDateTime: any = new Date(this.selectedTileDate);
        utcDateTime.setHours(utcDateTime.getHours() + 5);
        utcDateTime.setMinutes(utcDateTime.getMinutes() + 30);
        this.dateTimeObj.availableTimes.push({
          label: moment(this.selectedTileDate).format('hh:mm A'),
          value: moment(utcDateTime).format('YYYY-MM-DD HH:mm:ss ZZ')
        });
        console.log(this.selectedDate);
        this.appointmentForm.patchValue({
          clinicId: this.selectedDropDownsObj?.clinicIdForFilter,
          date: this.selectedTileDate,
          time: moment(utcDateTime).format('YYYY-MM-DD HH:mm:ss ZZ')
        });

        this.loadServiceByClinicId(
          this.selectedDropDownsObj?.clinicIdForFilter
        );
      }
      this.showModal = true;
    }
  }

  changeNonWorkDayColor(args: RenderCellEventArgs) {
    if (!args.element.classList.contains('e-work-hours')) {
      args.element.classList.add('e-disable-dates');
    }
  }

  changeWorkDayColor() {
    // if (args.element.classList.contains('e-disable-dates')) {
    //   args.element.classList.remove('e-disable-dates');
    // }
  }

  getUserSchedulesForAppointment(clinicId: number, providerId: number) {
    if (!providerId || !clinicId) {
      return;
    }
    const scheduleTypes = ['vacation', 'working'];
    this.calendarService
      .getUserSchedulesForAppointment(clinicId, providerId, scheduleTypes)
      .then(
        (response: any) => {
          if (response) {
            this.vacationDates = response.vacation;
            this.workingDates = response.working;
            // refresh is required to reload the onRenderCell to fix dropdown select values should reflect on the calender
            this.scheduleObj.refresh();
          }
        },
        () => {
          this.toastService.error('Unable to load Shedule data.');
        }
      );
  }

  getVacationSchedule(clinicId: number, providerId: number) {
    if (!providerId) {
      return;
    }
    this.calendarService.getVacationSchedules(clinicId, providerId).then(
      (response: any) => {
        this.vacationDates = response;
        // refresh is required to reload the onRenderCell to fix dropdown select values should reflect on the calender
        this.scheduleObj.refresh();
      },
      () => {
        this.toastService.error('Unable to load vacation schedule.');
      }
    );
  }

  getWorkingSchedule(clinicId: number, providerId: number) {
    if (!providerId) {
      return;
    }
    this.calendarService.getWorkingSchedules(clinicId, providerId).then(
      (response: any) => {
        this.workingDates = response;
        // refresh is required to reload the onRenderCell to fix dropdown select values should reflect on the calender
        this.scheduleObj.refresh();
      },
      () => {
        this.toastService.error('Unable to load vacation schedule.');
      }
    );
  }

  enableWorkingSchedule(args: RenderCellEventArgs) {
    const DATE_FORMAT = 'YYYY-MM-DD';
    const TIME_FORMAT = 'HH:mm:ss';
    // if (args.date.getDay() === 0 || args.date.getDay() === 6) {
    //   //set 'true' to disable the weekends
    //   args.element.classList.add('e-disable-dates');
    // }
    // Parse list of vacation startDate and endDate
    if (this.workingDates && this.workingDates.length > 0) {
      this.workingDates.forEach((schedule: any) => {
        const startDate = moment(schedule.fromDate, DATE_FORMAT);
        const endDate = moment(schedule.toDate, DATE_FORMAT);
        // Parse list of vacation startTime and endTime
        schedule.userScheduleTimings.forEach((timings: any) => {
          const weekArr = timings.days;

          // const nonWorkingDays: any = WEEKDAYS.filter(
          //   (x) => !weekArr.includes(x)
          // );
          const startTimeStr = moment(timings.timeFromDate, TIME_FORMAT);
          const endTimeStr = moment(timings.timeToDate, TIME_FORMAT);

          startDate.set({
            hour: startTimeStr.get('hour'),
            minute: startTimeStr.get('minute'),
            second: startTimeStr.get('second')
          });
          endDate.set({
            hour: endTimeStr.get('hour'),
            minute: endTimeStr.get('minute'),
            second: endTimeStr.get('second')
          });

          //parse date and time for a cell
          const cellDate = moment(args.date, DATE_FORMAT);
          const cellTime = moment(cellDate, TIME_FORMAT);

          if (cellDate >= startDate && cellDate <= endDate) {
            if (
              cellTime.get('hour') > startTimeStr.get('hour') &&
              cellTime.get('hour') < endTimeStr.get('hour') &&
              weekArr.includes(WeekdaysObj[args.date.getDay()])
            ) {
              args.element.classList.remove('e-disable-dates');
            } else {
              if (
                cellTime.get('hour') === startTimeStr.get('hour') &&
                weekArr.includes(WeekdaysObj[args.date.getDay()])
              ) {
                if (
                  cellTime.get('minute') >= startTimeStr.get('minute') &&
                  startTimeStr.get('hour') !== endTimeStr.get('hour')
                ) {
                  // nonWorkingDays = nonWorkingDays.filter(
                  //   (item: any) => item !== WeekdaysObj[args.date.getDay()]
                  // );
                  args.element.classList.remove('e-disable-dates');
                }
              }
              if (
                cellTime.get('hour') === endTimeStr.get('hour') &&
                weekArr.includes(WeekdaysObj[args.date.getDay()])
              ) {
                if (cellTime.get('minute') < endTimeStr.get('minute')) {
                  args.element.classList.remove('e-disable-dates');
                }
              }
            }
          }
          //this.handleDisbaleNonWorkingDays(nonWorkingDays, args);
        });
      });
    }
  }

  handleDisbaleNonWorkingDays(nonWorkingDays: any, args: RenderCellEventArgs) {
    // console.log(nonWorkingDays, args.element);
    nonWorkingDays.map((day: any) => {
      if (args.date.getDay() == Number(WeekdaysEnum[day])) {
        args.element.classList.add('e-disable-dates');
      }
    });
  }
  disableVacationDates(args: RenderCellEventArgs) {
    const DATE_FORMAT = 'YYYY-MM-DD';
    const TIME_FORMAT = 'HH:mm:ss';
    // Parse list of vacation startDate and endDate
    if (this.vacationDates && this.vacationDates.length > 0) {
      this.vacationDates.forEach((schedule: any) => {
        const startDate = moment(schedule.fromDate, DATE_FORMAT);
        const endDate = moment(schedule.toDate, DATE_FORMAT);
        // Parse list of vacation startTime and endTime
        schedule.userScheduleTimings.forEach((timings: any) => {
          const startTimeStr = moment(timings.timeFromDate, TIME_FORMAT);
          const endTimeStr = moment(timings.timeToDate, TIME_FORMAT);

          startDate.set({
            hour: startTimeStr.get('hour'),
            minute: startTimeStr.get('minute'),
            second: startTimeStr.get('second')
          });
          endDate.set({
            hour: endTimeStr.get('hour'),
            minute: endTimeStr.get('minute'),
            second: endTimeStr.get('second')
          });

          //parse date and time for a cell
          const cellDate = moment(args.date, DATE_FORMAT);
          const cellTime = moment(cellDate, TIME_FORMAT);

          // if (cellDate.isBetween(startDate,endDate))
          if (cellDate >= startDate && cellDate <= endDate) {
            if (
              cellTime.get('hour') > startTimeStr.get('hour') &&
              cellTime.get('hour') < endTimeStr.get('hour')
            ) {
              args.element.classList.add('e-disable-dates');
            } else {
              if (cellTime.get('hour') === startTimeStr.get('hour')) {
                if (
                  cellTime.get('minute') >= startTimeStr.get('minute') &&
                  startTimeStr.get('hour') !== endTimeStr.get('hour')
                ) {
                  args.element.classList.add('e-disable-dates');
                }
              }
              if (cellTime.get('hour') === endTimeStr.get('hour')) {
                if (cellTime.get('minute') < endTimeStr.get('minute')) {
                  args.element.classList.add('e-disable-dates');
                }
              }
            }
          }
        });
      });
    }
  }

  disableClinicVacationDates(args: RenderCellEventArgs) {
    const DATE_FORMAT = 'YYYY-MM-DD';
    const TIME_FORMAT = 'HH:mm:ss';
    // Parse list of vacation startDate and endDate
    if (
      this.selectedClinicData &&
      this.selectedClinicData?.clinicVacationSchedules?.length > 0
    ) {
      this.selectedClinicData?.clinicVacationSchedules.forEach(
        (schedule: any) => {
          const startDate = moment(schedule.fromDate, DATE_FORMAT);
          const endDate = moment(schedule.toDate, DATE_FORMAT);
          // Parse list of vacation startTime and endTime

          const startTimeStr = moment(
            this.formatTimeService.getTimeFromDate(schedule.fromDate),
            TIME_FORMAT
          );
          const endTimeStr = moment(
            this.formatTimeService.getTimeFromDate(schedule.toDate),
            TIME_FORMAT
          );

          startDate.set({
            hour: startTimeStr.get('hour'),
            minute: startTimeStr.get('minute'),
            second: 0
          });
          endDate.set({
            hour: endTimeStr.get('hour'),
            minute: endTimeStr.get('minute'),
            second: 0
          });

          //parse date and time for a cell
          const cellDate = moment(args.date, DATE_FORMAT);
          const cellTime = moment(cellDate, TIME_FORMAT);

          cellDate.set({
            hour: cellTime.get('hour'),
            minute: cellTime.get('minute'),
            second: 0
          });

          if (cellDate >= startDate && cellDate < endDate) {
            args.element.classList.add('e-disable-dates');
          }
        }
      );
    }
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

  filterByPatientsName(
    items: any[],
    searchName: string,
    secondarySearch: string,
    searchNameIdentifier: string,
    secondarySearchIdentifier: string
  ): any[] {
    if (!items) return [];
    if (
      (!searchName || searchName.length === 0) &&
      (!secondarySearch || secondarySearch.length === 0)
    ) {
      return items;
    }
    const results = items.filter((data: any) => {
      if (searchName.length > 0 && !secondarySearch) {
        return data[searchNameIdentifier].includes(searchName);
      } else if (!searchName && secondarySearch.length > 0) {
        return data[secondarySearchIdentifier] == secondarySearch;
      } else if (searchName.length > 0 && secondarySearch.length > 0) {
        return (
          data[searchNameIdentifier].includes(searchName) &&
          data[secondarySearchIdentifier] == secondarySearch
        );
      }
      if (searchName.length > 0) {
        return data[searchNameIdentifier].includes(searchName);
      }
    });
    console.log(results);
    return results;
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

  isEnabledInPersonConsulatation() {
    return this.selectedClinicData?.disableInPersonAppointment ? false : true;
  }

  fromToTime(startTime: string, endTime: string): any {
    if (
      this.isDateSame('startDate', 'endDate') &&
      this.vacationScheduleForm.get(startTime).value != '' &&
      this.vacationScheduleForm.get(endTime).value != ''
    ) {
      const fromTime = moment(
        this.vacationScheduleForm.get(startTime).value
      ).format('HH:mm');
      const toTime = moment(
        this.vacationScheduleForm.get(endTime).value
      ).format('HH:mm');
      if (fromTime > toTime) {
        this.toastService.error('End Time must be greater than Start Time');
        return false;
      }
    }
    return true;
  }

  vactionBooking() {
    this.showModal = false;
    this.showModalVaction = true;
    this.clinicVacationScheduleId = null;
    this.vacationScheduleForm.reset();
    this.vacationScheduleForm.patchValue({
      clinicId: this.selectedDropDownsObj?.clinicIdForFilter,
      startDate: '',
      endDate: '',
      startTime: '',
      endTime: '',
      allDay: true
    });
    this.vacationScheduleForm.get('startTime').clearValidators();
    this.vacationScheduleForm.get('startTime').setErrors(null);
    this.vacationScheduleForm.get('startTime').updateValueAndValidity();
    this.vacationScheduleForm.get('endTime').clearValidators();
    this.vacationScheduleForm.get('endTime').setErrors(null);
    this.vacationScheduleForm.get('endTime').updateValueAndValidity();
  }

  appointmentBooking() {
    this.showModal = true;
    this.showModalVaction = false;
    this.formTitle = 'Add Appointment';
    this.initializeAppointmentForm();
    this.loadServiceByClinicId(this.selectedDropDownsObj?.clinicIdForFilter);
    if (this.providersByServiceId?.length === 1) {
      this.appointmentForm.patchValue({
        providerId: this.providersByServiceId[0].id
      });
    }
  }

  submitVacation() {
    if (this.vacationScheduleForm.value.allDay) {
      this.vacationScheduleForm.patchValue({
        startTime: '',
        endTime: ''
      });
    }

    if (
      this.fromToDate('startDate', 'endDate') &&
      this.fromToTime('startTime', 'endTime')
    ) {
      var vactaionData = {
        startDate: moment(this.vacationScheduleForm.value.startDate).format(
          'YYYY-MM-DD 00:00:00 ZZ'
        ),
        endDate: moment(this.vacationScheduleForm.value.endDate).format(
          'YYYY-MM-DD 00:00:00 ZZ'
        ),
        startTime: this.vacationScheduleForm.value.startTime
          ? moment(this.vacationScheduleForm.value.startTime).format('HH:mm')
          : '00:01',
        endTime: this.vacationScheduleForm.value.endTime
          ? moment(this.vacationScheduleForm.value.endTime).format('HH:mm')
          : '23:59',
        allDay: this.vacationScheduleForm.value.allDay
      } as any;
      // Check if clinicVacationScheduleId is present to determine if it's an update or creation
      const isUpdate = !!this.clinicVacationScheduleId;

      if (isUpdate) {
        vactaionData['id'] = this.clinicVacationScheduleId;
      }

      // if (this.clinicVacationScheduleId) {
      //   vactaionData['id'] = this.clinicVacationScheduleId;
      // }
      console.log(this.vacationScheduleForm.value);
      this.calendarService
        .updateClinicVacationSchedule(
          [vactaionData],
          this.vacationScheduleForm.value.clinicId
        )
        .then(() => {
          this.showModalVaction = false;
          this.clinicVacationScheduleId = null;
          this.afterVacationCreated.emit(true);
          // this.toastService.success('Vacation created successfully');
          if (isUpdate) {
            this.toastService.success('Vacation updated successfully');
          } else {
            this.toastService.success('Vacation created successfully');
          }
        })
        .catch(() => {
          this.toastService.error(
            'Please reschedule, existing appointments or vacations coinciding with your vacation period.'
          );
        });
    }
  }

  editVacationCalendar(id: any, clinicId: any) {
    if (
      this.fromToDate('startDate', 'endDate') &&
      this.fromToTime('startTime', 'endTime')
    ) {
      this.clinicVacationScheduleId = id;
      this.calendarService
        .getClinicVacationById(id)
        .then((data: any) => {
          this.vacationScheduleForm.patchValue({
            clinicId: clinicId,
            startDate: new Date(
              this.formatTimeService.formatTimeWithoutzone(data?.fromDate)
            ),
            endDate: new Date(
              this.formatTimeService.formatTimeWithoutzone(data?.toDate)
            ),
            startTime: new Date(
              this.formatTimeService.formatTimeWithoutzone(data?.fromDate)
            ),
            endTime: new Date(
              this.formatTimeService.formatTimeWithoutzone(data?.toDate)
            ),
            allDay: data?.allDay
          });
        })
        .catch(() => {
          this.toastService.error(
            'Please reschedule, existing appointments or vacation coinciding with your vacation period.'
          );
        });
    }
  }

  hideVacationModal() {
    this.showModalVaction = false;
    this.clinicVacationScheduleId = null;
  }

  cancelClinicVacation() {
    this.calendarService
      .deleteClinicVacationById(this.clinicVacationScheduleId)
      .then(() => {
        this.afterVacationCreated.emit(true);
        this.showModalVaction = false;
        this.clinicVacationScheduleId = null;
        this.toastService.success('Vacation deleted successfully');
      })
      .catch(() => {
        this.toastService.error('Vacation cancel failed');
      });
  }

  goToVacation() {
    this.router.navigate(['users/' + this.currentId + '/edit'], {
      queryParams: {
        source: 'vacation'
      },
      queryParamsHandling: 'merge'
    });
  }
}

export enum WeekdaysEnum {
  SUNDAY = 0,
  MONDAY = 1,
  TUESDAY = 2,
  WEDNESDAY = 3,
  THURSDAY = 4,
  FRIDAY = 5,
  SATURDAY = 6
}

export const WeekdaysObj: any = {
  0: 'SUNDAY',
  1: 'MONDAY',
  2: 'TUESDAY',
  3: 'WEDNESDAY',
  4: 'THURSDAY',
  5: 'FRIDAY',
  6: 'SATURDAY'
};

export const WEEKDAYS = [
  'SUNDAY',
  'MONDAY',
  'TUESDAY',
  'WEDNESDAY',
  'THURSDAY',
  'FRIDAY',
  'SATURDAY'
];
