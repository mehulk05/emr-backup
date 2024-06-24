import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RegexEnum } from 'src/app/shared/common/constants/regex';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
import { BusinessService } from '../../services/business.service';

@Component({
  selector: 'app-paid-media',
  templateUrl: './paid-media.component.html',
  styleUrls: ['./paid-media.component.css']
})
export class PaidMediaComponent implements OnInit, OnChanges {
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
      paidMediaCode: [
        '',
        [Validators.required, Validators.pattern(this.urlPattern)]
      ]
    });
  }

  ngOnChanges(): void {
    if (this.businessInfo) {
      this.paidMediaForm.patchValue({
        paidMediaCode: this.businessInfo?.paidMediaCode
      });
    }
  }

  get f() {
    return this.paidMediaForm.controls;
  }

  deleteCodeInDataStudio() {
    this.submitForm(true);
  }
  submitForm(isClearForm?: any) {
    if (this.paidMediaForm.invalid) {
      this.toastService.error('Please enter correct code');
      return;
    }
    let formData = this.paidMediaForm.value;
    if (isClearForm) {
      formData = {
        paidMediaCode: ''
      };
    }
    const successMsg = isClearForm
      ? 'Source URL Deleted Successfully'
      : 'Source URL Added Successfully';
    this.businessService
      .updateBusinessPaidMediaCode(this.businessInfo.id, formData)
      .then(
        () => {
          localStorage.removeItem('sidebarData');
          setTimeout(() => {
            this.toastService.success(successMsg);
          }, 200);
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        },
        () => {
          this.toastService.error('Unable to update  information.');
        }
      );
  }
}
