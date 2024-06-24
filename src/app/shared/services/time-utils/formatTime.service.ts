import { Injectable } from '@angular/core';
import moment from 'moment-timezone';
import { HelperSharableService } from '../helperService/helper-sharable.service';
import { LocalStorageService } from '../local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class FormatTimeService {
  zone: string = '';
  businessId: any;

  constructor(
    private localStorageService: LocalStorageService,
    private sharedHelperService: HelperSharableService
  ) {
    this.zone = this.localStorageService.readStorage('defaultClinic')?.timezone;
    if (!this.zone) {
      this.getClinicTimeZone();
    }
  }

  getClinicTimeZone() {
    this.sharedHelperService.getDefaultCinic().then((data: any) => {
      this.zone = data?.timezone;
      //
      this.localStorageService.storeItem('defaultClinic', data);
    });
  }

  formatTime(time: any, timezone?: any) {
    var input: any = new Date(time);
    var format = 'MMM D YYYY h:mm A'; // must match the input
    var zone = timezone ? timezone : this.zone;
    var m = moment.tz(input, format, zone);
    if (time !== null) {
      time = m.format(format);
    }
    return time;
  }

  formatDate(time: any, timezone?: any) {
    var input = moment.tz(time, timezone); // Assuming 'time' is a valid date string
    var format = 'MMM D YYYY'; // Date format without time
    return input.format(format);
  }

  formatTimeWithoutzone(time: any) {
    var format = 'MMM D YYYY h:mm A';
    var utcTimezone = moment.parseZone(time).format(format);
    return utcTimezone;
  }

  getTimeFromDate(time: any) {
    var format = 'HH:mm:ss';
    var utcTimezone = moment.parseZone(time).format(format);
    return utcTimezone;
  }

  gettimeFromDate(time: any) {
    var format = 'h:mm A';
    var utcTimezone = moment.parseZone(time).format(format);
    return utcTimezone;
  }

  formatTimeWithoutTimezone(time: any) {
    var input: any = new Date(time);
    var format = 'MMM D YYYY h:mm A';
    var utcTimezone = moment(input).utcOffset(0, true).format(format);
    return moment.tz(utcTimezone, this.zone).format(format);
  }

  formatDateWithoutTimezone(time: any) {
    var input: any = new Date(time);
    var format = 'MMM D YYYY';
    var utcTimezone = moment(input).utcOffset(0, true).format(format);
    return moment.tz(utcTimezone, this.zone).format(format);
  }

  formatBookingHistoryTime(time: any, timezone?: any) {
    var input: any = new Date(time);

    var format = 'MMM D YYYY h:mm A'; // must match the input
    var zone = timezone ? timezone : this.zone;
    var m = moment.tz(input, format, zone);
    m.utc();
    time = m.format(format);
    return time;
  }

  /// special method for only lead time dont use it anywhere else

  formatTimeZone(time: any, timezone?: any) {
    var input: any = new Date(time);
    input.setHours(input.getHours() + 5);
    input.setMinutes(input.getMinutes() + 30);
    var format = 'hh:mm A'; // must match the input
    var zone = timezone ? timezone : this.zone;
    var m = moment.tz(input, format, zone);
    time = m.format(format);
    return time;
  }

  formatTimeZone1(time: any, timezone?: any) {
    var input: any = time;
    input.setHours(input.getHours() + 5);
    input.setMinutes(input.getMinutes() + 30);
    var format = 'hh:mm A'; // must match the input
    var zone = timezone ? timezone : this.zone;
    var m = moment.tz(input, format, zone);
    time = m.format(format);
    return time;
  }

  // To convert 12 hours to 24 hours with parseInt
  convertTime12to24 = (time12h: any) => {
    const [time, modifier] = time12h?.split(' ');
    // eslint-disable-next-line prefer-const
    let [hours, minutes] = time?.split(':');
    if (hours === '12') {
      hours = '00';
    }

    if (modifier === 'PM') {
      hours = parseInt(hours, 10) + 12;
    }
    return `${hours}:${minutes}`;
  };

  formatTimeslot(date: any, timezone: any) {
    //console.log(date, moment(date).format("hh:mm A"));
    var input: any = new Date(date);
    var fmt = 'hh:mm A'; // must match the input
    var zone = timezone;
    var m = moment.tz(input, fmt, zone);
    // convert it to utc
    m.utc();
    // format it for output
    date = m.format(fmt);
    return date;
  }

  formatDateForLeadTimeLine(date: any, timezone?: any) {
    var input: any = new Date(date);
    var fmt = 'MMM DD, yyyy'; // must match the input
    var zone = timezone ?? this.zone;
    var m = moment.tz(input, fmt, zone);
    // convert it to utc
    m.utc();

    // format it for output
    date = m.format(fmt);
    return date;
  }

  formatDateForLeadTimeLineClinic(date: any, timezone?: any) {
    var input: any = new Date(date);
    var fmt = 'MMM DD, yyyy'; // must match the input
    var zone = timezone ?? this.zone;
    var m = moment.tz(input, fmt, zone);
    // convert it to utc
    m.utc();

    // format it for output
    date = m.format(fmt);
    return date;
  }

  formatTimeToDate(time: any, timezone?: any) {
    var input: any = new Date(time);
    var format = 'MMM D YYYY'; // must match the input
    var zone = timezone ? timezone : this.zone;
    var m = moment.tz(input, format, zone);
    if (time !== null) {
      time = m.format(format);
    }
    return time;
  }

  compareApiDateWithLocalTime(apiDate: string) {
    // Convert the API date string to a date object
    const localDate = new Date(apiDate);

    // Convert the API date to UTC and extract the date part
    const datePart1 = apiDate.slice(0, 10);

    const apiDateUtc = moment(apiDate).format();
    // Extract the date part from the other date string
    const datePart2 = apiDateUtc.slice(0, 10);

    // Compare the date parts
    if (datePart1 !== datePart2) {
      // Add one day to the localDate
      localDate.setDate(localDate.getDate() + 1);
    }

    return localDate;
  }
}
