import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StripeRoutingModule } from './stripe-routing.module';
import { StripePageComponent } from './components/stripe-page/stripe-page.component';
import { OnBoardingSuccessComponent } from './components/on-boarding-success/on-boarding-success.component';
import { OnboardingRefreshComponent } from './components/onboarding-refresh/onboarding-refresh.component';

@NgModule({
  declarations: [
    StripePageComponent,
    OnboardingRefreshComponent,
    OnBoardingSuccessComponent
  ],
  imports: [CommonModule, StripeRoutingModule]
})
export class StripeModule {}
