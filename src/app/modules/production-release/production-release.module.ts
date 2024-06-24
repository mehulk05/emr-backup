import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductionReleaseRoutingModule } from './production-release-routing.module';
import { ProductionReleaseListComponent } from './services/production-release-list/production-release-list.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgPrimeModule } from '../ng-prime/ng-prime.module';

@NgModule({
  declarations: [ProductionReleaseListComponent],
  imports: [
    CommonModule,
    ProductionReleaseRoutingModule,
    SharedModule,
    NgPrimeModule
  ]
})
export class ProductionReleaseModule {}
