import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
import { SetPublicClinic } from 'src/app/shared/store-management/store/general-states/general-state.action';
import { ClinicService } from '../../../services/clinic.service';

@Component({
  selector: 'app-clinic-config',
  templateUrl: './clinic-config.component.html',
  styleUrls: ['./clinic-config.component.css']
})
export class ClinicConfigComponent implements OnInit, OnChanges {
  @Input() clinicData: any;
  @Input() clinicId: any;
  clinicConfigFormSetting: FormGroup;
  providerBaseBooking = false;
  enablePaymentLink = false;
  collectDeposit = false;
  disableVirtualAppointment: boolean = false;
  disableInPersonAppointment: boolean = false;
  hidePayLater: boolean = false;
  // stripeSetupUrl: string;
  title =
    'Allow your clients to book more than one appointment per timeslot by enabling multiple bookings without a provider.';
  title1 =
    'Allow your patient to sign the consents and questionnaires while booking appointment.';
  title2 = 'Customize additional notes for your public appointment form';
  title3 = 'Please Complete Stripe setup to receive Payments';
  constructor(
    public formBuilder: FormBuilder,
    private toastMessageService: ToasTMessageService,
    private clinicService: ClinicService,
    private router: Router,
    private store: Store,
    private localStorageService: LocalStorageService
  ) {
    // if (window.location.hostname === 'https://app.growth99.com') {
    //   this.stripeSetupUrl = 'https://app.growth99.com/stripe/setup';
    // } else {
    //   this.stripeSetupUrl = '/stripe/setup';
    // }
  }

  ngOnInit(): void {
    this.clinicConfigFormSetting = this.formBuilder.group({
      ccPatientEmail: [false, []],
      showPayButton: [false, []],
      appointmentBlockWithinHours: [24, []],
      preBookingOnly: [false, []],
      defaultPreBookingCost: [0, []],
      isProviderBasedAppointment: [false, []],
      numberOfSlotsAvailable: [1, []],
      showBookAppointmentButton: [true, []],
      seamlessPatientExperience: [false, []],
      disableVirtualAppointment: [false, []],
      disableInPersonAppointment: [false, []],
      hidePayLater: [false, []],
      priceVaries: [false, []],
      sendPatientWelcomeEmail: [true, []],
      notesLabel: ['', []],
      notesRequiredOptional: [false, []],
      showCategoriesOnAppointmentBookingPage: [false, []]
    });
  }

  ngOnChanges(): void {
    if (this.clinicData?.id != null) {
      setTimeout(() => {
        this.updateClinicConfigFormSetting();
      }, 100);
    }
  }

  updateClinicConfigFormSetting(data?: any) {
    console.log(this.clinicData, data);
    if (data != undefined) {
      this.clinicData = data;
    }
    this.clinicConfigFormSetting.patchValue({
      ccPatientEmail: this.clinicData?.ccPatientEmail,
      showPayButton: this.clinicData?.showPayButton,
      // sendRemainderEmail: this.clinicData?.sendRemainderEmail,
      appointmentBlockWithinHours: this.clinicData?.appointmentBlockWithinHours,
      preBookingOnly: this.clinicData?.preBookingOnly,
      defaultPreBookingCost: this.clinicData?.defaultPreBookingCost,
      isProviderBasedAppointment: this.clinicData?.isProviderBasedAppointment,
      numberOfSlotsAvailable: this.clinicData?.numberOfSlotsAvailable,
      showBookAppointmentButton: this.clinicData?.showBookAppointmentButton,
      seamlessPatientExperience: this.clinicData?.seamlessPatientExperience,
      disableVirtualAppointment: this.clinicData?.disableVirtualAppointment,
      disableInPersonAppointment: this.clinicData?.disableInPersonAppointment,
      hidePayLater: this.clinicData?.hidePayLater,
      priceVaries: this.clinicData?.priceVaries,
      sendPatientWelcomeEmail: this.clinicData?.sendPatientWelcomeEmail,
      notesLabel: this.clinicData?.notesLabel,
      notesRequiredOptional: this.clinicData?.notesRequiredOptional,
      showCategoriesOnAppointmentBookingPage:
        this.clinicData?.showCategoriesOnAppointmentBookingPage
    });
    if (this.clinicData?.isProviderBasedAppointment) {
      this.providerBaseBooking = true;
    }
    if (this.clinicData?.showPayButton) {
      this.enablePaymentLink = true;
    }
    if (this.clinicData?.preBookingOnly) {
      this.collectDeposit = true;
    }
    if (this.clinicData?.disableVirtualAppointment) {
      this.disableVirtualAppointment = true;
      this.disableInPersonAppointment = false;
    }
    if (this.clinicData?.disableInPersonAppointment) {
      this.disableVirtualAppointment = false;
      this.disableInPersonAppointment = true;
    }
    if (this.clinicData?.hidePayLater) {
      this.hidePayLater = true;
    }
  }

  onChangeProviderBasedBooking(values: any) {
    console.log(values.currentTarget.checked);
    if (values.currentTarget.checked) {
      this.providerBaseBooking = true;
    } else {
      this.providerBaseBooking = false;
      this.clinicConfigFormSetting.patchValue({
        numberOfSlotsAvailable: 1
      });
    }
  }

  onPreBookingOnly(values: any) {
    if (values.currentTarget.checked) {
      this.enablePaymentLink = true;
      if (this.clinicConfigFormSetting.value.preBookingOnly) {
        this.collectDeposit = true;
      }
    } else {
      this.enablePaymentLink = false;
      this.collectDeposit = false;
      this.clinicConfigFormSetting.get('hidePayLater').setValue(false);
    }
  }

  onEnablePriceVaries(values: any) {
    console.log(values);
    // if (values.currentTarget.checked) {
    //   this.enablePaymentLink = true;
    //   if (this.clinicConfigFormSetting.value.preBookingOnly) {
    //     this.collectDeposit = true;
    //   }
    // } else {
    //   this.enablePaymentLink = false;
    //   this.collectDeposit = false;
    // }
  }

  onChangeCollectDeposit(values: any) {
    if (values.currentTarget.checked) {
      this.collectDeposit = true;
    } else {
      this.collectDeposit = false;
    }
  }

  onCancelForm() {
    this.router.navigate(['clinics']);
  }

  get f() {
    return this.clinicConfigFormSetting.controls;
  }

  submitForm() {
    if (this.disableVirtualAppointment) {
      this.clinicConfigFormSetting.value.disableVirtualAppointment = true;
      this.clinicConfigFormSetting.value.disableInPersonAppointment = false;
    } else {
      this.disableVirtualAppointment = false;
    }
    if (this.disableInPersonAppointment) {
      this.clinicConfigFormSetting.value.disableInPersonAppointment = true;
      this.clinicConfigFormSetting.value.disableVirtualAppointment = false;
    } else {
      this.clinicConfigFormSetting.value.disableInPersonAppointment = false;
    }

    //   if(this.clinicConfigFormSetting.isProviderBasedAppointment.value)
    //   this.clinicConfigFormSetting.numberOfSlotsAvailable.value = 1;
    const formData = this.clinicConfigFormSetting.value;
    console.log(this.clinicConfigFormSetting.value.defaultPreBookingCost);
    if (
      this.clinicConfigFormSetting.value.showPayButton &&
      this.clinicConfigFormSetting.value.preBookingOnly &&
      // this.clinicConfigFormSetting.value.hidePayLater &&
      (!this.clinicConfigFormSetting.value.defaultPreBookingCost ||
        this.clinicConfigFormSetting.value.defaultPreBookingCost == 0)
    ) {
      this.toastMessageService.error('Enter deposit cost');
      return;
    }

    this.clinicService.updateClinicConfigSetting(this.clinicId, formData).then(
      (res: any) => {
        console.log('data', res);
        this.toastMessageService.success(
          'Clinic setting updated successfully.'
        );
        this.updateClinicConfigFormSetting(res);
        this.localStorageService.storeItem('defaultClinic', res);
        this.store.dispatch(new SetPublicClinic(res));
      },
      () => {
        this.toastMessageService.error('Unable to save clinic setting .');
      }
    );
  }

  disableVirtualAppointmentOnly(event: any) {
    if (event.target.checked) {
      this.disableVirtualAppointment = true;
      this.disableInPersonAppointment = false;
    } else {
      this.disableVirtualAppointment = false;
    }
  }
  disableInPersonAppointmentOnly(event: any) {
    if (event.target.checked) {
      this.disableInPersonAppointment = true;
      this.disableVirtualAppointment = false;
    } else {
      this.disableInPersonAppointment = false;
    }
  }

  hidePayLaterOnly(event: any) {
    console.log(event);
    // if (event.target.checked) {
    //   this.hidePayLater = true;
    // } else {
    //   this.hidePayLater = false;
    // }
  }
}
