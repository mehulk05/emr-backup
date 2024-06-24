import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// import { DeletedLeadRoutingModule } from './deleted-lead-routing.module';
// import { DeletedLeadListComponent } from './components/deleted-lead-list/deleted-lead-list.component';
import { DeletedPatientsRoutingModule } from './deleted-patients-routing.module';
import { DeletedPatientsListComponent } from './components/deleted-patient-list/deleted-patients-list.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgPrimeModule } from '../ng-prime/ng-prime.module';

@NgModule({
  declarations: [DeletedPatientsListComponent],
  imports: [
    CommonModule,
    DeletedPatientsRoutingModule,
    SharedModule,
    NgPrimeModule
  ]
})
export class DeletedPatientsModule {}
