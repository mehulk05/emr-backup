import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { environment } from 'src/environments/environment';
import { BusinessService } from 'src/app/modules/account-and-settings/business/services/business.service';
import { PackagePaymentService } from 'src/app/modules/account-and-settings/business/services/package-payment.service';
import { PaymentService } from 'src/app/modules/appointment/services/payment.service';

@Component({
  selector: 'app-two-way-text-configuration',
  templateUrl: './two-way-text-configuration.component.html',
  styleUrls: ['./two-way-text-configuration.component.css']
})
export class TwoWayTextConfigurationComponent implements OnInit, OnChanges {
  @Input() businessInfo: any;
  twoWayTextForm!: FormGroup;
  twowaySMSEnabled: boolean = false;
  twoWayNumber: any;
  showModal: boolean = false;
  showDisableTwoWayTextModal: boolean = false;
  twilioDisableInProgress: boolean = false;
  twilioUpgradeData: any;

  constructor(
    public formBuilder: FormBuilder,
    private toastService: ToasTMessageService,
    private businessService: BusinessService,
    private localStorageService: LocalStorageService,
    private packagePaymentService: PackagePaymentService,
    private paymentService: PaymentService
  ) {}

  ngOnInit(): void {
    this.twoWayTextForm = this.formBuilder.group({
      enableTwoWaySMS: [false, []],
      getTwilioNumber: [false, []],
      enableAiTwoWaySMSSuggestion: [false, []],
      enableSmsAutoReply: [false, []],
      enableEmailNotificationForMessages: [false, []]
    });
  }

  ngOnChanges(): void {
    if (this.businessInfo) {
      this.init();
    }
  }

  init() {
    if (
      this.businessInfo.getTwilioNumber &&
      this.businessInfo.twilioNumber === environment.DEFAULT_TWILIO_NUMBER
    ) {
      this.twilioDisableInProgress = true;
    }

    this.twoWayTextForm.patchValue({
      enableTwoWaySMS: this.businessInfo?.enableTwoWaySMS,
      enableAiTwoWaySMSSuggestion:
        this.businessInfo?.enableAiTwoWaySMSSuggestion,
      getTwilioNumber: this.twilioDisableInProgress
        ? false
        : this.businessInfo?.getTwilioNumber,
      enableSmsAutoReply: this.businessInfo.enableSmsAutoReply ?? false,
      enableEmailNotificationForMessages:
        this.businessInfo.enableEmailNotificationForMessages ?? false
    });

    if (this.businessInfo?.getTwilioNumber) {
      this.twowaySMSEnabled = true;
      this.twoWayTextForm.controls['enableTwoWaySMS'].valueChanges.subscribe(
        (value) => {
          this.updateSmsForwardingStatus(value);
        }
      );
      this.twoWayTextForm.controls[
        'enableAiTwoWaySMSSuggestion'
      ].valueChanges.subscribe((value) => {
        this.updateSmsAiMessageStatus(value);
      });
      this.twoWayTextForm.controls['enableSmsAutoReply'].valueChanges.subscribe(
        (value) => {
          this.updateSmsAutoReplyStatus(value);
        }
      );
      this.twoWayTextForm.controls[
        'enableEmailNotificationForMessages'
      ].valueChanges.subscribe((value) => {
        this.updateEmailNotificationForMessages(value);
      });
    }

    this.paymentService.getTwilioA2pUpgradeData().then((res: any) => {
      if (res) this.twilioUpgradeData = res;
    });
  }

  updateSmsForwardingStatus(value: boolean) {
    const formData = {
      enableTwoWaySMS: value
    };
    this.businessService
      .updateSmsForwardingStatus(this.businessInfo.id, formData)
      .then(
        (data) => {
          if (data) {
            this.localStorageService.storeItem('businessInfo', data);
            this.businessInfo = data;
          }
          this.toastService.success(
            'SMS Forwarding status updated successfully.'
          );
        },
        () => {
          this.twoWayTextForm.controls['enableTwoWaySMS'].setValue(!value, {
            emitEvent: false
          });
          this.toastService.error('Unable to update Sms Forwarding status.');
        }
      );
  }

  updateSmsAiMessageStatus(value: boolean) {
    const formData = {
      enableAiTwoWaySMSSuggestion: value
    };
    this.businessService
      .updateSmsAIMessageStatus(this.businessInfo.id, formData)
      .then(
        (data) => {
          if (data) {
            this.localStorageService.storeItem('businessInfo', data);
            this.businessInfo = data;
          }
          this.toastService.success(
            'SMS AI message suggestions updated successfully.'
          );
        },
        () => {
          this.twoWayTextForm.controls['enableAiTwoWaySMSSuggestion'].setValue(
            !value,
            {
              emitEvent: false
            }
          );
          this.toastService.error(
            'Unable to update SMS AI message suggestions status.'
          );
        }
      );
  }

  updateSmsAutoReplyStatus(value: boolean) {
    this.businessService
      .updateSmsAutoReplyStatus(this.businessInfo.id, value)
      .then(
        (data) => {
          if (data) {
            this.localStorageService.storeItem('businessInfo', data);
            this.businessInfo = data;
          }
          this.toastService.success(
            'SMS Auto reply status updated successfully.'
          );
        },
        () => {
          this.twoWayTextForm.controls['enableSmsAutoReply'].setValue(!value, {
            emitEvent: false
          });
          this.toastService.error('Unable to update SMS Auto reply status.');
        }
      );
  }

  updateEmailNotificationForMessages(value: boolean) {
    if (value && !this.businessInfo?.notificationEmail) {
      this.toastService.error(
        'Please add the email ID in the notification center before enabling this service'
      );
      this.twoWayTextForm.controls[
        'enableEmailNotificationForMessages'
      ].setValue(!value, {
        emitEvent: false
      });
      return;
    }
    this.businessService
      .updateEmailNotificationForMessages(this.businessInfo.id, value)
      .then(
        (data) => {
          if (data) {
            this.localStorageService.storeItem('businessInfo', data);
            this.businessInfo = data;
          }
          this.toastService.success(
            'Email Notification status updated successfully.'
          );
        },
        () => {
          this.twoWayTextForm.controls[
            'enableEmailNotificationForMessages'
          ].setValue(!value, {
            emitEvent: false
          });
          this.toastService.error(
            'Unable to update Email Notification status.'
          );
        }
      );
  }

  enableTwoWayText() {
    const formData = this.twoWayTextForm.value;
    this.updateTwoWayTextStatus(formData, this.hideModal);
  }

  updateTwoWayTextStatus(formData: any, callbackFn: any) {
    this.businessService
      .updateTwoWayTextStatus(this.businessInfo.id, formData)
      .then(
        (data) => {
          if (data) {
            this.localStorageService.storeItem('businessInfo', data);
            this.businessInfo = data;
            callbackFn();
            this.init();
          }
          this.toastService.success('Information updated successfully.');
        },
        () => {
          this.showModal = false;
          this.showDisableTwoWayTextModal = false;
          this.toastService.error('Unable to update  information.');
        }
      );
  }

  hideModal() {
    this.showModal = false;
    this.twoWayTextForm.controls['getTwilioNumber'].setValue(
      this.businessInfo.getTwilioNumber ?? false,
      {
        emitEvent: false
      }
    );
  }

  disableTwoWayText() {
    console.log(
      'Upgrade data before disable===> ' +
        JSON.stringify(this.twilioUpgradeData)
    );
    this.showModal = false;
    this.showDisableTwoWayTextModal = false;
    if (this.twilioUpgradeData?.subscriptionId) {
      this.packagePaymentService
        .unsubscribePackage(this.twilioUpgradeData.subscriptionId)
        .then((response: any) => {
          this.twilioUpgradeData = response;
          console.log(
            'Upgrade data after disable===> ' +
              JSON.stringify(this.twilioUpgradeData)
          );
          this.twoWayTextForm.patchValue({
            enableTwoWaySMS: false,
            getTwilioNumber: false,
            enableAiTwoWaySMSSuggestion: false
          });
          const formData = this.twoWayTextForm.value;
          this.updateTwoWayTextStatus(
            formData,
            this.hideDisableTwoWayTextModal
          );
          window.location.reload();
        })
        .catch((err) => console.log(err));
    }
  }

  hideDisableTwoWayTextModal() {
    this.showDisableTwoWayTextModal = false;
    this.twoWayTextForm.controls['getTwilioNumber'].setValue(
      this.businessInfo.getTwilioNumber ?? false,
      {
        emitEvent: false
      }
    );
  }

  showDisableTwoWayModal() {
    this.showDisableTwoWayTextModal = true;
  }
}
