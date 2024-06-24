import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppointmentService } from 'src/app/modules/appointment/services/appointment.service';
import { OnlineMeetingService } from 'src/app/modules/appointment/services/online-meeting.service';
import { FormatTimeService } from '../../services/time-utils/formatTime.service';
import { ToasTMessageService } from '../../services/toast-message.service';

@Component({
  selector: 'app-online-meeting',
  templateUrl: './online-meeting.component.html',
  styleUrls: ['./online-meeting.component.css']
})
export class OnlineMeetingComponent implements OnInit {
  appointment: any = null;
  appointmentId: any = null;
  config: any = null;
  showMeeting = false;
  meetingEnded = false;
  constructor(
    private formatTimeService: FormatTimeService,
    private activatedRoute: ActivatedRoute,
    private alertService: ToasTMessageService,
    private appointmentService: AppointmentService,
    private onlineMeetingService: OnlineMeetingService
  ) {}

  ngOnInit(): void {
    this.appointmentId = this.activatedRoute.snapshot.params.appointmentId;
    this.appointmentService
      .getOptimizedSingleAppointment(this.appointmentId)
      .then(
        (response: any) => {
          this.appointment = response;
          console.log(' this.appointment===', this.appointment);
        },
        () => {
          this.alertService.error('Unable to load appointment.');
        }
      );
  }

  formatBookingHistoryTime(time: any) {
    return this.formatTimeService.formatBookingHistoryTime(time);
  }

  joinMeeting() {
    if (this.config == null) {
      this.createMeeting();
    } else {
      this.showMeeting = true;
    }
  }

  onLeaveMeeting() {
    this.showMeeting = false;
  }

  onEndMeeting() {
    this.config = null;
    this.meetingEnded = true;

    // delete this meeting on the java
    this.onlineMeetingService.endOnlineMeeting(this.appointmentId).then(
      () => {
        this.config = null;
        this.meetingEnded = true;
      },
      () => {
        //this.alertService.error("Unable to start online meeting.");
      }
    );
  }

  createMeeting() {
    // TODO - may be we can ceate meeting earlier and join later.
    // need to load meeting details.

    this.appointmentId = this.activatedRoute.snapshot.params.appointmentId;
    this.onlineMeetingService.startOnlineMeeting(this.appointmentId).then(
      (response: any) => {
        this.config = response;
        this.showMeeting = true;
      },
      () => {
        this.alertService.error('Unable to start online meeting.');
      }
    );
  }
}
