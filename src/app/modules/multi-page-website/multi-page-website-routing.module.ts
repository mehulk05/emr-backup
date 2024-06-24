import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddEditMultipageWebsiteComponent } from './components/add-edit-multipage-website/add-edit-multipage-website.component';
import { AuthGuard } from 'src/app/shared/services/auth-guards/auth.guard';
import { MultipageWebsiteListComponent } from './components/multipage-website-list/multipage-website-list.component';

const routes: Routes = [
  {
    path: 'create',
    component: AddEditMultipageWebsiteComponent,
    canActivate: [AuthGuard],
    data: {
      breadcrumb: 'Create Landing Page'
    }
  },
  {
    path: '',
    component: MultipageWebsiteListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'edit/:id',
    component: AddEditMultipageWebsiteComponent,
    canActivate: [AuthGuard],
    data: {
      breadcrumb: 'Edit Landing Page'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MultiPageWebsiteRoutingModule {}
