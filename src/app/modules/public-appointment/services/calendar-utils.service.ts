import { Injectable } from '@angular/core';
import moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class CalendarUtilsService {
  constructor() {}

  getTotalWorkingHoursBySchedule(schedules: any) {
    let totalHours = 0;
    schedules.forEach((schedule: any) => {
      totalHours += this.getTotalHoursByScheduleTimings(schedule, totalHours);
    });
    return totalHours;
  }

  // Calculate hours for scheduled timings
  getTotalHoursByScheduleTimings(schedule: any, totalHours: number) {
    const TIME_FORMAT = 'HH:mm:ss';
    schedule.userScheduleTimings.forEach((timings: any) => {
      const startTime = moment(timings.timeFromDate, TIME_FORMAT);
      const endTime = moment(timings.timeToDate, TIME_FORMAT);
      const duration = moment.duration(endTime.diff(startTime));
      totalHours += duration.asHours();
    });
    return totalHours;
  }
}
