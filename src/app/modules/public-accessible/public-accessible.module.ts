import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PublicAccessibleRoutingModule } from './public-accessible-routing.module';
import { PublicLandingpageComponent } from './components/public-landingpage/public-landingpage.component';
import { PublicDefaaultLandingpageComponent } from './components/public-defaault-landingpage/public-defaault-landingpage.component';
import { NgPrimeModule } from '../ng-prime/ng-prime.module';
import { EmailUnsubscribeComponent } from './components/email-unsubscribe/email-unsubscribe.component';
import { PublicG99ClinicReviewReportPageComponent } from './components/public-g99-clinic-review-report-page/public-g99-clinic-review-report-page.component';
import { G99ReportReviewItemComponent } from './components/g99-report-review-item/g99-report-review-item.component';
import { SharedModule } from '../../shared/shared.module';
import { PublicDynamicFormPageComponent } from './components/public-dynamic-form-page/public-dynamic-form-page.component';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { MatGoogleMapsAutocompleteModule } from '@angular-material-extensions/google-maps-autocomplete';

@NgModule({
  declarations: [
    PublicLandingpageComponent,
    PublicDefaaultLandingpageComponent,
    EmailUnsubscribeComponent,
    PublicG99ClinicReviewReportPageComponent,
    G99ReportReviewItemComponent,
    PublicDynamicFormPageComponent
  ],
  imports: [
    CommonModule,
    PublicAccessibleRoutingModule,
    NgPrimeModule,
    SharedModule,
    NgxIntlTelInputModule,
    MatGoogleMapsAutocompleteModule
  ]
})
export class PublicAccessibleModule {}
