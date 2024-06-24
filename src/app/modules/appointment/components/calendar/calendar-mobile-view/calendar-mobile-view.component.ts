import { KeyValue } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output
} from '@angular/core';
import { FormatTimeService } from 'src/app/shared/services/time-utils/formatTime.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
  selector: 'app-calendar-mobile-view',
  templateUrl: './calendar-mobile-view.component.html',
  styleUrls: ['./calendar-mobile-view.component.css']
})
export class CalendarMobileViewComponent implements OnChanges {
  @Input() dateObj: any;
  @Input() appointments: any;

  @Output() handleChangeAppointmentEvent: EventEmitter<any> =
    new EventEmitter();
  upcomingAppointments: any[] = [];
  groupedUpComingAppointmentsObj: any;
  pastAppointment: any = [];
  constructor(
    private formatTimeService: FormatTimeService,
    private breakpointObserver: BreakpointObserver
  ) {}

  ngOnChanges(): void {
    if (this.appointments?.length > 0) {
      this.getNewAppointments();
    }
  }
  onDateSelect(e: any) {
    console.log(e);
    this.breakpointObserver
      .observe([Breakpoints.Handset, Breakpoints.Tablet])
      .subscribe((result) => {
        if (result.matches) {
          this.addAppointment(e);
          console.log('Mobile view');
        }
      });
  }

  handleChange(e: any) {
    if (e.index == 0) {
      this.getNewAppointments();
    } else if (e.index == 1) {
      this.getPastAppointments();
    } else {
      this.getAllAppointments();
    }
  }
  getNewAppointments() {
    const newDate = new Date();
    const result = this.appointments.filter((data: any) => {
      const currentDate = new Date(data.appointmentStartDate);
      if (currentDate >= newDate) {
        return data;
      }
    });
    this.upcomingAppointments = result;
    this.groupAppointmentsByDate();
  }

  getPastAppointments() {
    const newDate = new Date();
    const result = this.appointments.filter((data: any) => {
      const currentDate = new Date(data.appointmentStartDate);
      if (currentDate < newDate) {
        return data;
      }
    });
    this.upcomingAppointments = result;
    this.groupAppointmentsByDate();
  }

  getAllAppointments() {
    this.upcomingAppointments = this.appointments;
    this.groupAppointmentsByDate();
  }

  groupAppointmentsByDate() {
    const groups = this.upcomingAppointments.reduce(
      (groups: any, game: any) => {
        const date = game.appointmentStartDate.split('T')[0];
        if (!groups[date]) {
          groups[date] = [];
        }
        groups[date].push(game);
        return groups;
      },
      {}
    );
    this.groupedUpComingAppointmentsObj = groups;
    console.log(groups);
  }

  keyDescOrder = (a: KeyValue<any, any>, b: KeyValue<any, any>): number => {
    return a.key < b.key ? -1 : b.key > a.key ? 1 : 0;
  };

  isEmptyObject(obj: any) {
    return obj && Object.keys(obj).length === 0;
  }

  editAppointment(appointment: any) {
    this.handleChangeAppointmentEvent.emit(appointment);
  }

  addAppointment(e?: any) {
    let dateObj: any;
    if (e) {
      dateObj = { selectedDate: e };
    }
    this.handleChangeAppointmentEvent.emit(dateObj);
  }

  formatTime(time: any) {
    return this.formatTimeService.formatBookingHistoryTime(time);
  }
}
