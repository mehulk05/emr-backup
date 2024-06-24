import { Component, OnInit } from '@angular/core';
import { StripeService } from '../../services/stripe.service';

@Component({
  selector: 'app-onboarding-refresh',
  templateUrl: './onboarding-refresh.component.html',
  styleUrls: ['./onboarding-refresh.component.css']
})
export class OnboardingRefreshComponent implements OnInit {
  constructor(private stripeOnboardingService: StripeService) {}

  ngOnInit(): void {
    this.getRefreshUrl();
  }

  getRefreshUrl() {
    this.stripeOnboardingService
      .getStripeOnboardingRefreshUrl()
      .then((response: any) => {
        window.location = response.url;
      });
  }
}
