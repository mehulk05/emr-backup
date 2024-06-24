import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/shared/services/auth-guards/auth.guard';
import { AddEditWebsiteNewComponent } from './component/add-edit-website-new/add-edit-website-new.component';
import { WebsiteListComponent } from './component/website-list/website-list.component';

const routes: Routes = [
  {
    path: '',
    component: WebsiteListComponent,
    canActivate: [AuthGuard],
    data: {
      breadcrumb: 'Website Templates List'
    }
  },

  {
    path: 'create',
    component: AddEditWebsiteNewComponent,
    canActivate: [AuthGuard],
    data: {
      breadcrumb: 'Create Website Template'
    }
  },
  {
    path: ':id/edit',
    component: AddEditWebsiteNewComponent,
    canActivate: [AuthGuard],
    data: {
      breadcrumb: 'Edit Website Template'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WebsiteRoutingModule {}
