import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/shared/services/auth-guards/auth.guard';
import { OnBoardingSuccessComponent } from './components/on-boarding-success/on-boarding-success.component';
import { OnboardingRefreshComponent } from './components/onboarding-refresh/onboarding-refresh.component';
import { StripePageComponent } from './components/stripe-page/stripe-page.component';

const routes: Routes = [
  {
    // not able to findout where it is linked
    path: 'refresh',
    component: OnboardingRefreshComponent,
    data: { showHeader: false, showSidebar: false, showFooter: false }
  },
  {
    path: 'success',
    component: OnBoardingSuccessComponent,
    data: { showHeader: false, showSidebar: false, showFooter: false }
  },
  {
    path: 'setup',
    component: StripePageComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StripeRoutingModule {}
