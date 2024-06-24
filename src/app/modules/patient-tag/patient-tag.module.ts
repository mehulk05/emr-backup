import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PatientTagRoutingModule } from './patient-tag-routing.module';
import { PatientTagsListComponent } from './components/patient-tags-list/patient-tags-list.component';
import { AddEditPatientTagComponent } from './components/add-edit-patient-tag/add-edit-patient-tag.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgPrimeModule } from '../ng-prime/ng-prime.module';

@NgModule({
  declarations: [PatientTagsListComponent, AddEditPatientTagComponent],
  imports: [CommonModule, PatientTagRoutingModule, SharedModule, NgPrimeModule]
})
export class PatientTagModule {}
