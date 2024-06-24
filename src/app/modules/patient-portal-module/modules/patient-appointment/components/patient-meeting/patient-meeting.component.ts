import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { interval, Subscription } from 'rxjs';
import { PatientMeetingService } from '../../service/patient-meeting.service';

@Component({
  selector: 'app-patient-meeting',
  templateUrl: './patient-meeting.component.html',
  styleUrls: ['./patient-meeting.component.css']
})
export class PatientMeetingComponent implements OnInit, OnDestroy {
  subscription: Subscription;
  source = interval(60000);
  appointmentId: any = null;
  config: any = null;
  isConfigGenerated = false;
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private meetingService: PatientMeetingService
  ) {}

  ngOnInit(): void {
    this.appointmentId = this.activatedRoute.snapshot.params.appointmentId;
    this.generateConfig();
    this.subscription = this.source.subscribe(() => {
      if (!this.isConfigGenerated) {
        this.generateConfig();
      }
    });
  }

  generateConfig() {
    this.meetingService.joinMeeting(this.appointmentId).then(
      (response: any) => {
        this.config = response;
        this.isConfigGenerated = true;
      },
      () => {
        this.isConfigGenerated = false;
      }
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onEndMeeting() {
    this.meetingService.deleteMeeting(this.appointmentId).then(() => {
      this.router.navigate(['/patient-portal/myappointments']);
    });
  }

  onLeaveMeeting() {
    this.router.navigate(['/patient-portal/myappointments']);
  }
}
