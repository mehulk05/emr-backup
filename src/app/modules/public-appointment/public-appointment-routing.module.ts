import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppointmentBookingHomeComponent } from './components/appointment-booking-home/appointment-booking-home.component';
import { ClinicHomeComponent } from './components/clinic-home/clinic-home.component';
import { SeamlessBookingComponent } from './components/seamless-booking/seamless-booking.component';

const routes: Routes = [
  {
    path: '',
    component: ClinicHomeComponent,
    data: { showHeader: false, showSidebar: false, showFooter: false }
  },
  // {
  //   path: 'website',
  //   component: WebsiteBookingHomeComponent,
  //   data: { showHeader: false, showSidebar: false, showFooter: false }
  // },

  {
    path: 'business',
    component: AppointmentBookingHomeComponent,
    data: { showHeader: false, showSidebar: false, showFooter: false }
  },
  {
    path: 'business/seamlessBooking',
    component: SeamlessBookingComponent,
    pathMatch: 'full',
    data: { showHeader: false, showSidebar: false, showFooter: false }
  },
  {
    path: 'user/:userId/business/:businessId/book/appointment-home',
    component: ClinicHomeComponent,
    data: { showHeader: false, showSidebar: false, showFooter: false }
  },

  {
    path: 'clinic/:clinicId/:businessId/book/appointment-home',
    component: ClinicHomeComponent,
    data: { showHeader: false, showSidebar: false, showFooter: false }
  },
  // {
  //   // not able to findout where it is linked
  //   path: 'business/:businessId/:clinicId/:providerId/:serviceId/book/appointment',
  //   component: AppointmentBookingHomeComponent,
  //   data: { showHeader: false, showSidebar: false, showFooter: false }
  // },

  {
    path: 'business/:businessId/book/appointment-home',
    component: AppointmentBookingHomeComponent,
    data: { showHeader: false, showSidebar: false, showFooter: false }
  },
  {
    path: 'user/:userId/business/:businessId/clinic/:clinicId/book/appointment-home',
    component: ClinicHomeComponent,
    data: { showHeader: false, showSidebar: false, showFooter: false }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublicAppointmentRoutingModule {}
