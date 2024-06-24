import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { TimelineService } from '../../services/timeline.service';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.css']
})
export class TimelineComponent implements OnInit, OnDestroy {
  @Input() formId: number;
  timeLineData: any = [];

  constructor(private timeLineService: TimelineService) {}

  ngOnInit(): void {
    this.timeLineService
      .getTimeline(this.formId)
      .then((response) => {
        this.timeLineData = response;
      })
      .catch((e) => {
        console.log(e);
      });
  }

  ngOnDestroy() {
    this.timeLineData = [];
  }
}
