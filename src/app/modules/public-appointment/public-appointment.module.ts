import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PublicAppointmentRoutingModule } from './public-appointment-routing.module';
import { ClinicHomeComponent } from './components/clinic-home/clinic-home.component';
import { AppointmentBookingHomeComponent } from './components/appointment-booking-home/appointment-booking-home.component';
import { ClinicSelectionComponent } from './components/clinic-selection/clinic-selection.component';
import { ServiceSelectionComponent } from './components/service-selection/service-selection.component';
import { ProviderSelectionComponent } from './components/provider-selection/provider-selection.component';
import { DateSelectionComponent } from './components/date-selection/date-selection.component';
import { PatientInformationComponent } from './components/patient-information/patient-information.component';
import {
  CheckBoxModule,
  RadioButtonModule
} from '@syncfusion/ej2-angular-buttons';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PaymentInformationComponent } from './components/payment-information/payment-information.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { AnyProviderImageComponent } from './components/provider-selection/any-provider-image/any-provider-image.component';
import { SeamlessBookingComponent } from './components/seamless-booking/seamless-booking.component';
import { AngularFormComponent } from './components/angular-form/angular-form.component';
import { NgPrimeModule } from '../ng-prime/ng-prime.module';
import { QuestionarieTableComponent } from './components/questionarie-table/questionarie-table.component';
import { ServiceAccordianComponent } from './components/service-accordian/service-accordian.component';
import { ServiceByListComponent } from './components/service-by-list/service-by-list.component';
import { CategoryService } from '../account-and-settings/service-category/services/category.service';
import { ConsentTableComponent } from './components/consent-table/consent-table.component';

@NgModule({
  declarations: [
    ClinicHomeComponent,
    AppointmentBookingHomeComponent,
    ClinicSelectionComponent,
    ServiceSelectionComponent,
    ProviderSelectionComponent,
    DateSelectionComponent,
    PatientInformationComponent,
    PaymentInformationComponent,
    AnyProviderImageComponent,
    SeamlessBookingComponent,
    AngularFormComponent,
    QuestionarieTableComponent,
    ConsentTableComponent,
    ServiceAccordianComponent,
    ServiceByListComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PublicAppointmentRoutingModule,
    RadioButtonModule,
    CheckBoxModule,
    SharedModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    }),
    NgPrimeModule,
  ],
  exports: [
    ConsentTableComponent
  ],
  providers: [CategoryService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA] // Optionally add this if using Web Components

})
export class PublicAppointmentModule {}
