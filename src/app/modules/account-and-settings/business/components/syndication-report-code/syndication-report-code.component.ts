import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RegexEnum } from 'src/app/shared/common/constants/regex';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
import { BusinessService } from '../../services/business.service';

@Component({
  selector: 'app-syndication-report-code',
  templateUrl: './syndication-report-code.component.html',
  styleUrls: ['./syndication-report-code.component.css']
})
export class SyndicationReportCodeComponent implements OnInit, OnChanges {
  @Input() businessInfo: any;
  paidMediaForm!: FormGroup;
  loggedInUser: any = null;
  urlPattern = new RegExp(RegexEnum.httpUrl);
  constructor(
    public formBuilder: FormBuilder,
    private toastService: ToasTMessageService,
    private businessService: BusinessService
  ) {}

  ngOnInit(): void {
    console.log('');

    this.paidMediaForm = this.formBuilder.group({
      syndicationCode: [
        '',
        [Validators.required, Validators.pattern(this.urlPattern)]
      ]
    });
  }

  ngOnChanges(): void {
    if (this.businessInfo) {
      this.paidMediaForm.patchValue({
        syndicationCode: this.businessInfo?.syndicationCode
      });
    }
  }

  get f() {
    return this.paidMediaForm.controls;
  }

  deleteCodeInDataStudio() {
    this.submitForm(true);
    this.paidMediaForm.patchValue({
      syndicationCode: ''
    });
  }
  submitForm(isClearForm?: any) {
    if (this.paidMediaForm.invalid) {
      this.toastService.error('Please enter correct code');
      return;
    }
    let formData = this.paidMediaForm.value;
    if (isClearForm) {
      formData = {
        syndicationCode: ''
      };
    }
    const successMsg = isClearForm
      ? 'Source URL Deleted Successfully'
      : 'Source URL Added Successfully';
    this.businessService
      .updateSyndicationReport(this.businessInfo.id, formData)
      .then(
        () => {
          this.toastService.success(successMsg);
        },
        () => {
          this.toastService.error('Unable to update the information.');
        }
      );
  }
}
