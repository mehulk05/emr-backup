import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DeletedLeadRoutingModule } from './deleted-lead-routing.module';
import { DeletedLeadListComponent } from './components/deleted-lead-list/deleted-lead-list.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgPrimeModule } from '../ng-prime/ng-prime.module';

@NgModule({
  declarations: [DeletedLeadListComponent],
  imports: [CommonModule, DeletedLeadRoutingModule, SharedModule, NgPrimeModule]
})
export class DeletedLeadModule {}
