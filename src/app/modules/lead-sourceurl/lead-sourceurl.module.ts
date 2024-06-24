import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LeadSourceurlRoutingModule } from './lead-sourceurl-routing.module';
import { LeadSourceurlListComponent } from './components/lead-sourceurl-list/lead-sourceurl-list.component';
import { AdEditLeadSourceurlComponent } from './components/ad-edit-lead-sourceurl/ad-edit-lead-sourceurl.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgPrimeModule } from '../ng-prime/ng-prime.module';

@NgModule({
  declarations: [LeadSourceurlListComponent, AdEditLeadSourceurlComponent],
  imports: [
    CommonModule,
    LeadSourceurlRoutingModule,
    SharedModule,
    NgPrimeModule
  ]
})
export class LeadSourceurlModule {}
