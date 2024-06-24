import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PatientTagsListComponent } from './components/patient-tags-list/patient-tags-list.component';
import { AddEditPatientTagComponent } from './components/add-edit-patient-tag/add-edit-patient-tag.component';

const routes: Routes = [
  {
    path: '',
    component: PatientTagsListComponent,
    data: {
      breadcrumb: 'Patient Tags'
    }
  },
  {
    path: 'create',
    component: AddEditPatientTagComponent,
    data: {
      breadcrumb: 'Add Patient Tag'
    }
  },
  {
    path: 'edit/:id',
    component: AddEditPatientTagComponent,
    data: {
      breadcrumb: 'Edit Patient Tag'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PatientTagRoutingModule {}
