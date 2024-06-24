import { Component, OnChanges, Input } from '@angular/core';
import { Router } from '@angular/router';
import { PackagePaymentService } from '../../services/package-payment.service';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'account-control',
  templateUrl: './account-control.component.html',
  styleUrls: ['./account-control.component.css']
})
export class AccountControlComponent implements OnChanges {
  @Input() businessInfo: any;
  currentSubscription: any;
  customerPaymentInfo: any;
  payments: any = [];

  constructor(
    private alertService: ToasTMessageService,

    private router: Router,
    private packagePaymentService: PackagePaymentService
  ) {}

  ngOnChanges(): void {
    this.getSubscriptionsFromAPI();
    this.getCustomeDefaultpaymentDetails();
    this.getPaymentsList();
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
