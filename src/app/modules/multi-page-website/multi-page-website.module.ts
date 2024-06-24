import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MultiPageWebsiteRoutingModule } from './multi-page-website-routing.module';
import { MultipageWebsiteListComponent } from './components/multipage-website-list/multipage-website-list.component';
import { AddEditMultipageWebsiteComponent } from './components/add-edit-multipage-website/add-edit-multipage-website.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgPrimeModule } from '../ng-prime/ng-prime.module';
import { AddWebsiteSinglePageModalComponent } from './components/add-website-single-page-modal/add-website-single-page-modal.component';

@NgModule({
  declarations: [
    MultipageWebsiteListComponent,
    AddEditMultipageWebsiteComponent,
    AddWebsiteSinglePageModalComponent
  ],
  imports: [
    CommonModule,
    MultiPageWebsiteRoutingModule,
    SharedModule,
    NgPrimeModule
  ]
})
export class MultiPageWebsiteModule {}
