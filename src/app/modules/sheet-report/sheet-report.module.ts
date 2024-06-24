import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SheetReportRoutingModule } from './sheet-report-routing.module';
import { SheetDataComponent } from './components/sheet-data/sheet-data.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgPrimeModule } from '../ng-prime/ng-prime.module';

@NgModule({
  declarations: [SheetDataComponent],
  imports: [CommonModule, SheetReportRoutingModule, SharedModule, NgPrimeModule]
})
export class SheetReportModule {}
