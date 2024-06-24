import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PaymentService } from 'src/app/modules/appointment/services/payment.service';
import { GEO_CODES } from 'src/app/shared/common/constants/constant';
import { BusinessService } from 'src/app/shared/services/business.service';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';

@Component({
  selector: 'app-two-way-text-subscription',
  templateUrl: './two-way-text-subscription.component.html',
  styleUrls: ['./two-way-text-subscription.component.css']
})
export class TwoWayTextSubscriptionComponent implements OnInit {
  @ViewChild('progressIndicator') progressIndicator: ElementRef;
  businessInfo: any;
  currentIndex: number = -1;
  stepsCount: number = 3;
  twoWayTextUpgradeRequest: boolean = false;
  packageList: any[] = [];
  type: string = 'onetime';
  a2pUpgrade: any;
  geoOptions: any = GEO_CODES;
  geoCode: string;
  errGeo: Boolean = false;
  errDigit: Boolean = false;
  searchDigits: string;
  availableTwilioNumbersToBuy: any = [];
  paymentErrorMessage: string;
  businessId: any;
  constructor(
    private paymentService: PaymentService,
    private localStorageService: LocalStorageService,
    private toastService: ToasTMessageService,
    private businessService: BusinessService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((data: any) => {
      this.businessId =
        data?.bid || this.localStorageService.readStorage('businessInfo')?.id;
      console.log(this.businessId);
      this.paymentService
        .getTwilioA2pUpgradeData(this.businessId)
        .then((res: any) => {
          this.a2pUpgrade = res;
          if (
            (res?.isPaymentComplete && res?.fileUrl === 'None') ||
            (res?.isPaymentComplete && res?.address1)
          )
            this.changeStep(2);
          else if (res?.isPaymentComplete) this.changeStep(1);
          // else if (res?.twilioNumberChoice) this.changeStep(0);
        });
    });
    this.currentIndex = -1;

    this.businessInfo = this.localStorageService.readStorage('businessInfo');
    if (this.businessInfo) {
      this.twoWayTextUpgradeRequest =
        this.businessInfo.upgradeToTwoWayText ?? false;
    }
  }

  handleButtonClicked(e: any) {
    this.businessId = e?.bid;
    if (e.type === 'upgrade') {
      this.businessService
        .upgradeToTwoWayText(e.type, this.businessId)
        .then((resposne: any) =>
          console.log('Mail sent' + JSON.stringify(resposne))
        );
      this.currentIndex = 0;
    }
  }

  changeStep(index: number) {
    if (index === -1) this.currentIndex = index;
    else if (index >= 0 && index < this.stepsCount) {
      this.currentIndex = index;
      this.progressIndicator.nativeElement.style.width = `${
        (this.currentIndex / (this.stepsCount - 1)) * 100
      }%`;
    }
  }

  nextStep() {
    this.changeStep(this.currentIndex + 1);
  }

  prevStep() {
    this.changeStep(this.currentIndex - 1);
  }

  retry() {
    this.changeStep(1);
  }

  afteronPaymentSuccess(payment: any) {
    if (payment?.paid) {
      this.paymentService
        .getTwilioA2pUpgradeData(this.businessId)
        .then((res: any) => {
          this.a2pUpgrade = res;
        });
    }
  }

  changeDigitChoice(event: any) {
    const val = event.target.value;
    if (val.length > 10 || isNaN(val)) this.errDigit = true;
    else this.errDigit = false;
  }

  changeAreaCode(event: any) {
    const val = event.target.value;
    if (val.length > 3 || (val.length < 3 && val.length > 0) || isNaN(val))
      this.errGeo = true;
    else this.errGeo = false;
  }

  clickProgressDot(index: number) {
    console.log(this.currentIndex);
    console.log(this.a2pUpgrade);
    if (this.a2pUpgrade) {
      if (
        !this.a2pUpgrade.isPaymentComplete &&
        this.a2pUpgrade.twilioNumberChoice
      )
        this.changeStep(index);
    }
  }

  findAvailableNos() {
    if (!this.searchDigits && !this.geoCode) return;
    this.businessService
      .getAvailableTwilios(this.geoCode, this.searchDigits, this.businessId)
      .then((response: any) => {
        console.log(response);
        this.availableTwilioNumbersToBuy = response;
        response.length === 0 && this.toastService.info('No records found');
      });
  }

  savePhoneChoice(phoneObject: any) {
    const mForm = new FormData();
    const body = {
      twilioNumberChoice: phoneObject.phoneNumber
    };
    mForm.append('body', JSON.stringify(body));
    this.paymentService
      .saveTwilioA2pUpgradeData(mForm, this.businessId)
      .then((response: any) => {
        console.log(response);
        this.paymentService
          .getTwilioA2pUpgradeData(this.businessId)
          .then((res: any) => {
            this.a2pUpgrade = res;
          });
        this.nextStep();
      })
      .catch((err: any) => {
        console.log(err);
        this.toastService.error('Unable to save please try again');
      });
  }

  nextAndStayOnForm(fileUrl: string) {
    const mForm = new FormData();
    const body = { fileUrl };
    mForm.append('body', JSON.stringify(body));
    this.paymentService
      .saveTwilioA2pUpgradeData(mForm, this.businessId)
      .then((response: any) => {
        console.log(response);
        this.paymentService
          .getTwilioA2pUpgradeData(this.businessId)
          .then((res: any) => {
            this.a2pUpgrade = res;
          });
        this.nextStep();
      })
      .catch((err: any) => {
        console.log(err);
        this.toastService.error('Unable to save please try again');
      });
  }

  buttonClickedForPackageList(e: any) {
    console.log(
      'Current Index ==> ' + this.currentIndex,
      'Current Status ==> ' + e.type
    );
    if (e.type === 'cancel') {
      this.currentIndex === 0 ? (this.currentIndex = -1) : this.prevStep();
    } else if (e.type === 'failed') {
      this.currentIndex = 10;
      this.paymentErrorMessage = e.errorMessage;
    } else if (e.type === 'next') {
      this.paymentService
        .getTwilioA2pUpgradeData(this.businessId)
        .then((res: any) => {
          this.a2pUpgrade = res;
        });
      this.nextStep();
    }
  }

  goToDemo() {
    window.open(
      'https://support.growth99.com/portal/en/kb/articles/two-way-texting-feature-in-the-g99-application',
      '_blank'
    );
  }
}
