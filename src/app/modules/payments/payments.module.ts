import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PaymentsRoutingModule } from './payments-routing.module';
import { PaymentListComponent } from './components/payment-list/payment-list.component';
import { FormsModule } from '@angular/forms';
import { NgPrimeModule } from '../ng-prime/ng-prime.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { PaymentDetailComponent } from './components/payment-detail/payment-detail.component';
import { AppointmentModule } from '../appointment/appointment.module';

@NgModule({
  declarations: [PaymentListComponent, PaymentDetailComponent],
  imports: [
    CommonModule,
    PaymentsRoutingModule,
    FormsModule,
    SharedModule,
    NgPrimeModule,
    AppointmentModule
  ]
})
export class PaymentsModule {}
