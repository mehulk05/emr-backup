import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
import { BusinessService } from '../../services/business.service';

@Component({
  selector: 'app-refund-policy',
  templateUrl: './refund-policy.component.html',
  styleUrls: ['./refund-policy.component.css']
})
export class RefundPolicyComponent implements OnInit, OnChanges {
  @Input() businessInfo: any;
  @Input() loggedInUser: any;
  paymentRefundForm!: FormGroup;
  constructor(
    public formBuilder: FormBuilder,
    private toastService: ToasTMessageService,
    private businessService: BusinessService
  ) {}

  ngOnInit(): void {
    this.paymentRefundForm = this.formBuilder.group({
      paymentRefundable: [true, []],
      refundablePaymentPercentage: [
        0.0,
        [Validators.required, Validators.min(0), Validators.max(100)]
      ],
      paymentRefundableBeforeHours: [24, [Validators.required]]
    });
    this.loadBusiness();
  }

  ngOnChanges(): void {
    if (this.businessInfo) {
      this.paymentRefundForm = this.formBuilder.group({
        paymentRefundable: [true, []],
        refundablePaymentPercentage: [0.0, [Validators.required]],
        paymentRefundableBeforeHours: [24, [Validators.required]]
      });
    }
  }

  loadBusiness() {
    this.businessService
      .getBusinessOptimized(this.loggedInUser.businessId)
      .then((response: any) => {
        this.paymentRefundForm.patchValue({
          paymentRefundable: response.paymentRefundable,
          paymentRefundableBeforeHours: response.paymentRefundableBeforeHours,
          refundablePaymentPercentage: response.refundablePaymentPercentage
        });
      });
  }

  submitPaymentRefundForm() {
    const formData = this.paymentRefundForm.value;
    // formData.businessHours = businessHoursArray;
    this.businessService
      .updateBusinessPaymentRefund(this.businessInfo?.id, formData)
      .then(
        () => {
          this.toastService.success('Information updated successfully.');
        },
        () => {
          this.toastService.error('Unable to update  information.');
        }
      );
  }

  onCheckboxValueChanged(newValue: boolean, key: string): void {
    // Update the value in the form control
    this.paymentRefundForm.patchValue({
      [key]: newValue
    });
  }
}
