import { KeyValue } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import moment from 'moment';
import { FormatTimeService } from 'src/app/shared/services/time-utils/formatTime.service';
import { PatientService } from '../../services/patient.service';

@Component({
  selector: 'app-patient-timeline',
  templateUrl: './patient-timeline.component.html',
  styleUrls: ['./patient-timeline.component.css']
})
export class PatientTimelineComponent implements OnInit {
  @Input() patientId: any;
  id: any = null;
  patientTimelineData: any = [];
  finalObj: any;
  patientEmailData: any;
  showPreviewModal: boolean;
  constructor(
    private activatedRoute: ActivatedRoute,
    private patientService: PatientService,
    private formatTimeService: FormatTimeService
  ) {}

  ngOnInit(): void {
    console.log('');
    this.activatedRoute.paramMap.subscribe((data: any) => {
      this.id = data.params.leadId;
      this.getPatientTimeLine();
    });
  }

  getPatientTimeLine() {
    this.patientTimelineData = [];
    this.finalObj = {};
    this.patientService.getPatientTimeline(this.patientId).then((data: any) => {
      this.patientTimelineData = [...data];
    });
  }

  keyDescOrder = (a: KeyValue<any, any>, b: KeyValue<any, any>): number => {
    return a.key < b.key ? -1 : b.key > a.key ? 1 : 0;
  };

  formatTime1(time: any) {
    const t1 = moment.utc(time).format();
    return this.formatTimeService.formatTime(t1);
  }

  formatTime(time: any) {
    return this.formatTimeService.formatDateForLeadTimeLine(time);
  }

  getEmail(id: any) {
    this.showPreviewModal = true;
    this.patientService.emailTemplate(id).then((data: any) => {
      this.patientEmailData = data;
    });
  }

  onCloseModal() {
    this.showPreviewModal = false;
  }
}
