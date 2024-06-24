import { Component, Input, OnInit } from '@angular/core';
import { FormatTimeService } from 'src/app/shared/services/time-utils/formatTime.service';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
import { FiveStarViewService } from '../../services/five-star-view.service';

@Component({
  selector: 'app-g99-review-settings',
  templateUrl: './g99-review-settings.component.html',
  styleUrls: ['./g99-review-settings.component.css']
})
export class G99ReviewSettingsComponent implements OnInit {
  @Input() clinicData: any;
  @Input() clinicId: any;

  showReportNotificationDetails = false;
  month = 'Month';
  day = 'Day';
  week = 'Week';
  reportGenerationSuffixs = [this.month, this.week, this.day];
  reportGenerationPrefixs: number[] = [...Array(12).keys()].map((a) => a + 1);
  reportGenerationSuffix = this.month;
  reportGenerationPrefix = 1;
  clinicProperties: any;
  date: Date;
  minDate: Date;
  maxDate: Date;

  constructor(
    private clinicService: FiveStarViewService,
    private toastMessageService: ToasTMessageService,
    public formatTimeService: FormatTimeService
  ) {}

  ngOnInit(): void {
    this.getClinicProperties();
    this.maxDate = new Date();
    this.maxDate.setMonth(this.maxDate.getMonth() + 1);
    this.minDate = new Date();
    this.date = this.minDate;
  }

  getClinicProperties() {
    this.showReportNotificationDetails = false;
    const encryptedClinicId = window.btoa(this.clinicId).toString();
    this.clinicService.getClinicProperties(encryptedClinicId).subscribe(
      (res: any) => {
        console.log(res.data);
        this.clinicProperties = res?.data;
        this.showReportNotificationDetails = true;
        if (res?.data?.mailNotificationPeriodType) {
          this.reportGenerationSuffix = res.data.mailNotificationPeriodType;
          this.changePrefix();
          this.reportGenerationPrefix = res.data.mailNotificationPeriodNumber;
        }
      },
      () => {
        this.toastMessageService.error('Unable to load Report Interval');
      }
    );
  }

  changePrefix = () => {
    switch (this.reportGenerationSuffix) {
      case this.month:
        this.reportGenerationPrefixs = [...Array(12).keys()].map((a) => a + 1);
        break;
      case this.week:
        this.reportGenerationPrefixs = [...Array(7).keys()].map((a) => a + 1);
        break;
      case this.day:
        this.reportGenerationPrefixs = [...Array(29).keys()].map((a) => a + 2);
        break;
      default:
        this.reportGenerationPrefixs = [...Array(12).keys()].map((a) => a + 1);
        this.reportGenerationSuffix = this.month;
    }
    this.reportGenerationPrefix = 1;
  };

  submitReportInterval() {
    console.log(this.reportGenerationPrefix, this.reportGenerationSuffix);
    if (this.reportGenerationPrefix && this.reportGenerationSuffix) {
      var intervalInDays = 0;
      if (this.reportGenerationSuffix == this.month) {
        intervalInDays = this.reportGenerationPrefix * 30;
      } else if (this.reportGenerationSuffix == this.week) {
        intervalInDays = this.reportGenerationPrefix * 7;
        this.date = undefined;
      } else if (this.reportGenerationSuffix == this.day) {
        intervalInDays = this.reportGenerationPrefix;
        this.date = undefined;
      }

      console.log(`interval Days : ` + intervalInDays, this.date);
      const encryptedClinicId = window.btoa(this.clinicId).toString();
      this.clinicService
        .saveReportIntervalForClinic(
          intervalInDays,
          this.date,
          encryptedClinicId,
          this.reportGenerationPrefix,
          this.reportGenerationSuffix
        )
        .subscribe(
          () => {
            this.toastMessageService.success('Report Interval saved');
            this.getClinicProperties();
          },
          () => {
            this.toastMessageService.success('Failed to save');
          }
        );
    }
  }
}
