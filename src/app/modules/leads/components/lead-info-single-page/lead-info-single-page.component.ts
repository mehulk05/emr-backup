import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'app-lead-info-single-page',
  templateUrl: './lead-info-single-page.component.html',
  styleUrls: ['./lead-info-single-page.component.css']
})
export class LeadInfoSinglePageComponent implements OnInit {
  @Input() leadDetailObj: any;
  leadEmail: string = '';
  leadId: string | number;
  constructor(private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    combineLatest([
      this.activatedRoute.queryParams,
      this.activatedRoute.params
    ]).subscribe(([queryParams, params]) => {
      this.leadEmail = queryParams?.email;
      this.leadId = params?.leadId;
    });
  }
}
