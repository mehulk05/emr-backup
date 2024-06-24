import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
import { BusinessService } from '../../services/business.service';
// import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
// import { BusinessService } from '../../services/business.service';

@Component({
  selector: 'app-tracking-code',
  templateUrl: './tracking-code.component.html',
  styleUrls: ['./tracking-code.component.css']
})
export class TrackingCodeComponent implements OnInit, OnChanges {
  @Input() businessInfo: any;
  trackingCodeFrom!: FormGroup;
  constructor(
    public formBuilder: FormBuilder,
    private alertService: ToasTMessageService,
    private businessService: BusinessService
  ) {}

  ngOnInit(): void {
    this.trackingCodeFrom = this.formBuilder.group({
      landingPageTrackCode: ['', []],
      googleAnalyticsGlobalCode: ['', []],
      googleAnalyticsGlobalCodeUrl: ['', []]
    });
  }

  ngOnChanges(): void {
    if (this.businessInfo) {
      this.trackingCodeFrom.patchValue({
        landingPageTrackCode: this.businessInfo?.landingPageTrackCode,
        googleAnalyticsGlobalCode: this.businessInfo?.googleAnalyticsGlobalCode,
        googleAnalyticsGlobalCodeUrl:
          this.businessInfo?.googleAnalyticsGlobalCodeUrl
      });
    }
  }

  submitTrackingCodeForm() {
    console.log('');
    const formData = this.trackingCodeFrom.value;
    this.businessService
      .updateBusinessTrackingCode(this.businessInfo.id, formData)
      .then(
        () => {
          this.alertService.success('Information updated successfully.');
        },
        () => {
          this.alertService.error('Unable to update  information.');
        }
      );
  }
}
