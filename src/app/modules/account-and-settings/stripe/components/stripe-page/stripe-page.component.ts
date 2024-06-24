import { Component, OnInit } from '@angular/core';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
import { StripeService } from '../../services/stripe.service';

@Component({
  selector: 'app-stripe-page',
  templateUrl: './stripe-page.component.html',
  styleUrls: ['./stripe-page.component.css']
})
export class StripePageComponent implements OnInit {
  connectedStripeAccount: any = null;
  constructor(
    private alertService: ToasTMessageService,
    private stripeService: StripeService
  ) {}

  ngOnInit(): void {
    this.loadStripeConnectedAccount();
  }

  loadStripeConnectedAccount() {
    this.stripeService.getStripeConnectedAccount().then((response: any) => {
      if (response != null) {
        this.connectedStripeAccount = response;
      } else {
        this.connectedStripeAccount = null;
      }
    });
  }

  setupPayouts() {
    this.stripeService.getStripeOnboardingUrl().then(
      (response: any) => {
        console.log(response.url);
        window.open(response.url, '_blank');
        //  window.location = response.url;
      },
      () => {
        this.alertService.error('Unable to connect.');
      }
    );
  }

  resumeOnBoarding(accountId: any) {
    this.stripeService.resumeStripeOnboarding(accountId).then(
      (response: any) => {
        window.location = response.url;
      },
      () => {
        this.alertService.error('Unable to connect.');
      }
    );
  }

  deleteStripeAccount(id: any) {
    this.stripeService.deleteStripeConnectedAccount(id).then(
      () => {
        this.loadStripeConnectedAccount();
        this.alertService.success('Connected stripe account deleted.');
      },
      () => {
        this.alertService.error('Unable to delete connected stripe account.');
      }
    );
  }
}
