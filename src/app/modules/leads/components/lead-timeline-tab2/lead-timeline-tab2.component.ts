import { KeyValue } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import moment from 'moment';
import { FormatTimeService } from 'src/app/shared/services/time-utils/formatTime.service';
import { LeadsService } from '../../service/leads.service';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';

@Component({
  selector: 'app-lead-timeline-tab2',
  templateUrl: './lead-timeline-tab2.component.html',
  styleUrls: ['./lead-timeline-tab2.component.css']
})
export class LeadTimelineTab2Component implements OnInit {
  @Input() email: string;
  id: any = null;
  timelineData: any = [];
  leadTimelineData: any = [];
  combinedLeadTimelineData: any = [];
  leadEmailData: any;
  showPreviewModal: boolean;
  leadInfo: any;
  firstName: any;
  lastName: any;
  combinedTimelineLoaded: boolean = false;
  combinedTimelineMode: boolean = false;
  leadCount: number = 0;
  constructor(
    private activatedRoute: ActivatedRoute,
    private leadService: LeadsService,
    public formatTimeService: FormatTimeService,
    private localStorageService: LocalStorageService
  ) {}

  ngOnInit(): void {
    console.log('');
    this.activatedRoute.paramMap.subscribe((data: any) => {
      this.id = data.params.leadId;
      this.getLeadTimeLine();
      this.getLeadInfo();
    });
  }

  getLeadInfo() {
    this.leadInfo = this.localStorageService.readStorage('currentLeadDetail');
    if (!this.leadInfo) {
      this.leadService.getLeadCreationBox(this.id).then((response: any) => {
        console.log(response);
        this.leadInfo = response;
      });
    }
  }

  getLeadTimeLine() {
    this.leadTimelineData = [];
    this.leadService
      .getLeadAuditForTimeline(this.email || '', this.id)
      .then((data: any) => {
        if (data) {
          this.leadCount = data.leadCount;
          this.leadTimelineData = [...data.leadAuditList];
          this.timelineData = [];
          this.timelineData = [...this.leadTimelineData];
        }
      });
  }

  getCombinedLeadTimeLine() {
    this.combinedLeadTimelineData = [];
    this.leadService
      .getLeadAllTimeline(this.email, this.id)
      .then((data: any) => {
        this.combinedTimelineLoaded = true;
        this.combinedLeadTimelineData = [...data];
        this.timelineData = [];
        this.timelineData = [...this.combinedLeadTimelineData];
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

  formatTODate(time: any) {
    return moment(time).format('MMM D YYYY');
  }

  getEmail(id: any) {
    this.showPreviewModal = true;
    this.leadService.emailTemplate(id).then((data: any) => {
      this.leadEmailData = data;
    });
  }

  onCloseModal() {
    this.showPreviewModal = false;
  }

  switchTimeline(e: any) {
    const combinedTimelineMode = e.checked;
    this.timelineData = [];
    this.combinedTimelineMode = combinedTimelineMode;
    if (combinedTimelineMode) {
      if (this.combinedTimelineLoaded) {
        this.timelineData = [...this.combinedLeadTimelineData];
      } else {
        this.getCombinedLeadTimeLine();
      }
    } else {
      this.timelineData = [...this.leadTimelineData];
    }
  }
}
