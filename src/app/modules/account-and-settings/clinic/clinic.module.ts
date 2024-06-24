import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClinicRoutingModule } from './clinic-routing.module';
import { AddEditClinicFormComponent } from './components/add-edit-clinic-form/add-edit-clinic-form.component';
import { ClinicListComponent } from './components/clinic-list/clinic-list.component';
import { FormsModule } from '@angular/forms';
import { NgPrimeModule } from '../../ng-prime/ng-prime.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { ClinicDetailComponent } from './components/add-edit-clinic-form/clinic-detail/clinic-detail.component';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { ClinicBusinessHourComponent } from './components/add-edit-clinic-form/clinic-detail/clinic-business-hour/clinic-business-hour.component';
import { ClinicConfigComponent } from './components/add-edit-clinic-form/clinic-config/clinic-config.component';
import { ClinicReviewConfigComponent } from './components/add-edit-clinic-form/clinic-review-config/clinic-review-config.component';
import { G99ClinicReviewConfigComponent } from './components/add-edit-clinic-form/g99-clinic-review-config/g99-clinic-review-config.component';
import { G99ClinicReviewConfigRightCardComponent } from './components/add-edit-clinic-form/g99-clinic-review-config-right-card/g99-clinic-review-config-right-card.component';
import { G99ClinicReviewReportComponent } from './components/add-edit-clinic-form/g99-clinic-review-report/g99-clinic-review-report.component';
import { G99ReviewSubTabsComponent } from './components/add-edit-clinic-form/g99-review-sub-tabs/g99-review-sub-tabs.component';
import { G99ReviewSettingsComponent } from './components/add-edit-clinic-form/g99-review-settings/g99-review-settings.component';
import { G99ClinicReviewsEditComponent } from './components/add-edit-clinic-form/g99-clinic-reviews-add-edit/g99-clinic-reviews-edit.component';
import { G99ReviewItemComponent } from './components/add-edit-clinic-form/g99-review-item/g99-review-item.component';
import { G99ClinicReviewsAddComponent } from './components/add-edit-clinic-form/g99-clinic-reviews-add-edit/g99-clinic-reviews-add/g99-clinic-reviews-add.component';
import { G99ReviewQrCodeComponent } from './components/add-edit-clinic-form/g99-review-qrcode/g99-review-qrcode.component';
import { NgxQRCodeModule } from '@techiediaries/ngx-qrcode';

@NgModule({
  declarations: [
    ClinicListComponent,
    AddEditClinicFormComponent,
    ClinicDetailComponent,
    ClinicBusinessHourComponent,
    ClinicConfigComponent,
    ClinicReviewConfigComponent,
    G99ClinicReviewConfigComponent,
    G99ClinicReviewConfigRightCardComponent,
    G99ClinicReviewReportComponent,
    G99ReviewSubTabsComponent,
    G99ReviewSettingsComponent,
    G99ReviewQrCodeComponent,
    G99ClinicReviewsEditComponent,
    G99ReviewItemComponent,
    G99ClinicReviewsAddComponent
  ],
  imports: [
    CommonModule,
    ClinicRoutingModule,
    FormsModule,
    NgPrimeModule,
    SharedModule,
    GooglePlaceModule,
    NgxQRCodeModule
  ]
})
export class ClinicModule {}
