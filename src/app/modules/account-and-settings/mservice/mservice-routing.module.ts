import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/shared/services/auth-guards/auth.guard';
import { AddEditServiceFormComponent } from './components/add-edit-service-form/add-edit-service-form.component';
import { ServiceListComponent } from './components/service-list/service-list.component';

const routes: Routes = [
  {
    path: '',
    component: ServiceListComponent,
    canActivate: [AuthGuard],
    data: {
      breadcrumb: 'Services List'
    }
  },
  {
    path: 'create',
    component: AddEditServiceFormComponent,
    canActivate: [AuthGuard],
    data: {
      breadcrumb: 'Create Service'
    }
  },

  {
    path: ':serviceId/edit',
    component: AddEditServiceFormComponent,
    canActivate: [AuthGuard],
    data: {
      breadcrumb: 'Edit Service'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MserviceRoutingModule {}
