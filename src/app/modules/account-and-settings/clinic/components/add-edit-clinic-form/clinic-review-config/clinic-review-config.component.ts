import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
import { ClinicService } from '../../../services/clinic.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-clinic-review-config',
  templateUrl: './clinic-review-config.component.html',
  styleUrls: ['./clinic-review-config.component.css']
})
export class ClinicReviewConfigComponent implements OnInit, OnChanges {
  clinicReviewSettings!: FormGroup;
  @Input() clinicData: any;
  @Input() clinicId: any;
  constructor(
    public formBuilder: FormBuilder,
    private toastMessageService: ToasTMessageService,
    private clinicService: ClinicService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.clinicReviewSettings = this.formBuilder.group({
      //allowOnlineBooking: [false, []],

      appReviewCode: ['', []],
      reviewButtonCode: ['', []]
    });
  }

  ngOnChanges(): void {
    if (
      this.clinicId != null &&
      this.clinicReviewSettings &&
      this.clinicReviewSettings.controls
    ) {
      this.updateClinicReviewSettings();
    }
  }

  onCancelForm() {
    this.router.navigate(['clinics']);
  }

  updateClinicReviewSettings() {
    console.log(this.clinicReviewSettings.controls.value);
    this.clinicReviewSettings.patchValue({
      appReviewCode: this.clinicData?.appReviewCode,
      reviewButtonCode: this.clinicData?.reviewButtonCode
    });
  }

  submitForm() {
    const formData = this.clinicReviewSettings.value;
    this.clinicService.updateClinicReviewSetting(this.clinicId, formData).then(
      () => {
        this.toastMessageService.success(
          'Clinic setting updated successfully.'
        );
      },
      () => {
        this.toastMessageService.error('Unable to save clinic setting .');
      }
    );
  }
}
