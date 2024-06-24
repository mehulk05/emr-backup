import { Component, Input, OnInit } from '@angular/core';
import { FormatTimeService } from 'src/app/shared/services/time-utils/formatTime.service';
import { TriggersService } from '../../../services/triggers.service';

@Component({
  selector: 'app-trigger-audit',
  templateUrl: './trigger-audit.component.html',
  styleUrls: ['./trigger-audit.component.css']
})
export class TriggerAuditComponent implements OnInit {
  @Input() auditTriggerId: any;
  @Input() source: string = 'leads';
  auditData: any = [];
  auditNotFound: boolean = false;
  dateType: any = {
    APPOINTMENT_CREATED: 'Appointment Created Date',
    APPOINTMENT_BEFORE: 'Before Appointment Date',
    APPOINTMENT_AFTER: 'After Appointment Date'
  };
  templateTargets: any = {
    lead: 'Leads',
    Clinic: 'Clinic',
    custom: 'Custom',
    AppointmentPatient: 'Patient',
    AppointmentClinic: 'Clinic',
    AppointmentCustom: 'Custom'
  };
  scheduleList: any = {
    APPOINTMENT_CREATED: 'Appointment Created Date',
    APPOINTMENT_BEFORE: 'Before Appointment Date',
    APPOINTMENT_AFTER: 'After Appointment Date'
  };
  timeFrequency: any = {
    MIN: 'Min',
    HOUR: 'Hour',
    DAY: 'Day'
  };
  constructor(
    private triggerService: TriggersService,
    public formatTimeService: FormatTimeService
  ) {}

  ngOnInit(): void {
    if (this.auditTriggerId) {
      this.loadTriggerAuditData();
    }
  }

  loadTriggerAuditData() {
    this.triggerService
      .getTriggerAuditData(this.auditTriggerId)
      .then((response: any) => {
        if (response?.length > 0) {
          this.auditData = response;
        } else {
          this.auditNotFound = true;
        }
      });
  }
}
