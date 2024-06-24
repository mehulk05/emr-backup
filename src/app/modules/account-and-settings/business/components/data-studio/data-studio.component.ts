import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RegexEnum } from 'src/app/shared/common/constants/regex';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
import { BusinessService } from '../../services/business.service';

@Component({
  selector: 'app-data-studio',
  templateUrl: './data-studio.component.html',
  styleUrls: ['./data-studio.component.css']
})
export class DataStudioComponent implements OnInit, OnChanges {
  @Input() businessInfo: any;
  dataStudioForm!: FormGroup;
  loggedInUser: any = null;
  urlPattern = new RegExp(RegexEnum.httpUrl);
  constructor(
    public formBuilder: FormBuilder,
    private toastService: ToasTMessageService,
    private businessService: BusinessService
  ) {}

  ngOnInit(): void {
    console.log('');

    this.dataStudioForm = this.formBuilder.group({
      dataStudioCode: [
        '',
        [Validators.required, Validators.pattern(this.urlPattern)]
      ]
    });
  }

  ngOnChanges(): void {
    if (this.businessInfo) {
      this.dataStudioForm.patchValue({
        dataStudioCode: this.businessInfo?.dataStudioCode
      });
    }
  }

  get f() {
    return this.dataStudioForm.controls;
  }

  deleteCodeInDataStudio() {
    this.submitForm(true);
  }
  submitForm(isClearForm?: any) {
    if (this.dataStudioForm.invalid) {
      this.toastService.error('Please enter correct code');
      return;
    }
    let formData = this.dataStudioForm.value;
    const successMsg = isClearForm
      ? 'Source URL Deleted Successfully'
      : 'Source URL Added Successfully';
    if (isClearForm) {
      formData = {
        dataStudioCode: ''
      };
    }
    this.businessService
      .updateBusinessDataStudioCode(this.businessInfo.id, formData)
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
