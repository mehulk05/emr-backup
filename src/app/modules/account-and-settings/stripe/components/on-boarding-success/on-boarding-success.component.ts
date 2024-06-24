import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
import { StripeService } from '../../services/stripe.service';

@Component({
  selector: 'app-on-boarding-success',
  templateUrl: './on-boarding-success.component.html',
  styleUrls: ['./on-boarding-success.component.css']
})
export class OnBoardingSuccessComponent implements OnInit {
  loggedInUser: any = null;

  constructor(
    private router: Router,
    private alertService: ToasTMessageService,
    private stripeService: StripeService
  ) {}

  ngOnInit(): void {
    this.stripeFlowSuccess();
  }

  stripeFlowSuccess() {
    this.stripeService.stripeFlowSuccess().then(
      () => {
        this.router.navigate(['/stripe/setup']);
      },
      () => {
        this.alertService.error('Unable to check the status.');
        this.router.navigate(['/stripe/setup']);
      }
    );
  }
}
