import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LandingPageRoutingModule } from './landing-page-routing.module';
import { LandingpageListComponent } from './components/landingpage-list/landingpage-list.component';
import { AddEditLandingpageComponent } from './components/add-edit-landingpage/add-edit-landingpage.component';
import { DefaultPagesComponent } from './components/landingpage-list/default-pages/default-pages.component';
import { NgPrimeModule } from '../ng-prime/ng-prime.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { LandingpageServiceComponent } from './components/landingpage-list/landingpage-service/landingpage-service.component';
import { LandingpageServiceListComponent } from './components/landingpage-list/landingpage-service/landingpage-service-list/landingpage-service-list.component';
import { LandingPageOtherComponent } from './components/landing-page-other/landing-page-other.component';
import { LandingPageOthersServiceComponent } from './components/landing-page-other/landing-page-others-service.component';

@NgModule({
  declarations: [
    LandingpageListComponent,
    AddEditLandingpageComponent,
    DefaultPagesComponent,
    LandingpageServiceComponent,
    LandingpageServiceListComponent,
    LandingPageOtherComponent,
    LandingPageOthersServiceComponent
  ],
  imports: [
    CommonModule,
    NgPrimeModule,
    SharedModule,
    LandingPageRoutingModule,
    SharedModule
  ]
})
export class LandingPageModule {}
