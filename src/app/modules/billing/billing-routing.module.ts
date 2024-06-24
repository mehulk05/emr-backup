import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/shared/services/auth-guards/auth.guard';
import { SmsEmailBillingComponent } from './sms-email-billing/sms-email-billing.component';
import { SmsEmailUpgradeBillingComponent } from './sms-email-upgrade-billing/sms-email-upgrade-billing.component';

const routes: Routes = [
  {
    path: 'sms-email-billing',
    component: SmsEmailBillingComponent,
    canActivate: [AuthGuard],
    data: {
      breadcrumb: 'SMS/Email Membership & Billing'
    }
  },
  {
    path: 'sms-email-upgrade-billing',
    component: SmsEmailUpgradeBillingComponent,
    canActivate: [AuthGuard],
    data: {
      breadcrumb: 'SMS/Email Upgrade Billing'
    }
  },
  {
    path: '',
    component: SmsEmailBillingComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BillingRoutingModule {}
