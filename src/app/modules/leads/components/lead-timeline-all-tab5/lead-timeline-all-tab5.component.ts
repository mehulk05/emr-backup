import { KeyValue } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import moment from 'moment';
import { FormatTimeService } from 'src/app/shared/services/time-utils/formatTime.service';
import { LeadsService } from '../../service/leads.service';

@Component({
  selector: 'app-lead-timeline-all-tab5',
  templateUrl: './lead-timeline-all-tab5.component.html',
  styleUrls: ['./lead-timeline-all-tab5.component.css']
})
export class LeadTimelineAllTab5Component implements OnInit {
  id: any = null;
  leadTimelineData: any = [];
  finalObj: any;
  leadEmailData: any;
  showPreviewModal: boolean;
  @Input() email: string;
  leadInfo: any;
  constructor(
    private activatedRoute: ActivatedRoute,
    private leadService: LeadsService,
    private formatTimeService: FormatTimeService
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
    this.leadService.getLeadCreationBox(this.id).then((response: any) => {
      console.log(response);
      this.leadInfo = response;
    });
  }

  getLeadTimeLine() {
    this.leadTimelineData = [];
    this.finalObj = {};
    this.leadService
      .getLeadAllTimeline(this.email, this.id)
      .then((data: any) => {
        this.leadTimelineData = [...data];
        // this.leadTimelineData.forEach((lead: any) => {
        //   const date = this.formatTimeService.formatDateForLeadTimeLine(
        //     lead.createdDateTime
        //   );
        //   if (this.finalObj[date]) {
        //     this.finalObj[date].push(lead);
        //   } else {
        //     this.finalObj[date] = [lead];
        //   }
        // });
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
    this.leadService.emailTemplate(id).then((data: any) => {
      this.leadEmailData = data;
    });
  }

  onCloseModal() {
    this.showPreviewModal = false;
  }
}
