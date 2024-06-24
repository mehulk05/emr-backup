import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/shared/services/auth-guards/auth.guard';
import { AddEditClinicFormComponent } from './components/add-edit-clinic-form/add-edit-clinic-form.component';
import { ClinicListComponent } from './components/clinic-list/clinic-list.component';

const routes: Routes = [
  {
    path: '',
    component: ClinicListComponent,
    canActivate: [AuthGuard],
    data: {
      breadcrumb: 'Clinics List'
    }
  },
  {
    path: 'create',
    component: AddEditClinicFormComponent,
    canActivate: [AuthGuard],
    data: {
      breadcrumb: 'Create Clinic'
    }
  },
  {
    path: ':clinicId/edit',
    component: AddEditClinicFormComponent,
    canActivate: [AuthGuard],
    data: {
      breadcrumb: 'Edit Clinic'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClinicRoutingModule {}
