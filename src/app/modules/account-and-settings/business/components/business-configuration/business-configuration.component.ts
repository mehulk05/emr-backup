import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
import { BusinessService } from '../../services/business.service';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
@Component({
  selector: 'app-business-configuration',
  templateUrl: './business-configuration.component.html',
  styleUrls: ['./business-configuration.component.css']
})
export class BusinessConfigurationComponent implements OnInit, OnChanges {
  @Input() businessInfo: any;
  businessConfigurationForm!: FormGroup;
  constructor(
    public formBuilder: FormBuilder,
    private toastService: ToasTMessageService,
    private businessService: BusinessService,
    private localStorageService: LocalStorageService
  ) {}

  ngOnInit(): void {
    console.log('');

    this.businessConfigurationForm = this.formBuilder.group({
      // subDomainName: ['', [Validators.required]],
      showNotesPopupOnLeadLoad: [false, []],
      showPatientDetailsOnSinglePage: [false, []]

      // subDomainWebsiteTemplateId: ['',[Validators.required]],
    });
  }

  ngOnChanges(): void {
    if (this.businessInfo) {
      this.businessConfigurationForm.patchValue({
        showNotesPopupOnLeadLoad: this.businessInfo?.showNotesPopupOnLeadLoad,
        showPatientDetailsOnSinglePage:
          this.businessInfo?.showPatientDetailsOnSinglePage
      });
    }
  }

  get f() {
    return this.businessConfigurationForm.controls;
  }

  onCheckboxValueChanged(newValue: boolean, key: string): void {
    // Update the value in the form control
    this.businessConfigurationForm.patchValue({
      [key]: newValue
    });
  }
  submitForm() {
    if (this.businessConfigurationForm.invalid) {
      return;
    }

    console.log(this.businessConfigurationForm.value);

    const formData = this.businessConfigurationForm.value;
    // formData.businessHours = businessHoursArray;
    this.businessService
      .updateBusinessConfiguration(this.businessInfo.id, formData)
      .then(
        (data) => {
          this.localStorageService.storeItem('businessInfo', data);
          this.toastService.success('Information updated successfully.');
        },
        () => {
          this.toastService.error('Unable to update  information.');
        }
      );
  }
}
