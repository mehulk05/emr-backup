import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgPrimeModule } from '../ng-prime/ng-prime.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { WebsiteRoutingModule } from './website-routing.module';
import { WebsiteListComponent } from './component/website-list/website-list.component';
import { AddEditWebsiteNewComponent } from './component/add-edit-website-new/add-edit-website-new.component';
import { DefaultWebsiteComponent } from './component/website-list/default-website/default-website.component';
import { OtherWebsiteComponent } from './component/website-list/other-website/other-website.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [
    WebsiteListComponent,
    AddEditWebsiteNewComponent,
    DefaultWebsiteComponent,
    OtherWebsiteComponent
  ],
  imports: [
    CommonModule,
    WebsiteRoutingModule,
    NgPrimeModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
  ]
})
export class WebsiteModule {}
