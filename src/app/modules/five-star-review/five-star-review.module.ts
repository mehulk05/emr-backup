import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FiveStarReviewRoutingModule } from './five-star-review-routing.module';
import { ReviewTabComponent } from './components/review-tab/review-tab.component';
import { NgPrimeModule } from '../ng-prime/ng-prime.module';
import { G99ClinicReviewConfigRightCardComponent } from './components/g99-clinic-review-config-right-card/g99-clinic-review-config-right-card.component';
import { G99ClinicReviewConfigComponent } from './components/g99-clinic-review-config/g99-clinic-review-config.component';
import { G99ClinicReviewReportComponent } from './components/g99-clinic-review-report/g99-clinic-review-report.component';
import { G99ClinicReviewsAddComponent } from './components/g99-clinic-reviews-add-edit/g99-clinic-reviews-add/g99-clinic-reviews-add.component';
import { G99ClinicReviewsEditComponent } from './components/g99-clinic-reviews-add-edit/g99-clinic-reviews-edit.component';
import { G99ReviewItemComponent } from './components/g99-review-item/g99-review-item.component';
import { G99ReviewQrCodeComponent } from './components/g99-review-qrcode/g99-review-qrcode.component';
import { G99ReviewSettingsComponent } from './components/g99-review-settings/g99-review-settings.component';
import { FormsModule } from '@angular/forms';
import { NgxQRCodeModule } from '@techiediaries/ngx-qrcode';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [
    ReviewTabComponent,
    G99ClinicReviewConfigComponent,
    G99ClinicReviewConfigRightCardComponent,
    G99ClinicReviewReportComponent,
    G99ReviewSettingsComponent,
    G99ReviewQrCodeComponent,
    G99ClinicReviewsEditComponent,
    G99ReviewItemComponent,
    G99ClinicReviewsAddComponent
  ],
  imports: [
    CommonModule,
    FiveStarReviewRoutingModule,
    NgPrimeModule,
    FormsModule,
    SharedModule,
    NgxQRCodeModule
  ]
})
export class FiveStarReviewModule {}
