import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SmsEmailBillingComponent } from './sms-email-billing/sms-email-billing.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgPrimeModule } from '../ng-prime/ng-prime.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { BillingRoutingModule } from './billing-routing.module';
import { LeadsModule } from '../leads/leads.module';
import { SmsEmailUpgradeBillingComponent } from './sms-email-upgrade-billing/sms-email-upgrade-billing.component';

@NgModule({
  declarations: [SmsEmailBillingComponent, SmsEmailUpgradeBillingComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    SharedModule,
    NgPrimeModule,
    NgxPaginationModule,
    BillingRoutingModule,
    LeadsModule
  ]
})
export class BillingModule {}
