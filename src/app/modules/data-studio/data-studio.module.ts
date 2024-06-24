import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DataStudioRoutingModule } from './data-studio-routing.module';
import { DataStudioReportComponent } from './component/data-studio-report/data-studio-report.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { DataStudioTabsComponent } from './component/data-studio-tabs/data-studio-tabs.component';
import { LeadReportsComponent } from './component/lead-reports/lead-reports.component';
import { AppointmentReportsComponent } from './component/appointment-reports/appointment-reports.component';
import { NgPrimeModule } from '../ng-prime/ng-prime.module';
import { AppointmentModule } from '../appointment/appointment.module';
import { LeadsModule } from '../leads/leads.module';
import { PaidMediaReportsComponent } from './component/paid-media-reports/paid-media-reports.component';
import { SyndicationReportsComponent } from './component/data-studio-tabs/syndication-reports/syndication-reports.component';
import { SyndicationMultipleReportsPreviewComponent } from './component/data-studio-tabs/syndication-multiple-reports-preview/syndication-multiple-reports-preview.component';
import { SeoReportsComponent } from './component/seo-reports/seo-reports.component';

@NgModule({
  declarations: [
    DataStudioReportComponent,
    DataStudioTabsComponent,
    LeadReportsComponent,
    AppointmentReportsComponent,
    PaidMediaReportsComponent,
    SyndicationReportsComponent,
    SyndicationMultipleReportsPreviewComponent,
    SeoReportsComponent
  ],
  imports: [
    CommonModule,
    DataStudioRoutingModule,
    NgPrimeModule,
    SharedModule,
    AppointmentModule,
    LeadsModule
  ]
})
export class DataStudioModule {}
