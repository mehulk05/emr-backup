import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
import { PackagePaymentService } from '../../account-and-settings/business/services/package-payment.service';
import { AuthService } from '../../authentication/services/auth.service';
import { BusinessService } from '../../account-and-settings/business/services/business.service';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';

@Component({
  selector: 'app-sms-email-upgrade-billing',
  templateUrl: './sms-email-upgrade-billing.component.html',
  styleUrls: ['./sms-email-upgrade-billing.component.css']
})
export class SmsEmailUpgradeBillingComponent implements OnInit {
  @Input() businessInfo: any;
  customerPaymentInfo: any;
  payments: any = [];
  loggedInUser: any;
  paymentErrorMessage: string = '';
  showModal: boolean = false;
  constructor(
    private alertService: ToasTMessageService,
    private router: Router,
    private packagePaymentService: PackagePaymentService,
    private authService: AuthService,
    private businessService: BusinessService,
    private localStorageService: LocalStorageService
  ) {}

  ngOnInit(): void {
    this.authService.currentUserSubject.subscribe((data) => {
      this.loggedInUser = data;
      this.loadBusiness();
    });
    this.getPaymentsList();
  }

  loadBusiness() {
    this.businessService
      .getBusinessOptimized(this.loggedInUser?.businessId)
      .then((response: any) => {
        this.businessInfo = response;
        this.localStorageService.storeItem('businessInfo', this.businessInfo);
      });
  }

  getPaymentsList() {
    this.packagePaymentService
      .getUpgradePaymentsList()
      .then((response: any) => {
        this.payments = response;
      })
      .catch((error: any) => {
        this.payments = [];
        console.log(error.message);
      });
  }

  getDate(date: any) {
    return new Date(date * 1000);
  }

  showInvoice(invoiceUrl: string) {
    if (invoiceUrl && !invoiceUrl.includes('pi')) {
      window.open(invoiceUrl);
    }
  }

  getDates(date: any) {
    return new Date(date).toDateString();
  }

  showErrorReason(errorMessage: string) {
    this.paymentErrorMessage = errorMessage;
    this.showModal = true;
  }

  hideModal() {
    this.showModal = false;
    this.paymentErrorMessage = '';
  }
}
