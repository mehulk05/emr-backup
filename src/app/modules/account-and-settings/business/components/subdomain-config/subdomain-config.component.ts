import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
import { BusinessService } from '../../services/business.service';

@Component({
  selector: 'app-subdomain-config',
  templateUrl: './subdomain-config.component.html',
  styleUrls: ['./subdomain-config.component.css']
})
export class SubdomainConfigComponent implements OnInit, OnChanges {
  @Input() businessInfo: any;
  subdomainForm!: FormGroup;
  constructor(
    public formBuilder: FormBuilder,
    private toastService: ToasTMessageService,
    private businessService: BusinessService
  ) {}

  ngOnInit(): void {
    console.log('');

    this.subdomainForm = this.formBuilder.group({
      subDomainName: ['', [Validators.required]]
      // subDomainWebsiteTemplateId: ['',[Validators.required]],
    });
  }

  ngOnChanges(): void {
    if (this.businessInfo) {
      this.subdomainForm.patchValue({
        subDomainName: this.businessInfo?.subDomainName
      });
    }
  }

  get f() {
    return this.subdomainForm.controls;
  }

  submitForm() {
    if (this.subdomainForm.invalid) {
      return;
    }
    var format = /[^a-zA-Z0-9_-]+/;
    if (this.subdomainForm.value.subDomainName.match(format)) {
      this.toastService.error(
        'Special character and space not allowed in subdomain name'
      );
      return;
    }

    const formData = this.subdomainForm.value;
    // formData.businessHours = businessHoursArray;
    this.businessService
      .updateBusinessSubdomain(this.businessInfo.id, formData)
      .then(
        () => {
          this.toastService.success('Information updated successfully.');
        },
        () => {
          this.toastService.error('Unable to update  information.');
        }
      );
  }
}
