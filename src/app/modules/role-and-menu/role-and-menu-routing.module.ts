import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CutomRoleContainerV1Component } from './components/cutom-role-container-v1/cutom-role-container-v1.component';
import { CustomRoleListComponent } from './components/custom-role-list/custom-role-list.component';

const routes: Routes = [
  {
    path: '',
    component: CustomRoleListComponent,
    canActivate: [],
    data: {
      breadcrumb: 'Role List'
    }
  },
  {
    path: 'create',
    component: CutomRoleContainerV1Component,
    canActivate: [],
    data: {
      breadcrumb: 'Create Role'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RoleAndMenuRoutingModule {}
