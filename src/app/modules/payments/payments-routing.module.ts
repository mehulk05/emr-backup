import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/shared/services/auth-guards/auth.guard';
import { PaymentDetailComponent } from './components/payment-detail/payment-detail.component';
import { PaymentListComponent } from './components/payment-list/payment-list.component';

const routes: Routes = [
  {
    path: '',
    component: PaymentListComponent,
    canActivate: [AuthGuard],
    data: {
      breadcrumb: 'Payments List'
    }
  },
  {
    path: ':id/details',
    component: PaymentDetailComponent,
    canActivate: [AuthGuard],
    data: {
      breadcrumb: 'Payment Details',
      parentObj: {
        name: 'Payment',
        url: ''
      }
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaymentsRoutingModule {}
