import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/shared/services/auth-guards/auth.guard';
import { AppointmentPaymentDetailComponent } from './components/appointment-payment-detail/appointment-payment-detail.component';
import { AppointmentPaymentComponent } from './components/appointment-payment/appointment-payment.component';
import { BookingHistoryDashboardComponent } from './components/booking-history-dashboard/booking-history-dashboard.component';
import { AddEditBookingHistoryComponent } from './components/booking-history-prime/add-edit-booking-history/add-edit-booking-history.component';
//import { BookingHistoryPrimeComponent } from './components/booking-history-prime/booking-history-prime.component';
import { BookingHistoryComponent } from './components/booking-history/booking-history.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import { OnlineMeetingComponent } from '../../shared/reusableComponents/online-meeting/online-meeting.component';

const routes: Routes = [
  {
    path: 'calendar',
    component: CalendarComponent,
    data: {
      breadcrumb: 'Calendar'
    },
    canActivate: [AuthGuard]
  },
  {
    path: 'booking-history',
    component: BookingHistoryDashboardComponent,
    canActivate: [AuthGuard],
    data: {
      breadcrumb: 'Booking History'
    }
  },
  {
    path: 'booking-history/:appointmentId/edit',
    component: AddEditBookingHistoryComponent,
    canActivate: [AuthGuard],
    data: {
      breadcrumb: 'Edit Appointment'
    }
  },
  {
    path: ':appointmentId/payment',
    component: AppointmentPaymentDetailComponent,
    canActivate: [AuthGuard],
    data: {
      breadcrumb: 'Payment Details'
    }
  },
  {
    path: 'booking-history1',
    component: BookingHistoryComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'payments',
    component: AppointmentPaymentComponent,
    canActivate: [AuthGuard],
    data: {
      breadcrumb: 'Payments List'
    }
  },
  {
    path: '',
    redirectTo: 'booking-history',
    pathMatch: 'full'
  },
  {
    path: ':appointmentId/meeting',
    component: OnlineMeetingComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppointmentRoutingModule {}
