/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
/* eslint-disable @angular-eslint/no-output-on-prefix */
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  LOCALE_ID,
  OnChanges,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  CalendarDateFormatter,
  CalendarEvent,
  CalendarEventAction,
  CalendarMonthViewDay,
  CalendarView,
  DAYS_OF_WEEK
} from 'angular-calendar';
import moment from 'moment-timezone';
import { ClinicService } from 'src/app/modules/public-appointment/services/clinic.service';
import { Subject, BehaviorSubject, from } from 'rxjs';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
import { AppointmentService } from '../../services/appointment.service';
import { BusinessService } from '../../services/business.service';
import { CalendarUtilsService } from '../../services/calendar-utils.service';
import { UserService } from '../../services/user.service';
import { CustomDateFormatter } from './custom-date-formatter.provider';
import { ColorService } from 'src/app/shared/services/color.service';

@Component({
  selector: 'app-date-selection',
  templateUrl: './date-selection.component.html',
  styleUrls: ['./date-selection.component.css'],
  providers: [
    {
      provide: CalendarDateFormatter,
      useClass: CustomDateFormatter
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DateSelectionComponent implements OnInit, OnChanges {
  @ViewChild('someVar') el: ElementRef;

  view: CalendarView = CalendarView.Month;
  minDate: Date = new Date();
  viewDate: Date = new Date();
  actions: CalendarEventAction[] = [];

  refresh: Subject<any> = new Subject();
  events: CalendarEvent[] = [];
  bookingData: any;
  clinicData: any;

  @Input() booking: any;
  @Input() clinic: any;
  @Output() onDateSelection = new EventEmitter<any>();

  @Output() onBack = new EventEmitter<any>();
  selectedDay: any = null;
  date: any = null;
  time: string = null;
  unformattedTime: any = null;
  availableDates: any = [];
  availableTimes: any = [];
  dateindex: number = -1;
  weekStartsOn: number = DAYS_OF_WEEK.MONDAY;
  weekendDays: number[] = [DAYS_OF_WEEK.FRIDAY, DAYS_OF_WEEK.SATURDAY];
  timezone = localStorage.getItem('clinicTimeZone');
  isColorFecthed$: BehaviorSubject<any> = new BehaviorSubject(false);
  dateBackgrounColor = {
    backgroundColor: ''
  };
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

  titleColor: any;

  titleColor1 = localStorage.getItem('tc');
  userId: any;
  landingPageId: any;
  vacationDates: any[] = [];
  workingSchedule: any;
  constructor(
    private appointmentBookingService: AppointmentService,
    private alertService: ToasTMessageService,
    private businessService: BusinessService,
    private userService: UserService,
    private ref: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute,
    private calendarUtilService: CalendarUtilsService,
    private colorService: ColorService,
    private clinicService: ClinicService,

    @Inject(LOCALE_ID) public locale: string
  ) {}

  ngOnChanges(): void {
    if (this.booking && Object.keys(this.booking).length > 0) {
      this.bookingData = this.booking;
    }
    // const event: any = {
    //   day: {
    //     date: new Date(),
    //     cssClass: 'cal-selected',
    //     inMonth: true,
    //     isFuture: false,
    //     isPast: false,
    //     isToday: true,
    //     isWeekend: false,
    //     day: 5,
    //     events: []
    //   }
    // };
    // console.log(this.clinic);
    // if (this.clinic) {
    //   this.dayClicked(event.day, true);
    // }
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((d) => {
      if (Object.keys(d).length > 0) {
        this.userId = d.u;
        this.landingPageId = d?.lpid;
      }
    });
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
      this.colorService.setColors(response);
    } else {
      this.dateBackgrounColor.backgroundColor = this.hexToRGB(
        this.btnStyle.backgroundColor,
        0.15
      );
    }
    this.loadPersonalizationColors();
    console.log('===================', this.bookingData);
    this.date = this.bookingData?.date;
    this.time = this.bookingData?.time;

    console.log(this.time);
    if (this.time != null) {
      this.loadProviderSchedule();
    }

    if (!this.timezone) {
      this.timezone = localStorage.getItem('clinicTimeZone');
    }
  }

  loadPersonalizationColors() {
    if (this.landingPageId) {
      this.businessService
        .getPublicQuestionnaireFromLandingPageId(
          this.bookingData.businessId,
          this.landingPageId
        )
        .then((response: any) => {
          if (response) {
            this.colorService.setColors(response);
          }
        });
    } else {
      this.businessService
        .getPublicQuestionnaireOptimized(this.bookingData.businessId)
        .then(
          (response: any) => {
            this.colorService.setColors(response);
            console.log(response);
          },
          () => {
            this.alertService.error('Unable to load questionnnaire.');
          }
        );
    }
  }

  setPersonalizationColors(response: {
    buttonForegroundColor: string;
    buttonBackgroundColor: any;
    titleColor: string;
  }) {
    this.isColorFecthed$.next(true);
    if (
      response.buttonForegroundColor != null &&
      response.buttonForegroundColor != ''
    ) {
      this.btnTextStyle = {
        color: response.buttonForegroundColor,
        textTransform: 'uppercase'
      };
    }

    this.btnStyle = {
      backgroundColor: response.buttonBackgroundColor,
      color: response.buttonForegroundColor,
      border: response.buttonBackgroundColor,
      textTransform: 'uppercase'
    };
    if (response.titleColor != null && response.titleColor != '') {
      this.titleColor = response.titleColor;
      this.titleStyle = {
        color: response.buttonBackgroundColor,
        textTransform: 'uppercase'
      };
    }
    this.activeLinkStyle = {
      color: response.buttonBackgroundColor
    };
    this.dateBackgrounColor.backgroundColor = this.hexToRGB(
      this.btnStyle.backgroundColor,
      0.15
    );
  }

  hexToRGB(hex: string, alpha: string | number) {
    console.log(hex);
    var r = parseInt(hex.slice(1, 3), 16),
      g = parseInt(hex.slice(3, 5), 16),
      b = parseInt(hex.slice(5, 7), 16);

    if (alpha) {
      return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + alpha + ')';
    } else {
      return 'rgb(' + r + ', ' + g + ', ' + b + ')';
    }
  }
  loadProviderSchedule() {
    console.log('Entered In loadProviderSchedule()');
    const serviceIds: any[] = [];
    this.bookingData.selectedServices.map((service: { id: any }) => {
      serviceIds.push(service.id);
    });

    /* -------------------------If not Provider based booking ------------------------- */
    console.log('****', this.bookingData);
    if (this.bookingData?.selectedClinic?.isProviderBasedAppointment) {
      const date = moment(this.date).format('YYYY-MM-DD 00:00:00 ZZ');
      const formData: any = {
        date: date,
        clinicId: this.clinic?.id,
        serviceIds: serviceIds,
        appointmentId: null
      };
      this.appointmentBookingService
        .getTimeSlotsWithoutProvider(this.bookingData.businessId, formData)
        .then((data) => {
          this.availableTimes = data;
          this.ref.detectChanges();
        })
        .catch((e) => {
          console.log(e);
        });
    } else {
      /* ------------------------ if provider based booking ----------------------- */
      console.log('userID', this.userId);
      if (this.userId) {
        this.bookingData.provider.id = this.userId;
      }

      const date = moment(this.date).format('YYYY-MM-DD 00:00:00 ZZ');
      // let date = moment(this.date).format("YYYY-MM-DD");
      if (this.bookingData.provider.id == 0) {
        this.appointmentBookingService
          .getTimeSlotsForAnyProvider(
            this.bookingData.businessId,
            this.bookingData.selectedClinic.id,
            serviceIds,
            date
          )
          .then((data: any) => {
            this.availableTimes = data;

            console.log(this.availableTimes);
            console.log('for any', this.availableTimes);
            this.ref.detectChanges();
          });
      } else {
        this.appointmentBookingService
          .getAvailableTimeslots(
            this.bookingData.businessId,
            this.bookingData.selectedClinic.id,
            serviceIds,
            this.bookingData.provider.id,
            date
          )
          .then(
            (response: any) => {
              this.availableTimes = response;
              //console.log(this.availableTimes)

              this.ref.detectChanges();
            },
            () => {
              this.alertService.error('Unable to get Available Timeslots.');
            }
          );
      }
    }
  }

  onDateSelect() {
    if (this.date == null) {
      return;
    }
    this.onDateSelection.emit({ date: this.date, time: this.unformattedTime });
  }

  dayClicked(event: any, fromBeforeRenderView?: boolean): void {
    console.log('eve', event);
    if (this.bookingData.date !== event.date) {
      this.time = null;
    }
    if (this.selectedDay != null) {
      this.selectedDay.cssClass = '';
    }
    if (fromBeforeRenderView) {
      this.selectedDay = event;
    } else {
      if (this.bookingData.date !== event.day.date) {
        this.selectedDay = event.day;
      } else {
        this.selectedDay = event.day;
      }
    }

    this.selectedDay.cssClass = 'cal-selected';
    console.log('selectedDay', this.selectedDay);
    this.date = this.selectedDay.date;
    console.log(this.date);
    //this.time = null;
    //}
    this.loadProviderSchedule();
  }

  dateIsValid(date: Date): boolean {
    return date.getTime() >= new Date().getTime();
  }

  beforeMonthViewRender({ body }: { body: CalendarMonthViewDay[] }): void {
    if (
      this.bookingData &&
      !this.bookingData.selectedClinic?.isProviderBasedAppointment
    ) {
      this.disablePastAndVacationDates(body);
    }

    if (
      this.bookingData &&
      this.bookingData.selectedClinic?.isProviderBasedAppointment
    ) {
      this.handleClinicDisableDate(body);
    }

    if (this.bookingData) {
      this.handleSelectTodayDate(body);
    }
  }

  handleSelectTodayDate(body: any) {
    setTimeout(() => {
      body.forEach((day: any) => {
        if (day.isToday) {
          console.log(day);
          this.dayClicked(day, true);
        }
      });
    }, 2000);
  }

  handleClinicDisableDate(body: CalendarMonthViewDay[]): void {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    for (let i = 0; i < body.length; i++) {
      const cellDate = new Date(body[i].date);

      if (cellDate <= currentDate) {
        body[i].cssClass = 'cal-disabled';
        continue;
      }
    }

    this.clinicService
      .getAllCinicList(this.booking.businessId)
      .then((response: any) => {
        if (response && response.length > 0) {
          const clinicData = response[0];

          if (clinicData.businessHours && clinicData.businessHours.length > 0) {
            const businessHours = clinicData.businessHours;
            const disabledDays = this.extractDisabledDays(businessHours);
            body.forEach((day: CalendarMonthViewDay) => {
              const currentDay = new Date(day.date);
              const dayOfWeek = currentDay.getDay();

              if (!disabledDays.includes(dayOfWeek)) {
                day.cssClass = 'cal-disabled';
              }
            });
          }
        }
      });
  }

  extractDisabledDays(businessHours: any[]): number[] {
    const disabledDays: number[] = [];
    businessHours.forEach((hour: any) => {
      const dayOfWeek = this.getDayOfWeekFromString(hour.dayOfWeek);
      if (dayOfWeek !== null) {
        disabledDays.push(dayOfWeek);
      }
    });

    return disabledDays;
  }

  getDayOfWeekFromString(dayOfWeekString: string): number | null {
    const daysOfWeek = [
      'SUNDAY',
      'MONDAY',
      'TUESDAY',
      'WEDNESDAY',
      'THURSDAY',
      'FRIDAY',
      'SATURDAY'
    ];
    const index = daysOfWeek.indexOf(dayOfWeekString.toUpperCase());

    return index !== -1 ? index : null;
  }

  closeOpenMonthViewDay() {
    //this.activeDayIsOpen = false;
    this.loadProviderSchedule();
  }

  selectAvailableTime = (availableTime: { timeSlot: any }, index: number) => {
    this.unformattedTime = availableTime;

    if (typeof availableTime == 'string') {
      this.time = availableTime;
    } else {
      this.time = availableTime.timeSlot;
    }
    //  this.time = this.formatTime(this.time)
    this.dateindex = index;

    console.log(this.time);
    this.onDateSelect();
    //console.log(availableTime,index,this.time)
  };

  goBack() {
    this.onBack.emit('fromDate');
  }

  getDate() {
    if (this.date == null) {
      return '';
    }

    return moment(this.date).format('YYYY-MM-DD');
  }

  formatTime(time: string | number | Date) {
    var input: any = new Date(time);
    var fmt = 'hh:mm A'; // must match the input
    var zone = this.timezone;
    var m = moment.tz(input, fmt, zone);
    // convert it to utc
    m.utc();
    // format it for output
    time = m.format(fmt);

    return time;
  }

  disablePastAndVacationDates(body: CalendarMonthViewDay[]) {
    from(
      this.userService.getPublicVacationSchedules(
        this.bookingData.selectedClinic?.id,
        this.bookingData.provider?.id
      )
    ).subscribe(
      (response: any) => {
        this.vacationDates = response;
        console.log('======================>', response);
      },
      () => {
        this.alertService.error('Unable to load vacation schedule.');
      },
      () => {
        this.userService
          .getPublicOptimizedUserClinicSchedule(
            this.bookingData.provider.id,
            this.bookingData.selectedClinic?.id,
            'working'
          )
          .then(
            (workingScheduleResponse: any) => {
              this.workingSchedule = workingScheduleResponse;
              console.log(workingScheduleResponse);
              this.handlDisableDates(body);
              // Getting total working schedule hours per day
              // const totalWorkingHours =
              //   this.calendarUtilService.getTotalWorkingHoursBySchedule(
              //     this.workingSchedule
              //   );

              // body.forEach((day) => {
              //   console.log(day)
              //   if (!this.dateIsValid(day.date)) {
              //     day.cssClass = 'cal-disabled';
              //   }

              //   this.vacationDates.forEach((schedule) => {
              //     // Getting total vacation hours for the day
              //     let totalVacationHours = 0;
              //     totalVacationHours =
              //       this.calendarUtilService.getTotalHoursByScheduleTimings(
              //         schedule,
              //         totalVacationHours
              //       );
              //     const DATE_FORMAT = 'yyyy-MM-dd';
              //     const startDate = formatDate(
              //       schedule.fromDate,
              //       DATE_FORMAT,
              //       this.locale
              //     );
              //     const endDate = formatDate(
              //       schedule.toDate,
              //       DATE_FORMAT,
              //       this.locale
              //     );
              //     const cellDate = formatDate(
              //       day.date,
              //       DATE_FORMAT,
              //       this.locale
              //     );
              //     if (
              //       totalWorkingHours <= totalVacationHours &&
              //       cellDate >= startDate &&
              //       cellDate <= endDate
              //     ) {
              //       day.cssClass = 'cal-disabled';
              //       console.log('===================cal>' + 'true');
              //     }
              //   });
              //   this.ref.detectChanges();
              //   if (day.isToday) {
              //     if (this.bookingData.date !== null) {
              //       this.dayClicked(this.booking, true);
              //     } else {
              //       this.dayClicked(day, true);
              //     }
              //   }
              // });
            },
            () => {
              this.alertService.error('Unable to load vacation schedule.');
            }
          );
      }
    );
  }

  // handlDisableDates(dates: any) {
  //   let vacationHours = 0;
  //   let workingHours = 0;

  //   // Loop through all the dates in the calendar
  //   for (let i = 0; i < dates.length; i++) {
  //     const cellDate = new Date(dates[i].date);

  //     // Check if the date falls within a working schedule
  //     for (let j = 0; j < this.workingSchedule.length; j++) {
  //       const workingSchedule = this.workingSchedule[j];
  //       const startDate = new Date(workingSchedule.fromDate);
  //       const endDate = new Date(workingSchedule.toDate);

  //       // If the date falls within a working schedule, calculate the working hours for that date

  //       if (cellDate >= startDate && cellDate <= endDate) {
  //         workingHours = this.calculateWorkingHours(cellDate, workingSchedule.userScheduleTimings);
  //       }
  //     }

  //     // Check if the date falls within a vacation schedule
  //     for (let j = 0; j < this.vacationDates.length; j++) {
  //       const vacationSchedule = this.vacationDates[j];
  //       const startDate = new Date(vacationSchedule.fromDate);
  //       const endDate = new Date(vacationSchedule.toDate);

  //       // If the date falls within a vacation schedule, calculate the vacation hours for that date
  //       startDate.setHours(0, 0, 0, 0);
  //       endDate.setHours(0, 0, 0, 0);

  //       // if (moment(cellDate).format('DD-MM-YYYY') >=  moment(startDate).format('DD-MM-YYYY') && moment(cellDate).format('DD-MM-YYYY') <= moment(endDate).format('DD-MM-YYYY')) {
  //         if (cellDate >= startDate && cellDate <= endDate) {
  //         // console.log(moment(cellDate).format('DD-MM-YYYY'), moment(startDate).format('DD-MM-YYYY'), moment(endDate).format('DD-MM-YYYY'))
  //         // console.log(cellDate, startDate, endDate)
  //         vacationHours = this.calculateVacationHours(cellDate, vacationSchedule);
  //       }
  //     }

  //     // If the working hours are less than the vacation hours, or if the working hours are not provided, disable the date
  //     const currentDate = new Date();
  //     currentDate.setHours(0, 0, 0, 0);

  //     if (cellDate <= currentDate || (workingHours <= vacationHours || workingHours === 0)) {
  //       console.log(currentDate, cellDate, 'workingHours',workingHours, 'vacationHours', vacationHours)

  //       dates[i].cssClass = 'cal-disabled';
  //       console.log(dates[i])

  //     }

  //     // Reset the working hours and vacation hours for the next iteration
  //     workingHours = 0;
  //     vacationHours = 0;
  //     this.ref.detectChanges();
  //   }
  // }

  handlDisableDates(dates: any) {
    let vacationHours = 0;
    let workingHours = 0;
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    const workingScheduleMap = this.workingSchedule.reduce(
      (acc: any, schedule: any) => {
        const startDate = new Date(schedule.fromDate);
        const endDate = new Date(schedule.toDate);

        for (let i = startDate; i <= endDate; i.setDate(i.getDate() + 1)) {
          acc[i.toDateString()] = schedule.userScheduleTimings;
        }
        return acc;
      },
      {}
    );

    const vacationScheduleMap = this.vacationDates.reduce((acc, schedule) => {
      let startDate = new Date(schedule.fromDate);
      startDate = new Date(startDate.toISOString().slice(0, -1));
      startDate.setHours(0, 0, 0, 0);
      let endDate = new Date(schedule.toDate);
      endDate = new Date(endDate.toISOString().slice(0, -1));
      endDate.setHours(0, 0, 0, 0);

      for (let i = startDate; i <= endDate; i.setDate(i.getDate() + 1)) {
        acc[i.toDateString()] = schedule;
      }
      return acc;
    }, {});

    for (let i = 0; i < dates.length; i++) {
      const cellDate = new Date(dates[i].date);

      if (cellDate <= currentDate) {
        dates[i].cssClass = 'cal-disabled';
        continue;
      }

      const scheduleTimings = workingScheduleMap[cellDate.toDateString()];
      workingHours = scheduleTimings
        ? this.calculateWorkingHours(cellDate, scheduleTimings)
        : 0;

      const vacationSchedule = vacationScheduleMap[cellDate.toDateString()];
      vacationHours = vacationSchedule
        ? this.calculateVacationHours(cellDate, vacationSchedule)
        : 0;

      if (workingHours <= vacationHours || workingHours === 0) {
        dates[i].cssClass = 'cal-disabled';
      }
    }

    this.ref.detectChanges();
  }

  getDayName(day: any) {
    switch (day) {
      case 0:
        return 'SUNDAY';
      case 1:
        return 'MONDAY';
      case 2:
        return 'TUESDAY';
      case 3:
        return 'WEDNESDAY';
      case 4:
        return 'THURSDAY';
      case 5:
        return 'FRIDAY';
      case 6:
        return 'SATURDAY';
    }
    return false;
  }

  calculateWorkingHours(cellDate: any, userScheduleTimings: any) {
    let workingHours = 0;
    const currentDay = cellDate.getDay();
    const currentDayName = this.getDayName(currentDay);

    for (let i = 0; i < userScheduleTimings.length; i++) {
      const scheduleTiming = userScheduleTimings[i];

      // If the schedule timing days are not provided, or if the current day is in the list of schedule timing days, calculate the working hours
      if (
        !scheduleTiming.days ||
        scheduleTiming.days.includes(currentDayName)
      ) {
        const startTime = moment(scheduleTiming.timeFromDate, 'HH:mm:ss');
        const endTime = moment(scheduleTiming.timeToDate, 'HH:mm:ss');
        const duration = moment.duration(endTime.diff(startTime));
        workingHours += duration.asHours();
      }
    }

    return workingHours;
  }

  calculateVacationHours(date: any, vacationSchedule: any) {
    let totalVacationHours = 0;
    const userScheduleTimings = vacationSchedule.userScheduleTimings;

    userScheduleTimings.forEach((timing: any) => {
      const timeFrom = moment(timing.timeFromDate, 'HH:mm:ss');
      const timeTo = moment(timing.timeToDate, 'HH:mm:ss');
      const duration = moment.duration(timeTo.diff(timeFrom));
      totalVacationHours += duration.asHours();
    });

    return totalVacationHours;
  }
}
