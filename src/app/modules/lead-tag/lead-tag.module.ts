import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LeadTagRoutingModule } from './lead-tag-routing.module';
import { LeadTagsListComponent } from './components/lead-tags-list/lead-tags-list.component';
import { AddEditLeadTagComponent } from './components/add-edit-lead-tag/add-edit-lead-tag.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgPrimeModule } from '../ng-prime/ng-prime.module';

@NgModule({
  declarations: [LeadTagsListComponent, AddEditLeadTagComponent],
  imports: [CommonModule, LeadTagRoutingModule, SharedModule, NgPrimeModule]
})
export class LeadTagModule {}
