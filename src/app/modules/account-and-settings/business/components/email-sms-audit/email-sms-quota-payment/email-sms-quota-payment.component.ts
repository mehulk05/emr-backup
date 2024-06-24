import { Component, Input, OnInit } from '@angular/core';
//import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
import { BusinessService } from '../../../services/business.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-email-sms-quota-payment',
  templateUrl: './email-sms-quota-payment.component.html',
  styleUrls: ['./email-sms-quota-payment.component.css']
})
export class EmailSmsQuotaPaymentComponent implements OnInit {
  @Input() loggedInUser: any;
  selectedPack: any;
  showStripeComponent: boolean = false;
  rowData: any = [];
  constructor(
    private toastService: ToasTMessageService,
    private businessService: BusinessService,
    //private localStorageService: LocalStorageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    console.log('In Init');
    this.loadPackages();
  }

  loadPackages() {
    this.businessService
      .getEmailSmsPackage()
      .then((data: any) => {
        this.rowData = data;
      })
      .catch(() => {
        this.toastService.error('Unable to load Packages');
      });
  }

  gotoStripe(pack: any) {
    console.log(pack);
    pack.amountToPaid = pack.cost;
    this.selectedPack = pack;
    // this.selectedPack.tenantId =
    //   this.localStorageService.readStorage('businessInfo')?.id;
    this.showStripeComponent = true;
  }

  cancelStripeModal() {
    this.showStripeComponent = false;
  }

  onPaymentSuccess() {
    this.toastService.success('Payment completed successfully.');
    this.loadPackages();
    this.showStripeComponent = false;

    setTimeout(() => {
      this.router.navigate(['business']);
    }, 5000); //5s
  }

  onPaymentCancel() {
    this.showStripeComponent = false;
    setTimeout(() => {
      this.router.navigate(['business']);
    }, 5000); //5s
  }
}
