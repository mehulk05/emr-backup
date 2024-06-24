import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppointmentRoutingModule } from './appointment-routing.module';
import { BookingHistoryComponent } from './components/booking-history/booking-history.component';
import { FormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { BookingHistoryPrimeComponent } from './components/booking-history-prime/booking-history-prime.component';
import { AddEditBookingHistoryComponent } from './components/booking-history-prime/add-edit-booking-history/add-edit-booking-history.component';
import { AppointmentPaymentComponent } from './components/appointment-payment/appointment-payment.component';
import { TestDesignComponent } from './components/booking-history/test-design/test-design.component';
import { NgPrimeModule } from '../ng-prime/ng-prime.module';
import { CalendarComponent } from './components/calendar/calendar.component';
import { ScheduleModule } from '@syncfusion/ej2-angular-schedule';
import { CalendarViewComponent } from './components/calendar/calendar-view/calendar-view.component';
import { CalendarMobileViewComponent } from './components/calendar/calendar-mobile-view/calendar-mobile-view.component';
import { AppointmentPaymentDetailComponent } from './components/appointment-payment-detail/appointment-payment-detail.component';
import { PaymentRefundComponent } from './components/appointment-payment-detail/payment-refund/payment-refund.component';
import { NgxPrintModule } from 'ngx-print';
import { AddServiceComponent } from './components/appointment-payment-detail/add-service/add-service.component';
import { BookingHistoryDashboardComponent } from './components/booking-history-dashboard/booking-history-dashboard.component';
import { BookingHistoryGraphComponent } from './components/booking-history-graph/booking-history-graph.component';
import 'chartjs-plugin-labels';
import { EditServiceComponent } from './components/appointment-payment-detail/edit-service/edit-service.component';
import { AppointmentFilterComponent } from './components/booking-history-prime/appointment-filter/appointment-filter.component';
import { LayoutModule } from '@angular/cdk/layout';
import { CalendarTooltipComponent } from './components/calendar/calendar-tooltip/calendar-tooltip.component';
import { MatMenuModule } from '@angular/material/menu';
import { AddEditAppointmentDialogComponent } from './components/add-edit-appointment-dialog/add-edit-appointment-dialog.component';
@NgModule({
  declarations: [
    BookingHistoryComponent,
    BookingHistoryPrimeComponent,
    AddEditBookingHistoryComponent,
    AppointmentPaymentComponent,
    TestDesignComponent,
    CalendarComponent,
    CalendarViewComponent,
    CalendarMobileViewComponent,
    AppointmentPaymentDetailComponent,
    PaymentRefundComponent,
    AddServiceComponent,
    BookingHistoryDashboardComponent,
    BookingHistoryGraphComponent,
    EditServiceComponent,
    AppointmentFilterComponent,
    CalendarTooltipComponent,
    AddEditAppointmentDialogComponent
  ],
  imports: [
    CommonModule,
    AppointmentRoutingModule,
    FormsModule,
    SharedModule,
    ScheduleModule,
    NgPrimeModule,
    NgxPrintModule,
    LayoutModule,
    MatMenuModule
  ],
  exports: [AppointmentPaymentDetailComponent, BookingHistoryGraphComponent]
})
export class AppointmentModule {}
