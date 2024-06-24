import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
import { PackagePaymentService } from '../../account-and-settings/business/services/package-payment.service';
import { AuthService } from '../../authentication/services/auth.service';
import { BusinessService } from '../../account-and-settings/business/services/business.service';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';

@Component({
  selector: 'app-sms-email-billing',
  templateUrl: './sms-email-billing.component.html',
  styleUrls: ['./sms-email-billing.component.css']
})
export class SmsEmailBillingComponent implements OnInit {
  @Input() businessInfo: any;
  currentSubscription: any;
  customerPaymentInfo: any;
  payments: any = [];
  loggedInUser: any;
  cancelConfirmVisible: boolean = false;

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
    this.getSubscriptionsFromAPI();
    this.getCustomeDefaultpaymentDetails();
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

  getSubscriptionsFromAPI() {
    this.packagePaymentService
      .getSubscriptions()
      .then((response: any) => {
        this.currentSubscription = response;
      })
      .catch((error: any) => {
        this.currentSubscription = null;
        console.log(error.message);
      });
  }

  openConfirmationOrExplorePacks() {
    this.cancelConfirmVisible = true;
  }

  doActionAftterConfirm() {
    this.cancelConfirmVisible = false;
    if (this.currentSubscription) {
      this.unsubscribe(this.currentSubscription);
    }
  }

  getPaymentsList() {
    this.packagePaymentService
      .getPaymentsList()
      .then((response: any) => {
        this.payments = response;
      })
      .catch((error: any) => {
        this.payments = [];
        console.log(error.message);
      });
  }

  unsubscribe(data: any): void {
    console.log(data);
    if (!data) return;
    this.packagePaymentService
      .unsubscribePackage(data.subscriptionId)
      .then(() => {
        this.currentSubscription = null;
        this.alertService.success('Unsubscribed!');
      })
      .catch((error: any) => {
        this.alertService.error('Unsubscribe error!');
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

  showPacks() {
    this.router.navigate(['show-packs']);
  }

  getDates(date: any) {
    return new Date(date).toDateString();
  }

  getCustomeDefaultpaymentDetails() {
    this.packagePaymentService.getCustomerDefaultPayament().then((response) => {
      this.customerPaymentInfo = response;
    });
  }
}
